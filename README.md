# Elliza Portfolio

Static portfolio site for Elliza. No build step: open `index.html` or deploy the folder as-is to Netlify, Vercel, or GitHub Pages.

## Structure

```
index.html                     Page markup
assets/css/styles.css          All styles
assets/js/main.js              Interactions, portfolio grid, modal
assets/images/                 Local images (portrait)
```

## Updating portfolio items

Portfolio media links live near the top of `assets/js/main.js`:

- `graphicsImages`, `websiteImages`, `funnelImages`, `automationImages`, `socialImages`: image URLs, one per card
- `reelVideoLinks`: MP4 URLs for the Reels tab
- `websiteLiveLinks`, `funnelLiveLinks`: live URLs, matched by position to the preview images
