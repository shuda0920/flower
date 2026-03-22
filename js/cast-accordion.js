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
        expandedImage.innerHTML = `<img src="${imageData.src}" alt="${imageData.alt}" class="cast-portrait" style="width:100%;height:100%;object-fit:cover;">`;
        
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

    // 更新 Mobile 上的導航點
    function updateMobileDots(activeIndex) {
        const dots = document.querySelectorAll('.cast-dot');
        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }

    // 切換指定卡片
    function activateCard(index) {
        if (index < 0 || index >= accordionCards.length) return;
        const targetCard = accordionCards[index];
        if (targetCard.classList.contains('active')) return;

        accordionCards.forEach((c) => {
            c.classList.remove('active');
            // 只在非移動端視圖刪除圖片，移動端時由於切換會直接隱藏，刪不刪除無所謂，不過統一起見就先刪除
            removeExpandedImage(c);
        });

        targetCard.classList.add('active');
        createExpandedImage(targetCard);
        updateMobileDots(index);
    }

    // 點擊卡片展開/收縮
    accordionCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (window.innerWidth <= 768) return; // 手機模式下禁止點擊本身切換
            activateCard(index);
        });
    });

    // Mobile Navigation 按鈕
    const prevBtn = document.querySelector('.cast-prev');
    const nextBtn = document.querySelector('.cast-next');
    const dots = document.querySelectorAll('.cast-dot');

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const activeCard = document.querySelector('.accordion-card.active');
            let currentIndex = Array.from(accordionCards).indexOf(activeCard);
            let prevIndex = currentIndex > 0 ? currentIndex - 1 : accordionCards.length - 1;
            activateCard(prevIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const activeCard = document.querySelector('.accordion-card.active');
            let currentIndex = Array.from(accordionCards).indexOf(activeCard);
            let nextIndex = currentIndex < accordionCards.length - 1 ? currentIndex + 1 : 0;
            activateCard(nextIndex);
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            activateCard(index);
        });
    });

    // 預設展開第一個 (如果已經有 active 則使用該 index 觸發圖片創建)
    const initialActive = Array.from(accordionCards).findIndex(c => c.classList.contains('active'));
    if(initialActive !== -1) {
        createExpandedImage(accordionCards[initialActive]);
        updateMobileDots(initialActive);
    }


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
            activateCard(nextIndex);

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

            // 檢查是否是滑動手勢，避免與原本上下滾動衝突，只處理水平滑動
            if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
                const activeCard = document.querySelector('.accordion-card.active');
                if (!activeCard) return;
                const currentIndex = Array.from(accordionCards).indexOf(activeCard);
                let nextIndex;

                if (deltaX < -50) {
                    // 向左滑：下一個
                    nextIndex = currentIndex < accordionCards.length - 1 ? currentIndex + 1 : 0;
                } else if (deltaX > 50) {
                    // 向右滑：上一個
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : accordionCards.length - 1;
                }

                if (nextIndex !== undefined) {
                    activateCard(nextIndex);
                }
            }
        });
    });

});
