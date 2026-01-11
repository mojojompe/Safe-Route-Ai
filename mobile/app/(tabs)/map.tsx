import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, ActivityIndicator, Alert, Keyboard } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Navigation, Car, Footprints, AlertTriangle, CloudRain, Construction, Siren } from 'lucide-react-native';
import { getRouteOptions, RouteOption, saveRouteToHistory } from '../../src/services/routeService';
import { useRouteContext } from '../../src/context/RouteContext';
import { useAuth } from '../../src/context/AuthContext';
import GlassView from '../../components/ui/GlassView';
import Animated, { FadeInDown, FadeInUp, FadeInRight } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Dark Map Style JSON (Cleaned up specific colors if needed, keeping standard Dark for now)
const DARK_MAP_STYLE = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#121A15" }] // User Dark BG
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
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#181818" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#2c2c2c" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#000000" }]
    }
];

type TravelMode = 'walking' | 'driving';

export default function MapScreen() {
    const mapRef = useRef<MapView>(null);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [startLocation, setStartLocation] = useState('Current Location');
    const [destination, setDestination] = useState('');
    const [travelMode, setTravelMode] = useState<TravelMode>('walking');
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
            // Note: Currently passing startLocation only for display in history, 
            // as backend calculation assumes current location relative to destination for now.
            const options = await getRouteOptions(destination, travelMode);
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
                        edgePadding: { top: 150, right: 20, bottom: 200, left: 20 },
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

    const reportHazard = (type: string) => {
        Alert.alert("Report Hazard", `Report ${type} at current location?`, [
            { text: "Cancel", style: "cancel" },
            { text: "Report", onPress: () => Alert.alert("Success", "Hazard reported to community.") }
        ]);
    };

    return (
    <View className="flex-1 bg-[#071B11]">
        {/* MAP */}
        <MapView
            ref={mapRef}
            style={{ width: "100%", height: "100%" }}
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
                const color =
                    route.color === "green" ? "#00D35A" :
                    route.color === "red" ? "#ef4444" :
                    "#eab308";

                return (
                    <Polyline
                        key={route.id}
                        coordinates={coords}
                        strokeColor={color}
                        strokeWidth={isSelected ? 6 : 4}
                        zIndex={isSelected ? 10 : 1}
                        tappable
                        onPress={() => setSelectedRouteId(route.id)}
                    />
                );
            })}
        </MapView>

        {/* TOP FLOATING SEARCH + TOGGLES */}
        <View className="absolute top-10 left-4 right-4 z-50">
            <GlassView
                intensity={80}
                className="rounded-3xl px-4 py-4 border border-white/10 bg-white/20 shadow-lg"
            >
                {/* START LOCATION INPUT — same logic */}
                <View className="flex-row items-center bg-white/25 rounded-2xl px-4 h-12 mb-3 border border-white/10">
                    <View className="w-3 h-3 bg-[#00D35A] rounded-full mr-3" />
                    <TextInput
                        className="flex-1 text-white font-medium"
                        placeholder="Start Location"
                        placeholderTextColor="#d1d5db"
                        value={startLocation}
                        onChangeText={setStartLocation}
                    />
                </View>

                {/* DESTINATION INPUT — same logic */}
                <View className="flex-row items-center bg-white/40 rounded-2xl px-4 h-12 mb-4 border border-white/10">
                    <Search size={18} color="#000" />
                    <TextInput
                        className="flex-1 text-black ml-3 font-semibold"
                        placeholder="Where to?"
                        placeholderTextColor="#374151"
                        value={destination}
                        onChangeText={setDestination}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                </View>

                {/* TRAVEL MODE TOGGLE — same logic */}
                <View className="flex-row bg-white/30 rounded-full p-1">
                    <TouchableOpacity
                        onPress={() => setTravelMode("walking")}
                        className={`flex-1 flex-row items-center justify-center h-10 rounded-full 
                            ${travelMode === "walking" ? "bg-[#00D35A]" : ""}
                        `}
                    >
                        <Footprints
                            size={18}
                            color={travelMode === "walking" ? "#000" : "#fff"}
                        />
                        <Text
                            className={`ml-2 font-bold ${
                                travelMode === "walking" ? "text-black" : "text-white"
                            }`}
                        >
                            Walking
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setTravelMode("driving")}
                        className={`flex-1 flex-row items-center justify-center h-10 rounded-full 
                            ${travelMode === "driving" ? "bg-[#00D35A]" : ""}
                        `}
                    >
                        <Car
                            size={18}
                            color={travelMode === "driving" ? "#000" : "#fff"}
                        />
                        <Text
                            className={`ml-2 font-bold ${
                                travelMode === "driving" ? "text-black" : "text-white"
                            }`}
                        >
                            Driving
                        </Text>
                    </TouchableOpacity>
                </View>

                {loading && (
                    <ActivityIndicator
                        style={{ marginTop: 10 }}
                        color="#00D35A"
                    />
                )}
            </GlassView>
        </View>

        {/* RIGHT FLOATING BUTTONS */}
        <View className="absolute top-[40%] right-4 space-y-3 z-50">
            {["+", "-", "loc"].map((b, idx) => (
                <GlassView
                    key={idx}
                    intensity={80}
                    className="w-12 h-12 bg-white/25 rounded-full border border-white/10 items-center justify-center"
                >
                    {b === "loc" ? (
                        <Navigation size={20} color="white" />
                    ) : (
                        <Text className="text-white text-2xl font-bold">{b}</Text>
                    )}
                </GlassView>
            ))}
        </View>

        {/* BOTTOM ROUTE SUMMARY CARD — SAME LOGIC */}
        {selectedRoute && (
            <View className="absolute bottom-6 left-4 right-4 z-50">
                <GlassView
                    intensity={90}
                    className="rounded-3xl p-6 bg-white/20 border border-white/10 shadow-xl"
                >
                    <Text className="text-white text-xl font-bold mb-1">
                        Selected Route Summary
                    </Text>

                    <Text className="text-white/80 font-medium mb-1">
                        Route is {selectedRoute.score}% low-risk. ETA: {selectedRoute.eta}
                    </Text>

                    <Text className="text-white/60 text-sm mb-5">
                        Analyzing real-time safety data…
                    </Text>

                    <TouchableOpacity
                        onPress={async () => {
                            if (user && selectedRoute) {
                                saveRouteToHistory(
                                    user.uid,
                                    selectedRoute,
                                    startLocation,
                                    destinationQuery || destination
                                );
                            }
                            router.push("/(tabs)/breakdown");
                        }}
                        className="bg-[#00D35A] h-14 rounded-full flex-row items-center justify-center"
                    >
                        <Text className="text-black font-bold text-lg mr-2">
                            Start Navigation
                        </Text>
                        <Navigation size={20} color="black" />
                    </TouchableOpacity>
                </GlassView>
            </View>
        )}
    </View>
);

}
