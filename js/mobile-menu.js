// Mobile Navigation (Hamburger Menu)
// ─────────────────────────────────
// 核心策略：開選單時隱藏 glassi-fy（WebGL 覆蓋層），
// 關閉時恢復，確保黑色背景永遠可見。

const GLASSI_SELECTOR = 'glassi-fy';

function setGlassify(visible) {
    const g = document.querySelector(GLASSI_SELECTOR);
    if (!g) return;
    g.style.visibility = visible ? '' : 'hidden';
    g.style.opacity    = visible ? '' : '0';
    g.style.pointerEvents = visible ? '' : 'none';
}

function openMenu(hamburgerEl, navLinksEl) {
    hamburgerEl.classList.add('active');
    navLinksEl.classList.add('active');
    document.body.style.overflow = 'hidden';
    setGlassify(false);          // 暫停 glassi-fy，露出真正的黑色底色
}

function closeMenu(hamburgerEl, navLinksEl) {
    hamburgerEl.classList.remove('active');
    navLinksEl.classList.remove('active');
    document.body.style.overflow = '';
    setGlassify(true);           // 恢復 glassi-fy 效果
}

// ─── Initialize ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerEl  = document.querySelector('.hamburger');
    const navLinksEl   = document.querySelector('.nav-links');
    const nav          = document.querySelector('nav');
    const allNavLinks  = document.querySelectorAll('.nav-links a');

    if (!hamburgerEl || !navLinksEl) return;

    // Hamburger click
    hamburgerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navLinksEl.classList.contains('active')) {
            closeMenu(hamburgerEl, navLinksEl);
        } else {
            openMenu(hamburgerEl, navLinksEl);
            if (nav) {
                nav.classList.add('scrolled');
            }
        }
    });

    // Nav item click → close after short delay
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                if (navLinksEl.classList.contains('active')) {
                    closeMenu(hamburgerEl, navLinksEl);
                }
            }, 300);
        });
    });

    // Click outside (on overlay) → close
    navLinksEl.addEventListener('click', (e) => {
        if (e.target === navLinksEl) {
            closeMenu(hamburgerEl, navLinksEl);
        }
    });
});

// ─── Resize → close on desktop ────────────────────────
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const hamburgerEl = document.querySelector('.hamburger');
        const navLinksEl  = document.querySelector('.nav-links');
        if (window.innerWidth > 768 && navLinksEl && navLinksEl.classList.contains('active')) {
            closeMenu(hamburgerEl, navLinksEl);
        }
    }, 250);
});
