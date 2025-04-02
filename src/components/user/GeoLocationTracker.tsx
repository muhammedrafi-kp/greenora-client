// import React, { useState, useEffect, useRef } from "react";

// import mapboxgl from 'mapbox-gl'

// import 'mapbox-gl/dist/mapbox-gl.css';

// const MAPBOX_KEY = "pk.eyJ1IjoicmZ5MTAiLCJhIjoiY204cHNsYWIwMDVwMjJqc2hnOWZndDJlMCJ9.mVbOfB8NS7whlYm-Fhf2xQ";
// mapboxgl.accessToken = MAPBOX_KEY;

// const GeoLocationTracker = () => {
//   const mapContainer = useRef<HTMLDivElement>(null);
//   const map = useRef<mapboxgl.Map | null>(null);
//   const [location, setLocation] = useState({
//     latitude: null as number | null,
//     longitude: null as number | null,
//     speed: null as number | null,
//     accuracy: null as number | null,
//   });
//   const [tracking, setTracking] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const markerRef = useRef<mapboxgl.Marker | null>(null);
//   const fixedMarkerRef = useRef<mapboxgl.Marker | null>(null);
//   const [viewport, setViewport] = useState({
//     latitude: 0,
//     longitude: 0,
//     zoom: 14,
//   });
//   // Fixed point in Ramanattukara
//   const fixedPoint = {
//     longitude: 75.8498312,
//     latitude: 11.1811449
//   };

//   // Initialize map
//   useEffect(() => {
//     if (map.current || !mapContainer.current) return;

//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: "mapbox://styles/mapbox/streets-v11",
//       center: [fixedPoint.longitude, fixedPoint.latitude],
//       zoom: 14,
//     });

//     // Wait for map to load before adding markers
//     map.current.on('load', () => {
//       // Add fixed point marker
//       fixedMarkerRef.current = new mapboxgl.Marker({ color: "#FF0000" })
//         .setLngLat([fixedPoint.longitude, fixedPoint.latitude])
//         .setPopup(new mapboxgl.Popup().setHTML("<h3>Ramanattukara</h3>"))
//         .addTo(map.current);
//     });

//     // Add controls
//     map.current.addControl(new mapboxgl.NavigationControl());
//     map.current.addControl(new mapboxgl.FullscreenControl());

//     return () => {
//       if (map.current) {
//         map.current.remove();
//         map.current = null;
//       }
//     };
//   }, []);

//   // Track location
//   useEffect(() => {
//     if (!tracking) {
//       if (markerRef.current && map.current) {
//         markerRef.current.remove();
//         markerRef.current = null;
//       }
//       // Remove route when tracking is stopped
//       if (map.current) {
//         if (map.current.getLayer('route')) map.current.removeLayer('route');
//         if (map.current.getSource('route')) map.current.removeSource('route');
//       }
//       return;
//     }

//     if (!navigator.geolocation) {
//       setError("Geolocation is not supported by your browser");
//       return;
//     }

//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         const newLocation = {
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           speed: position.coords.speed,
//           accuracy: position.coords.accuracy,
//         };

//         setLocation(newLocation);
//         setError(null);

//         // Update or create marker
//         if (markerRef.current) {
//           markerRef.current.setLngLat([newLocation.longitude, newLocation.latitude]);
//         } else if (map.current) {
//           markerRef.current = new mapboxgl.Marker({ color: "#3FB1CE" })
//             .setLngLat([newLocation.longitude, newLocation.latitude])
//             .setPopup(new mapboxgl.Popup().setHTML("<h3>Your Location</h3>"))
//             .addTo(map.current);
//         }

//         // Center map on first location
//         if (map.current && !location.latitude) {
//           map.current.flyTo({
//             center: [newLocation.longitude, newLocation.latitude],
//             zoom: 14,
//           });
//         }

//         // Get directions
//         if (map.current && newLocation.latitude && newLocation.longitude) {
//           getDirections(
//             [fixedPoint.longitude, fixedPoint.latitude],
//             [newLocation.longitude, newLocation.latitude]
//           );
//         }
//       },
//       (err) => {
//         setError(err.message);
//       },
//       { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
//     );

//     return () => {
//       navigator.geolocation.clearWatch(watchId);
//     };
//   }, [tracking]);

//   // Get directions between points
//   const getDirections = (start: [number, number], end: [number, number]) => {
//     if (!map.current) return;

//     // Remove existing route layer if it exists
//     if (map.current.getLayer('route')) {
//       map.current.removeLayer('route');
//     }
//     if (map.current.getSource('route')) {
//       map.current.removeSource('route');
//     }

//     fetch(
//       `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${MAPBOX_KEY}`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.routes && data.routes.length > 0) {
//           const route = data.routes[0].geometry;

//           // Add the route source
//           map.current!.addSource('route', {
//             type: 'geojson',
//             data: {
//               type: 'Feature',
//               properties: {},
//               geometry: route
//             }
//           });

//           // Add the route layer
//           map.current!.addLayer({
//             id: 'route',
//             type: 'line',
//             source: 'route',
//             layout: {
//               'line-join': 'round',
//               'line-cap': 'round'
//             },
//             paint: {
//               'line-color': '#3fb1ce',
//               'line-width': 2,
//               'line-opacity': 0.7
//             }
//           });

