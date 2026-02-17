let translations = {};
let currentLang = 'he';
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let resetEmail = null;

/* Data Loading */
async function loadProjectData() {
    try {
        const [transRes, usersRes] = await Promise.all([
            fetch('translations.json'),
            fetch('users.json')
        ]);

        translations = await transRes.json();
        const initialUsers = await usersRes.json();

        // Merge initial users if not already in localStorage
        let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        initialUsers.forEach(initUser => {
            if (!storedUsers.find(u => u.email === initUser.email)) {
                storedUsers.push(initUser);
            }
        });
        localStorage.setItem('users', JSON.stringify(storedUsers));

        // Start the app after data is loaded
        initializeApp();
    } catch (error) {
        console.error("Failed to load project data:", error);
    }
}

function updateLanguage() {
    if (!translations[currentLang]) return;

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    // Update switch button text
    const langSwitchDesktop = document.getElementById('lang-switch-desktop');
    const langSwitchMobile = document.getElementById('lang-switch-mobile');
    const nextLang = currentLang === 'en' ? 'HE' : 'EN';

    if (langSwitchDesktop) langSwitchDesktop.innerText = nextLang;
    if (langSwitchMobile) langSwitchMobile.innerText = nextLang;

    // Update body class for RTL
    if (currentLang === 'he') {
        document.body.classList.add('rtl');
        document.documentElement.setAttribute('lang', 'he');
    } else {
        document.body.classList.remove('rtl');
        document.documentElement.setAttribute('lang', 'en');
    }

    updateAuthUI();
}

function navSlide() {
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

function scrollAnimations() {
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
}

/* Cart Logic */
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let isDelivery = false;

/* EmailJS Initialization */
const SERVICE_ID = 'service_6v0vq4l';
const TEMPLATE_ID = 'template_09ohb2s';
const PUBLIC_KEY = 'N-bB99u-x07A76Y7g';

(function () {
    emailjs.init(PUBLIC_KEY);
})();

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

function updateCartTotal() {
    const deliveryRadio = document.querySelector('input[name="delivery"]:checked');
    isDelivery = deliveryRadio ? deliveryRadio.value === 'shipping' : false;
    updateCartUI();
}

function updateCartUI() {
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
        cartItemsContainer.innerHTML = `<p class="empty-cart-msg" data-i18n="empty_cart">${translations[currentLang].empty_cart || 'Your cart is empty'}</p>`;
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
}

function addToCart(nameKey, priceKey) {
    const name = translations[currentLang][nameKey];
    const price = translations[currentLang][priceKey];

    cart.push({ name, price, nameKey, priceKey });
    updateCartUI();

    document.getElementById('cart-sidebar').classList.add('active');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

/* PayPal Initialization */
function initPayPal() {
    if (!window.paypal) return;

    paypal.Buttons({
        createOrder: (data, actions) => {
            let subtotal = cart.reduce((acc, item) => acc + parseInt(item.price.replace(/[^\d]/g, '')), 0);
            let shipping = isDelivery ? 60 : 0;
            let total = subtotal + shipping;

            if (total === 0) return actions.reject();

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

                emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams)
                    .then(function (response) {
                        console.log('SUCCESS!', response.status, response.text);
                        alert(`Transaction completed! Confirmation sent using EmailJS.`);
                    }, function (error) {
                        console.log('FAILED...', error);
                        alert('Transaction completed, but email failed to send (Check Console).');
                    });

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
}

function initializeApp() {
    updateLanguage();
    navSlide();
    scrollAnimations();
    updateCartUI();
    initPayPal();

    // Attach Event Listeners specifically to Product "Add to Cart" Buttons
    const addBtns = document.querySelectorAll('.product-card .btn-shop');
    const products = [
        { name: 'prod_1_name', price: 'prod_1_price' },
        { name: 'prod_2_name', price: 'prod_2_price' },
        { name: 'prod_3_name', price: 'prod_3_price' }
    ];

    addBtns.forEach((btn, index) => {
        if (products[index]) {
            btn.onclick = () => addToCart(products[index].name, products[index].price);
        }
    });

    initAuth();
}

/* Authentication Logic */
function initAuth() {
    const authLink = document.getElementById('auth-link');
    const authLinkMobile = document.getElementById('auth-link-mobile');
    const modal = document.getElementById('auth-modal');
    const closeBtn = document.querySelector('.close-modal');

    const toggleAuth = (e) => {
        e.preventDefault();
        if (currentUser) {
            handleLogout();
        } else {
            showModal('login-form');
        }
    };

    if (authLink) authLink.onclick = toggleAuth;
    if (authLinkMobile) authLinkMobile.onclick = toggleAuth;

    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.remove('active');
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.classList.remove('active');
        }
    };

    updateAuthUI();
    checkResetToken();
}

function updateAuthUI() {
    const authLink = document.getElementById('auth-link');
    if (authLink) {
        if (currentUser) {
            const helloStr = translations[currentLang].hello || "Hello";
            const logoutStr = translations[currentLang].logout || "Logout";
            authLink.innerHTML = `${helloStr}, ${currentUser.name.split(' ')[0]} | <span style="text-decoration: underline;">${logoutStr}</span>`;
            authLink.setAttribute('data-i18n', ''); // Disable i18n for dynamic text
        } else {
            authLink.setAttribute('data-i18n', 'login_signup');
            authLink.innerText = translations[currentLang].login_signup || "Login / Sign Up";
        }
    }
}

function showModal(formId) {
    const modal = document.getElementById('auth-modal');
    const forms = ['login-form', 'signup-form', 'forgot-password-form', 'reset-password-form'];

    // Clear all inputs when switching forms
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => input.value = '');

    forms.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = id === formId ? 'block' : 'none';
    });

    modal.classList.add('active');
}

