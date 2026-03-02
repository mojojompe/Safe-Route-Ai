import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdChevronRight, MdRefresh, MdHistory, MdTrendingUp, MdWarning, MdDelete, MdDeleteForever } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/ui/PageTransition';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface RouteItem {
  _id: string;
  startLocation: string;
  endLocation: string;
  distance: string;
  duration: string;
  safetyScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  date: string;
}

export default function History() {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [replayingId, setReplayingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showClearAll, setShowClearAll] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);

  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/history`, {
          params: { userId: user.uid }
        });
        setRoutes(res.data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleReplay = async (route: RouteItem) => {
    if (replayingId) return;
    setReplayingId(route._id);
    try {
      // 1. Geocode Start
      const startRes = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(route.startLocation)}.json`, {
        params: { access_token: MAPBOX_TOKEN, limit: 1 }
      });
      const startCoords = startRes.data.features[0]?.center;

      // 2. Geocode End
      const endRes = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(route.endLocation)}.json`, {
        params: { access_token: MAPBOX_TOKEN, limit: 1 }
      });
      const destCoords = endRes.data.features[0]?.center;

      if (!startCoords || !destCoords) {
        alert('Could not find locations for this route.');
        return;
      }

      // 3. Fetch Route Options
      const routeRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/route/options`, {
        start: startCoords,
        destination: destCoords,
        mode: 'driving'
      });

      // 4. Navigate to Breakdown (using the first/best route)
      const bestRoute = routeRes.data[0];
      nav('/route-breakdown', {
        state: {
          routeData: bestRoute,
          startQuery: route.startLocation,
          destQuery: route.endLocation
        }
      });

    } catch (error) {
      console.error("Replay failed", error);
      alert('Failed to replay route. Please try again.');
    } finally {
      setReplayingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/history/${id}`);
      // Optimistically remove from list with animation
      setRoutes(prev => prev.filter(r => r._id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Failed to delete route', error);
      alert('Failed to delete route. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!user) return;
    setClearingAll(true);
    try {
      await Promise.all(routes.map(r => axios.delete(`${import.meta.env.VITE_API_URL}/api/history/${r._id}`)));
      setRoutes([]);
      setShowClearAll(false);
    } catch (error) {
      console.error('Failed to clear history', error);
      alert('Failed to clear history. Please try again.');
    } finally {
      setClearingAll(false);
    }
  };

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.endLocation.toLowerCase().includes(search.toLowerCase()) ||
      route.startLocation.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || route.riskLevel === filter;
    return matchesSearch && matchesFilter;
  });

  // Calculate Summary Stats
  const totalRoutes = routes.length;
  const avgSafetyScore = totalRoutes > 0
    ? (routes.reduce((acc, curr) => acc + curr.safetyScore, 0) / totalRoutes).toFixed(1)
    : '0';

  return (
    <PageTransition className="min-h-screen bg-background-light dark:bg-background-dark p-6 lg:p-10 font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Confirm Delete Single Route Modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <GlassCard className="max-w-sm w-full p-8 text-center bg-white dark:bg-zinc-900 border-red-500/20">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-5">
                  <MdDelete className="text-3xl text-red-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Delete Route?</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                  This route will be permanently removed from your history. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(confirmDeleteId)}
                    disabled={deletingId === confirmDeleteId}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {deletingId === confirmDeleteId ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><MdDelete /> Delete</>
                    )}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Clear All Modal */}
      <AnimatePresence>
        {showClearAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <GlassCard className="max-w-sm w-full p-8 text-center bg-white dark:bg-zinc-900 border-red-500/20">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-5">
                  <MdDeleteForever className="text-3xl text-red-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Clear All History?</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                  All <strong className="text-gray-900 dark:text-white">{routes.length} routes</strong> will be permanently deleted. This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearAll(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAll}
                    disabled={clearingAll}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {clearingAll ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><MdDeleteForever /> Clear All</>
                    )}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <MdHistory className="text-green-500" /> Route History
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Review your past journeys and safety insights.
            </p>
          </div>

          {/* Stats Summary + Clear All */}
          <div className="flex gap-3 items-center flex-wrap">
            <GlassCard className="px-5 py-3 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                <MdTrendingUp size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Total Routes</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">{totalRoutes}</p>
              </div>
            </GlassCard>
            <GlassCard className="px-5 py-3 flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                <MdWarning size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Avg Safety</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">{avgSafetyScore}/10</p>
              </div>
            </GlassCard>

            {/* Clear All Button */}
            {routes.length > 0 && (
              <button
                onClick={() => setShowClearAll(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-bold text-sm border border-red-200 dark:border-red-800/30 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <MdDeleteForever size={18} /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <GlassCard className="p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-white/5 border-transparent rounded-xl focus:bg-white dark:focus:bg-black/20 focus:ring-2 focus:ring-green-500/50 transition-all outline-none text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {["All", "Low", "Moderate", "High"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === f
                  ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
                  : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                  }`}
              >
                {f} {f !== 'All' && 'Risk'}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredRoutes.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-full mb-4 text-gray-400">
                <MdSearch size={32} />
              </div>
              <p className="text-gray-500 text-lg font-medium">No routes found matching your criteria.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredRoutes.map((route, i) => (
                <motion.div
                  key={route._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  layout
                >
                  <GlassCard className="p-4 md:p-5 flex flex-col md:flex-row gap-4 md:gap-5 items-start md:items-center group" hoverEffect>
                    {/* Date Box */}
                    <div className="flex-shrink-0 flex flex-row md:flex-col items-center justify-center w-full md:w-16 h-10 md:h-16 gap-2 md:gap-0 bg-gray-100 dark:bg-white/5 rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-white/5 order-1 md:order-none">
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        {new Date(route.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-sm md:text-xl font-black text-gray-900 dark:text-white">
                        {new Date(route.date).getDate()}
                      </span>
                    </div>

                    {/* Route Details */}
                    <div className="flex-1 min-w-0 w-full order-3 md:order-none">
                      <div className="flex flex-col gap-1 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight break-words">
                          {route.startLocation}
                          <span className="text-gray-400 mx-2 inline-block md:hidden">↓</span>
                          <span className="text-gray-400 mx-2 hidden md:inline-block">→</span>
                          {route.endLocation}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                          {route.distance}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                          {route.duration}
                        </span>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end order-2 md:order-none border-b md:border-0 border-gray-100 dark:border-white/5 pb-3 md:pb-0 mb-3 md:mb-0">
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${route.riskLevel === 'Low' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                          route.riskLevel === 'Moderate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                            'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}>
                          {route.riskLevel}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-400 font-medium hidden sm:block">Score: <span className="text-gray-900 dark:text-white font-bold">{route.safetyScore}/10</span></p>

                        {/* Delete Button */}
                        <button
                          onClick={() => setConfirmDeleteId(route._id)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-400 hover:text-red-500 border border-red-100 dark:border-red-900/20 transition-all"
                          title="Delete Route"
                        >
                          <MdDelete className="text-lg" />
                        </button>

                        {/* Replay Button */}
                        <button
                          onClick={() => handleReplay(route)}
                          disabled={replayingId === route._id}
                          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                          title="Replay Route"
                        >
                          {replayingId === route._id ? (
                            <MdRefresh className="animate-spin text-lg md:text-xl" />
                          ) : (
                            <MdChevronRight className="text-xl md:text-2xl" />
                          )}
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
