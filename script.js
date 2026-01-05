// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');

mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    mobileMenuBtn.innerHTML = nav.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Event Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const eventCards = document.querySelectorAll('.event-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        // Show/hide event cards based on filter
        eventCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Ticket Quantity Counter
document.querySelectorAll('.count-btn').forEach(button => {
    button.addEventListener('click', function() {
        const counter = this.parentElement.querySelector('.ticket-quantity');
        let count = parseInt(counter.textContent);
        
        if (this.classList.contains('plus')) {
            count = Math.min(count + 1, 10);
        } else if (this.classList.contains('minus')) {
            count = Math.max(count - 1, 1);
        }
        
        counter.textContent = count;
    });
});

// Buy Tickets Button
document.querySelectorAll('.event-actions .btn').forEach(button => {
    button.addEventListener('click', function() {
        const eventCard = this.closest('.event-card');
        const eventTitle = eventCard.querySelector('.event-title').textContent;
        const ticketQuantity = eventCard.querySelector('.ticket-quantity').textContent;
        
        alert(`Added ${ticketQuantity} ticket(s) for "${eventTitle}" to your cart!`);
    });
});

// Notify Me Button for Coming Soon Events
document.querySelectorAll('.notify-btn').forEach(button => {
    button.addEventListener('click', function() {
        const eventCard = this.closest('.coming-soon-card');
        const eventTitle = eventCard.querySelector('h3').textContent;
        
        alert(`You'll be notified when tickets for "${eventTitle}" go on sale!`);
    });
});

// Newsletter Form Submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('.newsletter-input').value;
        
        // In a real application, you would send this to a server
        alert(`Thank you for subscribing with ${email}! You'll receive updates on upcoming events.`);
        this.reset();
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe event cards for animation
eventCards.forEach(card => {
    observer.observe(card);
});

// Add popular badge to first two cards for demo
document.querySelectorAll('.event-card:nth-child(-n+2)').forEach(card => {
    const popularBadge = document.createElement('div');
    popularBadge.className = 'event-popular';
    popularBadge.textContent = '🔥 Hot';
    if (card.querySelector('.event-img-container')) {
        card.querySelector('.event-img-container').appendChild(popularBadge);
    }
});

// Add sold out badge to one card for demo
const lastCard = document.querySelector('.event-card:last-child');
if (lastCard) {
    const soldOutOverlay = document.createElement('div');
    soldOutOverlay.className = 'event-sold-out';
    soldOutOverlay.innerHTML = '<div class="sold-out-text">Sold Out</div>';
    lastCard.appendChild(soldOutOverlay);
    
    // Disable interactions for sold out card
    lastCard.querySelectorAll('.count-btn, .btn-primary').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    });
}

