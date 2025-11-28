import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const nav = useNavigate()

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden font-display">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex w-full flex-1 flex-col">
          <header className="flex items-center justify-between whitespace-nowrap px-4 py-3 sm:px-10 md:px-20 lg:px-40">
            <div className="flex items-center gap-4 text-slate-800 dark:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Safe Route AI</h2>
            </div>
          </header>

          <main className="flex flex-1 flex-col items-center">
            <div className="relative flex w-full flex-col items-center justify-center px-4 py-20 text-center sm:px-10 md:px-20 lg:px-40 lg:py-32">
              <div className="absolute inset-0 z-0 opacity-10 dark:opacity-[0.07]">
                <img alt="Abstract illustration of a city map with winding paths and location markers." className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvrXYkB7K80BQntCMUiPE0jWZRTAljOOItuRJedFlDYft2zfLBiK96p0GU7RuDAZfVTTqpQMT4hYsAbGmW71IR_2O-zPQXdfQRaiou6K50IzULiBenimeiygMj8eoJywTohj8v6JcgP4V_GguOaqGnG7aDu6IYsQ-uUKNqdqnkIqKiGHSHP_sPYieWwhgDzwxX-OWoMaDaVEzCVa_3ArTiwY93Gy3ujTT-QZoy8S1rIE-wOBqDUVGhmSU13cqaqxSVAbxfHaY27QSC" />
              </div>
              <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6">
                <div className="flex flex-col gap-2">
                  <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-slate-800 dark:text-white sm:text-5xl md:text-6xl">
                    Welcome to Safe Route AI
                  </h1>
                  <h2 className="text-base font-normal leading-normal text-slate-600 dark:text-slate-300 md:text-xl">
                    Find the safest route before you move.
                  </h2>
                </div>
                <button
                  onClick={() => nav('/map')}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-primary text-background-dark text-lg font-bold leading-normal tracking-[0.015em] transition-transform hover:scale-105"
                >
                  <span className="truncate">Start</span>
                </button>
              </div>
            </div>

            <section className="w-full bg-white dark:bg-background-dark/50 px-4 py-16 sm:px-10 md:px-20 lg:px-40 sm:py-24">
              <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
                <div className="flex flex-col gap-4 rounded-xl border border-slate-200/50 bg-background-light p-6 text-center dark:border-slate-700/50 dark:bg-slate-800/20">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-3xl">verified_user</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Enhanced Safety</h3>
                  <p className="text-slate-600 dark:text-slate-300">Our AI analyzes real-time data to guide you through the safest paths, avoiding high-risk areas.</p>
                </div>
                <div className="flex flex-col gap-4 rounded-xl border border-slate-200/50 bg-background-light p-6 text-center dark:border-slate-700/50 dark:bg-slate-800/20">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-3xl">route</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Smart Navigation</h3>
                  <p className="text-slate-600 dark:text-slate-300">Get optimized routes for both walking and driving, balancing speed with unparalleled safety.</p>
                </div>
                <div className="flex flex-col gap-4 rounded-xl border border-slate-200/50 bg-background-light p-6 text-center dark:border-slate-700/50 dark:bg-slate-800/20">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined !text-3xl">notifications_active</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Real-Time Alerts</h3>
                  <p className="text-slate-600 dark:text-slate-300">Receive instant alerts about potential hazards on your route, keeping you aware and prepared.</p>
                </div>
              </div>
            </section>
          </main>
          <footer className="w-full py-6 text-center text-slate-600 dark:text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Safe Route AI. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
