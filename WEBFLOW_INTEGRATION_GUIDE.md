# Beacon of New Beginnings Webflow Integration Guide

## Current Setup
- **Website**: https://beaconnewbeginnings.org (deployed on Netlify)
- **GitHub Repo**: https://github.com/uniqename/beacon-of-new-beginnings.git
- **App Store**: Live on Apple App Store and Google Play Store
- **Mission**: Supporting survivors of abuse and homelessness in Ghana

## Webflow + Netlify Integration (Zero Downtime)

### Option 1: Webflow Export + Netlify Deploy (RECOMMENDED)

This approach keeps your current Netlify deployment and uses Webflow as a visual editor.

#### Step 1: Set Up Webflow Project
1. Go to [Webflow](https://webflow.com) and create a new account (or use existing)
2. Create a new site project: "Beacon of New Beginnings"
3. Choose "Blank Site" or "NGO/Nonprofit" template
4. Design your website in Webflow's visual editor

#### Step 2: Import Current Design to Webflow
1. Recreate your current website design in Webflow using the visual editor
2. Key pages to recreate:
   - Homepage with crisis hotline: +233 50 123 4567
   - Services page (AI-Powered Resource Matching, Shelter, Legal Aid, etc.)
   - Get Help page
   - Contact page
   - Privacy policy
   - Terms of service
   - Support resources

3. Key design elements:
   - Green (#10b981) and blue (#3b82f6) color scheme
   - Emergency contact prominently displayed
   - Anonymous support request form
   - Mobile-friendly navigation
   - Safety and privacy-focused design

#### Step 3: Export from Webflow
1. In Webflow, go to Project Settings > Publishing
2. Click "Export Code"
3. Download the ZIP file containing HTML, CSS, JS, and assets

#### Step 4: Deploy to Netlify (Maintain Current Setup)
1. Extract the Webflow export ZIP file
2. Copy the exported files to your local repository:
   ```bash
   cd "/Users/enamegyir/Documents/Projects/beacon-ngo-app 2"

   # Backup current files first
   mkdir backup-$(date +%Y%m%d)
   cp -r website/* backup-$(date +%Y%m%d)/

   # Copy Webflow export (adjust path to your download)
   cp -r ~/Downloads/beacon-webflow-export/* website/

   # Ensure critical files are preserved
   # Check if netlify.toml exists and preserve it
   if [ -f backup-*/netlify.toml ]; then
       cp backup-*/netlify.toml website/
   fi
   ```

3. Create netlify.toml if it doesn't exist:
   ```bash
   cat > website/netlify.toml << 'EOF'
# Netlify configuration for Beacon of New Beginnings
[build]
  publish = "website"
  command = ""

# Custom headers for security and performance
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'"

# Enable HTTPS redirects
[[redirects]]
  from = "http://beaconnewbeginnings.org/*"
  to = "https://beaconnewbeginnings.org/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://www.beaconnewbeginnings.org/*"
  to = "https://beaconnewbeginnings.org/:splat"
  status = 301
  force = true
EOF
   ```

4. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update website with Webflow design

   - Redesigned in Webflow visual editor for NGO/nonprofit
   - Exported and deployed to Netlify
   - Maintained all support and privacy pages
   - Enhanced safety and accessibility features

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"

   git push origin main
   ```

5. Netlify will automatically deploy the changes

#### Step 5: Configure Netlify Deployment
If this is your first Netlify deployment for Beacon:

1. Go to https://app.netlify.com
2. Click "Add new site" > "Import an existing project"
3. Choose GitHub and select: `uniqename/beacon-of-new-beginnings`
4. Build settings:
   - Base directory: (leave empty)
   - Build command: (leave empty)
   - Publish directory: `website`
5. Click "Deploy site"
6. After deployment, go to Site settings > Domain management
7. Add custom domain: `beaconnewbeginnings.org`
8. Configure DNS with your domain registrar

#### Step 6: Verify Deployment
1. Check Netlify dashboard: https://app.netlify.com
2. Verify the site is live at https://beaconnewbeginnings.org
3. Test all pages and crisis hotline links
4. Verify mobile app deep links still work
5. Test anonymous support form submission

### Option 2: Webflow Hosting with Custom Domain (Alternative)

If you prefer to host directly on Webflow:

1. **In Webflow**:
   - Publish your site to Webflow hosting
   - Go to Project Settings > Hosting
   - Add custom domain: `beaconnewbeginnings.org`

2. **Update DNS**:
   - In your domain registrar settings
   - Point `beaconnewbeginnings.org` A record to Webflow's IP
   - Point `www.beaconnewbeginnings.org` CNAME to `proxy-ssl.webflow.com`

3. **Considerations**:
   - Webflow hosting costs extra ($12-36/month depending on plan)
   - Webflow offers CMS features for content management
   - Updates must be made in Webflow instead of code

### Option 3: Webflow CMS for Content Management (Enhanced)

For NGOs needing content updates:

1. Use Webflow CMS to manage:
   - Service listings
   - Success stories (with privacy protection)
   - Resource pages
   - Event announcements
   - Crisis hotline updates

2. Create CMS collections:
   - Services (with status: Active/Coming Soon)
   - Resources
   - Team members
   - Testimonials (anonymous)

3. Export and deploy to Netlify as in Option 1

## Important Files to Preserve

Ensure these files are maintained in any Webflow integration:

```
netlify.toml          # Netlify configuration
_headers              # Security headers (critical for survivor safety)
_redirects            # URL redirects
privacy.html          # Required by Apple/Google
terms.html            # Required by Apple/Google
support.html          # Support resources
contact.html          # Crisis contacts
```

## App Store Requirements

Both Apple and Google require these specific pages for app approval:
- Privacy Policy: https://beaconnewbeginnings.org/privacy.html
- Terms of Service: https://beaconnewbeginnings.org/terms.html
- Support/Contact: https://beaconnewbeginnings.org/support.html

**DO NOT change these URLs** without updating the app stores first.

## Safety and Privacy Considerations

For NGO supporting abuse survivors:

1. **Anonymous Browsing**: Ensure forms don't require personal info
2. **Quick Exit Button**: Add prominent "Quick Exit" button that redirects to weather.com
3. **SSL Certificate**: Verify HTTPS is always enabled
4. **Form Privacy**: Ensure support request forms are encrypted
5. **Session Clearing**: Add warning about browser history
6. **Crisis Contacts**: Keep emergency numbers prominently displayed:
   - Crisis hotline: +233 50 123 4567
   - Emergency police: 191

## Webflow Design Best Practices for NGOs

1. **Accessibility**:
   - High contrast colors for readability
   - Large, easy-to-click buttons for crisis contacts
   - Clear navigation structure
   - Screen reader friendly

2. **Mobile-First Design**:
   - Many survivors access help via mobile
   - Ensure crisis hotline is clickable on mobile
   - Test forms on small screens

3. **Trust Signals**:
   - Display certifications and partnerships
   - Show success metrics (without compromising privacy)
   - Include testimonials (anonymous)

4. **Multilingual Support** (if applicable):
   - Consider adding local language options
   - Use Webflow's localization features

## Continuous Deployment Workflow

With Webflow + Netlify setup:

1. **Design Changes**: Make in Webflow visual editor
2. **Export**: Download code from Webflow
3. **Deploy**: Push to GitHub → Netlify auto-deploys
4. **Verify**: Check live site and test crisis hotline links

## Testing Checklist

After any Webflow integration:
- [ ] Homepage loads correctly
- [ ] Crisis hotline number is prominent and clickable
- [ ] All navigation links work
- [ ] Privacy policy accessible
- [ ] Terms of service accessible
- [ ] Support page accessible
- [ ] Anonymous support form works
- [ ] Mobile responsive design works
- [ ] Quick exit button functions (if implemented)
- [ ] Forms submit correctly
- [ ] SSL certificate valid (HTTPS)
- [ ] Page load speed acceptable
- [ ] All service pages display correctly
- [ ] Contact information accurate

## Rollback Plan

If issues arise:

```bash
cd "/Users/enamegyir/Documents/Projects/beacon-ngo-app 2"
git log --oneline  # Find previous commit
git revert HEAD    # Or git reset --hard <commit-hash>
git push origin main
```

Netlify will automatically deploy the previous version.

## Support Resources

- **Webflow University**: https://university.webflow.com
- **Webflow for Nonprofits**: https://webflow.com/nonprofit (potential discount)
- **Webflow Export Guide**: https://university.webflow.com/lesson/code-export
- **Netlify Docs**: https://docs.netlify.com
- **Accessibility Guide**: https://webflow.com/accessibility

## Cost Breakdown

- **Webflow**: $14-35/month (may qualify for nonprofit discount)
- **Netlify**: FREE (current setup, includes SSL and CDN)
- **Domain**: ~$12/year
- **GitHub**: FREE (current plan)

**Nonprofit Discount**: Webflow offers 50% off for qualifying nonprofits. Apply at https://webflow.com/nonprofit

## Next Steps

1. Apply for Webflow nonprofit discount (save 50%)
2. Create Webflow project for Beacon of New Beginnings
3. Use NGO/nonprofit template as starting point
4. Design with focus on safety and accessibility
5. Export code
6. Deploy to Netlify via GitHub
7. Test all crisis contact features
8. Monitor analytics for user safety

## Crisis Resources (Keep Updated)

Ensure these are always current on the website:
- **Crisis Hotline**: +233 50 123 4567
- **Emergency Police**: 191
- **DOVVSU (Domestic Violence & Victim Support Unit)**: Local contacts
- **Legal Aid**: Ghana Legal Aid contact info
- **Shelter Services**: Emergency accommodation info

---

**Created**: October 2025
**Website**: https://beaconnewbeginnings.org
**Mission**: Supporting survivors of abuse and homelessness in Ghana
**Priority**: Safety, Privacy, Accessibility
