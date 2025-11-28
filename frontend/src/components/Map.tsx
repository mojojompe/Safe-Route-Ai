import { useState } from 'react'
import Map, { Source, Layer } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

type Route = {
  id: string
  score: number
  color: string
  geojson: any
  eta: string
}

export default function MapView({ routes = [] as Route[], center = [-118.2437, 34.0522] }) {
  const [viewport] = useState({ longitude: center[0], latitude: center[1], zoom: 12 })

  return (
    <div className="relative w-full h-full min-h-[500px] bg-sr-muted">
      <Map
        initialViewState={{
          longitude: viewport.longitude,
          latitude: viewport.latitude,
          zoom: viewport.zoom
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        {routes.map(r => (
          <Source key={r.id} id={`route-${r.id}`} type="geojson" data={r.geojson}>
            <Layer
              id={`line-${r.id}`}
              type="line"
              paint={{
                'line-color': r.color,
                'line-width': 6,
                'line-opacity': 0.95,
                'line-blur': 1
              }}
            />
          </Source>
        ))}
      </Map>
    </div>
  )
}
