// --- Team Carousel ---
const teamSlides = document.querySelectorAll('.team-slide');
const teamPrevBtn = document.querySelector('.team-prev');
const teamNextBtn = document.querySelector('.team-next');
const indicators = document.querySelectorAll('.team-indicators .indicator');

let currentTeamIndex = 0;

function showTeamSlide(index) {
    // Remove active class from all slides
    teamSlides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Remove active class from all indicators
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });

    // Add active class to current slide
    if (teamSlides[index]) {
        teamSlides[index].classList.add('active');
    }

    // Add active class to current indicator
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }

    currentTeamIndex = index;
}

function nextTeamSlide() {
    let nextIndex = currentTeamIndex + 1;
    if (nextIndex >= teamSlides.length) {
        nextIndex = 0; // Loop back to first
    }
    showTeamSlide(nextIndex);
}

function prevTeamSlide() {
    let prevIndex = currentTeamIndex - 1;
    if (prevIndex < 0) {
        prevIndex = teamSlides.length - 1; // Loop to last
    }
    showTeamSlide(prevIndex);
}

// Event Listeners
if (teamPrevBtn) {
    teamPrevBtn.addEventListener('click', prevTeamSlide);
}

if (teamNextBtn) {
    teamNextBtn.addEventListener('click', nextTeamSlide);
}

// Indicator click events
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        showTeamSlide(index);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Only handle keyboard navigation when team section is in view
    const teamSection = document.getElementById('team');
    if (!teamSection) return;

    const rect = teamSection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInView) {
        if (e.key === 'ArrowLeft') {
            prevTeamSlide();
        } else if (e.key === 'ArrowRight') {
            nextTeamSlide();
        }
    }
});

// Touch/Swipe support for mobile
let teamTouchStartX = 0;
let teamTouchEndX = 0;

const teamCarousel = document.querySelector('.team-carousel');
if (teamCarousel) {
    teamCarousel.addEventListener('touchstart', (e) => {
        teamTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    teamCarousel.addEventListener('touchend', (e) => {
        teamTouchEndX = e.changedTouches[0].screenX;
        handleTeamSwipe();
    }, { passive: true });
}

function handleTeamSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe

    if (teamTouchEndX < teamTouchStartX - swipeThreshold) {
        // Swipe left - show next
        nextTeamSlide();
    }

    if (teamTouchEndX > teamTouchStartX + swipeThreshold) {
        // Swipe right - show previous
        prevTeamSlide();
    }
}

// Auto-reset to first slide (team group photo) when section comes into view
const teamSection = document.getElementById('team');
let hasLeftTeamSection = true; // Initialize to true so first entry triggers
let overlayTimeout = null;

if (teamSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Section is in view
                if (hasLeftTeamSection) {
                    // User has returned to section, reset to first slide
                    showTeamSlide(0);
                    hasLeftTeamSection = false;
                }
                
                // Auto trigger the group photo overlay pop-up
                const teamGroupPhoto = document.querySelector('.team-group-photo');
                if (teamGroupPhoto && currentTeamIndex === 0) {
                    teamGroupPhoto.classList.add('reveal-overlay');
                    
                    // Clear any existing timeout to avoid glitching
                    if (overlayTimeout) clearTimeout(overlayTimeout);
                    
                    // Hide overlay after 3 seconds to show the team photo
                    overlayTimeout = setTimeout(() => {
                        teamGroupPhoto.classList.remove('reveal-overlay');
                    }, 3000);
                }
            } else {
                // Section is out of view
                hasLeftTeamSection = true;
                
                // Cleanup overlay state if user scrolls away quickly
                const teamGroupPhoto = document.querySelector('.team-group-photo');
                if (teamGroupPhoto) {
                    teamGroupPhoto.classList.remove('reveal-overlay');
                }
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of section is visible
    });

    observer.observe(teamSection);
}
