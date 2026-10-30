# Medora medical equipment storefront

A responsive demonstration store built in HTML5, CSS, Bootstrap 5, and modular JavaScript. Vite provides local development and static production builds.

## Run locally

```powershell
npm install
npm run dev
```

Open the Local URL printed by Vite (normally http://127.0.0.1:5173).

```powershell
npm run build
npm run preview
```

The production output is `dist/`. It can be hosted by any static web server. All product images and icons are bundled; Google Fonts are optional and have system fallbacks.

## Included interactions

- Twelve products across eight equipment categories, in INR.
- Product and brand search; combined category and price filters; price, popularity, and rating sorting.
- Product quick views, quantity selection, stock limits, and unavailable stock handling.
- Persistent cart and wishlist using versioned localStorage keys, with safe recovery from invalid saved data.
- Automatic subtotal, inclusive demo taxes, ₹199 delivery below ₹5,000, and complimentary delivery from ₹5,000.
- Demo checkout with validated form fields, a local order reference, and a cart reset after completion.
- Local newsletter subscription and a contact inquiry preview, with clear submission status.
- Accessible native dialogs, keyboard closing, focus handling, mobile navigation, search shortcut `/`, and live status messages.
- CSS 3D image parallax, gentle product motion, zoom/reset/pause controls, scroll reveals, and a testimonial carousel.
- Reduced-motion support and responsive desktop, tablet, and mobile layouts.

## Verify

```powershell
npm test
```

The Playwright suite uses the installed Microsoft Edge browser on Windows. It exercises browsing, filtering, sorting, shopping, persistence, checkout, forms, carousel/showcase controls, viewport overflow, malformed storage, image loading, and console errors. Test screenshots are written to the ignored `artifacts/` directory. Start `npm run dev` before running it. To test a different running URL, set `TEST_URL`.

## Project structure

- `index.html` — page sections and accessible overlay shells.
- `src/styles.css` — Bootstrap import, visual design, responsive layouts, and motion.
- `src/catalog.js` — explicitly illustrative products, categories, service copy, and testimonials.
- `src/store.js` — shopping state, persistence, currency, and catalog filtering.
- `src/main.js` — rendering and interactions.
- `public/assets/` — local equipment images.
- `tests/storefront.mjs` — browser integration checks.
- `ASSET-CREDITS.md` — image sources and generation prompt.

## Demonstration scope

Medora is fictional. Product identities, prices, discounts, ratings, stock, technical specifications, certifications, testimonials, and service promises are demo content. Photographs illustrate equipment categories and do not imply manufacturer affiliation. The featured patient monitor is an AI-generated concept, presented with limited CSS 3D movement rather than a claimed 3D model.

No payment is collected, real order is submitted, inquiry is sent, or newsletter email is delivered. Checkout and contact personal details are not persisted. The order reference saves equipment totals only; the newsletter email is stored locally after submission. Cart, wishlist, newsletter preference, and demo order reference stay in this browser and can be removed by clearing site storage.

For commercial use, replace the sample catalog and reference images with licensed supplier content and connect real checkout, inventory, email, and fulfillment services.
