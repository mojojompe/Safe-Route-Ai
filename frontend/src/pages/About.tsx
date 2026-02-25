import { MdVerifiedUser, MdLock, MdEmail, MdGroups, MdLightbulb } from 'react-icons/md';
import { GlassCard } from '../components/ui/GlassCard';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/ui/PageTransition';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <PageTransition className="relative min-h-screen w-full bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <main className="relative flex-1 p-6 lg:p-10 z-10">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 mb-12 text-center items-center"
          >
            <span className="text-green-600 dark:text-green-500 font-bold tracking-wider uppercase text-sm">Our Story</span>
            <h1 className="text-gray-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
              About Safe Route AI
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-normal max-w-2xl mx-auto">
              Your trusted partner in navigating the world more safely, powered by advanced artificial intelligence.
            </p>
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              src="/New Vector.png"
              alt="Safe Route AI Concept"
              className="w-full max-w-md mt-8 rounded-3xl shadow-2xl hover:scale-[1.02] transition-transform duration-500"
            />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Mission Section */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <GlassCard className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 border-l-4 border-l-green-500">
                <div className="p-6 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                  <MdVerifiedUser size={48} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Our Mission
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    At Safe Route AI, our mission is to empower individuals to make safer travel choices.
                    We leverage cutting-edge AI and real-time data to analyze routes for potential hazards,
                    providing you with the safest possible path to your destination. We believe that safety
                    is a fundamental right, not a luxury.
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Privacy Section */}
            <motion.div variants={itemVariants}>
              <GlassCard className="h-full p-8 flex flex-col gap-4" hoverEffect>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                  <MdLock size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Privacy First
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We are committed to protecting your data. Your location is used only to provide safety services
                  and is never shared without consent. All data is anonymized and encrypted.
                </p>
              </GlassCard>
            </motion.div>

            {/* Innovation Section */}
            <motion.div variants={itemVariants}>
              <GlassCard className="h-full p-8 flex flex-col gap-4" hoverEffect>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
                  <MdLightbulb size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Continuous Innovation
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our algorithms are constantly learning and adapting. We combine historical crime data,
                  lighting conditions, and road safety stats to keep you ahead of danger.
                </p>
              </GlassCard>
            </motion.div>

            {/* Team Section */}
            <motion.div variants={itemVariants} className="md:col-span-2 mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <motion.img
                  src="/New Phone.png"
                  alt="App Interface"
                  className="w-full max-w-sm mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="order-1 md:order-2">
                <GlassCard className="p-8 md:p-12 text-center bg-gradient-to-br from-green-900/5 to-transparent h-full flex flex-col justify-center items-center">
                  <div className="inline-flex p-4 bg-white dark:bg-black/20 rounded-full shadow-lg mb-6 text-gray-800 dark:text-white">
                    <MdGroups size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Join Our Community
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                    We're building a community of safety-conscious individuals. Share your experiences,
                    report hazards, and help make your city safer for everyone.
                  </p>
                  <a
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-green-500/30"
                    href="mailto:support@saferoute.ai"
                  >
                    <MdEmail size={20} />
                    Contact Support
                  </a>
                </GlassCard>
              </div>
            </motion.div>

          </motion.div>

          <footer className="w-full py-10 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Safe Route AI. All rights reserved.
            </p>
          </footer>
        </div>
      </main>
    </PageTransition>
  );
}
