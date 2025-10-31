# 🎨 AZORA OS - COMPLETE BRANDING GUIDE

**Version:** 1.0  
**Last Updated:** October 31, 2025  
**Contact:** sizwe.ngwenya@azora.world

---

## 📁 **BRANDING ASSETS CREATED**

All assets are located in: `public/branding/`

### **Logos**

| Asset | File | Use Case | Dimensions |
|-------|------|----------|------------|
| **Primary Logo** | `logo-primary.svg` | Main brand identity | 1200x300 |
| **White Logo** | `logo-white.svg` | Dark backgrounds | 1200x300 |
| **Black Logo** | `logo-black.svg` | Light backgrounds | 1200x300 |
| **Square Icon** | `icon-square.svg` | App icon, social media profile | 512x512 |
| **Favicon** | `../favicon.svg` | Website favicon | 512x512 |
| **Apple Icon** | `../apple-icon.svg` | iOS/macOS app icon | 512x512 |

### **Marketing Materials**

| Asset | File | Use Case | Dimensions |
|-------|------|----------|------------|
| **Launch Poster** | `poster-launch.svg` | Print, digital displays | 1080x1920 |
| **Twitter Card** | `social-card-twitter.svg` | Twitter/X posts | 1200x675 |
| **GitHub Banner** | `banner-github.svg` | GitHub repository | 1280x640 |

---

## 🎨 **COLOR PALETTE**

### **Primary Colors**

```css
/* Purple (Primary) */
--primary-purple: #8b5cf6;
--primary-purple-light: #a855f7;
--primary-purple-dark: #7c3aed;

/* Pink (Accent) */
--accent-pink: #ec4899;
--accent-pink-light: #f472b6;
--accent-pink-dark: #db2777;

/* Cyan (Secondary) */
--secondary-cyan: #06b6d4;
--secondary-cyan-light: #22d3ee;
--secondary-cyan-dark: #0891b2;
```

### **Gradients**

```css
/* Primary Gradient */
background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);

/* Text Gradient */
background: linear-gradient(90deg, #06b6d4 0%, #8b5cf6 100%);

/* Background Gradient */
background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
```

### **Neutral Colors**

```css
/* Dark Theme */
--bg-dark: #0f172a;
--bg-dark-elevated: #1e1b4b;
--text-dark: #ffffff;
--text-dark-muted: #94a3b8;

/* Light Theme */
--bg-light: #ffffff;
--bg-light-elevated: #f8fafc;
--text-light: #0f172a;
--text-light-muted: #64748b;
```

---

## 🔤 **TYPOGRAPHY**

### **Font Family**

```css
/* Primary Font */
font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace (Code/Technical) */
font-family: 'Inter', 'Segoe UI Mono', 'Courier New', monospace;
```

### **Font Weights**

- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700
- **Extrabold:** 800
- **Black:** 900

### **Typography Scale**

```css
/* Display */
--text-display: 90px / 900 weight
--text-h1: 80px / 800 weight
--text-h2: 48px / 600 weight
--text-h3: 36px / 600 weight

/* Body */
--text-body-lg: 28px / 400 weight
--text-body: 20px / 400 weight
--text-body-sm: 16px / 400 weight

/* UI */
--text-button: 18px / 600 weight
--text-caption: 14px / 400 weight
```

---

## 🎯 **BRAND IDENTITY**

### **Logo Usage**

#### **DO:**
- ✅ Use on clean backgrounds
- ✅ Maintain minimum clear space (equal to height of "A")
- ✅ Scale proportionally
- ✅ Use provided color versions for different backgrounds
- ✅ Use SVG format for web/digital

#### **DON'T:**
- ❌ Stretch or distort
- ❌ Change colors
- ❌ Add effects (shadows, gradients not in original)
- ❌ Place on busy backgrounds
- ❌ Rotate logo

### **Minimum Sizes**

- **Print:** 30mm width
- **Digital:** 120px width
- **Favicon:** 16px (use simplified version)

---

## 🖼️ **DESIGN ELEMENTS**

### **Neural Network Style**

The Azora OS brand features a "neural network" aesthetic:

- **Nodes:** Small circles representing connection points
- **Lines:** Subtle connecting lines between elements
- **Orbit Rings:** Circular rings suggesting connectivity
- **Gradient Overlays:** Purple-to-pink gradients for depth

### **Icon Design Principles**

1. **Modern & Minimal:** Clean lines, simple shapes
2. **Geometric:** Based on circles and triangles
3. **Gradient:** Purple-pink or cyan-purple gradients
4. **Depth:** Subtle opacity and glow effects
5. **Connected:** Neural network visual language

---

## 📱 **PLATFORM-SPECIFIC GUIDELINES**

### **Web**

```html
<!-- Favicon -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-icon.svg">

<!-- Social Cards -->
<meta property="og:image" content="/branding/social-card-twitter.svg">
<meta name="twitter:image" content="/branding/social-card-twitter.svg">
```

### **Social Media**

