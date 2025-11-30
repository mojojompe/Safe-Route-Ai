import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapPage() {
  const [mode, setMode] = useState('Walking')

  // Mock route data
  const routePath = [
    [51.505, -0.09],
    [51.539, -0.13],
    [51.509, -0.15],
    [51.520, -0.19],
    [51.56, -0.27],
  ] as [number, number][];

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden font-display">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[51.505, -0.09]}>
            <Popup>Start Point</Popup>
          </Marker>
          <Marker position={[51.56, -0.27]}>
            <Popup>Destination</Popup>
          </Marker>
          <Polyline
            positions={routePath}
            color="#006321FF"
            weight={4}
            opacity={0.8}
          />
        </MapContainer>
      </div>

      {/* UI Overlay */}
      <div className="relative z-30 flex h-full grow flex-col pointer-events-none">
        {/* Top Nav Bar */}
        <header className="flex w-full items-start justify-between gap-4 p-4 md:p-6 pointer-events-auto">
          {/* Left Section: Logo & Search */}
          <div className="flex flex-1 flex-col items-start gap-3">
            <div className="flex items-center gap-2 text-green-500 drop-shadow-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-dark/50 ring-1 ring-white/10 backdrop-blur-md">
                <span className="material-symbols-outlined text-primary">
                  share_location
                </span>
              </div>
              <h1 className="text-green-700 text-lg font-bold leading-tight tracking-[-0.015em] drop-shadow-md text-shadow-sm">
                Safe Route AI
              </h1>
            </div>
            <div className="w-full max-w-md shadow-lg">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-2xl h-full bg-green-900 backdrop-blur-sm ring-1 ring-white/10">
                  <div className="text-green-500 flex items-center justify-center pl-4">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-transparent h-full placeholder:text-green-500 px-4 pl-2 text-base font-normal leading-normal"
                    placeholder="Search for a destination..."
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Right Section: Mode Toggle & Map Controls */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex h-10 items-center justify-center rounded-3xl bg-green-900 p-1 backdrop-blur-sm shadow-lg ring-1 ring-white/10">
              <label
                className={`flex cursor-pointer h-full grow items-center justify-center gap-2 overflow-hidden rounded-2xl px-3 text-white text-sm font-medium leading-normal transition-colors ${
                  mode === "Walking"
                    ? "bg-green-700 shadow-lg text-green-500"
                    : ""
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  directions_walk
                </span>
                <span className="truncate hidden sm:inline">Walking</span>
                <input
                  checked={mode === "Walking"}
                  onChange={() => setMode("Walking")}
                  className="invisible absolute w-0"
                  name="route-mode"
                  type="radio"
                  value="Walking"
                />
              </label>
              <label
                className={`flex cursor-pointer h-full grow items-center justify-center gap-2 overflow-hidden rounded-2xl px-3 text-white text-sm font-medium leading-normal transition-colors ${
                  mode === "Driving"
                    ? "bg-green-700 shadow-lg text-green-500"
                    : ""
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  directions_car
                </span>
                <span className="truncate hidden sm:inline">Driving</span>
                <input
                  checked={mode === "Driving"}
                  onChange={() => setMode("Driving")}
                  className="invisible absolute w-0"
                  name="route-mode"
                  type="radio"
                  value="Driving"
                />
              </label>
            </div>
          </div>
        </header>

        <div className="flex-1"></div>

        {/* Floating Summary Card */}
        <footer className="p-4 md:p-6 flex justify-center pointer-events-auto">
          <div className="w-full max-w-xl">
            <div className="flex flex-col items-stretch justify-start rounded-3xl bg-green-900 backdrop-blur-sm shadow-lg ring-1 ring-white/10 overflow-hidden md:flex-row md:items-start">
              <div className="flex w-full grow flex-col items-stretch justify-center gap-2 p-4">
                <p className="text-whitesmoke text-lg font-bold leading-tight tracking-[-0.015em]">
                  Selected Route Summary
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-white/70 text-sm font-normal leading-normal">
                      Route is 95% low-risk. ETA: 12 min
                    </p>
                    <p className="text-white/70 text-sm font-normal leading-normal">
                      Analyzing real-time safety data...
                    </p>
                  </div>
                  <button className="flex min-w-[84px] max-w-[480px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-10 px-3 bg-green-700 text-green-500 text-sm font-bold leading-normal tracking-wide transition-transform hover:scale-105">
                    <span className="truncate">Start Navigation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
