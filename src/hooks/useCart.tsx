import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useTranslations } from './useTranslations';

interface CartItem {
    nameKey: string;
    priceKey: string;
    name: string;
    price: string;
    size: number;
    priceValue: number;
}

export type DeliveryType = 'pickup' | 'regular' | 'ganei_tikva';

export interface Address {
    city: string;
    street: string;
    houseNum: string;
    floor: string;
    apt: string;
}

interface CartContextType {
    cart: CartItem[];
    isOpen: boolean;
    deliveryType: DeliveryType;
    total: number;
    address: Address;
    addToCart: (nameKey: string, priceKey: string, size: number, priceValue: number, customPrice?: string) => void;
    removeFromCart: (index: number) => void;
    toggleCart: () => void;
    setDeliveryType: (type: DeliveryType) => void;
    setAddress: (addr: Address) => void;
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
    const [deliveryType, setDeliveryType] = useState<DeliveryType>(() => {
        const stored = localStorage.getItem('deliveryType');
        return (stored as DeliveryType) || 'pickup';
    });
    const [address, setAddressState] = useState<Address>(() => {
        const stored = localStorage.getItem('address');
        return stored ? JSON.parse(stored) : { city: '', street: '', houseNum: '', floor: '', apt: '' };
    });

    const setAddress = (addr: Address) => {
        setAddressState(addr);
        localStorage.setItem('address', JSON.stringify(addr));
    };

    const updateDeliveryType = (type: DeliveryType) => {
        setDeliveryType(type);
        localStorage.setItem('deliveryType', type);
    };

    const saveCart = (items: CartItem[]) => {
        setCart(items);
        localStorage.setItem('cart', JSON.stringify(items));
    };

    const addToCart = useCallback((nameKey: string, priceKey: string, size: number, priceValue: number, customPrice?: string) => {
        const item: CartItem = {
            nameKey,
            priceKey,
            name: t(nameKey),
            price: customPrice || t(priceKey),
            size,
            priceValue,
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

    const deliveryPrice = deliveryType === 'regular' ? 60 : (deliveryType === 'ganei_tikva' ? 7 : 0);
    const total = cart.reduce((acc, item) => acc + (item.priceValue || 0), 0) + deliveryPrice;

    return (
        <CartContext.Provider value={{
            cart, isOpen, deliveryType, total, address,
            addToCart, removeFromCart, toggleCart, setDeliveryType: updateDeliveryType, setAddress,
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