// Enhanced buy button functionality
document.querySelectorAll('.event-actions .btn-primary').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Get event details
        const card = this.closest('.event-card');
        const title = card.querySelector('.event-title').textContent;
        const quantity = card.querySelector('.ticket-quantity').textContent;
        
        // Show success message
        const originalText = this.textContent;
        this.innerHTML = '<i class="fas fa-check"></i> Added!';
        this.style.background = 'linear-gradient(135deg, #36b37e 0%, #2a9d68 100%)';
        
        setTimeout(() => {
            this.textContent = originalText;
            this.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)';
        }, 2000);
        
        // Add to cart animation
        const ticketIcon = document.createElement('div');
        
        ticketIcon.style.position = 'fixed';
        ticketIcon.style.fontSize = '30px';
        ticketIcon.style.zIndex = '1000';
        ticketIcon.style.pointerEvents = 'none';
        
        const rect = this.getBoundingClientRect();
        ticketIcon.style.left = rect.left + 'px';
        ticketIcon.style.top = rect.top + 'px';
        document.body.appendChild(ticketIcon);
        
        // Animate to cart icon in header
        const cartIcon = document.querySelector('.header-actions .btn-secondary');
        const cartRect = cartIcon.getBoundingClientRect();
        
        const animation = ticketIcon.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${cartRect.left - rect.left}px, ${cartRect.top - rect.top}px) scale(0.5)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        animation.onfinish = () => {
            document.body.removeChild(ticketIcon);
            // Add cart count increment animation
            if (cartIcon.textContent.includes('Sign In')) {
                const currentCount = parseInt(cartIcon.textContent.match(/\d+/)?.[0] || 0);
                cartIcon.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${currentCount + parseInt(quantity)})`;
                cartIcon.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.2)' },
                    { transform: 'scale(1)' }
                ], { duration: 300 });
            }
        };
    });
});
// Cart functionality
let cart = [];
let cartCount = 0;

// DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartCountElement = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const continueShopping = document.getElementById('continueShopping');

// Event data
const eventData = {
    1: {
        id: 1,
        title: "Summer Music Festival 2025",
        price: 89,
        category: "music",
        date: "June 15, 2025",
        location: "Central Park, New York",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    2: {
        id: 2,
        title: "NBA Finals 2025",
        price: 150,
        category: "sports",
        date: "July 22, 2025",
        location: "Staples Center, Los Angeles",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    3: {
        id: 3,
        title: "Tech Innovators Conference",
        price: 299,
        category: "conference",
        date: "August 10, 2025",
        location: "Convention Center, San Francisco",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    4: {
        id: 4,
        title: "International Food Festival",
        price: 25,
        category: "festival",
        date: "April 5, 2025",
        location: "Grant Park, Chicago",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    5: {
        id: 5,
        title: "Mega DJ Night Party",
        price: 45,
        category: "music",
        date: "October 12, 2025",
        location: "Downtown Club, Miami",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    6: {
        id: 6,
        title: "Winter Light Festival",
        price: 15,
        category: "festival",
        date: "December 10, 2025",
        location: "City Park, Denver",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
    }
};

// Cart Functions
function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = cartCount;
}

function updateCartTotal() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const fee = subtotal * 0.1; // 10% service fee
    const grandTotal = subtotal + fee;
    
    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartFee').textContent = `$${fee.toFixed(2)}`;
    document.getElementById('cartGrandTotal').textContent = `$${grandTotal.toFixed(2)}`;
}

function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartTotal.style.display = 'none';
        checkoutBtn.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartTotal.style.display = 'block';
    checkoutBtn.style.display = 'block';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Add event listeners to cart buttons
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            increaseQuantity(id);
        });
    });
    
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            decreaseQuantity(id);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
            removeFromCart(id);
        });
    });
    
    updateCartTotal();
}

function addToCart(eventId, quantity) {
    const event = eventData[eventId];
    const existingItem = cart.find(item => item.id === eventId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...event,
            quantity: quantity
        });
    }
    
    updateCartCount();
    renderCartItems();
    showNotification(`${quantity} ticket(s) for "${event.title}" added to cart!`);
}

function increaseQuantity(eventId) {
    const item = cart.find(item => item.id === eventId);
    if (item) {
        item.quantity++;
        updateCartCount();
        renderCartItems();
    }
}

function decreaseQuantity(eventId) {
    const item = cart.find(item => item.id === eventId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            removeFromCart(eventId);
            return;
        }
        updateCartCount();
        renderCartItems();
    }
}

function removeFromCart(eventId) {
    cart = cart.filter(item => item.id !== eventId);
    updateCartCount();
    renderCartItems();
    showNotification('Item removed from cart');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #6c63ff, #ff6584);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(108, 99, 255, 0.3);
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Cart Event Listeners
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

continueShopping.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const fee = total * 0.1;
    const grandTotal = total + fee;
    
    alert(`Checkout - Total: $${grandTotal.toFixed(2)}\n\nItems:\n${cart.map(item => 
        `- ${item.quantity}x ${item.title}: $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')}\n\nThank you for your purchase!`);
    
    // Clear cart after checkout
    cart = [];
    updateCartCount();
    renderCartItems();
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Add to Cart buttons
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const eventCard = e.target.closest('.event-card');
            const eventId = parseInt(eventCard.getAttribute('data-event-id'));
            const quantity = parseInt(eventCard.querySelector('.ticket-quantity').textContent);
            
            addToCart(eventId, quantity);
        });
    });
    
    // Ticket Count Functionality
    document.querySelectorAll('.count-btn').forEach(button => {
        button.addEventListener('click', function() {
            const parent = this.closest('.ticket-count');
            const quantitySpan = parent.querySelector('.ticket-quantity');
            let quantity = parseInt(quantitySpan.textContent);
            
            if (this.classList.contains('plus')) {
                quantity++;
            } else if (this.classList.contains('minus') && quantity > 1) {
                quantity--;
            }
            
            quantitySpan.textContent = quantity;
        });
    });
    
    // Mobile Menu Toggle
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
        document.querySelector('nav').classList.toggle('active');
    });

    // Event Filtering
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            const eventCards = document.querySelectorAll('.event-card');
            
            eventCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    // Close mobile menu if open
                    document.querySelector('nav').classList.remove('active');
                }
            }
        });
    });
    
    // Notification animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

// Notify buttons
document.querySelectorAll('.notify-btn').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.coming-soon-card');
        const title = card.querySelector('h3').textContent;
        alert(`You'll be notified when tickets for "${title}" go on sale!`);
    });
});

// Newsletter form
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('.newsletter-input').value;
    alert(`Thank you for subscribing with ${email}! You'll receive updates on upcoming events.`);
    this.reset();
});