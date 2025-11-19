# Beacon of New Beginnings - Website

Official website for Beacon of New Beginnings NGO, providing safety, healing, and empowerment to survivors of abuse and homelessness in Ghana.

## 🌐 Live Site

**https://beaconnewbeginnings.org**

Deployed on Netlify

## 📋 Repository Contents

This repository contains **only the website code**, separated from the mobile app for cleaner deployment.

### Website Files

- `index.html` - Main landing page (38KB, full-featured)
- `privacy-policy.html` - Privacy policy
- `terms-of-service.html` - Terms of service
- `child-safety-standards.html` - Child safety standards
- `netlify.toml` - Netlify deployment configuration
- `_redirects` - Netlify redirect rules
- `CNAME` - Custom domain configuration (beaconnewbeginnings.org)

### Directories

- `images/` - Website images and graphics
- `assets/` - Logo and other assets
- `docs/` - Documentation website
- `website/` - Alternative static website version
- `safehaven-website/` - SafeHaven branded version
- `account/` - Account deletion pages
- `privacy/` - Privacy-related pages
- `.github/workflows/` - GitHub Pages deployment workflow

## 🚀 Deployment

### Netlify (Primary)

The website is configured for automatic deployment on Netlify:

- **Domain**: beaconnewbeginnings.org
- **Build Command**: `echo 'No build required - static site'`
- **Publish Directory**: `.` (root)
- **Branch**: `main`

Push to `main` branch to trigger automatic deployment.

### GitHub Pages (Backup)

The site also deploys to GitHub Pages via GitHub Actions workflow (`.github/workflows/deploy.yml`).

## 🔧 Local Development

### Quick Start

Simply open `index.html` in a web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

### Testing Locally

Test all pages:
- Homepage: `/index.html`
- Privacy: `/privacy-policy.html`
- Terms: `/terms-of-service.html`
- Child Safety: `/child-safety-standards.html`

Test redirects (work on Netlify only):
- `/privacy` → `/privacy-policy.html`
- `/terms` → `/terms-of-service.html`
- `/support` → `/#contact`

## 📱 Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Trauma-informed design with calming colors
- ✅ Emergency contact information prominently displayed
- ✅ Donation integration
- ✅ Resource directory
- ✅ Service information
- ✅ Privacy-focused
- ✅ Fast loading (static HTML)
- ✅ SEO optimized

## 🔗 Related Repository

- **Mobile App**: [beacon-app](https://github.com/uniqename/beacon-app) - Flutter app for iOS and Android

## 🛠️ Netlify Configuration

The `netlify.toml` file configures:

```toml
[build]
  publish = "."
  command = "echo 'No build required - static site'"

[[redirects]]
  from = "/privacy-policy"
  to = "/privacy-policy.html"
  status = 200

# ... more redirects
```

## 📞 Emergency Contacts (Ghana)

- **Emergency Hotline**: 999
- **Domestic Violence Hotline**: 0800-800-800 (24/7)
- **Beacon of New Beginnings**: Contact via website

## 🤝 Mission

To provide safety, healing, and empowerment to survivors of abuse and homelessness through comprehensive shelter services, professional counseling, legal advocacy, and sustainable livelihood programs that restore dignity and independence.

## 📄 License

MIT License - See original repository for full details

## 🔒 Privacy & Security

- All forms use HTTPS
- Privacy policy prominently linked
- Account deletion process available at `/account/delete.html`
- Data deletion requests at `/privacy/delete-data.html`

## 📧 Support

For website issues or content updates, visit [beaconnewbeginnings.org](https://beaconnewbeginnings.org)

---

**"Your safety matters. Your story matters. You matter."**

*For immediate help: Call 999 (Emergency) or 0800-800-800 (Domestic Violence Hotline)*
