import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

export default function Navbar() {
    const { t, lang, toggleLang } = useTranslations();
    const { currentUser, logout } = useAuth();
    const { cart, toggleCart } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { key: 'home', href: '#home' },
        { key: 'collection', href: '#collection' },
        { key: 'about', href: '#about' },
    ];

    const handleAuthClick = () => {
        if (currentUser) {
            logout();
        } else {
            window.dispatchEvent(new CustomEvent('open-auth'));
        }
    };

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,10,10,0.7)] backdrop-blur-xl border-b border-[var(--color-border)]"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        >
            <nav className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
                <a href="#" className="flex items-center hover:opacity-80 transition-opacity duration-200">
                    <img src="/logo.jpg" alt="Penfumes" className="h-12 w-auto object-contain rounded-md" />
                </a>

                {/* Desktop Nav */}
                <ul className={`
          list-none flex items-center gap-8
          max-md:fixed max-md:top-0 max-md:right-0 max-md:w-full max-md:h-screen
          max-md:bg-[rgba(10,10,10,0.95)] max-md:backdrop-blur-3xl
          max-md:flex-col max-md:justify-center max-md:gap-8
          max-md:z-[150] max-md:transition-transform max-md:duration-500 max-md:ease-[var(--ease-out-custom)]
          ${mobileOpen ? 'max-md:translate-x-0' : 'max-md:translate-x-full'}
        `}>
                    {navItems.map(item => (
                        <li key={item.key}>
                            <a
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="text-sm md:text-xs font-normal tracking-wider uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 relative group"
                            >
                                {t(item.key)}
                                <span className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-gold)] group-hover:w-full transition-all duration-400 ease-[var(--ease-out-custom)]" />
                            </a>
                        </li>
                    ))}
                    <li className="max-md:block md:block">
                        <button
                            onClick={() => { handleAuthClick(); setMobileOpen(false); }}
                            className="text-sm md:text-xs tracking-wider uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 bg-transparent border-none"
                        >
                            {currentUser
                                ? `${t('hello')}, ${currentUser.name.split(' ')[0]} | ${t('logout')}`
                                : t('login_signup')
                            }
                        </button>
                    </li>
                </ul>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleLang}
                        className="text-xs font-semibold tracking-widest px-3 py-1.5 border border-[var(--color-border)] rounded-full text-[var(--color-text-secondary)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all duration-200 bg-transparent"
                    >
                        {lang === 'he' ? 'EN' : 'HE'}
                    </button>

                    <button onClick={toggleCart} className="relative text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 p-1 bg-transparent border-none">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                        <AnimatePresence>
                            {cart.length > 0 && (
                                <motion.span
                                    className="absolute -top-1.5 -right-1.5 bg-[var(--color-gold)] text-black text-[0.65rem] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                >
                                    {cart.length}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Mobile burger */}
                    <button
                        className={`flex flex-col gap-[5px] p-1 md:hidden bg-transparent border-none z-[200] ${mobileOpen ? 'burger-open' : ''}`}
                        onClick={() => setMobileOpen(prev => !prev)}
                        aria-label="Menu"
                    >
                        <span className="block w-[22px] h-[1.5px] bg-[var(--color-text-secondary)] rounded transition-all duration-300 ease-[var(--ease-out-custom)] origin-center" />
                        <span className="block w-[22px] h-[1.5px] bg-[var(--color-text-secondary)] rounded transition-all duration-300 ease-[var(--ease-out-custom)] origin-center" />
                        <span className="block w-[22px] h-[1.5px] bg-[var(--color-text-secondary)] rounded transition-all duration-300 ease-[var(--ease-out-custom)] origin-center" />
                    </button>
                </div>
            </nav>
        </motion.header>
    );
}