function showLogin() { showModal('login-form'); }
function showSignUp() { showModal('signup-form'); }
function showForgotPassword() { showModal('forgot-password-form'); }

function handleSignUp(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value.toLowerCase();
    const password = document.getElementById('signup-password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.email === email)) {
        alert(currentLang === 'he' ? "האימייל כבר קיים במערכת" : "Email already exists");
        return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    document.getElementById('auth-modal').classList.remove('active');
    updateAuthUI();
    alert(currentLang === 'he' ? "נרשמת בהצלחה!" : "Signed up successfully!");
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.toLowerCase();
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('auth-modal').classList.remove('active');
        updateAuthUI();
    } else {
        alert(currentLang === 'he' ? "אימייל או סיסמה שגויים" : "Invalid email or password");
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
}

function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.toLowerCase();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
        alert(currentLang === 'he' ? "אימייל לא נמצא" : "Email not found");
        return;
    }

    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const resetLink = `${window.location.origin}${window.location.pathname}#reset_token=${token}`;

    const resetData = {
        email: email,
        expiry: Date.now() + 3600000 // 1 hour
    };
    localStorage.setItem(`reset_${token}`, JSON.stringify(resetData));

    const templateParams = {
        email: email,
        link: resetLink
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then(() => {
            alert(currentLang === 'he' ? "לינק לאיפוס סיסמה נשלח למייל שלך" : "Password reset link has been sent to your email.");
            document.getElementById('auth-modal').classList.remove('active');
        }, (error) => {
            console.error("FAILED to send Reset Link", error);
            alert("Failed to send link. Please try again later.");
        });
}

function checkResetToken() {
    const hash = window.location.hash;
    if (hash.includes('reset_token=')) {
        const token = hash.split('reset_token=')[1].split('&')[0];
        const resetData = JSON.parse(localStorage.getItem(`reset_${token}`));

        if (resetData && resetData.expiry > Date.now()) {
            resetEmail = resetData.email;
            showModal('reset-password-form');
            window.history.replaceState(null, null, window.location.pathname);
            localStorage.removeItem(`reset_${token}`);
        } else {
            alert(currentLang === 'he' ? "הלינק פג תוקף או שאינו תקין" : "Reset link is invalid or expired.");
            window.history.replaceState(null, null, window.location.pathname);
        }
    }
}

function handleResetPassword(e) {
    e.preventDefault();
    const newPassword = document.getElementById('new-password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === resetEmail);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));

        alert(currentLang === 'he' ? "הסיסמה שונתה בהצלחה! כעת ניתן להתחבר." : "Password reset successfully! You can now login.");
        resetEmail = null;
        showLogin();
    }
}

// Global scope exposure
window.showLogin = showLogin;
window.showSignUp = showSignUp;
window.showForgotPassword = showForgotPassword;
window.handleSignUp = handleSignUp;
window.handleLogin = handleLogin;
window.handleForgotPassword = handleForgotPassword;
window.handleResetPassword = handleResetPassword;
window.handleLogout = handleLogout;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.updateCartTotal = updateCartTotal;

document.addEventListener('DOMContentLoaded', loadProjectData);
