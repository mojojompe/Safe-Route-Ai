import { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import MissingPageModal from '../MissingPageModal';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalPageName, setModalPageName] = useState('');

    const handleMissingPageClick = (pageName: string) => {
        setModalPageName(pageName);
        setModalOpen(true);
    };

    return (
        <>
            <footer className="bg-white dark:bg-black border-t border-gray-100 dark:border-white/10 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-full bg-sr-green/20 flex items-center justify-center">
                                    <img src="/logo.svg" alt="Safe Route Logo" className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-xl text-gray-900 dark:text-white">Safe Route Ai</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                                Empowering your journey with AI-driven safety insights. Navigate with confidence, wherever you go.
                            </p>

                            {/* Social Media Icons (no links) */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-sr-green/10 hover:text-sr-green transition-colors flex items-center justify-center cursor-pointer text-gray-500 dark:text-gray-400">
                                    <FaFacebook className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-sr-green/10 hover:text-sr-green transition-colors flex items-center justify-center cursor-pointer text-gray-500 dark:text-gray-400">
                                    <FaTwitter className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-sr-green/10 hover:text-sr-green transition-colors flex items-center justify-center cursor-pointer text-gray-500 dark:text-gray-400">
                                    <FaInstagram className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-sr-green/10 hover:text-sr-green transition-colors flex items-center justify-center cursor-pointer text-gray-500 dark:text-gray-400">
                                    <FaLinkedin className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* Contact Column */}
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Contact Us</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="mailto:saferouteai@gmail.com"
                                        className="group relative text-gray-500 dark:text-gray-400 hover:text-sr-green text-sm transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:pl-2"
                                    >
                                        <FaEnvelope className="text-sr-green transition-transform group-hover:scale-110" />
                                        saferouteai@gmail.com
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.youtube.com/@SafeRouteAi"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative text-gray-500 dark:text-gray-400 hover:text-sr-green text-sm transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:pl-2"
                                    >
                                        <FaYoutube className="text-sr-green transition-transform group-hover:scale-110" />
                                        YouTube Channel
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://wa.me/2348071455374"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative text-gray-500 dark:text-gray-400 hover:text-sr-green text-sm transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:pl-2"
                                    >
                                        <FaWhatsapp className="text-sr-green transition-transform group-hover:scale-110" />
                                        +234 807 145 5374
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Company</h3>
                            <ul className="space-y-3">
                                {['About Us', 'Careers', 'Blog', 'Contact'].map((item) => (
                                    <li key={item}>
                                        <button
                                            onClick={() => handleMissingPageClick(item)}
                                            className="text-gray-500 dark:text-gray-400 hover:text-sr-green text-sm transition-colors"
                                        >
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal Column */}
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h3>
                            <ul className="space-y-3">
                                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                                    <li key={item}>
                                        <button
                                            onClick={() => handleMissingPageClick(item)}
                                            className="group relative text-gray-500 dark:text-gray-400 hover:text-sr-green text-sm transition-all duration-300 hover:scale-105 hover:pl-2"
                                        >
                                            {item}
                                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-sr-green transition-all duration-300 group-hover:w-full" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            &copy; {currentYear} Safe Route AI. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            <MissingPageModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                pageName={modalPageName}
            />
        </>
    );
}
