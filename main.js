(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const ld = $('.ld');

  /* Contact form: posts to Formspree when an id is set, otherwise opens the visitor's email app */
  const FORMSPREE_ID = ''; // paste your form id from formspree.io, e.g. 'xyzabcde'
  const EMAIL = 'chaudharyhasnainshafiq@gmail.com';
  const f = $('#f'), fs = $('#fs');
  f.addEventListener('submit', async e => {
    e.preventDefault();
    if (!f.checkValidity()) { fs.textContent = 'Please fill in your name, a valid email and a message.'; return; }
    const d = Object.fromEntries(new FormData(f));
    if (FORMSPREE_ID) {
      try {
        const r = await fetch('https://formspree.io/f/' + FORMSPREE_ID, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
        if (r.ok) { f.reset(); fs.textContent = 'Message sent. Thank you.'; return; }
      } catch (_) { /* fall through to email */ }
    }
    fs.textContent = 'Opening your email app...';
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Portfolio enquiry from ' + d.name)}&body=${encodeURIComponent(d.message + '\n\n' + d.name + ', ' + d.email)}`;
  });

  /* Static, natively scrolling page if libraries fail to load or motion is reduced */
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!(window.gsap && window.ScrollTrigger && window.Lenis) || RM) { ld && ld.remove(); return; }

  const root = document.documentElement, nav = $('.nav');
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  root.classList.add('fx');
  history.scrollRestoration = 'manual';
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* Lenis smooth scroll driven by the GSAP ticker; header hides on scroll down */
  const lenis = new Lenis({ lerp: 0.09 });
  lenis.on('scroll', l => { ScrollTrigger.update(); nav.classList.toggle('hide', l.direction === 1 && l.scroll > 300); });
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = $(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    lenis.scrollTo(t, { duration: 1.6 });
  }));

  /* Opening sequence: counter, curtain lift, staged hero reveal */
  const hero = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
    .from('.ln > span', { yPercent: 110, duration: 1.5, stagger: 0.14 })
    .from('.portrait', { clipPath: 'inset(0 0 100% 0)', duration: 1.6, ease: 'power4.inOut' }, 0)
    .from('.portrait img', { scale: 1.3, duration: 2.2 }, 0)
    .from('[data-i]', { y: 24, opacity: 0, duration: 1.2, stagger: 0.1 }, 0.5);
  const n = $('.ld-n'), c = { v: 0 };
  gsap.timeline({ onComplete: () => lenis.start() })
    .to(c, { v: 100, duration: 2, ease: 'power2.inOut', onUpdate: () => { n.textContent = String(Math.round(c.v)).padStart(3, '0'); } })
    .to(ld, { yPercent: -100, duration: 1.1, ease: 'power4.inOut' }, '+=0.2')
    .add(() => hero.play(), '-=0.5')
    .set(ld, { display: 'none' });

  /* Headings: word-by-word masked reveal */
  $$('[data-split]').forEach(el => {
    el.innerHTML = el.textContent.trim().split(' ').map(w => `<span class="w"><span>${w}</span></span>`).join(' ');
    gsap.from($$('.w > span', el), { yPercent: 115, duration: 1.2, stagger: 0.06, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  /* Staggered lists and clip-path image reveals */
  $$('[data-rs]').forEach(el => gsap.from(el.children, { y: 40, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }));
  $$('.rv').forEach(el => gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power4.inOut', scrollTrigger: { trigger: el, start: 'top 85%' } }));

  /* Hero parallax (halved on touch devices) */
  const k = fine ? 1 : 0.5, hs = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.portrait img', { yPercent: -14 * k, ease: 'none', scrollTrigger: hs });
  gsap.to('.hero h1', { yPercent: -14 * k, ease: 'none', scrollTrigger: hs });

  /* Skills: pinned horizontal scroll on desktop; native swipe on smaller screens */
  gsap.matchMedia().add('(min-width: 900px)', () => {
    const tr = $('.track'), dist = () => tr.scrollWidth - innerWidth;
    gsap.to(tr, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.skills', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true } });
  });

  /* Desktop only: custom cursor, magnetic buttons, hero light that follows the pointer */
  if (fine) {
    root.classList.add('has-cur');
    const cur = $('.cur');
    gsap.set(cur, { x: -50, y: -50 });
    const cx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
    addEventListener('pointermove', e => { cx(e.clientX); cy(e.clientY); });
    $$('a, button, [data-cur]').forEach(el => {
      el.addEventListener('pointerenter', () => gsap.to(cur, { scale: 3.5, opacity: 0.35, duration: 0.4 }));
      el.addEventListener('pointerleave', () => gsap.to(cur, { scale: 1, opacity: 1, duration: 0.4 }));
    });
    $$('[data-mag]').forEach(el => {
      const mx = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'elastic.out(1,0.4)' }), my = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'elastic.out(1,0.4)' });
      el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * 0.35); my((e.clientY - r.top - r.height / 2) * 0.35); });
      el.addEventListener('pointerleave', () => { mx(0); my(0); });
    });
    const gx = gsap.quickTo('.glow', 'x', { duration: 1.4 }), gy = gsap.quickTo('.glow', 'y', { duration: 1.4 });
    $('.hero').addEventListener('pointermove', e => { gx(e.clientX); gy(e.clientY); });
  }

  /* Re-measure once web fonts have changed the layout */
  document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
