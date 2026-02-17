import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';
import { useCart } from '../hooks/useCart';
import CheckoutModal from './CheckoutModal';

export default function CartSidebar() {
    const { t } = useTranslations();
    const {
        cart, isOpen, isDelivery, total,
        removeFromCart, toggleCart, setIsDelivery,
        getDisplayName, getDisplayPrice,
    } = useCart();
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        toggleCart();          // close the cart sidebar
        setCheckoutOpen(true); // open checkout modal
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleCart}
                        />
                        {/* Sidebar */}
                        <motion.aside
                            className="cart-sidebar-panel fixed top-0 right-0 w-[min(420px,90vw)] h-screen bg-[var(--color-bg-elevated)] border-l border-[var(--color-border)] z-[201] flex flex-col"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                                <h2 className="font-[var(--font-display)] text-2xl font-normal">{t('cart_title')}</h2>
                                <button
                                    onClick={toggleCart}
                                    className="text-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 bg-transparent border-none cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Items */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {cart.length === 0 ? (
                                    <p className="text-center text-[var(--color-text-tertiary)] py-16 text-sm">{t('empty_cart')}</p>
                                ) : (
                                    cart.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex items-center gap-4 p-4 border-b border-[var(--color-border)]"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <div className="w-11 h-11 bg-[var(--color-bg-glass)] border border-[var(--color-border)] rounded-[10px] flex items-center justify-center text-[var(--color-gold)] shrink-0">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">{getDisplayName(item)}</span>
                                                    <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-400">{item.size}{t('ml')}</span>
                                                </div>
                                                <span className="text-xs text-[var(--color-text-secondary)]">{getDisplayPrice(item)}</span>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(i)}
                                                className="text-[var(--color-text-tertiary)] hover:text-red-400 transition-colors duration-200 p-1 bg-transparent border-none cursor-pointer"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                </svg>
                                            </button>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-[var(--color-border)]">
                                {/* Delivery options */}
                                <div className="flex gap-2 mb-4">
                                    <label
                                        className={`flex-1 flex items-center gap-2 p-3 border rounded-[10px] cursor-pointer text-xs transition-all duration-200
                      ${!isDelivery
                                                ? 'border-[var(--color-gold)] text-[var(--color-gold)] bg-[var(--color-gold-glow)]'
                                                : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'
                                            }`}
                                    >
                                        <input type="radio" name="delivery" checked={!isDelivery} onChange={() => setIsDelivery(false)} className="hidden" />
                                        <span>{t('pickup')}</span>
                                    </label>
                                    <label
                                        className={`flex-1 flex items-center gap-2 p-3 border rounded-[10px] cursor-pointer text-xs transition-all duration-200
                      ${isDelivery
                                                ? 'border-[var(--color-gold)] text-[var(--color-gold)] bg-[var(--color-gold-glow)]'
                                                : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'
                                            }`}
                                    >
                                        <input type="radio" name="delivery" checked={isDelivery} onChange={() => setIsDelivery(true)} className="hidden" />
                                        <span>{t('shipping')}</span>
                                    </label>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center py-4">
                                    <span className="text-base">{t('total')}</span>
                                    <span className="text-xl font-semibold text-[var(--color-gold)]">₪{total}</span>
                                </div>

                                {/* Checkout button */}
                                <motion.button
                                    onClick={handleCheckout}
                                    className={`w-full py-4 font-semibold text-sm tracking-wider uppercase rounded-[10px] transition-opacity duration-200 cursor-pointer border-none
                    ${cart.length > 0
                                            ? 'bg-[var(--color-gold)] text-black hover:opacity-90'
                                            : 'bg-[var(--color-bg-glass)] text-[var(--color-text-tertiary)] cursor-not-allowed'
                                        }`}
                                    whileHover={cart.length > 0 ? { scale: 1.02 } : {}}
                                    whileTap={cart.length > 0 ? { scale: 0.98 } : {}}
                                >
                                    {t('checkout')}
                                </motion.button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Checkout Modal */}
            <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
        </>
    );
}
