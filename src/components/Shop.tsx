import { motion } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';
import ProductCard from './ProductCard';

const products = [
    { nameKey: 'prod_6_name', descKey: 'prod_6_desc', priceKey: 'prod_6_price', image: '/products/img_04.jpg' },
    { nameKey: 'prod_7_name', descKey: 'prod_7_desc', priceKey: 'prod_7_price', image: '/products/img_05.jpg' },
    { nameKey: 'prod_1_name', descKey: 'prod_1_desc', priceKey: 'prod_1_price', image: '/products/img_06.jpg' },
    { nameKey: 'prod_2_name', descKey: 'prod_2_desc', priceKey: 'prod_2_price', image: '/products/img_07.jpg' },
    { nameKey: 'prod_3_name', descKey: 'prod_3_desc', priceKey: 'prod_3_price', image: '/products/img_08.jpg' },
    { nameKey: 'prod_8_name', descKey: 'prod_8_desc', priceKey: 'prod_8_price', image: '/products/img_09.jpg' },
    { nameKey: 'prod_9_name', descKey: 'prod_9_desc', priceKey: 'prod_9_price', image: '/products/img_10.jpg' },
    { nameKey: 'prod_10_name', descKey: 'prod_10_desc', priceKey: 'prod_10_price', image: '/products/img_11.jpg' },
    { nameKey: 'prod_11_name', descKey: 'prod_11_desc', priceKey: 'prod_11_price', image: '/products/img_12.jpg' },
    { nameKey: 'prod_12_name', descKey: 'prod_12_desc', priceKey: 'prod_12_price', image: '/products/img_13.jpg' },
    { nameKey: 'prod_13_name', descKey: 'prod_13_desc', priceKey: 'prod_13_price', image: '/products/img_14.jpg' },
    { nameKey: 'prod_14_name', descKey: 'prod_14_desc', priceKey: 'prod_14_price', image: '/products/img_15.jpg' },
    { nameKey: 'prod_15_name', descKey: 'prod_15_desc', priceKey: 'prod_15_price', image: '/products/img_16.jpg' },
    { nameKey: 'prod_16_name', descKey: 'prod_16_desc', priceKey: 'prod_16_price', image: '/products/img_17.jpg' },
    { nameKey: 'prod_17_name', descKey: 'prod_17_desc', priceKey: 'prod_17_price', image: '/products/img_18.jpg' },
    { nameKey: 'prod_5_name', descKey: 'prod_5_desc', priceKey: 'prod_5_price', image: '/products/img_03.jpg' },
    { nameKey: 'prod_4_name', descKey: 'prod_4_desc', priceKey: 'prod_4_price', image: '/products/img_01.jpg' },
    { nameKey: 'prod_18_name', descKey: 'prod_18_desc', priceKey: 'prod_18_price', image: '/products/img_02.jpg' },
];

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
