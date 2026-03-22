/* ============================================
   PULSAR ENHANCEMENTS v3.1
   Scope: Lenis smooth scroll · Header scroll behaviour · GSAP defaults
   NOT in scope: reveal logic, stat counters — owned by pulsar-animations.js.
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     UTILITY: poll until condition or timeout
  ------------------------------------------ */
  function waitFor(condition, callback, interval, timeout) {
    interval = interval || 50;
    timeout  = timeout  || 6000;
    var start = Date.now();
    (function check() {
      if (condition()) {
        callback();
      } else if (Date.now() - start < timeout) {
        setTimeout(check, interval);
      }
    })();
  }

  /* ------------------------------------------
     1. LENIS SMOOTH SCROLL
     Intentional brand dependency — provides premium inertia scroll feel.
     Desktop only. Tied into GSAP ticker when available.
  ------------------------------------------ */
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    if (window.innerWidth < 768) return;

    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 2
    });

    window.__pulsarLenis = lenis;

    if (window.gsap) {
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })();
    }

    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }
  }

  /* ------------------------------------------
     2. GSAP DEFAULTS
     Sets global ScrollTrigger defaults. Registration is also done by
     pulsar-animations.js — safe to call registerPlugin twice.
  ------------------------------------------ */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ toggleActions: 'play none none none' });
  }

  /* ------------------------------------------
     3. HEADER SCROLL BEHAVIOUR
     Uses IntersectionObserver on a sentinel element — never window scroll events.
     Sentinel sits at 61px from the document top. When it exits the viewport
     (user has scrolled >61px), the scrolled class is applied. When it re-enters,
     the class is removed.
  ------------------------------------------ */
  function initHeaderScroll() {
    var headerGroup = document.getElementById('header-group');
    if (!headerGroup) return;

    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:61px;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.insertBefore(sentinel, document.body.firstChild);

    var obs = new IntersectionObserver(
      function (entries) {
        headerGroup.classList.toggle('pulsar-header--scrolled', !entries[0].isIntersecting);
      },
      { threshold: 0 }
    );

    obs.observe(sentinel);

    // Store refs for potential cleanup
    window.__pulsarHeaderObs      = obs;
    window.__pulsarHeaderSentinel = sentinel;
  }

  /* ------------------------------------------
     INIT
     Reveal logic is NOT here. pulsar-animations.js is the single
     owner of all .pulsar-reveal and scroll animation behaviour.
  ------------------------------------------ */
  function init() {
    initHeaderScroll();

    waitFor(
      function () { return window.gsap && window.ScrollTrigger; },
      initGSAP
    );

    waitFor(
      function () { return typeof Lenis !== 'undefined'; },
      initLenis
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
