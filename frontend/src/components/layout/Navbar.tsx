import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { MdMenu, MdClose } from "react-icons/md";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setMobileMenuOpen(false);
        }
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 pointer-events-none",
                scrolled ? "py-4" : "py-6"
            )}
        >
            <div
                className={cn(
                    "pointer-events-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 backdrop-blur-md border border-white/20 shadow-lg",
                    scrolled
                        ? "bg-white/90 w-[85%] md:w-[55%] shadow-xl"
                        : "bg-transparent w-[85%] md:w-[55%] border-transparent shadow-none"
                )}
            >
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-sr-green/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <img src="/logo.svg" alt="App Logo" className="w-5 h-5" />
                    </div>
                    <span className={cn("font-bold text-lg tracking-tight transition-colors", scrolled ? "text-sr-dark" : "text-white")}>
                        Safe Route Ai
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {["Home", "About", "Mission", "FAQ"].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item.toLowerCase())}
                            className={cn(
                                "text-sm font-medium transition-all duration-300 hover:text-sr-green hover:scale-110 relative group",
                                scrolled ? "text-gray-600" : "text-white/80 hover:text-white"
                            )}
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sr-green transition-all duration-300 group-hover:w-full" />
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={cn("md:hidden p-2 transition-transform hover:scale-110", scrolled ? "text-sr-dark" : "text-white")}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <MdClose size={24} />
                    ) : (
                        <MdMenu size={24} />
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 left-4 right-4 bg-black/40 dark:bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 md:hidden pointer-events-auto border border-white/20"
                    >
                        <div className="flex flex-col gap-4">
                            {["Home", "About", "Mission", "FAQ"].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="group relative text-lg font-medium text-white py-2 border-b border-white/20 last:border-0 hover:text-sr-green text-left transition-all duration-300 hover:scale-105 hover:pl-2"
                                >
                                    {item}
                                    <span className="absolute bottom-2 left-0 w-0 h-0.5 bg-sr-green transition-all duration-300 group-hover:w-full" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
