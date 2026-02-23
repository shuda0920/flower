# 項目文件結構

## 📁 資料夾組織

```
flower/
├── index.html              # 主頁面
├── css/                    # 樣式表文件夾
│   ├── style.css          # 主樣式表
│   ├── soundtrack.css     # 原聲帶樣式
│   ├── team-carousel.css  # 團隊輪播樣式
│   ├── team-group-photo.css # 團隊合照樣式
│   ├── mobile-fixes.css   # 移動端修復
│   └── fluid-design-example.css # 流體設計範例
├── js/                     # JavaScript文件夾
│   ├── script.js          # 主腳本
│   ├── soundtrack.js      # 原聲帶功能
│   ├── team-carousel.js   # 團隊輪播功能
│   └── mobile-menu.js     # 移動端菜單
├── images/                 # 圖片資源夾
│   ├── hero-bg.jpg        # 首頁背景圖
│   └── marble-bg.png      # 大理石背景紋理
└── docs/                   # 文檔資料夾
    ├── FLUID-DESIGN-SUMMARY.md
    ├── MOBILE_FIXES_README.md
    ├── PARTICLES_RWD_README.md
    ├── SCROLL-CONTROL-GUIDE.md
    ├── SOUNDTRACK_README.md
    ├── TEAM_CAROUSEL_README.md
    ├── TEAM_GROUP_PHOTO_README.md
    └── WHY_EXTRA_FIXES_NEEDED.md
```

## 📂 資料夾說明

### `/css` - 樣式表
存放所有 CSS 樣式文件
- **style.css** (41KB) - 主樣式，包含全局樣式、導航、布局等
- **soundtrack.css** (8KB) - 原聲帶區塊的專屬樣式
- **team-carousel.css** (6KB) - 主創團隊輪播樣式
- **team-group-photo.css** (4KB) - 團隊合照特殊樣式
- **mobile-fixes.css** (6KB) - 移動端響應式修復
- **fluid-design-example.css** (2KB) - 流體設計範例

### `/js` - JavaScript
存放所有 JavaScript 腳本
- **script.js** (18KB) - 主腳本，包含 p5.js 動畫、GSAP 動畫等
- **soundtrack.js** (5KB) - 黑膠唱片播放器功能
- **team-carousel.js** (4KB) - 團隊成員輪播邏輯
- **mobile-menu.js** (4KB) - Hamburger 菜單交互

### `/images` - 圖片資源
存放所有圖片素材
- **hero-bg.jpg** (171KB) - 首頁主視覺背景
- **marble-bg.png** (833KB) - 大理石紋理背景

### `/docs` - 文檔
存放項目說明文檔
- **FLUID-DESIGN-SUMMARY.md** - 流體設計總結
- **MOBILE_FIXES_README.md** - 移動端修復說明
- **PARTICLES_RWD_README.md** - 粒子特效響應式說明
- **SCROLL-CONTROL-GUIDE.md** - 滾動控制指南
- **SOUNDTRACK_README.md** - 原聲帶功能說明
- **TEAM_CAROUSEL_README.md** - 團隊輪播說明
- **TEAM_GROUP_PHOTO_README.md** - 團隊合照功能說明
- **WHY_EXTRA_FIXES_NEEDED.md** - 為何需要額外修復的解釋

## 🔗 路徑引用

### HTML 中的引用已更新為：

**CSS 引用**：
```html
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/soundtrack.css">
<link rel="stylesheet" href="css/team-carousel.css">
<link rel="stylesheet" href="css/team-group-photo.css">
<link rel="stylesheet" href="css/mobile-fixes.css">
```

**JavaScript 引用**：
```html
<script src="js/script.js"></script>
<script src="js/soundtrack.js"></script>
<script src="js/team-carousel.js"></script>
<script src="js/mobile-menu.js"></script>
```

**圖片引用（如需使用）**：
```html
<img src="images/hero-bg.jpg" alt="背景圖">
<img src="images/marble-bg.png" alt="大理石紋理">
```

## 📊 文件統計

| 類型 | 數量 | 總大小 |
|------|------|--------|
| CSS | 6 | ~72 KB |
| JS | 4 | ~31 KB |
| 圖片 | 2 | ~1 MB |
| 文檔 | 8 | ~38 KB |
| HTML | 1 | ~27 KB |
| **總計** | **21** | **~1.17 MB** |

## ✨ 優點

### 1. 清晰的組織結構
- ✅ 文件按類型分類
- ✅ 易於查找和維護
- ✅ 符合標準項目結構

### 2. 模塊化管理
- ✅ CSS 模塊獨立
- ✅ JS 功能分離
- ✅ 文檔集中管理

### 3. 易於擴展
- ✅ 添加新樣式到 css/
- ✅ 添加新腳本到 js/
- ✅ 添加新圖片到 images/

### 4. 團隊協作友好
- ✅ 職責分明
- ✅ 減少衝突
- ✅ 便於版本控制

## 🚀 使用建議

### 添加新文件時：
1. **CSS** → 放入 `css/` 並在 HTML 中引用
2. **JavaScript** → 放入 `js/` 並在 HTML 底部引用
3. **圖片** → 放入 `images/` 並使用相對路徑
4. **文檔** → 放入 `docs/` 便於查閱

### 最佳實踐：
- 保持文件名小寫，使用連字符分隔
- CSS 按功能模塊命名（如 `feature-name.css`）
- JS 按功能命名（如 `feature-name.js`）
- 圖片使用描述性名稱（如 `hero-image.jpg`）

## 📝 注意事項

1. **路徑問題**：所有引用已更新為相對路徑
2. **備份**：建議定期備份整個項目
3. **版本控制**：考慮使用 Git 進行版本管理

---

**整理日期**：2026-02-09  
**項目名稱**：如果青春會開花 - 原創音樂劇網站
