// Cast Accordion - 手風琴卡司展示交互

document.addEventListener('DOMContentLoaded', () => {
    const accordionCards = document.querySelectorAll('.accordion-card');

    if (accordionCards.length === 0) return;

    // 動態創建展開圖片
    function createExpandedImage(card) {
        const cardExpanded = card.querySelector('.card-expanded');
        const expandedInfo = cardExpanded.querySelector('.expanded-info');
        const actorId = expandedInfo.getAttribute('data-actor');
        
        // 檢查是否已經存在
        if (cardExpanded.querySelector('.expanded-image')) {
            return;
        }

        // 獲取卡片資訊
        const cardNo = card.getAttribute('data-cast');
        const actorImageMap = {
            '1': { src: 'images/actor/actor_1.jpg', alt: '洪藝瑄飾演玫瑰' },
            '2': { src: 'images/actor/actor_2.jpg', alt: '林威成飾演浩' },
            '3': { src: 'images/actor/actor_3.jpg', alt: '賴政杰飾演陶' },
            '4': { src: 'images/actor/actor_4.jpg', alt: '尹筑帆飾演語心' }
        };

        const imageData = actorImageMap[cardNo];
        
        // 創建 expanded-image 元素
        const expandedImage = document.createElement('div');
        expandedImage.className = 'expanded-image';
        expandedImage.innerHTML = `<img src="${imageData.src}" alt="${imageData.alt}" class="cast-portrait">`;
        
        // 插入到 expanded-info 前面
        expandedInfo.parentNode.insertBefore(expandedImage, expandedInfo);
    }

    // 刪除展開圖片
    function removeExpandedImage(card) {
        const expandedImage = card.querySelector('.card-expanded .expanded-image');
        if (expandedImage) {
            expandedImage.remove();
        }
    }

    // 點擊卡片展開/收縮
    accordionCards.forEach(card => {
        card.addEventListener('click', () => {
            // 如果點擊的是已經active的卡片，不做任何事
            if (card.classList.contains('active')) {
                return;
            }

            // 移除所有其他卡片的active狀態和圖片
            accordionCards.forEach(c => {
                c.classList.remove('active');
                removeExpandedImage(c);
            });

            // 添加active到當前卡片和圖片
            card.classList.add('active');
            createExpandedImage(card);
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
            accordionCards.forEach(c => {
                c.classList.remove('active');
                removeExpandedImage(c);
            });
            accordionCards[nextIndex].classList.add('active');
            createExpandedImage(accordionCards[nextIndex]);

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
                    accordionCards.forEach(c => {
                        c.classList.remove('active');
                        removeExpandedImage(c);
                    });
                    accordionCards[nextIndex].classList.add('active');
                    createExpandedImage(accordionCards[nextIndex]);
                }
            }
        });
    });

    // 初始化：為 active 的卡片添加圖片
    const initialActive = document.querySelector('.accordion-card.active');
    if (initialActive) {
        createExpandedImage(initialActive);
    }
});
