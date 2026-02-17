import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';
import { useCart } from '../hooks/useCart';

interface Props {
    nameKey: string;
    descKey: string;
    priceKey: string;
    image?: string;
    index: number;
}

export default function ProductCard({ nameKey, descKey, priceKey, image, index }: Props) {
    const { t, lang } = useTranslations();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState(5);
    const sizes = [2, 3, 5, 10];

    return (
        <motion.div
            className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-border-hover)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_var(--color-gold-glow)] transition-all duration-400 flex flex-col h-full"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                type: 'spring',
                stiffness: 80,
                damping: 20,
                delay: index * 0.15,
            }}
            whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
        >
            {/* Image Section */}
            <div className="relative h-[260px] bg-[#0a0a0a] overflow-hidden group">
                {image ? (
                    <img
                        src={image}
                        alt={t(nameKey)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#1a1a1a]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-[var(--font-display)] text-2xl font-normal mb-2">{t(nameKey)}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed flex-grow">{t(descKey)}</p>

                {/* Size Selector */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{t('size')}</span>
                        <span className="text-[10px] text-[#c9a96e] font-serif italic">{t('usage_info')}</span>
                    </div>
                    <div className="flex gap-2">
                        {sizes.map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border ${selectedSize === size
                                    ? 'bg-[#c9a96e] border-[#c9a96e] text-black shadow-[0_0_15px_rgba(201,169,110,0.3)]'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                    }`}
                            >
                                {size}{t('ml')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xl font-medium text-[var(--color-gold)]">
                            {(() => {
                                const basePriceStr = t(priceKey);
                                const match = basePriceStr.match(/₪(\d+)/);
                                const basePrice = match ? parseInt(match[1]) : 0;
                                let multiplier = 1;
                                if (selectedSize === 2) multiplier = 0.5;
                                else if (selectedSize === 3) multiplier = 0.7;
                                else if (selectedSize === 10) multiplier = 1.8;

                                const finalPrice = Math.round(basePrice * multiplier);
                                return `₪${finalPrice} (${selectedSize}${t('ml')})`;
                            })()}
                        </span>
                    </div>
                    <motion.button
                        className="text-xs font-medium tracking-wider uppercase px-5 py-3 bg-transparent border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] hover:shadow-[0_0_20px_var(--color-gold-glow)] transition-all duration-200 cursor-pointer"
                        onClick={() => {
                            const basePriceStr = t(priceKey);
                            const match = basePriceStr.match(/₪(\d+)/);
                            const basePrice = match ? parseInt(match[1]) : 0;
                            let multiplier = 1;
                            if (selectedSize === 2) multiplier = 0.5;
                            else if (selectedSize === 3) multiplier = 0.7;
                            else if (selectedSize === 10) multiplier = 1.8;

                            const finalPrice = Math.round(basePrice * multiplier);
                            const priceString = `₪${finalPrice} (${selectedSize}${t('ml')})`;

                            addToCart(nameKey, priceKey, selectedSize, priceString);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                        {t('add_to_cart')}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
