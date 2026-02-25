import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdLightbulb, MdShield } from "react-icons/md";

interface SafetyTip {
    category: string;
    title: string;
    description: string;
    image: string;
    contextual: boolean;
    moreInfo?: string; // Optional extended info
}

interface SafetyTipModalProps {
    isOpen: boolean;
    onClose: () => void;
    tip: SafetyTip | null;
}

export default function SafetyTipModal({ isOpen, onClose, tip }: SafetyTipModalProps) {
    if (!tip) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            {/* Header Image */}
                            <div className="relative h-48 sm:h-56">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                <img
                                    src={tip.image}
                                    alt={tip.title}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors"
                                >
                                    <MdClose size={20} />
                                </button>
                                <div className="absolute bottom-4 left-6 z-20">
                                    <span className="text-xs font-bold text-green-400 uppercase tracking-wider bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm mb-2 inline-block">
                                        {tip.category}
                                    </span>
                                    <h2 className="text-2xl font-bold text-white leading-tight">
                                        {tip.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <div className="prose dark:prose-invert">
                                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-6">
                                        {tip.description}
                                    </p>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 mb-6">
                                        <div className="flex items-start gap-3">
                                            <MdLightbulb className="text-blue-500 text-xl mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-blue-700 dark:text-blue-400 text-sm uppercase tracking-wide mb-1">
                                                    Why this matters
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {getMoreInfo(tip)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-2xl border border-green-100 dark:border-green-900/30">
                                        <div className="flex items-start gap-3">
                                            <MdShield className="text-green-600 text-xl mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-green-700 dark:text-green-400 text-sm uppercase tracking-wide mb-1">
                                                    Pro Tip
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    Always update your emergency contacts and enable location sharing with trusted friends before starting your journey.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t border-gray-200/50 dark:border-white/10 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-xl font-bold text-sm transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

// Helper to generate generic "more info" if not provided
function getMoreInfo(tip: SafetyTip): string {
    if (tip.moreInfo) return tip.moreInfo;

    // Generic fallback content based on category or title keywords
    if (tip.category === 'Walking') {
        if (tip.title.includes('Phone')) return "Distracted walking is a leading cause of pedestrian accidents. Remaining alert ensures you can react to sudden traffic changes.";
        if (tip.title.includes('Light') || tip.title.includes('Bright')) return "Visibility is crucial. Statistics show that pedestrians wearing dark clothing at night are 3x more likely to be involved in accidents.";
        return "Pedestrians are most vulnerable at intersections. Staying high-alert in these zones significantly reduces accident risk.";
    }
    if (tip.category === 'Driving') {
        if (tip.title.includes('Lock')) return "Carjackings often occur when vehicles are stopped. Locked doors provide the first line of defense against unauthorized entry.";
        if (tip.title.includes('Park')) return "Well-lit areas deter criminals and ensure you remain visible to witnesses and security cameras.";
        return "Defensive driving gives you time to react to others' mistakes. Awareness is your best safety feature.";
    }
    return "Taking proactive safety measures allows you to focus on your journey rather than potential risks.";
}
