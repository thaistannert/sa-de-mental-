/* thais tannert. — jornal científico mensal
   Smooth scroll (Lenis) + scroll-driven motion (GSAP/ScrollTrigger) */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Lenis smooth scroll wired into ScrollTrigger's ticker
  --------------------------------------------------------------------- */
  let lenis;
  if (!reduceMotion){
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------------------------------------------------------------------
     Custom cursor
  --------------------------------------------------------------------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && !('ontouchstart' in window)){
    const pos = { x: window.innerWidth/2, y: window.innerHeight/2 };
    const ringPos = { x: pos.x, y: pos.y };
    window.addEventListener('mousemove', (e) => {
      pos.x = e.clientX; pos.y = e.clientY;
      gsap.set(dot, { x: pos.x, y: pos.y });
    });
    gsap.ticker.add(() => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
    });
    document.querySelectorAll('a, button, .gallery-item, .ed-photo, .chip-grid li').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

  /* ---------------------------------------------------------------------
     Header condense on scroll
  --------------------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  ScrollTrigger.create({
    start: 60,
    end: 99999,
    onUpdate: (self) => {
      header.classList.toggle('is-condensed', self.scroll() > 60);
    }
  });

  /* ---------------------------------------------------------------------
     Hero load-in sequence
  --------------------------------------------------------------------- */
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .fromTo('.hero-lockup > *', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.14 })
    .fromTo('.scroll-cue', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.4')
    .fromTo('.hero-author', { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, 0.5)
    .fromTo('.header-meta, .site-header .logo-mark', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.8 }, 0.1);

  /* Hero parallax on scroll */
  gsap.to('.hero-media', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-scrim', {
    opacity: 0.94,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* ---------------------------------------------------------------------
     Gallery — clip reveal + differential parallax
  --------------------------------------------------------------------- */
  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    const img = item.querySelector('img');
    gsap.fromTo(item.querySelector('.clip'),
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.3,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: item, start: 'top 88%' }
      }
    );
    gsap.fromTo(img, { scale: 1.16, yPercent: -6 }, {
      scale: 1.02, yPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true }
    });
    gsap.from(item.querySelector('.cap'), {
      opacity: 0, y: 14, duration: 0.8, delay: 0.3,
      scrollTrigger: { trigger: item, start: 'top 85%' }
    });
  });

  /* ---------------------------------------------------------------------
     Section eyebrows / heads generic reveal
  --------------------------------------------------------------------- */
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      opacity: 0, y: 26, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* Article paragraphs stagger */
  gsap.utils.toArray('.article-columns > p, .article-columns > .pull-quote').forEach((p) => {
    gsap.from(p, {
      opacity: 0, y: 18, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: p, start: 'top 92%' }
    });
  });

  /* Closing lines */
  gsap.from('.article-closing', {
    opacity: 0, y: 18, duration: 0.9,
    scrollTrigger: { trigger: '.article-closing', start: 'top 90%' }
  });

  /* Share button gentle pulse-in (bubble handled by generic [data-reveal]) */
  gsap.from('.share-btn', {
    opacity: 0, scale: .8, duration: 0.7, ease: 'back.out(1.6)',
    scrollTrigger: { trigger: '.share-prompt', start: 'top 85%' }
  });

  /* CTA reveal */
  gsap.from('.cta-portrait', {
    opacity: 0, y: 20, scale: .92, duration: 0.9,
    scrollTrigger: { trigger: '.cta', start: 'top 75%' }
  });
  gsap.from('.cta h2', {
    opacity: 0, y: 24, duration: 0.9, stagger: 0.12,
    scrollTrigger: { trigger: '.cta', start: 'top 70%' }
  });
  gsap.from('.cta-btn, .cta-social', {
    opacity: 0, y: 18, duration: 0.9, stagger: 0.1,
    scrollTrigger: { trigger: '.cta-btn', start: 'top 92%' }
  });


  /* ---------------------------------------------------------------------
     Editorial pieces — photos, band parallax, bars, stat counters
  --------------------------------------------------------------------- */
  document.querySelectorAll('[data-photo]').forEach((fig) => {
    const clip = fig.querySelector('.clip');
    const img = fig.querySelector('img');
    gsap.fromTo(clip, { clipPath: 'inset(0 0 100% 0)' }, {
      clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.inOut',
      scrollTrigger: { trigger: fig, start: 'top 88%' }
    });
    const still = fig.dataset.photo === 'still';
    gsap.fromTo(img, still ? { scale: 1.05 } : { scale: 1.16, yPercent: -5 }, {
      scale: 1.0, yPercent: still ? 0 : 5, ease: 'none',
      scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });


  document.querySelectorAll('.bars').forEach((bars) => {
    gsap.from(bars.querySelectorAll('i'), {
      scaleY: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: bars, start: 'top 88%' }
    });
  });

  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1.8, ease: 'power2.out',
      onUpdate: () => { el.textContent = pre + Math.round(o.v).toLocaleString('pt-BR') + suf; },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  gsap.utils.toArray('.chip-grid li, .cycle li, .timeline li').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, y: 14, duration: 0.7, ease: 'power2.out', delay: (i % 4) * 0.05,
      scrollTrigger: { trigger: el, start: 'top 94%' }
    });
  });

  gsap.fromTo('.cta-split .cta-media img', { scale: 1.06 }, {
    scale: 1.0, ease: 'none',
    scrollTrigger: { trigger: '.cta-split', start: 'top bottom', end: 'bottom top', scrub: true }
  });
  gsap.from('.range-fill', {
    scaleX: 0, duration: 1.4, ease: 'power3.out',
    scrollTrigger: { trigger: '.range', start: 'top 90%' }
  });

  ScrollTrigger.refresh();
});
