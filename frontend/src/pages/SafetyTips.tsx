import { useState } from 'react';
import { MdSearch, MdDirectionsWalk, MdDirectionsCar, MdNightlight, MdShield } from 'react-icons/md';
import { GlassCard } from '../components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import SafetyTipModal from '../components/SafetyTipModal';
import { PageTransition } from '../components/ui/PageTransition';

export default function SafetyTips() {
  const [activeTab, setActiveTab] = useState('Walking');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTip, setSelectedTip] = useState<any>(null);

  const tips = [
    {
      category: 'Walking',
      title: 'Stay Aware',
      description: 'Pay attention to your surroundings and avoid distractions like your phone.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5WGnvXoIGbfZ-ODqe5E3hK4Tf_73-yMf0-nXlPE2hiSfBI_zHOImAFiAV1dglrjex4hs5oR9kTsuD6fE_BXlBV8MurvhX6Xbh9mgG_9a8nimerzAbWBzaia0QNsDm_E2TZzvCLJgjzw_MpPxNed6ikpkNRTfIMkk3SsRaZEuSkz3VLalxeTrljQbhOs-A-DOp_9v5DrQ3SirHmvI648HBKUrGf11wactdsyGQ2dvNleIMC8wFCuMa5Czb9ILGbdABaXcKJZnb3nEt',
      contextual: false,
      moreInfo: "Distraction is a major factor in pedestrian incidents. Keep your head up and scan the environment continuously."
    },
    {
      category: 'Walking',
      title: 'Share Your Route',
      description: 'Let a friend or family member know your intended route and ETA.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO4FcTUaJpRkAKTHtxsuCTZOA3mWQt6BOFkP-xoS7iiW5quCdzztMKqL1vUrFXO3QlBNWaDAQBNlVSgYBJoBjXDijJEKyz9sPRT8s9JnuhAnaJsW3wRfhg1AP1ndBNHRxGfigcZr7I7HGc24EjSHoRSNufGN4tXMNAcsDDoq6KkJwHEvZA_2BZZlRP2cRtKz5R5eGVJSsL2jjNg1gt5ZvIwqgjczSWLQRQpOM4jGyLloRv51Lwi1i2bdqIz1Q7g1j5fsNIiI82QFA4',
      contextual: false,
      moreInfo: "Sharing your location creates a digital safety net. If you don't arrive on time, someone knows where to look."
    },
    {
      category: 'Walking',
      title: 'Wear Bright Clothing',
      description: 'Make yourself more visible to drivers, especially at night or in low light.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo8ZN2a0Z4pFPu-3d-MJ4YjDEZF8Kz0VY17vEYrtaVXEhEwfUjENMfWA2hOp5YiObPrgBK8WFivb0VtiEqWZx91W61W6R1TGrv38RQgdkbatYAvkdp8OqoJlyj4sMpGeM0B6LnNyYXpGUuB9NBJ42hchaF2X3yXPKPoDDf52h_f5ciEiv1s2fRiwxkKCn5JLpHtYnZMRtMbtSOupXz7BYFa_SXFoDoEiwW6jPEmHLm4wBn-lXOMXNaLrzVEXIGL_JKttdq0lMn6U7q',
      contextual: false
    },
    {
      category: 'Walking',
      title: 'Stick to Well-Lit Paths',
      description: 'When walking at night, choose routes that are well-illuminated and populated.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNQ0nyiX5v0qMDtF_f1HnRKYM-ZEoOrKR5rfk2KmjVb4lmect7amzTr8_gP451-pjeBvL5ZuFQBkC8woyFMI19_yvZFpSroxXXBs9cSVoum0RI6cRQtIkv3hsNQTTpbVPKIHxD1IppaNkUtKQIT8z6oWSqd1C6Vrq59HZC1_U2cvIBAudbFXuFY7Z6FKHs8kS7BTHcAFI7DqimTRaju0NLa-f6taLRzwulthYjAmNXYO7gpISJfryVXw8LP0wkiujXLF08Uuk_e87u',
      contextual: true
    },
    {
      category: 'Driving',
      title: 'Lock Your Doors',
      description: 'Keep your car doors locked at all times, especially in slow traffic.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa7U7oDEMqQGo9FGefNUTzJffOmwKwdG070pZRZFifjo-6mFQg8KqI4Da42RtJEUmcdzrNrbQkOLqQIXDPFEYYJCQ5KMLc3W9h6eR4CZP0XIJwKIx4VIM2Dvfzxz45WFdVk3mfBiDx17QlSuwF93LRdbntv-hQc2j04HDfg7RGJplydRJ-fD8-_s4J8jFT_hMBMpZwHckA1TGp93y3qiB-J8_a1aS4k-uYxUj5on6Dh6Uvzu2ODdmd6YwspmHF7dL0jrYVnuU7yFAC',
      contextual: false
    },
    {
      category: 'Driving',
      title: 'Plan Ahead',
      description: 'Check traffic and weather conditions before you start your journey.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0vGj4_R7Qn3k6A5z8x-S7Vq9Bw0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0A1B2C3D4E5F6G7H8I9J0K',
      contextual: false
    },
    {
      category: 'Driving',
      title: 'Avoid Road Rage',
      description: 'Stay calm and do not engage with aggressive drivers.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6',
      contextual: false
    }
  ];

  const filteredTips = tips.filter(tip => {
    const matchesTab = tip.category === activeTab;
    const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <PageTransition className="min-h-screen bg-background-light dark:bg-background-dark font-sans overflow-x-hidden">
      {/* Background Decor */}
      <div className="hidden md:block absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl space-y-8 relative z-10 px-4 py-6 md:p-10">

        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3 justify-center md:justify-start">
            <MdShield className="text-green-500" /> Safety Tips
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium max-w-2xl">
            Essential guidelines to keep you safe on the road, whether you're walking or driving.
          </p>
        </div>

        {/* Search & Tabs */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-2xl w-full sm:w-fit backdrop-blur-sm order-2 md:order-1">
            {['Walking', 'Driving'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === tab
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
              >
                {tab === 'Walking' ? <MdDirectionsWalk size={18} /> : <MdDirectionsCar size={18} />}
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96 group order-1 md:order-2">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search safety tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all backdrop-blur-md"
            />
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          <AnimatePresence mode='popLayout'>
            {filteredTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                layout
                className="h-full"
              >
                <GlassCard
                  onClick={() => setSelectedTip(tip)}
                  className="h-full group cursor-pointer hover:border-green-500/50 transition-all overflow-hidden p-0 flex flex-col min-h-[350px]"
                >
                  <div className="h-48 sm:h-56 overflow-hidden relative shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                    <img
                      src={tip.image}
                      alt={tip.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                      {tip.contextual && (
                        <span className="bg-purple-500/90 text-white text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-md flex items-center gap-1">
                          <MdNightlight size={12} /> Night
                        </span>
                      )}
                    </div>
                    <h3 className="absolute bottom-4 left-4 right-4 z-20 text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md">
                      {tip.title}
                    </h3>
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white/50 dark:bg-black/20 backdrop-blur-md">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm line-clamp-3">
                      {tip.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center bg-transparent">
                      <span className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-wider group-hover:translate-x-1 transition-transform">Read More</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {selectedTip && (
        <SafetyTipModal
          tip={selectedTip}
          isOpen={!!selectedTip}
          onClose={() => setSelectedTip(null)}
        />
      )}
    </PageTransition>
  );
}
