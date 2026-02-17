import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nProvider } from './hooks/useTranslations'
import { AuthProvider } from './hooks/useAuth'
import { CartProvider } from './hooks/useCart'
import App from './App'
import './App.css'

// Internal Framer Motion shim to prevent console errors from library-internal bugs
if (typeof window !== 'undefined') {
    (window as any).formatErrorMessage = (message: string, errorCode?: string) => {
        return errorCode
            ? `${message}. For more information, visit https://motion.dev/troubleshooting/${errorCode}`
            : message;
    };
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <I18nProvider>
            <AuthProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </AuthProvider>
        </I18nProvider>
    </StrictMode>,
)
