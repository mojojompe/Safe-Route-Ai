import { useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

export default function RouteBreakdown() {
  const [view, setView] = useState('segments')

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-green-950 overflow-x-hidden font-display">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1">
            <main className="flex flex-col lg:flex-row gap-8 mt-8">
              {/* Left Column: Route Segments */}
              <div className="w-full lg:w-2/5 flex flex-col gap-6">
                {/* PageHeading */}
                <div className="flex flex-wrap justify-between gap-3 px-4">
                  <div className="flex min-w-72 flex-col gap-2">
                    <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                      Route Analysis
                    </p>
                    <p className="text-gray-600 dark:text-[#9db9a6] text-base font-normal leading-normal">
                      Downtown to City Park
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 px-4">
                  <div className="flex min-w-[120px] flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 border border-black/10 dark:border-[#3b5443] bg-white dark:bg-[#111813]">
                    <p className="text-gray-800 dark:text-white text-base font-medium leading-normal">
                      Overall Risk
                    </p>
                    <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">
                      6.8 / 10
                    </p>
                  </div>
                  <div className="flex min-w-[120px] flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 border border-black/10 dark:border-[#3b5443] bg-white dark:bg-[#111813]">
                    <p className="text-gray-800 dark:text-white text-base font-medium leading-normal">
                      Distance
                    </p>
                    <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">
                      2.5 mi
                    </p>
                  </div>
                  <div className="flex min-w-[120px] flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 border border-black/10 dark:border-[#3b5443] bg-white dark:bg-[#111813]">
                    <p className="text-gray-800 dark:text-white text-base font-medium leading-normal">
                      Est. Time
                    </p>
                    <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">
                      15 min
                    </p>
                  </div>
                </div>

                {/* SegmentedButtons */}
                <div className="flex px-4 py-3">
                  <div className="flex h-10 flex-1 items-center justify-center rounded-xl bg-black/5 dark:bg-[#28392e] p-1">
                    <label
                      className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all ${
                        view === "segments"
                          ? "bg-white dark:bg-[#111813] shadow-sm text-black dark:text-white"
                          : "text-gray-600 dark:text-[#9db9a6]"
                      }`}
                    >
                      <span className="truncate">Route Segments</span>
                      <input
                        checked={view === "segments"}
                        onChange={() => setView("segments")}
                        className="invisible w-0"
                        name="view-toggle"
                        type="radio"
                        value="Route Segments"
                      />
                    </label>
                    <label
                      className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all ${
                        view === "turn-by-turn"
                          ? "bg-white dark:bg-[#111813] shadow-sm text-black dark:text-white"
                          : "text-gray-600 dark:text-[#9db9a6]"
                      }`}
                    >
                      <span className="truncate">Turn-by-turn</span>
                      <input
                        checked={view === "turn-by-turn"}
                        onChange={() => setView("turn-by-turn")}
                        className="invisible w-0"
                        name="view-toggle"
                        type="radio"
                        value="Turn-by-turn"
                      />
                    </label>
                  </div>
                </div>

                {/* Segment Cards List */}
                <div className="flex flex-col gap-4 px-4 overflow-y-auto max-h-[60vh]">
                  {/* High Risk Segment Card */}
                  <div className="flex w-full overflow rounded-xl bg-green-900 dark:bg-[#111813] shadow-lg p-y-1">
                    <div className="w-2 bg-red-500"></div>
                    <div className="flex flex-col gap-4 p-5 w-full">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Segment 1 of 4
                          </p>
                          <h3 className="text-lg font-bold text-black dark:text-white">
                            Oak St to Pine Ave
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-bold text-red-500">
                          <span>8/10</span>
                          <span className="material-symbols-outlined text-base">
                            warning
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">
                          Poor Lighting
                        </span>
                        <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">
                          High Crime Rate
                        </span>
                      </div>
                      <button className="flex items-center justify-center gap-2 rounded-lg bg-primary/20 dark:bg-primary/20 hover:bg-primary/30 dark:hover:bg-primary/30 px-4 py-2 text-sm font-bold text-primary dark:text-primary">
                        <span className="material-symbols-outlined text-base">
                          alt_route
                        </span>
                        <span>View Safer Detour</span>
                      </button>
                    </div>
                  </div>

                  {/* Medium Risk Segment Card */}
                  <div className="flex w-full overflow rounded-xl border border-black/10 dark:border-white/20 bg-white dark:bg-[#111813]">
                    <div className="w-2 bg-orange-500"></div>
                    <div className="flex flex-col gap-4 p-5 w-full">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Segment 2 of 4
                          </p>
                          <h3 className="text-lg font-bold text-black dark:text-white">
                            Pine Ave to Elm St
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-bold text-orange-500">
                          <span>5/10</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">
                          Isolated Block
                        </span>
                      </div>
                      <button className="flex items-center justify-center gap-2 rounded-lg bg-primary/20 dark:bg-primary/20 hover:bg-primary/30 dark:hover:bg-primary/30 px-4 py-2 text-sm font-bold text-primary dark:text-primary">
                        <span className="material-symbols-outlined text-base">
                          alt_route
                        </span>
                        <span>View Safer Detour</span>
                      </button>
                    </div>
                  </div>

                  {/* Low Risk Segment Card */}
                  <div className="flex w-full overflow rounded-xl border border-black/10 dark:border-white/20 bg-white dark:bg-[#111813]">
                    <div className="w-2 bg-green-500"></div>
                    <div className="flex flex-col gap-4 p-5 w-full">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Segment 3 of 4
                          </p>
                          <h3 className="text-lg font-bold text-black dark:text-white">
                            Elm St to Maple Blvd
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-sm font-bold text-green-500">
                          <span>2/10</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">
                          Well Lit
                        </span>
                        <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">
                          Busy Street
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Map */}
              <div className="w-full lg:w-3/5 flex flex-col min-h-[400px] lg:min-h-0">
                <div className="flex p-4 h-full">
                  <div className="w-full h-full bg-center bg-no-repeat bg-cover rounded-3xl object-cover border border-black/10 dark:border-white/20">
                    <MapContainer
                      center={[51.505, -0.09]}
                      zoom={13}
                      scrollWheelZoom={true}
                      className="h-full w-full rounded-3xl"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    </MapContainer>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
