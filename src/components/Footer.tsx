import { motion } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';

export default function Footer() {
    const { t } = useTranslations();

    return (
        <motion.footer
            className="py-16 border-t border-[var(--color-border)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center gap-4 text-center">
                <img src="/logo.jpg" alt="Penfumes" className="h-14 w-auto object-contain rounded-md" />
                <p className="text-xs text-[var(--color-text-tertiary)]" dangerouslySetInnerHTML={{ __html: t('footer_copy') }} />
                <a
                    href="https://github.com/danielipopopopopo/penfumes-by-liad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-gold)] transition-colors duration-200"
                >
                    GitHub
                </a>
            </div>
        </motion.footer>
    );
}
