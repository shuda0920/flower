/* =====================================================
   Mascot Carousel – mascot-carousel.js
   ===================================================== */
(function () {
    const slides   = document.querySelectorAll('.mascot-slide');
    const dots     = document.querySelectorAll('.mascot-dot');
    const prevBtn  = document.getElementById('mascot-prev');
    const nextBtn  = document.getElementById('mascot-next');

    if (!slides.length) return;

    let current   = 1;   /* 從封面（index 1）開始 */
    const total   = slides.length;
    let autoTimer = null;

    function goTo(idx) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (idx + total) % total;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function startAuto() {
        autoTimer = setInterval(() => goTo(current + 1), 4500);
    }

    function stopAuto() {
        clearInterval(autoTimer);
    }

    prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAuto();
            goTo(Number(dot.dataset.index));
            startAuto();
        });
    });

    /* Touch swipe support */
    let touchStartX = 0;
    const wrapper = document.querySelector('.mascot-carousel');
    wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    wrapper.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
            stopAuto();
            goTo(dx < 0 ? current + 1 : current - 1);
            startAuto();
        }
    });

    startAuto();
})();
