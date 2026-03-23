// Mobile Navigation (Hamburger Menu)

// Toggle mobile menu
function toggleMobileMenu() {
    const hamburgerElement = document.querySelector('.hamburger');
    const navLinksElement = document.querySelector('.nav-links');

    if (hamburgerElement && navLinksElement) {
        hamburgerElement.classList.toggle('active');
        navLinksElement.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (navLinksElement.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}


// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerElement = document.querySelector('.hamburger');
    const navLinksElement = document.querySelector('.nav-links');
    const nav = document.querySelector('nav');
    const allNavLinks = document.querySelectorAll('.nav-links a');

    // Hamburger click event
    if (hamburgerElement) {
        hamburgerElement.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
            nav.classList.add('glassify');
            nav.classList.add('scrolled');
        });
    }

    // Nav items click - close menu with delay
    if (allNavLinks.length > 0) {
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Delay closing to allow smooth scroll to start
                setTimeout(() => {
                    if (navLinksElement && navLinksElement.classList.contains('active')) {
                        navLinksElement.classList.remove('active');
                        if (hamburgerElement) {
                            hamburgerElement.classList.remove('active');
                        }
                        document.body.style.overflow = '';
                    }
                }, 300);
            });
        });
    }

    // Click on overlay background to close
    if (navLinksElement) {
        navLinksElement.addEventListener('click', (e) => {
            // Only close if clicking the background, not the menu items
            if (e.target === navLinksElement) {
                navLinksElement.classList.remove('active');
                if (hamburgerElement) {
                    hamburgerElement.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        });
    }
});

// Handle window resize - close menu when resizing to desktop
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const navLinksElement = document.querySelector('.nav-links');
        const hamburgerElement = document.querySelector('.hamburger');

        if (window.innerWidth > 768 && navLinksElement) {
            navLinksElement.classList.remove('active');
            if (hamburgerElement) {
                hamburgerElement.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    }, 250);
});
