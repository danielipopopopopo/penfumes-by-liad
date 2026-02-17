import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useTranslations } from './useTranslations';

interface CartItem {
    nameKey: string;
    priceKey: string;
    name: string;
    price: string;
    size: number;
}

interface CartContextType {
    cart: CartItem[];
    isOpen: boolean;
    isDelivery: boolean;
    total: number;
    addToCart: (nameKey: string, priceKey: string, size: number, customPrice?: string) => void;
    removeFromCart: (index: number) => void;
    toggleCart: () => void;
    setIsDelivery: (v: boolean) => void;
    getDisplayName: (item: CartItem) => string;
    getDisplayPrice: (item: CartItem) => string;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const { t } = useTranslations();
    const [cart, setCart] = useState<CartItem[]>(() => {
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isDelivery, setIsDelivery] = useState(false);

    const saveCart = (items: CartItem[]) => {
        setCart(items);
        localStorage.setItem('cart', JSON.stringify(items));
    };

    const addToCart = useCallback((nameKey: string, priceKey: string, size: number, customPrice?: string) => {
        const item: CartItem = {
            nameKey,
            priceKey,
            name: t(nameKey),
            price: customPrice || t(priceKey),
            size,
        };
        setCart(prev => {
            const next = [...prev, item];
            localStorage.setItem('cart', JSON.stringify(next));
            return next;
        });
        setIsOpen(true);
    }, [t]);

    const removeFromCart = useCallback((index: number) => {
        setCart(prev => {
            const next = prev.filter((_, i) => i !== index);
            localStorage.setItem('cart', JSON.stringify(next));
            return next;
        });
    }, []);

    const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

    const getDisplayName = useCallback((item: CartItem) => t(item.nameKey) || item.name, [t]);
    const getDisplayPrice = useCallback((item: CartItem) => t(item.priceKey) || item.price, [t]);

    const total = cart.reduce((acc, item) => {
        const priceStr = t(item.priceKey) || item.price;
        // Basic integer extraction, ignoring size for now as priceKey might already include it or we wait for logic
        return acc + parseInt(priceStr.replace(/[^\d]/g, '') || '0');
    }, 0) + (isDelivery ? 60 : 0);

    return (
        <CartContext.Provider value={{
            cart, isOpen, isDelivery, total,
            addToCart, removeFromCart, toggleCart, setIsDelivery,
            getDisplayName, getDisplayPrice,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
