const translations = {
    en: {
        home: "Home",
        collection: "Store",
        about: "About Us",
        contact: "Contact",
        hero_title: "penfumes by liad",
        about_title: "About Us",
        about_text_1: "Welcome to <strong>Penfumes by Liad</strong>, where artistry meets aroma in a symphony of scents. Our journey began with a passion for crafting fragrances that are not just perfumes, but memories bottled in elegance.",
        about_text_2: "Each scent is meticulously curated using the finest ingredients from around the world, designed to evoke emotion and sophistication. Whether you seek a bold statement or a subtle whisper of grace, our collection promises to elevate your presence.",
        lang_btn: "HE",

        // Shop Translations
        collection_title: "Shop",
        prod_1_name: "Midnight Rose",
        prod_1_desc: "A bold blend of dark rose and oud.",
        prod_1_price: "₪250",
        prod_2_name: "Golden Amber",
        prod_2_desc: "Warm amber with hints of vanilla.",
        prod_2_price: "₪280",
        prod_3_name: "Ocean Mist",
        prod_3_desc: "Fresh aquatic notes with citrus.",
        prod_3_price: "₪220",
        add_to_cart: "Add to Cart",

        // Cart Translations
        cart_title: "Your Cart",
        empty_cart: "Your cart is empty.",
        total: "Total:",
        checkout: "Checkout",
        pickup: "Self Pickup (Free)",
        shipping: "Delivery (+₪60)",
        footer_copy: "&copy; 2026 Penfumes by Liad. All Rights Reserved."
    },
    he: {
        home: "בית",
        collection: "Shop",
        about: "About Us",
        contact: "צור קשר",
        hero_title: "penfumes by liad",
        about_title: "About Us",
        about_text_1: "ברוכים הבאים ל<strong>Penfumes by Liad</strong>, המקום בו אמנות פוגשת ארומה בסימפוניה של ניחוחות. המסע שלנו התחיל עם תשוקה ליצירת ניחוחות שהם לא רק בשמים, אלא רגעים שנלכדו באלגנטיות.",
        about_text_2: "כל ניחוח נבחר בקפידה תוך שימוש במרכיבים המשובחים ביותר מרחבי העולם, ונועד לעורר רגש ותחכום. בין אם אתם מחפשים הצהרה נועזת או לחישה עדינה של חן, הקולקציה שלנו מבטיחה לשדרג את הנוכחות שלכם.",
        lang_btn: "EN",

        // Shop Translations
        collection_title: "Shop",
        prod_1_name: "ורד חצות",
        prod_1_desc: "שילוב נועז של ורד כהה ואוד.",
        prod_1_price: "₪250",
        prod_2_name: "ענבר זהוב",
        prod_2_desc: "ענבר חמים עם נגיעות וניל.",
        prod_2_price: "₪280",
        prod_3_name: "ערפל האוקיינוס",
        prod_3_desc: "תווים ימיים רעננים עם הדרים.",
        prod_3_price: "₪220",
        add_to_cart: "הוסף לסל",

        // Cart Translations
        cart_title: "העגלה שלך",
        empty_cart: "העגלה שלך ריקה.",
        total: "סה\"כ:",
        checkout: "לקופה",
        pickup: "איסוף עצמי (חינם)",
        shipping: "משלוח (+₪60)",
        footer_copy: "&copy; 2026 Penfumes by Liad. כל הזכויות שמורות."
    }
};

let currentLang = 'en';

const updateLanguage = () => {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    // Update switch button text
    const langBtnText = translations[currentLang].lang_btn;
    document.getElementById('lang-switch-desktop').innerText = langBtnText;
    document.getElementById('lang-switch-mobile').innerText = langBtnText;

    // Update body class for RTL
    if (currentLang === 'he') {
        document.body.classList.add('rtl');
        document.documentElement.setAttribute('lang', 'he');
    } else {
        document.body.classList.remove('rtl');
        document.documentElement.setAttribute('lang', 'en');
    }
};

const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const langSwitchDesktop = document.getElementById('lang-switch-desktop');
    const langSwitchMobile = document.getElementById('lang-switch-mobile');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    const toggleLang = (e) => {
        e.preventDefault();
        currentLang = currentLang === 'en' ? 'he' : 'en';
        updateLanguage();
    };

    if (langSwitchDesktop) langSwitchDesktop.addEventListener('click', toggleLang);
    if (langSwitchMobile) langSwitchMobile.addEventListener('click', toggleLang);
}

const scrollAnimations = () => {
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
};

/* Cart Logic */
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let isDelivery = false;

/* EmailJS Initialization */
// REPLACE THESE WITH YOUR ACTUAL KEYS FROM EMAILJS.COM
const SERVICE_ID = "service_qnztk6h";
const TEMPLATE_ID = "template_yv9btwr";
const PUBLIC_KEY = "FXlsl4AhvCVg7uCeD";

(function () {
    emailjs.init(PUBLIC_KEY);
})();

const toggleCart = () => {
    document.getElementById('cart-sidebar').classList.toggle('active');
};

const updateCartTotal = () => {
    const deliveryRadio = document.querySelector('input[name="delivery"]:checked');
    isDelivery = deliveryRadio ? deliveryRadio.value === 'shipping' : false;
    updateCartUI();
};

