import { motion } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';
import ProductCard from './ProductCard';
import { products } from '../data/products';

export default function Shop() {
    const { t } = useTranslations();

    return (
        <section id="collection" className="py-32 bg-[var(--color-bg)]">
            <div className="max-w-[1200px] mx-auto px-6">
                <motion.h2
                    className="font-[var(--font-display)] text-[clamp(2rem,5vw,3.5rem)] font-normal tracking-tight text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                >
                    {t('collection_title')}
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((p, i) => (
                        <ProductCard key={p.nameKey} {...p} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
