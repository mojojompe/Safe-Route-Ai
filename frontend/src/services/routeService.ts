import api from './api'

export type RouteOption = {
    id: string
    distance: string
    eta: string
    mode: 'walking' | 'driving'
    score: number
    color: 'green' | 'yellow' | 'red'
    segments: any[]
    geojson: any
}

export const getRouteOptions = async (destination: string, mode: 'walking' | 'driving'): Promise<RouteOption[]> => {
    const res = await api.post('/route/options', { destination, mode })
    return res.data.routes
}
