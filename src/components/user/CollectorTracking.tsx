import React, { useState, useEffect, useRef } from "react";
import Map, { Marker, NavigationControl, FullscreenControl, Source, Layer, Popup } from 'react-map-gl/mapbox';
import type { MapRef, MarkerDragEvent, LngLat } from 'react-map-gl/mapbox';
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { FiNavigation, FiMapPin, FiUser, FiPlay, FiStopCircle, FiInfo } from 'react-icons/fi';
import { MdSpeed, MdGpsFixed, MdLocationPin } from 'react-icons/md';
import { FaArrowLeft, FaTruck } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";


const MAPBOX_KEY = import.meta.env.VITE_MAPBOX_KEY;

interface Location {
    latitude: number | null;
    longitude: number | null;
    speed: number | null;
    accuracy: number | null;
    timestamp?: number;
}

interface Viewport {
    latitude: number;
    longitude: number;
    zoom: number;
}

const blinkingStyle = {
    animation: 'blink 2s linear infinite'
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0.4; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(styleSheet);

const CollectorTracking: React.FC = () => {

    const mapRef = useRef<MapRef>(null);
    const [location, setLocation] = useState<Location>({
        latitude: null,
        longitude: null,
        speed: null,
        accuracy: null,
    });
    const [tracking, setTracking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [routeData, setRouteData] = useState<any>(null);
    const [viewport, setViewport] = useState<Viewport>({
        latitude: 11.1811449,
        longitude: 75.8498312,
        zoom: 14,
    });
    const [showPopup, setShowPopup] = useState(false);
    const [distance, setDistance] = useState<number | null>(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    // Fixed point in Ramanattukara
    const fixedPoint = {
        longitude: 75.8498312,
        latitude: 11.1811449,
        name: "Ramanattukara Center"
    };

    // Calculate distance between two points in meters
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // Earth radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    // Fit bounds between two points
    const fitBoundsBetweenPoints = (point1: [number, number], point2: [number, number]) => {
        if (!mapRef.current) return;

        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(point1);
        bounds.extend(point2);

        mapRef.current.fitBounds(bounds, {
            padding: 100,
            maxZoom: 15
        });
    };


    // Get initial location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        speed: position.coords.speed,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    };
                    setLocation(newLocation);

                    // Center map on current location
                    if (mapRef.current) {
                        mapRef.current.flyTo({
                            center: [newLocation.longitude, newLocation.latitude],
                            zoom: 14
                        });
                    }
                },
                (err) => {
                    setError(err.message);
                },
                { enableHighAccuracy: true, timeout: 5000 }
            );
        } else {
            setError("Geolocation is not supported by your browser");
        }
    }, []);

    // Update distance when location changes
    useEffect(() => {
        if (location.latitude && location.longitude) {
            const dist = calculateDistance(
                fixedPoint.latitude,
                fixedPoint.longitude,
                location.latitude,
                location.longitude
            );
            setDistance(dist);
        }
    }, [location]);


    // When tracking starts, fit bounds between points
    useEffect(() => {
        if (tracking && location.latitude && location.longitude) {
            fitBoundsBetweenPoints(
                [fixedPoint.longitude, fixedPoint.latitude],
                [location.longitude, location.latitude]
            );
        }
    }, [tracking]);


    // Track location when tracking is enabled
    useEffect(() => {
        if (!tracking) {
            setRouteData(null);
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const newLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    speed: position.coords.speed,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                };

                setLocation(newLocation);
                setError(null);

                // Get directions if we have valid coordinates
                if (newLocation.latitude && newLocation.longitude) {
                    getDirections(
                        [fixedPoint.longitude, fixedPoint.latitude],
                        [newLocation.longitude, newLocation.latitude]
                    );
                }
            },
            (err) => {
                setError(err.message);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [tracking]);


    // Get directions between points
    const getDirections = (start: [number, number], end: [number, number]) => {
        fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${MAPBOX_KEY}`
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.routes && data.routes.length > 0) {
                    setRouteData({
                        type: 'Feature',
                        properties: {},
                        geometry: data.routes[0].geometry
                    });

                    // Fit the map to the route bounds if map is available
                    if (mapRef.current) {
                        const coordinates = data.routes[0].geometry.coordinates;
                        const bounds = new mapboxgl.LngLatBounds();
                        coordinates.forEach((coord: [number, number]) => bounds.extend(coord));

                        mapRef.current.fitBounds(bounds, {
                            padding: 100,
                            maxZoom: 15
                        });
                    }
                }
            })
            .catch((err) => console.error('Error fetching directions:', err));
    };



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="container mx-auto p-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                        >
                            <FaArrowLeft className="text-gray-600" />
                        </button>
                        <h1 className="text-lg font-semibold">Track Collector</h1>
                    </div>
                </div>
            </div>

            {/* Main content with 2:1 ratio */}
            <div className="container mx-auto p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Map Section (2/3 width) */}
                    <div className="lg:w-2/3 bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-md font-semibold flex items-center">
                                <FiNavigation className="mr-2" />Track your collector
                            </h1>
                            <button
                                onClick={() => setShowPopup(!showPopup)}
                                className="p-2 rounded-full bg-white shadow hover:bg-gray-100"
                                title="Information"
                            >
                                <FiInfo size={20} />
                            </button>
                        </div>

                        {/* Information Popup */}
                        {showPopup && (
                            <div className="absolute top-20 right-4 bg-white p-4 rounded-lg shadow-lg z-10 max-w-xs">
                                <h3 className="font-bold mb-2">About This Tracker</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    This application tracks your live location and shows the route to the fixed point in Ramanattukara.
                                    Enable tracking to start monitoring your movement.
                                </p>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="text-sm text-blue-500 hover:text-blue-700"
                                >
                                    Close
                                </button>
                            </div>
                        )}

                        {/* Map container */}
                        <div className="w-full h-[70vh] rounded-lg overflow-hidden border border-gray-200">
                            <Map
                                ref={mapRef}
                                mapboxAccessToken={MAPBOX_KEY}
                                initialViewState={viewport}
                                mapStyle="mapbox://styles/mapbox/streets-v11"
                                onMove={evt => setViewport(evt.viewState)}
                            >
                                {/* Fixed point marker with popup */}
                                <Marker longitude={fixedPoint.longitude} latitude={fixedPoint.latitude} anchor="bottom">
                                    <div
                                        className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                                        style={blinkingStyle}
                                        onClick={() => setShowPopup(true)}
                                    >
                                        <FaTruck className="text-white" size={16} />
                                    </div>
                                </Marker>

                                {/* Current location marker */}
                                {location.latitude && location.longitude && (
                                    <Marker longitude={location.longitude} latitude={location.latitude} anchor="bottom">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                                            <FiUser className="text-white" size={16} />
                                        </div>
                                    </Marker>
                                )}

                                {/* Route layer */}
                                {routeData && (
                                    <Source id="route" type="geojson" data={routeData}>
                                        <Layer
                                            id="route"
                                            type="line"
                                            paint={{
                                                'line-color': '#3b82f6',
                                                'line-width': 4,
                                                'line-opacity': 0.8
                                            }}
                                            layout={{
                                                'line-join': 'round',
                                                'line-cap': 'round'
                                            }}
                                        />
                                    </Source>
                                )}

                                <NavigationControl position="top-left" showCompass={false} />
                                <FullscreenControl position="top-left" />
                            </Map>
                        </div>

                        {/* Location Details moved below map */}
                        <div className="mt-4 bg-white rounded-lg shadow p-4">
                            <h3 className="text-sm font-medium mb-2">Location Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400">Latitude</p>
                                    <p className="font-mono">{location.latitude?.toFixed(6) || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Longitude</p>
                                    <p className="font-mono">{location.longitude?.toFixed(6) || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Accuracy</p>
                                    <p className="font-mono">{location.accuracy?.toFixed(2) || "N/A"} meters</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Last Update</p>
                                    <p className="font-mono">
                                        {location.timestamp ? new Date(location.timestamp).toLocaleTimeString() : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats and Controls Section (1/3 width) */}
                    <div className="lg:w-1/3 flex flex-col gap-4">
                        {/* Stats Cards - Arranged in pairs */}
                        <div className="bg-white rounded-lg shadow p-4">
                            {/* Fixed Location and Your Location in same row */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <div className="flex items-center">
                                        <MdLocationPin className="text-red-500 mr-2" size={20} />
                                        <h3 className="text-sm font-medium">Fixed Location</h3>
                                    </div>
                                    <p className="text-sm font-medium mt-2">{fixedPoint.name}</p>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow">
                                    <div className="flex items-center">
                                        <FiUser className="text-blue-500 mr-2" size={18} />
                                        <h3 className="text-sm font-medium">Your Location</h3>
                                    </div>
                                    <p className="text-sm font-medium  mt-2">
                                        {location.latitude?.toFixed(4) || "N/A"}, {location.longitude?.toFixed(4) || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Speed and Distance in same row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <div className="flex items-center">
                                        <MdSpeed className="text-green-500 mr-2" size={20} />
                                        <h3 className="text-sm font-medium">Speed</h3>
                                    </div>
                                    <p className="text-sm font-semibold mt-2">
                                        {location.speed ? `${(location.speed * 3.6).toFixed(1)} km/h` : "N/A"}
                                    </p>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow">
                                    <div className="flex items-center">
                                        <MdGpsFixed className="text-purple-500 mr-2" size={20} />
                                        <h3 className="text-sm font-medium">Distance</h3>
                                    </div>
                                    <p className="text-sm font-semibold mt-2">
                                        {distance ? `${(distance / 1000).toFixed(2)} km` : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tracking Button */}
                        <button
                            onClick={() => setTracking(!tracking)}
                            className={`w-full px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center ${
                                tracking ? "bg-red-700 hover:bg-red-800" : "bg-green-900 hover:bg-green-950"
                            }`}
                        >
                            {tracking ? (
                                <>
                                    <FiStopCircle className="mr-2" /> Stop Tracking
                                </>
                            ) : (
                                <>
                                    <FiPlay className="mr-2" /> Start Tracking
                                </>
                            )}
                        </button>

                        {error && (
                            <p className="mt-2 text-sm text-red-500 flex items-center">
                                <FiInfo className="mr-1" /> {error}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectorTracking;


