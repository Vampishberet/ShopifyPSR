/* ============================================
   PULSAR ENHANCEMENTS v3.0
   Scope: Lenis smooth scroll · Header scroll behaviour · GSAP defaults
   NOT in scope: reveal logic, stat counters — both owned by pulsar-animations.js.
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     Utility: wait for condition
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
    if (window.innerWidth < 768) return; // mobile: native scroll is better

    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      direction: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    window.__pulsarLenis = lenis;

    // Tick via GSAP if available, else rAF
    if (window.gsap) {
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })();
    }

    // Sync with ScrollTrigger
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }
  }

  /* ------------------------------------------
     2. GSAP DEFAULTS
     Sets global ScrollTrigger defaults. Registration is done by
     pulsar-animations.js — safe to call registerPlugin twice.
  ------------------------------------------ */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ toggleActions: 'play none none none' });
  }

  /* ------------------------------------------
     3. HEADER SCROLL BEHAVIOUR
  ------------------------------------------ */
  function initHeaderScroll() {
    var headerGroup = document.getElementById('header-group');
    if (!headerGroup) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 60) {
            headerGroup.classList.add('pulsar-header--scrolled');
          } else {
            headerGroup.classList.remove('pulsar-header--scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ------------------------------------------
     INIT
     Reveal logic is NOT here. pulsar-animations.js is the single
     owner of all .pulsar-reveal and scroll animation behavior.
  ------------------------------------------ */
  function init() {
    initHeaderScroll();

    waitFor(
      function () { return window.gsap && window.ScrollTrigger; },
      function () {
        initGSAP();
      }
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
