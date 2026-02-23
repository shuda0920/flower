# 移動端菜單修復說明

## 🔧 修復的問題

### 問題根源
點擊菜單項後，hamburger 圖標和菜單沒有正確關閉，原因是：

1. **代碼衝突**：`script.js` 和 `mobile-menu.js` 都有 hamburger 處理邏輯
2. **事件衝突**：重複的事件監聽器互相干擾
3. **時機問題**：點擊關閉和滾動動作同時發生

## ✅ 修復方案

### 1. 移除 script.js 中的舊代碼

**之前**（第 517-540 行）：
```javascript
// Mobile Menu
const mbMenu = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (mbMenu) {
    mbMenu.addEventListener('click', () => {
        // 使用內聯樣式...
        navLinks.style.display = 'flex';
        navLinks.style.position = 'absolute';
        // ...
    });
}
```

**現在**：
```javascript
// Mobile Menu handling is in mobile-menu.js
```

✅ **優點**：避免重複處理，邏輯集中管理

### 2. 重寫 mobile-menu.js

**關鍵修改**：

#### A. 添加事件防止冒泡
```javascript
hamburgerElement.addEventListener('click', (e) => {
    e.stopPropagation(); // 防止觸發其他點擊事件
    toggleMobileMenu();
});
```

#### B. 延遲關閉菜單
```javascript
allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(() => {
            // 關閉菜單
        }, 300); // 延遲300ms，讓滾動開始後再關閉
    });
});
```

✅ **效果**：給予足夠時間讓平滑滾動開始，視覺更流暢

#### C. 點擊覆蓋層關閉
```javascript
navLinksElement.addEventListener('click', (e) => {
    if (e.target === navLinksElement) {
        // 只在點擊背景時關閉
    }
});
```

✅ **效果**：點擊菜單外的深色區域可以關閉菜單

## 📋 完整功能列表

### 打開菜單
- ✅ 點擊 hamburger 圖標
- ✅ 三條線變成 X 形狀
- ✅ 全屏菜單淡入
- ✅ 鎖定 body 滾動

### 關閉菜單
- ✅ 點擊 hamburger/X 圖標（toggle）
- ✅ 點擊任意菜單項（延遲 300ms）
- ✅ 點擊菜單背景覆蓋層
- ✅ 窗口調整到桌面尺寸（> 768px）

### 視覺反饋
- ✅ Hamburger → X 動畫（300ms）
- ✅ 菜單淡入淡出
- ✅ 菜單項依序出現動畫
- ✅ body 滾動鎖定/解鎖

## 🎯 修復後的效果

### 正常流程
```
1. 用戶點擊 hamburger
   → 菜單打開，X 圖標顯示

2. 用戶點擊「劇情」
   → 延遲 300ms...
   → 頁面開始滾動到劇情區塊
   → 菜單關閉，hamburger 圖標恢復

3. 滾動完成 ✅
```

### 之前的問題
```
1. 用戶點擊 hamburger
   → 菜單打開，但狀態混亂

2. 用戶點擊「劇情」
   → ❌ 菜單沒關閉
   → ❌ X 圖標還在
   → ❌ 需要再點擊一次才能關閉
```

## 🔍 技術細節

### 使用 Class Toggle 而非內聯樣式

**之前**（script.js）：
```javascript
navLinks.style.display = 'flex';
navLinks.style.position = 'absolute';
navLinks.style.top = '46px';
// 內聯樣式優先級高，難以用 CSS 覆蓋
```

**現在**（mobile-menu.js）：
```javascript
hamburgerElement.classList.toggle('active');
navLinksElement.classList.toggle('active');
// 使用 class，完全由 CSS 控制樣式
```

### CSS 控制（mobile-fixes.css）
```css
.nav-links {
    display: none; /* 預設隱藏 */
}

.nav-links.active {
    display: flex; /* 打開時顯示 */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    /* 全屏覆蓋層 */
}

.hamburger.active .line:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
}
/* X 形狀動畫 */
```

## 📊 文件變更總結

| 文件 | 變更 | 說明 |
|------|------|------|
| `js/script.js` | 刪除 517-540 行 | 移除舊的 hamburger 代碼 |
| `js/mobile-menu.js` | 完全重寫 | 修復邏輯，添加延遲關閉 |
| `css/mobile-fixes.css` | 無變更 | 樣式已正確 |

## 🧪 測試檢查清單

### 基本功能
- [ ] 點擊 hamburger 打開菜單
- [ ] 再次點擊關閉菜單
- [ ] 點擊菜單項後自動關閉
- [ ] 點擊背景關閉菜單

### 動畫效果
- [ ] Hamburger → X 動畫流暢
- [ ] 菜單淡入淡出正常
- [ ] 菜單項依序出現

### 滾動行為
- [ ] 點擊「劇情」後平滑滾動
- [ ] 滾動時菜單已關閉
- [ ] body 滾動鎖定正確

### 響應式
- [ ] 桌面模式不顯示 hamburger
- [ ] 窗口縮小時出現 hamburger
- [ ] 調整到桌面尺寸時自動關閉菜單

## 💡 關鍵改進

1. **延遲關閉（300ms）**
   - 給予滾動動畫啟動時間
   - 用戶體驗更流暢

2. **事件防冒泡**
   - `e.stopPropagation()`
   - 避免觸發其他事件

3. **代碼集中化**
   - 所有 mobile 邏輯在 `mobile-menu.js`
   - 易於維護和調試

4. **使用 Class 而非內聯樣式**
   - CSS 完全控制外觀
   - JavaScript 只管理狀態

---

**修復日期**：2026-02-09  
**問題**：點擊菜單項後 burger 不關閉  
**狀態**：✅ 已修復