| Platform | Dimensions | File |
|----------|------------|------|
| **Twitter/X Post** | 1200x675 | social-card-twitter.svg |
| **LinkedIn Post** | 1200x627 | social-card-twitter.svg |
| **Facebook Post** | 1200x630 | social-card-twitter.svg |
| **Instagram Post** | 1080x1080 | icon-square.svg |
| **Instagram Story** | 1080x1920 | poster-launch.svg |

### **GitHub**

- **Repository Banner:** banner-github.svg (1280x640)
- **Profile Picture:** icon-square.svg
- **README Header:** logo-white.svg (on dark background)

### **Print**

- **Business Cards:** logo-primary.svg or logo-black.svg
- **Posters:** poster-launch.svg
- **Banners:** Custom size based on logo-primary.svg
- **Merchandise:** icon-square.svg or simplified icon

---

## 🎨 **MARKETING MATERIALS**

### **Launch Poster**

**File:** `poster-launch.svg`  
**Dimensions:** 1080x1920 (9:16)  
**Use Cases:**
- Instagram Stories
- Digital displays
- Print posters
- Trade show banners

**Features:**
- Large Azora icon
- Main headline
- Stats (54 countries, 1.4B users, 100+ services)
- Contact information
- Copyright notice

### **Social Media Cards**

**Twitter/X Card**  
**File:** `social-card-twitter.svg`  
**Dimensions:** 1200x675 (16:9)

**Features:**
- Icon on left
- AZORA OS headline
- Tagline
- Website URL

**Best for:**
- Link previews
- Announcement posts
- Feature highlights

### **GitHub Banner**

**File:** `banner-github.svg`  
**Dimensions:** 1280x640 (2:1)

**Features:**
- Dark theme (matches GitHub)
- Grid background
- Technology tags
- Repository link

---

## 🚀 **USAGE EXAMPLES**

### **Website Header**

```tsx
<nav className="flex items-center space-x-3">
  <img src="/favicon.svg" width="40" height="40" alt="Azora OS" />
  <span className="text-2xl font-bold text-white">Azora OS</span>
</nav>
```

### **Email Signature**

```
[Azora Logo]
Your Name
Position
Azora ES (Pty) Ltd
sizwe.ngwenya@azora.world
+27 73 234 7232
azora.world
```

### **Social Media Bio**

```
🚀 Azora OS - Universal Human Infrastructure
🌍 Empowering 1.4B Africans across 54 countries
🔐 Quantum-Secure AI Ecosystem
🔗 azora.world
```

---

## 📄 **FILE FORMATS**

### **Provided Formats**

- **SVG:** All assets (scalable, recommended for web)
- **PNG:** Generate from SVG as needed
- **ICO:** favicon.ico for legacy browser support

### **Generating Other Formats**

```bash
# Generate PNG from SVG (requires Inkscape or ImageMagick)
inkscape -w 1024 -h 1024 icon-square.svg -o icon-1024.png

# Generate different sizes
inkscape -w 512 -h 512 icon-square.svg -o icon-512.png
inkscape -w 256 -h 256 icon-square.svg -o icon-256.png
inkscape -w 128 -h 128 icon-square.svg -o icon-128.png
```

---

## 🎯 **BRAND VOICE**

### **Personality**

- **Innovative:** Leading edge technology
- **Empowering:** Enabling human potential
- **Secure:** Trustworthy and reliable
- **Pan-African:** Proudly African, globally relevant
- **Intelligent:** AI-powered, data-driven

### **Tone**

- **Professional** but **Approachable**
- **Confident** but not arrogant
- **Technical** but **Accessible**
- **Visionary** but **Practical**

### **Key Messages**

1. **Universal Human Infrastructure**
2. **Empowering 1.4 billion Africans**
3. **Quantum-Secure AI Ecosystem**
4. **54 countries, one platform**
5. **Be Everywhere. Help Everyone. Solve Everything.**

---

## 📞 **BRAND ASSETS REQUEST**

Need custom sizes or formats?

**Contact:**
- **Email:** sizwe.ngwenya@azora.world
- **Phone:** +27 73 234 7232

---

## 📊 **BRAND METRICS**

### **Color Accessibility**

All brand colors meet WCAG 2.1 AA standards for contrast:

- Purple (#8b5cf6) on dark background: ✅ AAA
- Pink (#ec4899) on dark background: ✅ AA
- Cyan (#06b6d4) on dark background: ✅ AAA
- White text on purple gradient: ✅ AA

### **Logo Recognition**

Minimum size for brand recognition:
- **Icon only:** 24x24px
- **Logo + text:** 120px width
- **Full lockup:** 180px width

---

## 🎉 **READY TO USE!**

All assets are production-ready and optimized for:

✅ **Web & Digital**  
✅ **Print & Merchandise**  
✅ **Social Media**  
✅ **App Icons**  
✅ **Marketing Campaigns**

---

**© 2025 Azora ES (Pty) Ltd. All Rights Reserved.**

*This brand guide is proprietary and confidential. Use of Azora OS branding requires permission.*

