# 🎓 DANETUDES - Français pour Expatriés

> Programme d'apprentissage du français pour faciliter l'intégration sociale et professionnelle des expatriés et de leurs familles à Abidjan, Côte d'Ivoire.

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://danetudes.ci)
[![License](https://img.shields.io/badge/License-Proprietary-blue?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/Version-3.1.0-brightgreen?style=flat-square)](package.json)

---

## 🌟 Features

- ✅ **100% Static Site** - HTML, CSS, JavaScript (no backend needed)
- ✅ **Mobile Responsive** - Optimized for all devices
- ✅ **Fast Performance** - Deployed on Vercel CDN
- ✅ **Multi-language** - French & English support (i18n)
- ✅ **SEO Optimized** - Meta tags, structured data, sitemaps
- ✅ **Contact Forms** - Client-side validation
- ✅ **Accessibility** - WCAG compliant

---

## 📂 Project Structure

```
DANETUDES/
├── index.html              # Homepage
├── contact.html            # Contact page
├── services.html           # Services/Courses page
├── offres.html             # Offers page
├── about.html              # About page
├── assets/
│   ├── css/                # Stylesheets
│   │   ├── style.css       # Main styles
│   │   ├── animations.css  # Animations
│   │   ├── testimonials.css
│   │   ├── planning.css
│   │   ├── parcours.css
│   │   └── resources.css
│   ├── js/                 # JavaScript
│   │   ├── main.js         # Main script
│   │   ├── i18n.js         # Internationalization
│   │   ├── contact.js      # Contact form
│   │   ├── planning.js     # Planning features
│   │   ├── quiz.js         # Quiz functionality
│   │   ├── performance.js  # Performance monitoring
│   │   ├── logger.js       # Logging utility
│   │   ├── translations.js # Translation strings
│   │   └── clapay-once.js  # Payment integration
│   └── images/             # Optimized images
├── robots.txt              # SEO robots config
├── sitemap.xml             # Site map for SEO
├── vercel.json             # Vercel deployment config
├── _redirects              # Redirect rules
├── .env.example            # Environment template
├── package.json            # Project metadata
└── VERCEL_DEPLOYMENT.md    # Deployment guide
```

---

## 🚀 Quick Start

### Option 1: Deploy to Vercel (Recommended)

1. **Fork the repository**
   ```bash
   # Visit: https://github.com/artisanci917-create/danetudes/fork
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your forked repository
   - Click "Deploy"

3. **Done!** Your site is live 🎉

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions.

### Option 2: Local Development

1. **Clone repository**
   ```bash
   git clone https://github.com/artisanci917-create/danetudes.git
   cd danetudes
   ```

2. **Open in browser**
   - Drag `index.html` into your browser, OR
   - Use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```

3. **View at**
   ```
   http://localhost:8000
   ```

---

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your settings (optional for static site):

```env
NODE_ENV=production
SITE_URL=https://danetudes.ci
DEFAULT_LANGUAGE=fr
```

### Customization

**Logo & Images**
- Replace images in `assets/images/`
- Update paths if filename changes

**Colors & Fonts**
- Edit CSS variables in `assets/css/style.css`:
  ```css
  :root {
    --blue1: #0066cc;
    --orange: #FF6B00;
    /* ... more variables */
  }
  ```

**Translations**
- Edit `assets/js/translations.js`
- Add new languages in `languages` object
- Update `DEFAULT_LANGUAGE` in `.env`

**Content**
- Edit HTML files directly
- Update text, images, links as needed
- All pages are self-contained

---

## 📱 Mobile Optimization

The site is fully responsive:
- ✅ Mobile-first CSS approach
- ✅ Flexible grid layout
- ✅ Touch-friendly buttons (44px minimum)
- ✅ Fast load times
- ✅ Optimized images

Test on mobile:
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Test on various screen sizes

---

## ⚡ Performance

### Optimization Features
- Static site (no database)
- CSS/JS minification
- Image optimization (WebP)
- Gzip compression
- Browser caching headers
- CDN delivery via Vercel

### Performance Targets
- **Load Time**: < 2 seconds
- **Lighthouse**: > 90/100
- **Mobile Score**: > 90/100
- **Uptime**: 99.95%

---

## 🔒 Security

### Protected Files
- `.env` - Environment variables (not in version control)
- `package.json` - Dependency config
- `.git` - Repository metadata
- `node_modules` - Dependencies

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

Configured in `vercel.json`

---

## 🌐 Internationalization (i18n)

Supports multiple languages via `assets/js/i18n.js`:

```javascript
// Usage in HTML
<a href="#" data-i18n="nav.home">Home</a>

// Language switching
document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);
```

**Supported Languages**
- 🇫🇷 Français (fr)
- 🇬🇧 English (en)

To add more languages:
1. Add translations in `assets/js/translations.js`
2. Add to `LANGUAGES` in `.env`

---

## 📊 Analytics & Monitoring

### Vercel Analytics
- View at: https://vercel.com/dashboard
- Monitor deployments
- Track performance metrics
- View error logs

### Google Analytics (Optional)
Add to `<head>` in HTML files:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## 🧪 Testing

### Manual Testing
- [ ] All pages load correctly
- [ ] Links work (internal & external)
- [ ] Forms validate
- [ ] Images display
- [ ] Mobile responsive
- [ ] Cross-browser compatible

### Automated Testing
Run before deployment:
```bash
# Check file structure
npm test
```

### Browser Support
- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

---

## 🚀 Deployment Platforms

### Recommended: Vercel
- ⭐⭐⭐⭐⭐ Best performance
- Automatic HTTPS
- Global CDN
- Free tier available

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

### Also Supported
- **Netlify**: Similar to Vercel
- **GitHub Pages**: Free, but slower
- **Render**: Good CDN performance
- **Traditional Hosting**: Via FTP/SSH

---

## 📋 Checklist Before Deployment

- [ ] All pages tested locally
- [ ] Mobile responsiveness verified
- [ ] All links working
- [ ] Images optimized
- [ ] SEO tags in place
- [ ] Environment variables configured
- [ ] `.env` file not committed
- [ ] `vercel.json` present
- [ ] `_redirects` configured

---

## 🐛 Troubleshooting

### Page Not Found
- Check `.html` filename
- Verify `_redirects` routing rules
- Clear browser cache

### Images Not Showing
- Verify image paths start with `/`
- Check file extensions (jpg, png, webp)
- Use absolute paths

### Styles Not Loading
- Clear cache (Ctrl+Shift+Delete)
- Check CSS file paths
- Verify no typos in file names

### Mobile Menu Not Working
- Check `main.js` hamburger menu
- Verify CSS media queries
- Test in browser DevTools

### Deploy Fails
- Check `vercel.json` syntax
- Ensure all HTML files exist
- Verify `.gitignore` doesn't exclude needed files

---

## 📝 Git Workflow

### Push Changes
```bash
git add .
git commit -m "feat: update content"
git push origin main
```

### Auto-Deploy
- Push to `main` → Vercel deploys automatically
- Preview deployments for pull requests
- Rollback to previous version anytime

---

## 📞 Support & Contact

- **Website**: https://danetudes.ci
- **WhatsApp**: https://wa.me/22589767600
- **Email**: contact@danetudes.ci
- **GitHub Issues**: https://github.com/artisanci917-create/danetudes/issues

---

## 📄 License

This project is **PROPRIETARY**. Unauthorized copying or distribution is prohibited.

© 2024-2026 DANETUDES. All rights reserved.

---

## 🙏 Credits

- **Design & Development**: DANETUDES Team
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Icons & Fonts**: Google Fonts

---

## 🎯 Future Roadmap

- [ ] Backend for dynamic content (optional)
- [ ] Blog section
- [ ] Student portal
- [ ] Payment integration (enhanced)
- [ ] Admin dashboard (optional)
- [ ] Email notifications

---

**Happy coding! 🚀 Deploy with confidence on Vercel!**

For updates and support, check the [GitHub repository](https://github.com/artisanci917-create/danetudes).