//           // Fit the map to the route bounds
//           const coordinates = route.coordinates;
//           const bounds = coordinates.reduce((bounds:any, coord:any) => {
//             return bounds.extend(coord);
//           }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

//           map.current!.fitBounds(bounds, {
//             padding: 50,
//             maxZoom: 14
//           });
//         }
//       })
//       .catch((err) => console.error('Error fetching directions:', err));
//   };

//   return (
//     <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-lg w-full max-w-4xl">
//       <h2 className="text-xl font-bold mb-4">📍 Live Location Tracker (Mapbox)</h2>

//       {/* Map container */}
//       <div ref={mapContainer} className="w-full h-96 mb-4 rounded-lg overflow-hidden" />

//       {/* Location Data */}
//       {error && <p className="text-red-500 mb-2">{error}</p>}
//       <div className="grid grid-cols-2 gap-4 w-full">
//         <p className="text-gray-700">Latitude: {location.latitude?.toFixed(6) || "N/A"}</p>
//         <p className="text-gray-700">Longitude: {location.longitude?.toFixed(6) || "N/A"}</p>
//         <p className="text-gray-700">Speed: {location.speed?.toFixed(2) || "N/A"} m/s</p>
//         <p className="text-gray-700">Accuracy: {location.accuracy?.toFixed(2) || "N/A"} meters</p>
//       </div>

//          {/* Controls */}
//       <button
//         onClick={() => setTracking(!tracking)}
//         className={`mt-4 px-4 py-2 text-white rounded-lg ${
//           tracking ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
//         }`}
//       >
//         {tracking ? "Stop Tracking" : "Start Tracking"}
//       </button>
//     </div>
//   );
// };

// export default GeoLocationTracker;

import React, { useState, useEffect, useRef } from "react";
import Map, { Marker, NavigationControl, FullscreenControl, Source, Layer, Popup } from 'react-map-gl/mapbox';
import type { MapRef, MarkerDragEvent, LngLat } from 'react-map-gl/mapbox';
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { FiNavigation, FiMapPin, FiUser, FiPlay, FiStopCircle, FiInfo } from 'react-icons/fi';
import { MdSpeed, MdGpsFixed, MdLocationPin } from 'react-icons/md';

const MAPBOX_KEY = "pk.eyJ1IjoicmZ5MTAiLCJhIjoiY204cGs1Nzc5MDM1dzJsc2gyOXFnY3RwbCJ9.Rk-lBQ2SG0GldFcU8wGmjg";

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

const GeoLocationTracker = () => {
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
    <div className="flex flex-col items-center p-10 bg-gray-50 rounded-xl shadow-xl w-full mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="lg:text-2xl md:text-xl sm:text-lg text:sm font-bold text-gray-800 flex items-center">
          <FiNavigation className="mr-2" /> Live Location Tracker
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowPopup(!showPopup)}
            className="p-2 rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-100 transition-colors"
            title="Information"
          >
            <FiInfo size={20} />
          </button>
        </div>
      </div>

      {/* Information Popup */}
      {showPopup && (
        <div className="absolute top-20 right-4 bg-white p-4 rounded-lg shadow-lg z-10 max-w-xs">
          <h3 className="font-bold mb-2 text-gray-800">About This Tracker</h3>
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
      {/* <div className="w-full h-[500px] mb-6 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm"> */}
      <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] mb-6 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">

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
              onClick={() => setShowPopup(true)}
            >
              <FiMapPin className="text-white" size={16} />
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

      {/* Stats Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <MdLocationPin className="text-red-500 mr-2" size={20} />
            <h3 className="text-sm font-medium text-gray-500">Fixed Location</h3>
          </div>
          <p className="text-lg font-semibold mt-1">{fixedPoint.name}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <FiUser className="text-blue-500 mr-2" size={18} />
            <h3 className="text-sm font-medium text-gray-500">Your Location</h3>
          </div>
          <p className="text-lg font-semibold mt-1">
            {location.latitude?.toFixed(4) || "N/A"}, {location.longitude?.toFixed(4) || "N/A"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <MdSpeed className="text-green-500 mr-2" size={20} />
            <h3 className="text-sm font-medium text-gray-500">Speed</h3>
          </div>
          <p className="text-lg font-semibold mt-1">
            {location.speed ? `${(location.speed * 3.6).toFixed(1)} km/h` : "N/A"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <MdGpsFixed className="text-purple-500 mr-2" size={20} />
            <h3 className="text-sm font-medium text-gray-500">Distance</h3>
          </div>
          <p className="text-lg font-semibold mt-1">
            {distance ? `${(distance / 1000).toFixed(2)} km` : "N/A"}
          </p>
        </div>
      </div>

      {/* Controls and Additional Data */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Location Details</h3>
          <div className="grid grid-cols-2 gap-3">
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

        <div className="flex flex-col items-center">
          <button
            onClick={() => setTracking(!tracking)}
            className={`px-6 py-3 rounded-xl text-white font-medium flex items-center transition-all ${tracking ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
              } shadow-md hover:shadow-lg`}
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
  );
};

export default GeoLocationTracker;