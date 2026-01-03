# 🚀 Quick Setup Guide

## Installation (Super Simple!)

### Option 1: Direct Open (Fastest)
1. **Download/Clone** this project
2. **Double-click** `index.html`
3. **Done!** The demo runs in your browser

### Option 2: Local Server (Recommended)
```bash
# If you have Python installed:
python -m http.server 8000

# Or with Node.js:
npx serve

# Or with PHP:
php -S localhost:8000
```
Then open: `http://localhost:8000`

---

## 📁 Folder Structure

```
your-project/
│
├── index.html          ← Main demo page
├── style.css           ← All styling
├── app.js              ← Functionality
├── README.md           ← Documentation
├── ASSETS_GUIDE.md     ← Image guidelines
├── SETUP.md            ← This file
│
└── assets/             ← (Create this folder)
    ├── t1.png         ← Template 1 image
    ├── t2.png         ← Template 2 image
    ├── t3.png         ← Template 3 image
    └── ad1.png        ← Final ad image
```

---

## 🎨 Adding Images (Optional)

1. **Create** `assets/` folder
2. **Add images**:
   - `t1.png` (400×400px)
   - `t2.png` (400×400px)
   - `t3.png` (400×400px)
   - `ad1.png` (600×600px)

**Note**: Demo works perfectly with SVG fallbacks if you don't add images!

---

## ✅ Browser Compatibility

### ✅ Fully Supported:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### ⚠️ Partial Support:
- Chrome 80-89 (some blur effects may not work)
- Firefox 75-87 (backdrop-filter may not work)

### ❌ Not Supported:
- Internet Explorer (use Edge instead)
- Very old mobile browsers

---

## 🧪 Testing Checklist

- [ ] Open `index.html` in browser
- [ ] Click/drag-drop file upload works
- [ ] All sections animate smoothly
- [ ] Template cards display correctly
- [ ] Compliance score animates
- [ ] Download buttons work
- [ ] Reset button reloads demo
- [ ] Responsive on mobile (test with DevTools)

---

## 🐛 Troubleshooting

### Images Not Loading?
- Check `assets/` folder exists
- Verify image filenames match exactly
- Check browser console for errors (F12)

### Animations Not Working?
- Make sure you're using a modern browser
- Check hardware acceleration is enabled
- Try different browser

### Drag-Drop Not Working?
- Use Chrome/Firefox (best support)
- Make sure you're dropping image files
- Check file size (max 10MB)

---

## 🎯 Demo Flow

1. **Upload Section**
   - Drag-drop or click to upload
   - Shows loading animation (2.5s)

2. **Analysis Section**
   - Displays AI insights
   - Shows retail data
   - Animates quality bars

3. **Templates Section**
   - Shows 3 recommended templates
   - Select any template

4. **Final Section**
   - Shows compliance score
   - Displays final ad
   - Export options

---

## 🎨 Customization

### Change Colors:
Edit `:root` variables in `style.css`:
```css
:root {
    --primary: #667eea;      /* Change primary color */
    --secondary: #764ba2;    /* Change secondary color */
    /* ... more variables ... */
}
```

### Change Content:
Edit text directly in `index.html`:
- Hero title
- Section descriptions
- Metric values
- Template names

### Change Animations:
Adjust timing in `app.js`:
```javascript
setTimeout(() => {
    showAnalysisSection();
}, 2500); // Change delay here
```

---

## 📱 Mobile Testing

### Chrome DevTools:
1. Press `F12`
2. Click device icon (Ctrl+Shift+M)
3. Select device (iPhone, iPad, etc.)
4. Test responsive behavior

### Recommended Test Devices:
- iPhone 12/13 Pro (390×844)
- iPad (768×1024)
- Samsung Galaxy S21 (360×800)

---

## 🚀 Performance Tips

### For Best Performance:
- Use WebP images (smaller files)
- Compress images (TinyPNG.com)
- Keep images under 500KB each
- Use modern browser

### FPS Issues?
- Close other browser tabs
- Enable hardware acceleration
- Update graphics drivers

---

## 📤 Deployment Options

### Option 1: GitHub Pages (Free)
1. Create GitHub repo
2. Push code
3. Enable Pages in Settings
4. Access at `username.github.io/repo-name`

### Option 2: Netlify (Free)
1. Drag folder to netlify.com/drop
2. Get instant URL
3. Done!

### Option 3: Vercel (Free)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

---

## 🔒 Security Notes

- No backend = No security concerns
- All processing happens client-side
- No data sent to servers
- Safe to use with real product images

---

## 📊 File Sizes

- `index.html`: ~30KB
- `style.css`: ~25KB
- `app.js`: ~12KB
- **Total**: ~67KB (super lightweight!)

---

## 💡 Pro Tips

1. **Test in multiple browsers** before presenting
2. **Prepare backup images** in assets folder
3. **Practice the demo flow** beforehand
4. **Have a sample product image ready** to upload
5. **Test on actual mobile device** if possible

---

## 🎓 Learning Resources

- HTML/CSS: [MDN Web Docs](https://developer.mozilla.org)
- JavaScript: [JavaScript.info](https://javascript.info)
- Design: [Dribbble](https://dribbble.com) for inspiration
- Icons: Using inline SVG (no dependencies)

---

## 🤝 Support

Having issues? Check:
1. Browser console (F12 → Console)
2. Network tab (F12 → Network)
3. ASSETS_GUIDE.md for image help
4. README.md for full documentation

---

## ✨ Features Checklist

- [x] Modern glassmorphism UI
- [x] Animated background
- [x] Drag & drop upload
- [x] AI analysis dashboard
- [x] Template recommendations
- [x] Compliance scoring
- [x] Multi-format export
- [x] Responsive design
- [x] Smooth animations
- [x] Toast notifications

---

**Ready to impress at the hackathon? Let's go! 🚀**

**Demo Time**: ~2 minutes for full flow
**Setup Time**: ~30 seconds
**Wow Factor**: 💯
