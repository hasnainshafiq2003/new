# Muhammad Hasnain Shafiq - Portfolio

Static site, no build step: `index.html`, `css/style.css`, `js/main.js`.
GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13 and Google Fonts (Bodoni Moda, Instrument Sans) load from CDNs, so you need an internet connection.

**Run locally** (from this folder): `python3 -m http.server 8000`, then open http://localhost:8000
(or `npx serve .`). Opening index.html directly also works.

**Deploy:** replace the files in your GitHub Pages repo with these and push.

**Contact form:** create a form at formspree.io and paste its id into `FORMSPREE_ID` in `js/main.js`. Until then the form opens the visitor's email app.

**Work samples:** the portfolio you gave me lists no projects, so "Selected work" shows your real roles. To add an image, put it in `assets/` and add `style="--img:url(assets/name.jpg)"` to that card's `.art` element. Use `loading="lazy"` on any new `<img>` below the hero.

**Photo:** the hero uses `https://hasnainshafiq2003.github.io/portfolio/12.jpg`. Keep that file in the repo, or change the `src` in index.html.
