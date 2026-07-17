# ModernBooks — Online Bookstore Platform

A fully responsive, framework-free online bookstore built with **semantic HTML5, CSS3 and JavaScript** for the Frontend Web Development Competition 2026.

**Live demo:** `https://modernbooks.vercel.app` (placeholder — update after deployment)
**Documentation page:** [`about-project.html`](./about-project.html)

---

## ✨ Features

- **Glassmorphism UI** — frosted-glass navigation, cards, and drawers with a custom "Night Reading Room" dark theme and a matching light theme, toggled instantly with no page reload.
- **Responsive layout** — fluid from 1440px desktops down to 320px phones, with a dedicated `responsive.css` breakpoint map.
- **Auto-sliding hero carousel** — pure JS, with arrows, dots, and pause-safe autoplay.
- **Live catalogue filtering** — search, category chips, price range slider, and minimum-rating filter all recompute the grid instantly via `Array.filter`/`sort`.
- **Cart & wishlist tray** — persists to `localStorage`, with quantity steppers, live subtotal/discount/total, and a checkout flow.
- **Toast notification system** — contextual success/info/error toasts for every cart, wishlist, filter, and form action.
- **Scroll-to-top control**, sticky glass navigation, and a responsive hamburger menu for mobile.

---

## 📁 Folder Structure

```
Project/
│── index.html            # Main bookstore application
│── about-project.html    # Mandatory documentation page
│── css/
│      style.css          # Design tokens + all component styles
│      responsive.css     # Breakpoint media queries
│── js/
│      script.js          # Application state, rendering, and interactions
│── images/                # Static image assets (screenshots, etc.)
│── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox, `backdrop-filter`) |
| Behaviour | JavaScript (ES6+, no frameworks) |
| Fonts | Google Fonts — Fraunces, Inter, Space Mono |
| Icons | Font Awesome 6 |
| Hosting | Vercel (static) |

No React, Vue, Bootstrap, Tailwind, or jQuery is used anywhere in this project.

---

## ▶️ Running Locally

This is a static site — no build step or dependencies required.

1. Clone or download the `Project/` folder.
2. Open `index.html` directly in a browser, **or** serve it locally for the best experience:
   ```bash
   npx serve .
   # or
   python3 -m http.server 5500
   ```
3. Visit the printed local URL in your browser.

---

## 🚀 Deploying to Vercel

1. Push this folder to a GitHub repository.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Other** (static site) — no build command required.
4. Output directory: `/` (project root).
5. Deploy — Vercel will serve `index.html` at the root automatically.

---

## 👥 Team

| Name | Roll No | Department | Year |
|---|---|---|---|
| C H Supriya | 1SP23AI015 | AI & ML | 4th Year |
| Sneha S H | *[Insert Roll No]* | AI & ML | 4th Year |

Full contribution breakdown, challenges faced, and technical learning outcomes are documented on the [Documentation page](./about-project.html).

---

## 📄 License

Built for academic/competition submission purposes.
