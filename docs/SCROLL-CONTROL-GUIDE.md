# 🎬 滾動動畫與位置控制 - 完整說明

## 📊 滾動控制架構

你的網站滾動是由 **3 個系統** 聯合控制：

```
┌──────────────────────────────────────┐
│       1. CSS 基礎滾動控制            │
│       (style.css)                    │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│       2. GSAP ScrollTrigger          │
│       (script.js - 主要控制器)       │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│       3. 導航錨點跳轉                │
│       (HTML + CSS)                   │
└──────────────────────────────────────┘
```

---

## 1️⃣ CSS 基礎滾動控制

### **文件：** `style.css` 第 79 行

```css
html {
    scroll-behavior: smooth;  /* ← 平滑滾動 */
    font-size: var(--font-size-base);
}
```

### **功能：**
- ✅ 所有滾動都是平滑的（不會跳躍）
- ✅ 點擊錨點連結時會平滑滾動
- ✅ 瀏覽器原生支援

### **控制範圍：**
- 導航點擊跳轉 (nav links)
- `window.scrollTo()` 行為
- 錨點 `#` 連結

---

## 2️⃣ GSAP ScrollTrigger（主要控制器）

### **文件：** `script.js` 第 290-371 行

這是**最重要的滾動動畫控制器**！

### **A. 註冊插件**
```javascript
// 第 290 行
gsap.registerPlugin(ScrollTrigger);
```

### **B. 標題淡入動畫**
```javascript
// 第 292-302 行
gsap.utils.toArray(".section-title").forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,           // 觸發元素
            start: "top 100%",        // 滾動位置：元素頂部碰到視窗底部
            toggleActions: "play none none reverse"
        },
        y: 40,                        // 從下方 40px 開始
        opacity: 0,                   // 從透明開始
    });
});
```

**效果：** 當標題進入視窗時，從下往上淡入
**觸發點：** 標題距離視窗底部時開始動畫

### **C. Hero 背景溶解效果**（最複雜）
```javascript
// 第 306-337 行
const heroTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",          // Hero 頂部碰到視窗頂部
        end: "bottom top",         // Hero 底部碰到視窗頂部（滾過整個 hero）
        scrub: 0.5                 // 跟隨滾動，0.5秒緩衝
    }
});

heroTl
    // 1. 圖片放大（整個過程）
    .to(".hero-image-container", {
        scale: 1.7,
        duration: 1,
        ease: "none"
    }, 0)
    
    // 2. 視差下沉
    .to(".hero-image-container", {
        y: 190,
        duration: 1,
        ease: "none"
    }, 0.1)
    
    // 3. 淡出（後半段）
    .to(".hero-image-container, .hero-content", {
        opacity: 0,
        duration: 0.35,
        ease: "none"
    }, 0.15);
```

**效果：**
- ✨ 滾動時圖片放大 1.7 倍
- ✨ 圖片往下移動 190px（視差效果）
- ✨ 後半段開始淡出到完全透明

**觸發範圍：** Hero section 的整個高度（100vh）

### **D. 卡片網格交錯淡入**
```javascript
// 第 342-365 行
const grids = [".team-grid", ".merch-grid", ".schedule-grid"];

grids.forEach(grid => {
    const children = document.querySelector(grid)?.children;
    if (children) {
        ScrollTrigger.batch(children, {
            start: "top 95%",      // 元素頂部距離視窗底部 5%
            onEnter: batch => gsap.to(batch, {
                autoAlpha: 1,      // 淡入
                y: 0,              // 回到原位
                stagger: 0.1,      // 每個間隔 0.1 秒
                duration: 0.6,
                ease: "power2.out"
            }),
            onLeaveBack: batch => gsap.to(batch, {
                autoAlpha: 0,      // 淡出
                y: 30,             // 往下移
            })
        });
        
        // 初始狀態：隱藏 + 往下 30px
        gsap.set(children, { autoAlpha: 0, y: 30 });
    }
});
```

