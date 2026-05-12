// State Management
let isLoggedIn = true; // Set to true for logged in, false for signed out

// DOM Elements
const accountBtn = document.getElementById('accountBtn');
const accountMenu = document.getElementById('accountMenu');
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    setupEventListeners();
});

// Update Auth UI based on login state
function updateAuthUI() {
    const accountContainer = document.querySelector('.account-container');
    
    if (isLoggedIn) {
        // Show account menu, hide sign in button
        accountContainer.style.display = 'flex';
        signInBtn.style.display = 'none';
    } else {
        // Show sign in button, hide account menu
        accountContainer.style.display = 'none';
        signInBtn.style.display = 'flex';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Sign In Button
    signInBtn.addEventListener('click', () => {
        handleSignIn();
    });

    // Sign Out Button
    signOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleSignOut();
    });

    // Menu Toggle (Sidebar)
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking on a nav item (mobile)
    const navItems = sidebar.querySelectorAll('a.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Close account menu when clicking outside
    document.addEventListener('click', (e) => {
        const accountContainer = document.querySelector('.account-container');
        if (!accountContainer.contains(e.target)) {
            accountBtn.blur();
        }
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
        }
    });

    // Prevent menu from closing when clicking inside
    accountMenu.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) {
            // Allow links and buttons to work
        } else {
            e.stopPropagation();
        }
    });
}

// Handle Sign In
function handleSignIn() {
    isLoggedIn = true;
    updateAuthUI();
    showNotification('Successfully signed in!', 'success');
}

// Handle Sign Out
function handleSignOut() {
    isLoggedIn = false;
    updateAuthUI();
    showNotification('You have been signed out', 'info');
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#34a853' : '#065fd4'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-size: 0.95rem;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-in-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Close menu with Escape key
    if (e.key === 'Escape') {
        accountBtn.blur();
        sidebar.classList.remove('open');
    }

    // Toggle menu with M key (when not typing in input)
    if (e.key === 'm' && e.ctrlKey && document.activeElement.tagName !== 'INPUT') {
        sidebar.classList.toggle('open');
    }
});

// Search functionality
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const query = searchInput.value.trim();
    if (query) {
        console.log('Searching for:', query);
        showNotification(`Searching for "${query}"...`, 'info');
        // In a real app, this would navigate to search results
    }
}

// Video card click handlers
const videoCards = document.querySelectorAll('.video-card');
videoCards.forEach(card => {
    card.addEventListener('click', () => {
        if (!isLoggedIn) {
            showNotification('Please sign in to watch videos', 'info');
            handleSignIn(); // Auto sign in for demo
        } else {
            const title = card.querySelector('.video-title').textContent;
            console.log('Playing:', title);
            showNotification(`Now playing: ${title}`, 'success');
        }
    });
});

// Navigation item active state
const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
navItems.forEach((item, index) => {
    if (index === 0) {
        item.classList.add('active');
    }
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Filter dropdown change
const filterDropdown = document.querySelector('.filter-dropdown');
filterDropdown.addEventListener('change', (e) => {
    const filter = e.target.value;
    console.log('Sorting by:', filter);
    showNotification(`Sorting by: ${filter}`, 'info');
});

// Clear history button
const historyClearBtn = document.querySelector('.history-clear-btn');
if (historyClearBtn) {
    historyClearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to clear your watch history?')) {
            showNotification('Watch history cleared', 'success');
        }
    });
}

// Demo: Log initial state
console.log('YouTube Clone Loaded');
console.log('Logged In:', isLoggedIn);
console.log('Tip: Press Ctrl+M to toggle sidebar on desktop');
console.log('Tip: Click on any video to see playback simulation');
