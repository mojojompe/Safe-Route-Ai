import { motion, AnimatePresence } from 'framer-motion';

interface MissingPageModalProps {
    isOpen: boolean;
    onClose: () => void;
    pageName?: string;
}

export default function MissingPageModal({ isOpen, onClose, pageName }: MissingPageModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-white/10"
                        >
                            <div className="text-center">
                                {/* Icon */}
                                <div className="w-16 h-16 bg-sr-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-sr-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                                    Coming Soon
                                </h2>

                                {/* Message */}
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {pageName ? `The ${pageName} page` : 'This page'} is currently under construction. We're working hard to bring you this feature soon!
                                </p>

                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="w-full px-6 py-3 bg-sr-green text-white rounded-xl font-semibold hover:bg-sr-green-dim transition-colors shadow-lg hover:shadow-xl"
                                >
                                    Got it
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
