import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_alfkne7';
const TEMPLATE_ID = 'template_ycwdqfn';
const PUBLIC_KEY = 'RsBqeWkJoWzzc4z0j';

emailjs.init(PUBLIC_KEY);

interface User {
    name: string;
    email: string;
    password: string;
}

interface AuthContextType {
    currentUser: User | null;
    login: (email: string, password: string) => string | null;
    signup: (name: string, email: string, password: string) => string | null;
    logout: () => void;
    forgotPassword: (email: string) => Promise<string | null>;
    resetPassword: (newPassword: string) => string | null;
    setResetEmail: (email: string | null) => void;
    checkResetToken: () => boolean;
    sendOTP: (email: string) => Promise<string | null>;
    verifyOTP: (email: string, code: string) => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    });
    const [resetEmail, setResetEmail] = useState<string | null>(null);

    // Load initial users from users.json
    useEffect(() => {
        fetch('/users.json')
            .then(res => res.json())
            .then((initialUsers: User[]) => {
                const stored: User[] = JSON.parse(localStorage.getItem('users') || '[]');
                let updated = false;
                initialUsers.forEach(u => {
                    if (!stored.find(s => s.email === u.email)) {
                        stored.push(u);
                        updated = true;
                    }
                });
                if (updated) localStorage.setItem('users', JSON.stringify(stored));
            })
            .catch(err => console.error('Failed to load users:', err));
    }, []);

    const login = useCallback((email: string, password: string): string | null => {
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email.toLowerCase() && u.password === password);
        if (user) {
            setCurrentUser(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            return null;
        }
        return 'invalid_credentials';
    }, []);

    const signup = useCallback((name: string, email: string, password: string): string | null => {
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email.toLowerCase())) return 'email_exists';
        const newUser = { name, email: email.toLowerCase(), password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        setCurrentUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return null;
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    }, []);

    const forgotPassword = useCallback(async (email: string): Promise<string | null> => {
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        if (!users.find(u => u.email === email.toLowerCase())) return 'email_not_found';

        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const resetLink = `${window.location.origin}${window.location.pathname}#reset_token=${token}`;

        localStorage.setItem(`reset_${token}`, JSON.stringify({
            email: email.toLowerCase(),
            expiry: Date.now() + 3600000
        }));

        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, { email, link: resetLink });
            return null;
        } catch (e: any) {
            console.error('EmailJS Error:', e);
            if (e.status === 404 || e.text?.includes('404')) {
                alert('EmailJS Error: 404 Not Found. Service/Template/Key in useAuth.tsx is invalid.');
            }
            return 'send_failed';
        }
    }, []);

    const resetPasswordFn = useCallback((newPassword: string): string | null => {
        if (!resetEmail) return 'no_reset_email';
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        const idx = users.findIndex(u => u.email === resetEmail);
        if (idx === -1) return 'user_not_found';
        users[idx].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        setResetEmail(null);
        return null;
    }, [resetEmail]);

    const checkResetToken = useCallback((): boolean => {
        const hash = window.location.hash;
        if (!hash.includes('reset_token=')) return false;

        const token = hash.split('reset_token=')[1].split('&')[0];
        const data = localStorage.getItem(`reset_${token}`);
        if (!data) return false;

        const parsed = JSON.parse(data);
        if (parsed.expiry > Date.now()) {
            setResetEmail(parsed.email);
            // Move cleanup to after a tiny delay or ensure state is taken
            setTimeout(() => {
                window.history.replaceState(null, '', window.location.pathname);
                localStorage.removeItem(`reset_${token}`);
            }, 100);
            return true;
        }
        window.history.replaceState(null, '', window.location.pathname);
        return false;
    }, []);

    const sendOTP = useCallback(async (email: string): Promise<string | null> => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        localStorage.setItem(`otp_${email.toLowerCase()}`, JSON.stringify({ otp, expiry }));

        // NOTE: Using placeholders for the second EmailJS account as requested. 
        // User should update these in useAuth.tsx
        const OTP_SERVICE_ID = 'service_8cckky7';
        const OTP_TEMPLATE_ID = 'template_ax0rbvk';
        const OTP_PUBLIC_KEY = 'FXlsl4AhvCVg7uCeD';

        const expiryStr = new Date(expiry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        try {
            await emailjs.send(OTP_SERVICE_ID, OTP_TEMPLATE_ID, {
                email: email,      // Matches {{email}} in "To Email"
                otp_code: otp,     // Matches {{otp_code}} in template content
                expiry_time: expiryStr, // Matches {{expiry_time}} in template content
            }, OTP_PUBLIC_KEY);
            return null;
        } catch (e: any) {
            console.error('OTP Send Error Detailed:', e);
            return 'send_failed';
        }
    }, []);

    const verifyOTP = useCallback((email: string, code: string): string | null => {
        const data = localStorage.getItem(`otp_${email.toLowerCase()}`);
        if (!data) return 'invalid_otp';

        const { otp, expiry } = JSON.parse(data);
        if (Date.now() > expiry) {
            localStorage.removeItem(`otp_${email.toLowerCase()}`);
            return 'invalid_otp';
        }

        if (otp === code) {
            const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
            let user = users.find(u => u.email === email.toLowerCase());

            if (!user) {
                // Auto-signup for OTP if user doesn't exist
                user = { name: email.split('@')[0], email: email.toLowerCase(), password: 'otp_user' };
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));
            }

            setCurrentUser(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.removeItem(`otp_${email.toLowerCase()}`);
            return null;
        }
        return 'invalid_otp';
    }, []);

    return (
        <AuthContext.Provider value={{
            currentUser,
            login,
            signup,
            logout,
            forgotPassword,
            resetPassword: resetPasswordFn,
            setResetEmail,
            checkResetToken,
            sendOTP,
            verifyOTP,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
