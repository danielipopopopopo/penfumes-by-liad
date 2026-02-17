import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function PerfumeDisplay() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1.05]);
    const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center pointer-events-none overflow-hidden">
            <motion.div
                className="relative w-full max-w-[600px] aspect-square flex items-center justify-center"
                style={{ y, scale, rotate }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
                {/* Glow behind the bottle */}
                <div
                    className="absolute inset-0 bg-[radial-gradient(circle,rgba(230,179,46,0.15)_0%,transparent_70%)] blur-3xl pointer-events-none"
                    aria-hidden="true"
                />

                {/* The main render */}
                <img
                    src="/premium_perfume_bottle_final_render.png"
                    alt="Premium Luxury Perfume"
                    className="w-full h-full object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
                />
            </motion.div>
        </div>
    );
}
