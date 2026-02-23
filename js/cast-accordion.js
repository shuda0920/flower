// Cast Accordion - 手風琴卡司展示交互

document.addEventListener('DOMContentLoaded', () => {
    const accordionCards = document.querySelectorAll('.accordion-card');

    if (accordionCards.length === 0) return;

    // 點擊卡片展開/收縮
    accordionCards.forEach(card => {
        card.addEventListener('click', () => {
            // 如果點擊的是已經active的卡片，不做任何事
            if (card.classList.contains('active')) {
                return;
            }

            // 移除所有其他卡片的active狀態
            accordionCards.forEach(c => c.classList.remove('active'));

            // 添加active到當前卡片
            card.classList.add('active');
        });
    });


    // 鍵盤導航支持
    document.addEventListener('keydown', (e) => {
        const activeCard = document.querySelector('.accordion-card.active');
        if (!activeCard) return;

        const currentIndex = Array.from(accordionCards).indexOf(activeCard);
        let nextIndex;

        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            // 向左/向上：上一個
            nextIndex = currentIndex > 0 ? currentIndex - 1 : accordionCards.length - 1;
            e.preventDefault();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            // 向右/向下：下一個
            nextIndex = currentIndex < accordionCards.length - 1 ? currentIndex + 1 : 0;
            e.preventDefault();
        }

        if (nextIndex !== undefined) {
            accordionCards.forEach(c => c.classList.remove('active'));
            accordionCards[nextIndex].classList.add('active');

            // 滾動到可視區域
            accordionCards[nextIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    });

    // 觸控滑動支持（移動設備）
    let touchStartX = 0;
    let touchStartY = 0;

    accordionCards.forEach(card => {
        card.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        card.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // 檢查是否是滑動手勢（而不是點擊）
            if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
                const activeCard = document.querySelector('.accordion-card.active');
                const currentIndex = Array.from(accordionCards).indexOf(activeCard);
                let nextIndex;

                // 橫屏模式：左右滑動
                if (window.innerWidth > window.innerHeight) {
                    if (deltaX < -50) {
                        // 向左滑：下一個
                        nextIndex = currentIndex < accordionCards.length - 1 ? currentIndex + 1 : 0;
                    } else if (deltaX > 50) {
                        // 向右滑：上一個
                        nextIndex = currentIndex > 0 ? currentIndex - 1 : accordionCards.length - 1;
                    }
                } else {
                    // 豎屏模式：上下滑動
                    if (deltaY < -50) {
                        // 向上滑：下一個
                        nextIndex = currentIndex < accordionCards.length - 1 ? currentIndex + 1 : 0;
                    } else if (deltaY > 50) {
                        // 向下滑：上一個
                        nextIndex = currentIndex > 0 ? currentIndex - 1 : accordionCards.length - 1;
                    }
                }

                if (nextIndex !== undefined) {
                    accordionCards.forEach(c => c.classList.remove('active'));
                    accordionCards[nextIndex].classList.add('active');
                }
            }
        });
    });
});
