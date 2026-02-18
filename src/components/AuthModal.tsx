import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';

type FormView = 'login' | 'signup' | 'forgot' | 'reset' | 'otp_send' | 'otp_verify';

export default function AuthModal() {
    const { t, lang } = useTranslations();
    const { login, signup, forgotPassword, resetPassword, checkResetToken, sendOTP, verifyOTP } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<FormView>('login');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpEmail, setOtpEmail] = useState('');

    useEffect(() => {
        const check = () => {
            if (checkResetToken()) {
                console.log('Reset token detected, opening modal');
                setIsOpen(true);
                setView('reset');
                setError('');
            }
        };

        const authHandler = () => {
            setIsOpen(true);
            setView('login');
            setError('');
        };

        window.addEventListener('open-auth', authHandler);
        window.addEventListener('hashchange', check);

        // Check immediately on mount
        check();

        return () => {
            window.removeEventListener('open-auth', authHandler);
            window.removeEventListener('hashchange', check);
        };
    }, [checkResetToken]);

    const close = () => {
        setIsOpen(false);
        setError('');
        setOtpEmail('');
    };
    const switchView = (v: FormView) => { setView(v); setError(''); };

    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const err = login(form.get('email') as string, form.get('password') as string);
        if (err) setError(t('invalid_login_err'));
        else close();
    };

    const handleSignup = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const err = signup(form.get('name') as string, form.get('email') as string, form.get('password') as string);
        if (err === 'email_exists') setError(t('email_exists_err'));
        else close();
    };

    const handleForgot = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const form = new FormData(e.currentTarget);
        const err = await forgotPassword(form.get('email') as string);
        setLoading(false);
        if (err === 'email_not_found') setError(t('email_not_found_err'));
        else if (err === 'send_failed') setError(t('unexpected_err'));
        else { alert(t('send_link')); close(); }
    };

    const handleReset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const err = resetPassword(form.get('password') as string);
        if (err) setError(t('unexpected_err'));
        else { alert(t('new_password_title')); switchView('login'); }
    };

    const handleOTPSend = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const email = new FormData(e.currentTarget).get('email') as string;
        const err = await sendOTP(email);
        setLoading(false);
        if (err) setError(lang === 'he' ? 'שליחה נכשלה' : 'Send failed');
        else {
            setOtpEmail(email);
            switchView('otp_verify');
        }
    };

    const handleOTPVerify = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const code = new FormData(e.currentTarget).get('code') as string;
        const err = verifyOTP(otpEmail, code);
        if (err) setError(t('invalid_otp'));
        else close();
    };

    const inputClass = "w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[10px] text-[var(--color-text-primary)] text-sm outline-none focus:border-[var(--color-gold)] transition-colors duration-200 placeholder:text-[var(--color-text-tertiary)] mb-3";
    const submitClass = "w-full py-3 bg-[var(--color-gold)] text-black font-semibold text-sm tracking-wider uppercase rounded-[10px] mt-2 hover:opacity-90 transition-opacity duration-200 cursor-pointer border-none";
    const linkClass = "text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-gold)] transition-colors duration-200 bg-transparent border-none cursor-pointer";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[300] flex items-center justify-center p-6 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={close}
                >
                    <motion.div
                        className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-10 w-[min(440px,100%)] relative"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={close}
                            className="auth-close-btn absolute top-4 right-4 text-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-glass)] w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 bg-transparent border-none cursor-pointer"
                        >
                            ✕
                        </button>

                        {error && (
                            <p className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2.5 rounded-[10px] text-sm text-center mb-4">
                                {error}
                            </p>
                        )}

                        {view === 'login' && (
                            <form onSubmit={handleLogin}>
                                <h2 className="font-[var(--font-display)] text-2xl font-normal text-center mb-6">{t('login_title')}</h2>
                                <input name="email" type="email" placeholder={t('email_placeholder')} required className={inputClass} />
                                <input name="password" type="password" placeholder={t('password_placeholder')} required className={inputClass} />
                                <motion.button type="submit" className={submitClass} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    {t('login_btn')}
                                </motion.button>

                                <div className="flex flex-col items-center gap-2 mt-6">
                                    <button type="button" onClick={() => switchView('otp_send')} className={submitClass}>{t('login_otp_btn')}</button>
                                    <button type="button" onClick={() => switchView('signup')} className={linkClass}>{t('need_account')}</button>
                                    <button type="button" onClick={() => switchView('forgot')} className={linkClass}>{t('forgot_password')}</button>
                                </div>
                            </form>
                        )}

                        {view === 'otp_send' && (
                            <form onSubmit={handleOTPSend}>
                                <h2 className="font-[var(--font-display)] text-2xl font-normal text-center mb-6">{t('login_otp_btn')}</h2>
                                <input name="email" type="email" placeholder={t('email_placeholder')} required className={inputClass} />
                                <motion.button type="submit" className={submitClass} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    {loading ? '...' : t('send_link')}
                                </motion.button>
                                <div className="flex flex-col items-center gap-2 mt-6">
                                    <button type="button" onClick={() => switchView('login')} className={linkClass}>{t('back_to_login')}</button>
                                </div>
                            </form>
                        )}

                        {/* Verify placeholder is fine (000000) */}

                        {view === 'signup' && (
                            <form onSubmit={handleSignup}>
                                <h2 className="font-[var(--font-display)] text-2xl font-normal text-center mb-6">{t('signup_title')}</h2>
                                <input name="name" type="text" placeholder={t('full_name_placeholder')} required className={inputClass} />
                                <input name="email" type="email" placeholder={t('email_placeholder')} required className={inputClass} />
                                <input name="password" type="password" placeholder={t('password_placeholder')} required className={inputClass} />
                                <motion.button type="submit" className={submitClass} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    {t('signup_btn')}
                                </motion.button>
                                <div className="flex flex-col items-center gap-2 mt-6">
                                    <button type="button" onClick={() => switchView('login')} className={linkClass}>{t('have_account')}</button>
                                </div>
                            </form>
                        )}

                        {view === 'forgot' && (
                            <form onSubmit={handleForgot}>
                                <h2 className="font-[var(--font-display)] text-2xl font-normal text-center mb-4">{t('forgot_password_title')}</h2>
                                <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6">{t('enter_reset_link_msg')}</p>
                                <input name="email" type="email" placeholder={t('email_placeholder')} required className={inputClass} />
                                <motion.button type="submit" className={submitClass} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    {loading ? '...' : t('send_link')}
                                </motion.button>
                                <div className="flex flex-col items-center gap-2 mt-6">
                                    <button type="button" onClick={() => switchView('login')} className={linkClass}>{t('back_to_login')}</button>
                                </div>
                            </form>
                        )}

                        {view === 'reset' && (
                            <form onSubmit={handleReset}>
                                <h2 className="font-[var(--font-display)] text-2xl font-normal text-center mb-6">{t('new_password_title')}</h2>
                                <input name="password" type="password" placeholder={t('new_password_placeholder')} required className={inputClass} />
                                <motion.button type="submit" className={submitClass} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    {t('reset_password_btn')}
                                </motion.button>
                                <div className="flex flex-col items-center gap-2 mt-6">
                                    <button type="button" onClick={() => switchView('login')} className={linkClass}>{t('back_to_login')}</button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
