# 導航欄滾動自動高亮功能說明

## 🎯 功能概述

現在導航欄會根據頁面滾動位置自動更新選中狀態（active class），用戶無需點擊也能看到當前所在區塊。

## ✨ 功能特點

### 1. 自動高亮
- ✅ **滾動檢測** - 實時監聽頁面滾動
- ✅ **區塊識別** - 自動識別當前可視區域的section
- ✅ **狀態同步** - 導航欄自動高亮對應連結
- ✅ **平滑切換** - 進入新區塊時立即更新

### 2. 智能判斷
- ✅ **提前觸發** - section頂部上方150px開始觸發
- ✅ **頂部處理** - 滾動到頁面頂部（<100px）時移除所有高亮
- ✅ **精準匹配** - 根據section ID精確匹配導航連結

### 3. 雙重觸發
- ✅ **點擊觸發** - 點擊導航連結時立即高亮
- ✅ **滾動觸發** - 滾動到區塊時自動高亮

## 🔧 技術實現

### 核心邏輯

```javascript
function updateNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        // 檢查當前滾動位置
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            // 更新導航欄active狀態
            const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}
```

### 關鍵參數

| 參數 | 值 | 說明 |
|------|---|------|
| **偏移量** | -150px | section頂部上方150px開始觸發 |
| **頂部閾值** | 100px | 小於100px時移除所有高亮 |
| **事件** | scroll | 監聽window的滾動事件 |

### 工作流程

```
1. 用戶滾動頁面
   ↓
2. 觸發scroll事件
   ↓
3. 執行updateNavOnScroll()
   ↓
4. 遍歷所有section[id]
   ↓
5. 計算section位置和高度
   ↓
6. 判斷scrollY是否在範圍內
   ↓
7. 找到對應的導航連結
   ↓
8. 移除其他active，添加當前active
   ↓
9. 視覺更新完成 ✅
```

## 📐 觸發區域示意

```
頁面頂部 (0px)
├─ scrollY < 100px → 無高亮
│
Hero Section (#hero)
├─ offsetTop - 150px ← 開始觸發
├─ ... 區塊內容
└─ offsetTop + height ← 結束觸發
│
About Section (#about)
├─ offsetTop - 150px ← 開始觸發
├─ ... 區塊內容
└─ offsetTop + height ← 結束觸發
│
... 其他區塊
```

## 🎨 視覺效果

### 導航欄狀態

**未選中**：
```css
.nav-links a {
    color: rgba(255, 255, 255, 0.8);
}
```

**選中（active）**：
```css
.nav-links a.active::after {
    width: 100%;
    left: 0;
    background: var(--gold-500);
}
```

## 📋 對應的Section ID

| 導航連結 | Section ID | 說明 |
|---------|-----------|------|
| 劇情 | #about | 故事章節區 |
| 原聲帶 | #soundtrack | 原聲帶區 |
| 團隊 | #team | 主創團隊區 |
| 演員 | #cast | 卡司展示區 |
| 互動 | #game | 互動遊戲區 |
| 周邊 | #merch | 周邊商品區 |
| 購票 | #tickets | 購票資訊區（在footer內） |

## 🔍 調試要點

### 確認Section有ID
```html
<!-- ✅ 正確：有id屬性 -->
<section id="about" class="container">

<!-- ❌ 錯誤：沒有id -->
<section class="container">
```

### 確認導航連結正確
```html
<!-- ✅ 正確：href對應section id -->
<a href="#about">劇情</a>

<!-- ❌ 錯誤：href不存在 -->
<a href="#story">劇情</a>
```

### 檢查控制台
```javascript
// 調試用：查看當前活動區塊
window.addEventListener('scroll', () => {
    console.log('Current scrollY:', window.scrollY);
});
```

## ⚙️ 自定義設置

### 調整觸發偏移量
```javascript
const sectionTop = section.offsetTop - 150; // 改為其他值
```

**建議值**：
- **150px** - 默認，適合大部分情況
- **200px** - 提前更多，適合固定導航欄較高的情況
- **100px** - 延遲觸發，適合精確定位

### 調整頂部閾值
```javascript
if (scrollY < 100) { // 改為其他值
```

**建議值**：
- **100px** - 默認
- **50px** - 更快移除高亮
- **0px** - 只在完全頂部移除

## 🧪 測試場景

### 桌面端
- [ ] 向下滾動，觀察導航欄高亮變化
- [ ] 快速滾動，確認高亮正確跟隨
- [ ] 滾動到頂部，確認高亮移除
- [ ] 點擊導航連結，確認跳轉後高亮正確

### 移動端
- [ ] 滑動滾動，觀察高亮變化
- [ ] 打開hamburger菜單，點擊連結
- [ ] 確認菜單關閉後高亮正確

### 邊界情況
- [ ] 頁面剛載入時的狀態
- [ ] 在兩個section交界處滾動
- [ ] 非常快速滾動
- [ ] 使用鍵盤Page Up/Down滾動

## 💡 優化建議

### 性能優化（可選）
如果section很多，可以添加節流（throttle）：

```javascript
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateNavOnScroll, 50);
});
```

### 平滑滾動
確保CSS中有：
```css
html {
    scroll-behavior: smooth;
}
```

## 🐛 常見問題

### Q: 導航欄不會自動更新？
**A**: 檢查：
1. Section是否有`id`屬性
2. 導航連結的`href`是否匹配section的`id`
3. 打開控制台查看是否有JavaScript錯誤

### Q: 更新太慢或太快？
**A**: 調整`offsetTop - 150`中的`150`值

### Q: 頂部時不應該移除高亮？
**A**: 刪除或註釋這段代碼：
```javascript
if (scrollY < 100) {
    promoLinks.forEach(link => link.classList.remove('active'));
}
```

### Q: 想要默認高亮第一個？
**A**: 修改頂部邏輯：
```javascript
if (scrollY < 100) {
    promoLinks.forEach(link => link.classList.remove('active'));
    promoLinks[0].classList.add('active'); // 高亮第一個
}
```

## 📊 效果對比

### 修復前
- ❌ 點擊導航才會高亮
- ❌ 滾動時導航狀態不變
- ❌ 用戶不知道當前在哪個區塊

### 修復後
- ✅ 滾動自動更新高亮
- ✅ 導航狀態與頁面同步
- ✅ 用戶清楚知道當前位置

---

**修改文件**：`js/script.js`  
**添加功能**：滾動自動高亮  
**修復日期**：2026-02-10  
**狀態**：✅ 已完成
