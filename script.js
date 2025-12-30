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
        ticketIcon.innerHTML = '🎟️';
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