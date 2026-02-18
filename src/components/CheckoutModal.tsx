import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import emailjs from '@emailjs/browser';
import { useTranslations } from '../hooks/useTranslations';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

// Constants (Store these in .env in production)
const PAYPAL_CLIENT_ID = "AeiuDIaHLRE4sB0XE_CQfBoz8SqnuLoj41T_I3y6hJ9EnFgLTUMxy2AfONYmhaxpq9bmI4KLXnpMN4aM";
const SERVICE_ID = 'service_alfkne7'; // Updated from user screenshot
const TEMPLATE_ID = 'template_ltw4ucg';
const PUBLIC_KEY = 'RsBqeWkJoWzzc4z0j';

type PaymentMethod = 'paypal' | null;

export default function CheckoutModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { t, lang } = useTranslations();
    const { cart, total, address, setAddress } = useCart();
    const { currentUser } = useAuth();

    const [method, setMethod] = useState<PaymentMethod>(null);
    const [guestEmail, setGuestEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const { deliveryType } = useCart();
    const isDelivery = deliveryType !== 'pickup';
    const userEmail = currentUser?.email || guestEmail;
    const showEmailInput = !currentUser;

    const handleClose = () => {
        setMethod(null);
        setSuccess(false);
        setError('');
        onClose();
    };

    const sendReceipt = async () => {
        if (!userEmail) {
            console.error('No email provided for receipt');
            return;
        }

        let deliveryStr = '';
        if (deliveryType === 'pickup') deliveryStr = '\nSelf Pickup';
        else if (deliveryType === 'ganei_tikva') deliveryStr = `\nLocal Delivery (Ganei Tikva): ${address.street} ${address.houseNum}, Floor ${address.floor}, Apt ${address.apt}`;
        else deliveryStr = `\nHome Delivery: ${address.street} ${address.houseNum}, Floor ${address.floor}, Apt ${address.apt}`;

        try {
            console.log('Sending receipt to:', userEmail);
            const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
                to_email: userEmail,
                to_name: currentUser?.name || 'Guest',
                message: `Thank you for your order (Total: ₪${total}). Items: ${cart.map(i => `${i.name} (${i.size}ml)`).join(', ')}${deliveryStr}`,
                link: window.location.origin
            }, PUBLIC_KEY);
            console.log('Receipt sent successfully!', response);
        } catch (e: any) {
            console.error('Receipt send failed', e);
            const errMsg = lang === 'he'
                ? `שגיאה בשליחה למייל: ${e.text || e.message || 'שגיאה לא ידועה'}. אנא בדוק את הגדרות ה-EmailJS שלך.`
                : `Failed to send confirmation email: ${e.text || e.message || 'Unknown error'}. Check your EmailJS settings.`;
            alert(errMsg);
        }
    };

    const handleApprove = async () => {
        setSuccess(true);
        await sendReceipt();
        localStorage.removeItem('cart');
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/75 backdrop-blur-md z-[400] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                >
                    <motion.div
                        className="bg-[#111] border border-white/10 rounded-2xl w-[min(500px,100%)] relative overflow-hidden shadow-2xl"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="font-serif text-xl text-white">
                                {success
                                    ? t('order_confirmed')
                                    : t('checkout')
                                }
                            </h2>
                            <button
                                onClick={handleClose}
                                className="text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {success ? (
                            <div className="p-10 text-center text-white">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    className="text-6xl mb-6 block"
                                >
                                    🎉
                                </motion.div>
                                <h3 className="text-xl text-[#c9a96e] mb-2 font-serif">
                                    {t('thank_you_order')}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {t('receipt_sent_to')} {userEmail}
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-6 px-6 py-2 bg-[#c9a96e] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    {t('back_to_store')}
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

                                {/* Guest Email Input */}
                                {showEmailInput && (
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold">
                                            {t('email_for_receipt')}
                                        </label>
                                        <input
                                            type="email"
                                            value={guestEmail}
                                            onChange={(e) => setGuestEmail(e.target.value)}
                                            placeholder={t('email_placeholder')}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a96e] outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                )}

                                {/* Address Fields */}
                                {isDelivery && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-serif text-white/80 border-b border-white/5 pb-2">
                                            {t('address_title')}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] uppercase text-gray-500 mb-1">{t('address_city')}</label>
                                                <input
                                                    type="text"
                                                    value={address.city}
                                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-[#c9a96e] outline-none"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase text-gray-500 mb-1">{t('address_street')}</label>
                                                <input
                                                    type="text"
                                                    value={address.street}
                                                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-[#c9a96e] outline-none"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase text-gray-500 mb-1">{t('address_house')}</label>
                                                <input
                                                    type="text"
                                                    value={address.houseNum}
                                                    onChange={(e) => setAddress({ ...address, houseNum: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-[#c9a96e] outline-none"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-[10px] uppercase text-gray-500 mb-1">{t('address_floor')}</label>
                                                    <input
                                                        type="text"
                                                        value={address.floor}
                                                        onChange={(e) => setAddress({ ...address, floor: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-[#c9a96e] outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] uppercase text-gray-500 mb-1">{t('address_apt')}</label>
                                                    <input
                                                        type="text"
                                                        value={address.apt}
                                                        onChange={(e) => setAddress({ ...address, apt: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-[#c9a96e] outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="flex justify-between items-center py-4 border-t border-white/10 border-b border-white/10">
                                    <span className="text-gray-400">{t('total')}</span>
                                    <span className="text-2xl font-serif text-[#c9a96e]">
                                        ₪{Number.isInteger(total) ? total : total.toFixed(2)}
                                    </span>
                                </div>

                                {/* Error Banner */}
                                {error && (
                                    <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded border border-red-500/20">
                                        {error}
                                    </p>
                                )}

                                {/* PayPal Buttons (Visible immediately) */}
                                <PayPalScriptProvider options={{
                                    clientId: PAYPAL_CLIENT_ID,
                                    currency: "ILS",
                                    intent: "capture"
                                }}>
                                    <div className="w-full relative z-10 transition-opacity">
                                        <PayPalButtons
                                            style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                                            onClick={(data, actions) => {
                                                // Validate before opening PayPal
                                                if (showEmailInput && (!guestEmail || !guestEmail.includes('@'))) {
                                                    setError(t('invalid_login_err'));
                                                    return actions.reject();
                                                }
                                                if (isDelivery && (!address.city || !address.street || !address.houseNum)) {
                                                    setError(t('address_error'));
                                                    return actions.reject();
                                                }
                                                setError('');
                                                return actions.resolve();
                                            }}
                                            createOrder={(data, actions) => {
                                                const totalValue = total || 0;
                                                if (isNaN(totalValue) || totalValue <= 0) {
                                                    console.error('PayPal createOrder failed: Total is NaN or zero');
                                                    setError(t('invalid_total'));
                                                    throw new Error('Invalid order total');
                                                }
                                                return actions.order.create({
                                                    intent: "CAPTURE",
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                currency_code: "ILS",
                                                                value: totalValue.toFixed(2),
                                                                breakdown: {
                                                                    item_total: {
                                                                        currency_code: "ILS",
                                                                        value: totalValue.toFixed(2)
                                                                    }
                                                                }
                                                            },
                                                            description: `Order for ${userEmail || 'Guest'}`,
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={async (data, actions) => {
                                                if (actions.order) {
                                                    try {
                                                        const details = await actions.order.capture();

                                                        // CRITICAL: Check if the transaction was actually successful
                                                        if (details.status === 'COMPLETED') {
                                                            await handleApprove();
                                                        } else {
                                                            // Handle cases where the payment was rejected or didn't complete
                                                            console.error('Payment not completed:', details);
                                                            const errMsg = t('payment_not_completed');
                                                            setError(errMsg);
                                                            alert(errMsg);
                                                        }
                                                    } catch (err: any) {
                                                        console.error('Capture FAILED:', err);
                                                        const errMsg = `${t('payment_failed')}: ${err.message}`;
                                                        setError(errMsg);
                                                        alert(errMsg);
                                                    }
                                                }
                                            }}
                                            onCancel={() => {
                                                setError(t('payment_cancelled'));
                                            }}
                                            onError={(err) => {
                                                console.error('PayPal Error Event:', err);
                                                setError(t('paypal_error_msg'));
                                            }}
                                        />
                                    </div>
                                </PayPalScriptProvider>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
