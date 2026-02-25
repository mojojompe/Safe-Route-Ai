import { motion, AnimatePresence } from "framer-motion";
import { MdLogout } from "react-icons/md";

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
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
                            className="w-full max-w-sm bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
                        >
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full text-red-500">
                                    <MdLogout size={32} />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Log Out?
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        Are you sure you want to log out? You'll need to sign in again to access your saved routes.
                                    </p>
                                </div>

                                <div className="flex gap-3 w-full mt-2">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        className="flex-1 px-4 py-2.5 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
