// Mock scoring service to simulate AI safety analysis
// In a real scenario, this would call a trained ML model or a specialized API.

type ScoreResult = {
  score: number
  color: 'green' | 'yellow' | 'red'
  segments: any[]
}

async function scoreRoute(geojson: any, opts: any): Promise<ScoreResult> {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 800))

  // Deterministic mock based on route distance or ID to keep UI consistent
  const distance = opts.distance || Math.random() * 10

  let score: number
  let segments: any[] = []

  if (distance < 2) {
    // Short routes are usually safer in this mock
    score = 8.5
    segments = [
      { title: 'Start to Midpoint', score: 9, reason: 'Well Lit, High Foot Traffic', color: '#00d35a' },
      { title: 'Midpoint to End', score: 8, reason: 'Residential Area', color: '#00d35a' }
    ]
  } else if (distance < 5) {
    // Medium routes have some risk
    score = 6.2
    segments = [
      { title: 'Downtown Sector', score: 5, reason: 'Moderate Traffic', color: '#eab308' },
      { title: 'Park Perimeter', score: 7, reason: 'Good Visibility', color: '#00d35a' },
      { title: 'Industrial Zone', score: 4, reason: 'Low Lighting', color: '#ef4444' }
    ]
  } else {
    // Long routes are riskier
    score = 4.5
    segments = [
      { title: 'Highway Access', score: 3, reason: 'High Speed Traffic', color: '#ef4444' },
      { title: 'City Outskirts', score: 5, reason: 'Isolated', color: '#eab308' },
      { title: 'Destination Approach', score: 6, reason: 'Moderate Lighting', color: '#eab308' }
    ]
  }

  const color = score >= 7 ? 'green' : score >= 4 ? 'yellow' : 'red'

  return {
    score,
    color,
    segments
  }
}

export default { scoreRoute }
