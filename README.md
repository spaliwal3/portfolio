# Samarth P - Portfolio Website

A modern, content-driven portfolio website built with pure HTML, CSS, and JavaScript.

## Features

- 🏠 **Home** - Landing page with quick navigation
- 💼 **Projects** - Portfolio with tag filtering
- 📄 **Resume** - Structured resume with PDF download
- 📷 **Photography** - Masonry gallery with lightbox
- ✍️ **Blog** - Markdown-based blog posts
- 🎬 **Movies** - Letterboxd integration + reviews

## Quick Start

```bash
# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

## Updating Content

All content is in JSON files in the `content/` folder:

| File | Purpose |
|------|---------|
| `projects.json` | Your projects/portfolio |
| `resume.json` | Experience, education, skills |
| `photos.json` | Photography gallery |
| `posts.json` | Blog posts |
| `movies.json` | Custom movie reviews |

## Deployment

This is a static site - deploy anywhere:
- **GitHub Pages**: Push to GitHub, enable Pages in settings
- **Netlify**: Drag and drop to netlify.com/drop
- **Any host**: Upload all files via FTP/SFTP

## Tech Stack

- Vanilla HTML, CSS, JavaScript
- No build step required
- CSS custom properties for theming
- Hash-based SPA routing
- Letterboxd RSS integration
