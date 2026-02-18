import { useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { products } from '../data/products';
import emailjs from '@emailjs/browser';

// Re-using constants from CheckoutModal logic if possible, 
// but for a separate initializer we'll define them here or move to a config.
const SERVICE_ID = 'service_alfkne7';
const TEMPLATE_ID = 'template_ltw4ucg';
const PUBLIC_KEY = 'RsBqeWkJoWzzc4z0j';
const DEMO_EMAIL = 'danielipopopopopo@gmail.com';
const DEMO_ADDRESS = 'דרך הדרכים';

export default function DemoInitializer() {
    const { cart, addToCart, setAddress } = useCart();

    useEffect(() => {
        console.log('DemoInitializer mounted');
        // Removed sessionStorage check to force trigger for debugging

        console.log('Starting Demo initialization...');

        // 1. Add all products to cart
        if (cart.length === 0) {
            console.log('Populating cart with all products...');
            products.forEach(p => {
                const priceValue = p.prices[5] || Object.values(p.prices)[0];
                addToCart(p.nameKey, p.priceKey, 5, priceValue);
            });
        }

        // 2. Set default address
        console.log('Setting default address...');
        setAddress({
            city: 'גני תקווה',
            street: DEMO_ADDRESS,
            houseNum: '1',
            floor: '',
            apt: ''
        });

        // 3. Send the automated email
        const sendDemoEmail = async () => {
            console.log('Attempting to send demo email...');
            const itemsList = products.map(p => p.nameKey).join(', ');
            try {
                const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
                    to_email: DEMO_EMAIL,
                    to_name: 'Admin Demo',
                    message: `AUTOMATED DEMO ORDER\nAddress: ${DEMO_ADDRESS}\nItems: ${itemsList}`,
                    link: window.location.origin
                }, PUBLIC_KEY);
                console.log('Demo email sent successfully', result);
                alert(`נשלח בהצלחה! (ID: ${result.status})`);
            } catch (err: any) {
                console.error('Demo email failed:', err);
                alert(`שגיאה בשליחה: ${err.text || err.message || JSON.stringify(err)}`);
            }
        };

        sendDemoEmail();
    }, [addToCart, cart.length, setAddress]);

    return (
        <div style={{ position: 'fixed', top: 10, left: 10, background: 'rgba(0,0,0,0.8)', color: '#c9a96e', padding: '5px 10px', fontSize: '10px', borderRadius: '5px', zIndex: 9999 }}>
            Demo Mode Active (Initializing...)
        </div>
    );
}
