# I-Arts — Custom Portrait Portfolio

A responsive, single-page artist portfolio and custom portrait commission showcase built for **I-Arts (`@_i_arts_`)** by **Shanjay Nivass S**.

## Features

- **Glassmorphism UI & Responsive Layout**: Adaptive navigation bar with mobile menu toggle, scroll progress bar, and smooth section navigation.
- **Interactive Art Gallery**: Category filter tabs with dynamic artwork counts (`Pencil Art`, `Digital Art`, `Photo Recreations`, `Anime to Live-Action`).
- **Artwork Lightbox Modal**: Full-screen image preview with click-to-zoom, previous/next controls, touch swipe gestures, and keyboard navigation (`Escape`, `ArrowLeft`, `ArrowRight`).
- **Commission Planner**: Interactive configurator to choose portrait style, physical/digital format, and subject type, then pre-fill the contact form in one click.
- **Contact & Inquiry Workflow**: Formatted `mailto:` inquiry builder, one-click email copy with toast notifications, and direct Instagram DM links.
- **Accessibility & Performance**: Semantic HTML landmarks, skip-to-content link, `aria` attributes, lazy-loaded gallery images, and `prefers-reduced-motion` support.

## Tech Stack

- **HTML5** (`index.html`)
- **CSS3** (`page.css` — Flexbox, CSS Grid, Glassmorphism, Scroll Reveal)
- **Vanilla JavaScript** (`script.js` — IntersectionObserver, DOM filtering, Lightbox, Clipboard API)
- **Font Awesome 6** & **Google Fonts** (`Outfit`, `Playfair Display`)

## Project Structure

```text
single page/
├── index.html      # Main single-page application
├── page.css        # Styling, responsive rules, and animations
├── script.js       # Gallery filters, lightbox, planner, and scrollspy
├── README.md       # Project documentation
└── image/          # Artwork, icons, and illustration assets
```

## How to Run Locally

Open `index.html` directly in any modern browser, or serve the folder with a static server (e.g., VS Code Live Server or `python -m http.server`).

