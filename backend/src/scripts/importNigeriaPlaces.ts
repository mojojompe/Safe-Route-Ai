/**
 * Nigeria Places Data Importer
 * --------------------------------
 * Imports schools + roads directly from the shapefiles (no ogr2ogr needed)
 * and streams the large HOTOSM GeoJSON file.
 *
 * Run once:
 *   npm run import:nigeria
 */

import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
// @ts-ignore — shapefile has no types bundle
import * as shapefile from 'shapefile'
import { NigeriaPlace } from '../models/NigeriaPlace.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Script lives at backend/src/scripts/ — go up 2 levels to reach backend/
const DATA_DIR = path.join(__dirname, '../../Nigeria Details')

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getLineStringMidpoint(coords: number[][]): number[] | null {
    if (!coords || coords.length === 0) return null
    const mid = coords[Math.floor(coords.length / 2)]
    return Array.isArray(mid) && mid.length >= 2 && !isNaN(mid[0]) ? mid : coords[0]
}

function inNigeria(coords: number[]): boolean {
    return coords[0] >= 2.5 && coords[0] <= 15.0 && coords[1] >= 4.0 && coords[1] <= 14.0
}

async function batchInsert(docs: any[], label: string): Promise<number> {
    let inserted = 0
    for (let i = 0; i < docs.length; i += 500) {
        try {
            const res = await NigeriaPlace.insertMany(docs.slice(i, i + 500), { ordered: false })
            inserted += res.length
        } catch (e: any) {
            inserted += e.result?.result?.nInserted || e.result?.nInserted || 0
        }
        process.stdout.write(`\r  ${label}: ${inserted.toLocaleString()} / ${docs.length.toLocaleString()}`)
    }
    return inserted
}

// ─── Schools Importer ────────────────────────────────────────────────────────

async function importSchools() {
    const shpPath = path.join(DATA_DIR, 'Nigeria_-_Schools.shp')
    if (!fs.existsSync(shpPath)) {
        console.warn('\n⚠️  Nigeria_-_Schools.shp not found — skipping schools.')
        return 0
    }

    console.log('\n📚 Reading schools shapefile...')
    const source = await shapefile.open(shpPath)
    const docs: any[] = []

    while (true) {
        const { done, value } = await source.read()
        if (done) break
        if (!value?.geometry || !value?.properties) continue

        const props = value.properties
        const name = props.Name || props.name || props.SCHOOL_NAM || props.SCHOOL_NAME
        if (!name || !String(name).trim()) continue

        let coords: number[] | null = null
        const geom = value.geometry
        if (geom.type === 'Point') {
            coords = geom.coordinates
        } else if (geom.type === 'Polygon' && geom.coordinates?.[0]?.length > 0) {
            const ring: number[][] = geom.coordinates[0]
            coords = [
                ring.reduce((s, c) => s + c[0], 0) / ring.length,
                ring.reduce((s, c) => s + c[1], 0) / ring.length
            ]
        } else if (geom.type === 'MultiPoint') {
            coords = geom.coordinates[0]
        }

        if (!coords || coords.length < 2 || isNaN(coords[0]) || !inNigeria(coords)) continue

        docs.push({
            name: String(name).trim(),
            type: 'school',
            subtype: props.School_Typ || props.TYPE || props.Type || 'school',
            state: props.State || props.STATE || '',
            lga: props.LGA || props.Lga || '',
            location: { type: 'Point', coordinates: [coords[0], coords[1]] }
        })
    }

    console.log(`\n  Found ${docs.length.toLocaleString()} valid schools. Inserting...`)
    const inserted = await batchInsert(docs, 'Schools')
    console.log(`\n✅ Schools done — ${inserted.toLocaleString()} imported`)
    return inserted
}

// ─── NGA Roads Importer ──────────────────────────────────────────────────────

async function importNGARoads() {
    const shpPath = path.join(DATA_DIR, 'NGA_roads.shp')
    if (!fs.existsSync(shpPath)) {
        console.warn('\n⚠️  NGA_roads.shp not found — skipping NGA roads.')
        return 0
    }

    console.log('\n🛣️  Reading NGA roads shapefile...')
    const source = await shapefile.open(shpPath)
    const seen = new Set<string>()
    const docs: any[] = []

    while (true) {
        const { done, value } = await source.read()
        if (done) break
        if (!value?.geometry || !value?.properties) continue

        const props = value.properties
        const name = props.RTT_DESCRI || props.road_name || props.name || props.Name
        if (!name || !String(name).trim()) continue
        const key = String(name).toLowerCase().trim()
        if (seen.has(key)) continue
        seen.add(key)

        let coords: number[] | null = null
        const geom = value.geometry
        if (geom.type === 'LineString') coords = getLineStringMidpoint(geom.coordinates)
        else if (geom.type === 'MultiLineString' && geom.coordinates?.[0]) coords = getLineStringMidpoint(geom.coordinates[0])

        if (!coords || !inNigeria(coords)) continue

        docs.push({
            name: String(name).trim(),
            type: 'road',
            subtype: props.F_CODE_DES || 'road',
            state: props.STATE || props.State || '',
            lga: '',
            location: { type: 'Point', coordinates: [coords[0], coords[1]] }
        })
    }

    console.log(`\n  Found ${docs.length.toLocaleString()} unique road names. Inserting...`)
    const inserted = await batchInsert(docs, 'Roads')
    console.log(`\n✅ NGA roads done — ${inserted.toLocaleString()} imported`)
    return inserted
}

