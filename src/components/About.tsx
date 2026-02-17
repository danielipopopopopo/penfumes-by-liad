import { motion, Variants } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';

const textKeys = ['about_intro', 'about_goal', 'about_reason'];
const questionKeys = ['about_q1', 'about_q2', 'about_q3'];
const bulletKeys = ['about_b1', 'about_b2', 'about_b3'];

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 80, damping: 20 },
    },
};

export default function About() {
    const { t } = useTranslations();

    return (
        <section id="about" className="py-32 bg-[var(--color-bg-elevated)] border-t border-b border-[var(--color-border)]">
            <div className="max-w-[1200px] mx-auto px-6">
                <motion.h2
                    className="font-[var(--font-display)] text-[clamp(2rem,5vw,3.5rem)] font-normal tracking-tight text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                >
                    {t('about_title')}
                </motion.h2>

                <motion.div
                    className="max-w-[800px] mx-auto about-content-wrap"
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {textKeys.map(key => (
                        <motion.p
                            key={key}
                            className="text-base text-[var(--color-text-secondary)] mb-4 leading-[1.8]"
                            variants={fadeUp}
                            dangerouslySetInnerHTML={{ __html: t(key) }}
                        />
                    ))}

                    <motion.div
                        className="my-8 p-6 bg-[var(--color-bg-glass)] border border-[var(--color-border)] rounded-xl"
                        variants={fadeUp}
                    >
                        {questionKeys.map(key => (
                            <p key={key} className="text-lg text-[var(--color-text-primary)] mb-2 last:mb-0">
                                {t(key)}
                            </p>
                        ))}
                    </motion.div>

                    <motion.p
                        className="text-base text-[var(--color-text-secondary)] mb-4 leading-[1.8]"
                        variants={fadeUp}
                        dangerouslySetInnerHTML={{ __html: t('about_solution') }}
                    />
                    <motion.p
                        className="text-base text-[var(--color-text-secondary)] mb-4 leading-[1.8]"
                        variants={fadeUp}
                        dangerouslySetInnerHTML={{ __html: t('about_full_bottle') }}
                    />
                    <motion.p
                        className="text-base text-[var(--color-text-secondary)] mb-4 leading-[1.8]"
                        variants={fadeUp}
                        dangerouslySetInnerHTML={{ __html: t('about_selection') }}
                    />

                    <motion.ul className="list-none my-8 p-0" variants={fadeUp}>
                        {bulletKeys.map(key => (
                            <li key={key} className="text-base text-[var(--color-text-secondary)] mb-3">
                                {t(key)}
                            </li>
                        ))}
                    </motion.ul>

                    <motion.p
                        className="font-[var(--font-display)] text-xl italic text-[var(--color-gold)] text-center mt-8"
                        variants={fadeUp}
                    >
                        {t('about_footer')}
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
