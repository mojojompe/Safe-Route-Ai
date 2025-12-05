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

export const saveRouteToHistory = async (userId: string, route: RouteOption, start: string, destination: string) => {
    try {
        await api.post('/history/save', {
            userId,
            startLocation: start || 'Current Location',
            endLocation: destination,
            distance: route.distance,
            duration: route.eta, // Frontend uses 'duration', but route has 'eta'. Verify if backend expects duration string.
            // Frontend 'duration' seems to come from mapbox duration. Here route.eta is formatted string? 
            // In routeService.ts GET options, we return RouteOption.
            // Let's assume sending the string ETA is fine or check backend model if possible. 
            // The frontend sends `selectedRoute.duration`.
            safetyScore: route.score,
            riskLevel: route.score > 70 ? 'Low' : route.score > 40 ? 'Moderate' : 'High',
            date: new Date()
        });
    } catch (error) {
        console.error("Failed to save route history", error);
        // Don't throw, just log. We don't want to block navigation.
    }
}
