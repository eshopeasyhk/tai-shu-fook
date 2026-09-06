# 泰舒服 Tai Shu Fook｜元朗按摩

元朗西裕街金福閣中泰按摩店形象網站：精選套票、明碼價錢牌、技師介紹、WhatsApp 預約。

## 本機預覽

```bash
cd tai-shu-fook
python3 -m http.server 8767
```

瀏覽器開啟：<http://127.0.0.1:8767/>

> 請用本機 HTTP 伺服器開啟，勿直接用 `file://`，否則 `fetch('data/site.json')` 可能被瀏覽器封鎖。

## 聯絡

- 店舖：泰舒服
- 地址：元朗西裕街 5-11 號金福閣地下 2 號舖
- 電話／WhatsApp：5105 7090（85251057090）
- 營業時間：每日 11:00–00:30
- Google 地圖：https://maps.app.goo.gl/AGKSUeXps7ZLtECc6

## 自訂內容

編輯 **`data/site.json`**（品牌、套票、價錢牌、技師、WhatsApp）。`js/content.js` 動態填入；樣式 `css/site.css` + `css/dark-overrides.css`。

## GitHub Pages

已附 `.nojekyll`。啟用後網址：

`https://eshopeasyhk.github.io/tai-shu-fook/`
