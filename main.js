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
        collection_title: "Exclusive Collection",
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
        checkout: "Checkout"
    },
    he: {
        home: "בית",
        collection: "חנות",
        about: "אודותינו",
        contact: "צור קשר",
        hero_title: "penfumes by liad",
        about_title: "אודותינו",
        about_text_1: "ברוכים הבאים ל<strong>Penfumes by Liad</strong>, המקום בו אמנות פוגשת ארומה בסימפוניה של ניחוחות. המסע שלנו התחיל עם תשוקה ליצירת ניחוחות שהם לא רק בשמים, אלא רגעים שנלכדו באלגנטיות.",
        about_text_2: "כל ניחוח נבחר בקפידה תוך שימוש במרכיבים המשובחים ביותר מרחבי העולם, ונועד לעורר רגש ותחכום. בין אם אתם מחפשים הצהרה נועזת או לחישה עדינה של חן, הקולקציה שלנו מבטיחה לשדרג את הנוכחות שלכם.",
        lang_btn: "EN",

        // Shop Translations
        collection_title: "קולקציה בלעדית",
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
        checkout: "לקופה"
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

const toggleCart = () => {
    document.getElementById('cart-sidebar').classList.toggle('active');
};

const updateCartUI = () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cart-total');

    // Update Count
    cartCount.innerText = cart.length;

    // Calculate Total
    let total = cart.reduce((acc, item) => acc + parseInt(item.price.replace(/[^\d]/g, '')), 0);
    cartTotal.innerText = `₪${total}`;

    // Render Items
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-msg" data-i18n="empty_cart">${translations[currentLang].empty_cart}</p>`;
    } else {
        cart.forEach((item, index) => {
            const itemHTML = `
                <div class="cart-item">
                    <div style="display:flex; align-items:center;">
                        <div style="width:50px; height:50px; background: #333; border-radius:5px; margin-right:10px; display:flex; justify-content:center; align-items:center; color:#555;">
                            <i class="fas fa-wine-bottle"></i>
                        </div>
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <span>${item.price}</span>
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

    // Open cart to show item
    document.getElementById('cart-sidebar').classList.add('active');
};

const removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
};

document.addEventListener('DOMContentLoaded', () => {
    navSlide();
    scrollAnimations();
    updateCartUI();

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