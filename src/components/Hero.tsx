import { motion } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';
import PerfumeDisplay from './PerfumeDisplay';

export default function Hero() {
    const { t } = useTranslations();

    return (
        <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-[1]">
                <PerfumeDisplay />
            </div>

            <motion.div
                className="relative z-[2] text-center pointer-events-none"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.3 }}
            >
                <motion.p
                    className="text-xs font-medium tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4 pointer-events-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    {t('luxury_fragrances')}
                </motion.p>
                <motion.h1
                    className="font-[var(--font-display)] text-[clamp(3rem,10vw,7rem)] font-normal tracking-tight leading-none mb-8 hero-shimmer pointer-events-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.7 }}
                >
                    {t('hero_title')}
                </motion.h1>
                <motion.a
                    href="#collection"
                    className="inline-block text-sm font-medium tracking-[0.15em] uppercase py-4 px-12 border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-black transition-all duration-400 ease-[var(--ease-out-custom)] pointer-events-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {t('collection')}
                </motion.a>
            </motion.div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[var(--color-bg)] to-transparent z-[3] pointer-events-none" />
        </section>
    );
}