**效果：** 團隊、商品、時刻表的卡片依序淡入

### **E. 重新計算位置**
```javascript
// 第 369-371 行
window.addEventListener("load", () => {
    ScrollTrigger.refresh();  // 頁面載入完成後重新計算
});
```

**功能：** 確保圖片載入後位置正確

---

## 3️⃣ 導航錨點跳轉

### **文件：** `index.html` + `style.css`

```html
<!-- index.html 導航 -->
<nav>
    <a href="#about">故事章節</a>
    <a href="#team">主創團隊</a>
    <a href="#cast">主演卡司</a>
    <!-- ... -->
</nav>

<!-- 各個 section -->
<section id="about" class="container">
<section id="team" class="container">
<section id="cast" class="container">
```

**工作原理：**
1. 點擊 `<a href="#about">`
2. 瀏覽器找到 `id="about"` 的元素
3. 使用 CSS `scroll-behavior: smooth` 平滑滾動過去

---

## 🎛️ 如何修改滾動行為

### **1. 改變滾動速度**

**平滑度：**
```css
/* style.css */
html {
    scroll-behavior: smooth;  /* 改為 auto 則立即跳轉 */
}
```

**GSAP 跟隨速度：**
```javascript
/* script.js - 第 311 行 */
scrollTrigger: {
    scrub: 0.5  // 改小 (0.1) 更緊跟，改大 (2) 更緩慢
}
```

### **2. 改變動畫觸發點**

```javascript
/* script.js - 第 296 行 */
scrollTrigger: {
    start: "top 100%",  // 改為 "top 80%" 提前觸發
    //     ↑      ↑
    //   元素位置  視窗位置
}
```

**常用位置：**
- `"top top"` - 元素頂部碰到視窗頂部
- `"top 80%"` - 元素頂部在視窗 80% 處
- `"center center"` - 元素中心對齊視窗中心
- `"bottom top"` - 元素底部碰到視窗頂部

### **3. 改變動畫效果**

```javascript
/* script.js - 第 299 行 */
gsap.from(title, {
    y: 40,        // 改為 y: 100 → 從更下方出現
    opacity: 0,   // 改為 scale: 0.5 → 從縮小開始
    duration: 1   // 新增：控制動畫時長
});
```

### **4. 禁用某些動畫**

```javascript
/* script.js - 註釋掉不要的部分 */

// 不要標題淡入？
// gsap.utils.toArray(".section-title").forEach(title => {
//     ...
// });

// 不要 Hero 溶解？
// const heroTl = gsap.timeline({
//     ...
// });
```

---

## 🐛 常見問題

### **Q1: 滾動位置不準確？**
**A:** ScrollTrigger 需要重新計算
```javascript
ScrollTrigger.refresh();
```

### **Q2: 動畫太快/太慢？**
**A:** 調整 `scrub` 或 `duration`
```javascript
scrub: 1,      // 慢一點
duration: 2,   // 快一點
```

### **Q3: 想要全屏滾動（snap）？**
**A:** 之前已經試過但你不喜歡，目前是自由滾動模式

### **Q4: 動畫跟滾動衝突？**
**A:** 檢查是否有多個 ScrollTrigger 控制同一元素

---

## 📝 總結

### **滾動位置控制者：**
1. **CSS `scroll-behavior`** - 基礎平滑滾動
2. **GSAP ScrollTrigger** - 動畫觸發和控制
3. **HTML 錨點** - 導航跳轉目標

### **動畫控制者：**
1. **GSAP Timeline** - Hero 背景溶解
2. **GSAP from/to** - 元素淡入淡出
3. **GSAP batch** - 批次交錯動畫

### **關鍵檔案：**
- `script.js` 第 290-371 行 → **主要動畫控制**
- `style.css` 第 79 行 → **平滑滾動開關**
- `index.html` 錨點 `id` → **跳轉目標**

---

**想修改滾動行為？直接編輯 `script.js` 的 ScrollTrigger 設定！** 🎬
