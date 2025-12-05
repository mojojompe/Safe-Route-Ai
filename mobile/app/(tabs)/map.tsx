import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, ActivityIndicator, Alert, Keyboard } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Navigation } from 'lucide-react-native';
import { getRouteOptions, RouteOption, saveRouteToHistory } from '../../src/services/routeService';
import { useRouteContext } from '../../src/context/RouteContext';
import { useAuth } from '../../src/context/AuthContext';

const { width, height } = Dimensions.get('window');

// Dark Map Style JSON
const DARK_MAP_STYLE = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#212121" }]
    },
    {
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#212121" }]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#bdbdbd" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#181818" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#1b1b1b" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#2c2c2c" }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#8a8a8a" }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{ "color": "#373737" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#3c3c3c" }]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [{ "color": "#4e4e4e" }]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#000000" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#3d3d3d" }]
    }
];

export default function MapScreen() {
    const mapRef = useRef<MapView>(null);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [destination, setDestination] = useState('');
    const [routes, setRoutes] = useState<RouteOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            mapRef.current?.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            });
        })();
    }, []);

    const { setSelectedRoute, setDestinationQuery, destinationQuery } = useRouteContext();
    const { user } = useAuth();
    const router = useRouter();

    const handleSearch = async () => {
        Keyboard.dismiss();
        if (!destination) return;
        setLoading(true);
        setDestinationQuery(destination);
        try {
            const options = await getRouteOptions(destination, 'walking');
            setRoutes(options);
            if (options.length > 0) {
                // Default select first
                setSelectedRouteId(options[0].id);
                setSelectedRoute(options[0]);

                // Fit map to show route
                const route = options[0];
                if (route.geojson?.coordinates?.length) {
                    const coordinates = route.geojson.coordinates.map((c: any) => ({
                        latitude: c[1],
                        longitude: c[0]
                    }));
                    mapRef.current?.fitToCoordinates(coordinates, {
                        edgePadding: { top: 50, right: 20, bottom: 200, left: 20 },
                        animated: true,
                    });
                }
            }
        } catch (err: any) {
            console.error(err);
            Alert.alert("Error", "Failed to fetch routes. Please check connection.");
        } finally {
            setLoading(false);
        }
    };

    const selectedRoute = routes.find(r => r.id === selectedRouteId);

    return (
        <View className="flex-1 bg-neutral-950">
            <MapView
                ref={mapRef}
                style={{ width: '100%', height: '100%' }}
                provider={PROVIDER_DEFAULT}
                customMapStyle={DARK_MAP_STYLE}
                showsUserLocation
                showsMyLocationButton={false}
            >
                {routes.map(route => {
                    const coords = route.geojson?.coordinates?.map((c: any) => ({
                        latitude: c[1],
                        longitude: c[0]
                    })) || [];

                    const isSelected = route.id === selectedRouteId;
                    const color = route.color === 'green' ? '#10b981' : route.color === 'red' ? '#ef4444' : '#eab308';

                    return (
                        <Polyline
                            key={route.id}
                            coordinates={coords}
                            strokeColor={color}
                            strokeWidth={isSelected ? 6 : 4}
                            zIndex={isSelected ? 10 : 1}
                            onPress={() => setSelectedRouteId(route.id)}
                            tappable
                        />
                    )
                })}
            </MapView>

            {/* Floating Inputs */}
            <View className="absolute top-14 left-4 right-4 z-50">
                <View className="bg-neutral-900/90 rounded-2xl p-4 shadow-xl border border-neutral-800">
                    <View className="flex-row items-center bg-black/40 rounded-xl px-3 h-10 mb-3">
                        <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3" />
                        <Text className="text-gray-400 text-sm">Current Location</Text>
                    </View>

                    <View className="flex-row items-center bg-neutral-800 rounded-xl px-3 h-12">
                        <Search size={20} color="#9ca3af" />
                        <TextInput
                            className="flex-1 text-white ml-2"
                            placeholder="Where to?"
                            placeholderTextColor="#6b7280"
                            value={destination}
                            onChangeText={setDestination}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                    </View>

                    {loading && <ActivityIndicator className="mt-4" color="#10b981" />}
                </View>
            </View>

            {/* Route Info Card (Bottom) */}
            {selectedRoute && (
                <View className="absolute bottom-5 left-4 right-4 bg-neutral-900 rounded-2xl p-5 border border-neutral-800 shadow-xl z-50">
                    <View className="flex-row justify-between items-start mb-2">
                        <View>
                            <Text className="text-white font-bold text-xl uppercase tracking-wider">{selectedRoute.mode}</Text>
                            <Text className={`font-bold mt-1 ${selectedRoute.color === 'green' ? 'text-emerald-500' : 'text-yellow-500'}`}>
                                {selectedRoute.color === 'green' ? 'Safest Route' : 'Warning: Risks Detected'}
                            </Text>
                        </View>
                        <View className="bg-neutral-800 px-3 py-1 rounded-lg">
                            <Text className="text-white font-mono">{selectedRoute.distance}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mt-2">
                        <View className="flex-row items-center mr-6">
                            <Text className="text-gray-400 mr-2">ETA</Text>
                            <Text className="text-white font-bold">{selectedRoute.eta}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-gray-400 mr-2">Score</Text>
                            <Text className="text-white font-bold">{selectedRoute.score}/100</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={async () => {
                            if (user && selectedRoute) {
                                // Save history in background
                                saveRouteToHistory(user.uid, selectedRoute, 'Current Location', destinationQuery || destination);
                            }
                            router.push('/(tabs)/breakdown');
                        }}
                        className="bg-emerald-600 mt-4 h-12 rounded-xl items-center justify-center"
                    >
                        <Text className="text-white font-bold text-base">Start Navigation / See Breakdown</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