// ─── HOTOSM Roads Importer (streaming — 1.1 GB) ──────────────────────────────

async function importHOTOSMRoads() {
    const filePath = path.join(DATA_DIR, 'hotosm_nga_roads_lines_geojson.geojson')
    if (!fs.existsSync(filePath)) {
        console.warn('\n⚠️  hotosm_nga_roads_lines_geojson.geojson not found — skipping.')
        return 0
    }

    let JSONStream: any
    try {
        JSONStream = (await import('JSONStream')).default
    } catch {
        console.error('❌ JSONStream not installed. Run: npm install JSONStream')
        return 0
    }

    console.log('\n🗺️  Streaming HOTOSM roads (1.1 GB) — this will take 30–60 minutes...')
    const seen = new Set<string>()
    let pendingBatch: any[] = []
    let total = 0
    let skipped = 0
    let processing = false

    const flush = async (force = false) => {
        if (processing && !force) return
        if (pendingBatch.length < 2000 && !force) return
        processing = true
        const toInsert = pendingBatch.splice(0, 2000)
        try {
            const res = await NigeriaPlace.insertMany(toInsert, { ordered: false })
            total += res.length
        } catch (e: any) {
            total += e.result?.result?.nInserted || e.result?.nInserted || 0
        }
        process.stdout.write(`\r  ${total.toLocaleString()} unique names imported (${skipped.toLocaleString()} skipped/dupes)`)
        processing = false
    }

    await new Promise<void>((resolve, reject) => {
        const stream = fs.createReadStream(filePath, { encoding: 'utf8' })
        const parser = JSONStream.parse('features.*')

        parser.on('data', async (feature: any) => {
            const name = feature.properties?.name || feature.properties?.Name || feature.properties?.ref
            if (!name || !String(name).trim()) { skipped++; return }
            const key = String(name).toLowerCase().trim()
            if (seen.has(key)) { skipped++; return }
            seen.add(key)

            const geom = feature.geometry
            let coords: number[] | null = null
            if (geom?.type === 'LineString') coords = getLineStringMidpoint(geom.coordinates)
            else if (geom?.type === 'MultiLineString' && geom.coordinates?.[0]) coords = getLineStringMidpoint(geom.coordinates[0])
            if (!coords || coords.length < 2 || isNaN(coords[0])) return

            pendingBatch.push({
                name: String(name).trim(),
                type: 'road',
                subtype: feature.properties?.highway || 'road',
                state: feature.properties?.['addr:state'] || '',
                lga: feature.properties?.['addr:subdistrict'] || '',
                location: { type: 'Point', coordinates: [coords[0], coords[1]] }
            })

            if (pendingBatch.length >= 2000) {
                parser.pause()
                await flush()
                parser.resume()
            }
        })

        parser.on('end', async () => {
            await flush(true)
            resolve()
        })
        parser.on('error', reject)
        stream.pipe(parser)
    })

    console.log(`\n✅ HOTOSM roads done — ${total.toLocaleString()} unique road names imported`)
    return total
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI not set in .env')
        process.exit(1)
    }

    const args = process.argv.slice(2)
    const runAll = args.length === 0
    const runSchools = runAll || args.includes('schools')
    const runNGA = runAll || args.includes('nga-roads')
    const runHOTOSM = runAll || args.includes('hotosm')

    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    await NigeriaPlace.createIndexes()
    console.log('✅ Indexes ready')

    let grandTotal = 0
    if (runSchools) grandTotal += await importSchools()
    if (runNGA) grandTotal += await importNGARoads()
    if (runHOTOSM) grandTotal += await importHOTOSMRoads()

    console.log(`\n🎉 Done! ${grandTotal.toLocaleString()} total places now searchable in Nigeria DB.`)
    console.log('   Run: npm run import:schools | import:nga-roads | import:hotosm')

    await mongoose.disconnect()
    process.exit(0)
}

main().catch(err => {
    console.error('❌ Import failed:', err)
    process.exit(1)
})
