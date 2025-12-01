import axios from 'axios'

type ScoreResult = {
  score: number
  color: 'green' | 'yellow' | 'red'
  riskLevel: string
  segments: any[]
}

async function scoreRoute(geojson: any, opts: any): Promise<ScoreResult> {
  // Use Raindrop AI (or fallback to mock if it fails/is not an AI service)
  try {
    // ... (AI call logic would go here)

    // Fallback Mock Logic (Enhanced)
    const distance = opts.distance
    let score = 0

    if (opts.mode === 'walking') {
      score = distance < 1 ? 9 : distance < 3 ? 7 : 5
    } else {
      score = distance < 5 ? 8 : 6
    }

    // Add some randomness
    score = Math.min(10, Math.max(1, score + (Math.random() * 2 - 1)))
    score = Number(score.toFixed(1))

    const color = score >= 7 ? 'green' : score >= 4 ? 'yellow' : 'red'
    const riskLevel = score >= 7 ? 'Low' : score >= 4 ? 'Moderate' : 'High'

    // Generate segments based on steps if available, otherwise geometry
    const segments = []
    const steps = opts.steps || []

    // If we have steps, try to group them into logical segments
    // Otherwise fall back to simple division
    const segmentCount = Math.min(4, Math.max(2, Math.floor(geojson.coordinates.length / 10)))

    if (steps.length > 0) {
      // Divide steps into chunks
      const stepsPerSegment = Math.ceil(steps.length / segmentCount)

      for (let i = 0; i < segmentCount; i++) {
        const startIdx = i * stepsPerSegment
        const endIdx = Math.min((i + 1) * stepsPerSegment, steps.length)
        const segmentSteps = steps.slice(startIdx, endIdx)

        if (segmentSteps.length === 0) continue

        const segScore = Math.min(10, Math.max(1, score + (Math.random() * 4 - 2))).toFixed(1)
        const segColor = Number(segScore) >= 7 ? '#00d35a' : Number(segScore) >= 4 ? '#eab308' : '#ef4444'

        // Extract details
        const startName = segmentSteps[0].name || segmentSteps[0].maneuver.instruction
        const endName = segmentSteps[segmentSteps.length - 1].name || segmentSteps[segmentSteps.length - 1].maneuver.instruction
        const range = `From ${startName} to ${endName}`

        const durationSec = segmentSteps.reduce((acc: number, s: any) => acc + (s.duration || 0), 0)
        const time = `${Math.ceil(durationSec / 60)} min`

        const junctions = segmentSteps
          .filter((s: any) => s.maneuver && s.maneuver.type !== 'arrive' && s.maneuver.type !== 'depart')
          .map((s: any) => s.name || s.maneuver.instruction)
          .slice(0, 3) // Top 3

        // Mock qualitative data based on score
        let tips: string[] = []
        let risks: string[] = []
        let landmarks: string[] = []

        if (Number(segScore) >= 7) {
          tips = ["Well-lit area", "Pedestrian friendly", "Frequent police patrols"]
          risks = ["Low traffic"]
          landmarks = ["City Park", "Public Library"]
        } else if (Number(segScore) >= 4) {
          tips = ["Stay alert", "Use main roads", "Avoid alleyways"]
          risks = ["Uneven pavement", "Moderate traffic", "Dim lighting"]
          landmarks = ["Bus Station", "Local Market"]
        } else {
          tips = ["Avoid if possible at night", "Walk in groups", "Keep valuables hidden"]
          risks = ["High crime rate", "Poor lighting", "Heavy traffic"]
          landmarks = ["Construction Site", "Old Warehouse"]
        }

        segments.push({
          title: `Section ${i + 1}`,
          score: segScore,
          color: segColor,
          reason: Number(segScore) > 7 ? 'Safe Area' : 'Caution Advised',
          range,
          time,
          tips,
          risks,
          landmarks,
          junctions
        })
      }
    } else {
      // Fallback if no steps
      for (let i = 0; i < segmentCount; i++) {
        const segScore = Math.min(10, Math.max(1, score + (Math.random() * 4 - 2))).toFixed(1)
        const segColor = Number(segScore) >= 7 ? '#00d35a' : Number(segScore) >= 4 ? '#eab308' : '#ef4444'

        segments.push({
          title: `Section ${i + 1}`,
          score: segScore,
          color: segColor,
          reason: Number(segScore) > 7 ? 'Safe Area' : 'Caution Advised',
          range: "Area details unavailable",
          time: "N/A",
          tips: ["Stay alert"],
          risks: ["Unknown"],
          landmarks: [],
          junctions: []
        })
      }
    }

    return {
      score,
      color,
      riskLevel,
      segments
    }

  } catch (error) {
    console.error("AI Scoring failed", error)
    return {
      score: 5.0,
      color: 'yellow',
      riskLevel: 'Moderate',
      segments: []
    }
  }
}

export default { scoreRoute }