const updateCartUI = () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cart-total');

    // Update Count
    cartCount.innerText = cart.length;

    // Calculate Total
    let subtotal = cart.reduce((acc, item) => {
        const priceStr = translations[currentLang][item.priceKey] || item.price;
        return acc + parseInt(priceStr.replace(/[^\d]/g, ''));
    }, 0);
    let total = isDelivery ? subtotal + 60 : subtotal;

    cartTotal.innerText = `₪${total}`;

    // Render Items
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-msg" data-i18n="empty_cart">${translations[currentLang].empty_cart}</p>`;
    } else {
        cart.forEach((item, index) => {
            const displayName = translations[currentLang][item.nameKey] || item.name;
            const displayPrice = translations[currentLang][item.priceKey] || item.price;
            const itemHTML = `
                <div class="cart-item">
                    <div style="display:flex; align-items:center;">
                        <div style="width:50px; height:50px; background: #333; border-radius:5px; margin-right:10px; display:flex; justify-content:center; align-items:center; color:#555;">
                            <i class="fas fa-wine-bottle"></i>
                        </div>
                        <div class="cart-item-details">
                            <h4>${displayName}</h4>
                            <span>${displayPrice}</span>
                        </div>
                    </div>
                    <i class="fas fa-trash-alt remove-item" onclick="removeFromCart(${index})"></i>
                </div>
            `;
            cartItemsContainer.innerHTML += itemHTML;
        });
    }

    // Save to LocalStorage
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addToCart = (nameKey, priceKey) => {
    const name = translations[currentLang][nameKey];
    const price = translations[currentLang][priceKey];

    cart.push({ name, price, nameKey, priceKey });
    updateCartUI();

    document.getElementById('cart-sidebar').classList.add('active');
};

const removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
};

/* PayPal Initialization */
const initPayPal = () => {
    if (!window.paypal) return;

    paypal.Buttons({
        createOrder: (data, actions) => {
            let subtotal = cart.reduce((acc, item) => acc + parseInt(item.price.replace(/[^\d]/g, '')), 0);
            let shipping = isDelivery ? 60 : 0;
            let total = subtotal + shipping;

            if (total === 0) return actions.reject();

            // Create items array for PayPal
            const paypalItems = cart.map(item => ({
                name: item.name,
                unit_amount: {
                    currency_code: 'ILS',
                    value: item.price.replace(/[^\d]/g, '')
                },
                quantity: '1'
            }));

            return actions.order.create({
                purchase_units: [{
                    amount: {
                        currency_code: 'ILS',
                        value: total.toString(),
                        breakdown: {
                            item_total: {
                                currency_code: 'ILS',
                                value: subtotal.toString()
                            },
                            shipping: {
                                currency_code: 'ILS',
                                value: shipping.toString()
                            }
                        }
                    },
                    items: paypalItems
                }]
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
                // Prepare Email Params
                const shippingAddress = details.purchase_units[0].shipping.address;
                const addressString = `${shippingAddress.address_line_1}, ${shippingAddress.admin_area_2}, ${shippingAddress.admin_area_1}, ${shippingAddress.postal_code}, ${shippingAddress.country_code}`;

                const subtotal = cart.reduce((acc, item) => acc + parseInt(item.price.replace(/[^\d]/g, '')), 0);
                const shipping = isDelivery ? 60 : 0;

                const emailParams = {
                    order_id: details.id,
                    customer_name: details.payer.name.given_name + ' ' + details.payer.name.surname,
                    email: details.payer.email_address,
                    delivery_method: isDelivery ? (translations[currentLang].shipping || "Delivery") : (translations[currentLang].pickup || "Self Pickup"),
                    shipping_address: isDelivery ? addressString : "N/A (Pickup)",
                    items_list: cart.map(i => `${i.name} (x1)`).join("<br>"),
                    cost_shipping: shipping,
                    cost_total: details.purchase_units[0].amount.value,
                    subtotal: subtotal
                };

                // Send Email
                emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams)
                    .then(function (response) {
                        console.log('SUCCESS!', response.status, response.text);
                        alert(`Transaction completed! Confirmation sent using EmailJS.`);
                    }, function (error) {
                        console.log('FAILED...', error);
                        alert('Transaction completed, but email failed to send (Check Console).');
                    });

                // Clear Cart
                cart = [];
                updateCartUI();
                toggleCart();
            });
        },
        onError: (err) => {
            console.error('PayPal Error:', err);
            alert('Something went wrong with the payment. Please try again.');
        }
    }).render('#paypal-button-container');
};

document.addEventListener('DOMContentLoaded', () => {
    navSlide();
    scrollAnimations();
    updateCartUI();
    initPayPal();

    // Attach Event Listeners to "Add to Cart" Buttons
    // Note: In a real app, products would have IDs. Here mapping via index for simplicity
    const addBtns = document.querySelectorAll('.btn-shop');
    const products = [
        { name: 'prod_1_name', price: 'prod_1_price' },
        { name: 'prod_2_name', price: 'prod_2_price' },
        { name: 'prod_3_name', price: 'prod_3_price' }
    ];

    addBtns.forEach((btn, index) => {
        btn.onclick = () => addToCart(products[index].name, products[index].price);
    });
});
