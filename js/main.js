// ===========================
// XAANE Website - Main JavaScript
// ===========================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initCart();
    initContactForm();
});

// ===========================
// Mobile Menu Toggle
// ===========================
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    }
}

// ===========================
// Shopping Cart Functionality
// ===========================
function initCart() {
    updateCartCount();
}

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('xaane_cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('xaane_cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cart = getCart();
    const cartCount = document.getElementById('cartCount');

    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Add item to cart
function addToCart(product) {
    const cart = getCart();

    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);

    // Show confirmation (you can make this fancier later)
    alert(`${product.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

// Update item quantity
function updateCartItemQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
}

// Get cart total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Clear cart
function clearCart() {
    localStorage.removeItem('xaane_cart');
    updateCartCount();
}

// Export functions for use in other pages
window.cartFunctions = {
    getCart,
    saveCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartTotal,
    clearCart,
    updateCartCount
};

// ===========================
// Contact Form Handling
// ===========================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const submitButton = form.querySelector('.btn-submit');

            // Disable button during submission
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    formStatus.style.display = 'block';
                    formStatus.style.backgroundColor = '#719d7dff';
                    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                    form.reset();
                } else {
                    // Error
                    formStatus.style.display = 'block';
                    formStatus.style.backgroundColor = '#dfa8a4ff';
                    formStatus.textContent = 'Oops! There was a problem sending your message. Please try again.';
                }
            } catch (error) {
                // Network error
                formStatus.style.display = 'block';
                formStatus.style.backgroundColor = '#ea8e88ff';
                formStatus.textContent = 'Oops! There was a problem sending your message. Please try again.';
            }

            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = 'Send';

            // Hide status message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        });
    }
}
