/* ============================================
   PULSAR ENHANCEMENTS v2.0
   GSAP init · Lenis smooth scroll · Custom cursor
   Stat counters · Header scroll · Scroll reveals
   ============================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  ------------------------------------------ */
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    if (window.innerWidth < 768) return; // skip on mobile

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
     2. GSAP + SCROLLTRIGGER INIT
  ------------------------------------------ */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ toggleActions: 'play none none none' });
  }

  /* ------------------------------------------
     4. HEADER SCROLL BEHAVIOUR
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
     5. STAT COUNTERS
  ------------------------------------------ */
  var countersInitialized = false;

  function initStatCounters() {
    if (countersInitialized) return;
    countersInitialized = true;

    var counters = document.querySelectorAll('[data-pulsar-counter]');
    if (!counters.length) return;

    counters.forEach(function (el) {
      var target   = parseFloat(el.dataset.pulsarCounter);
      var suffix   = el.dataset.pulsarSuffix   || '';
      var prefix   = el.dataset.pulsarPrefix   || '';
      var duration = parseFloat(el.dataset.pulsarDuration) || 2;
      var isInt    = Number.isInteger(target);

      // If reduced motion — just show final value immediately
      if (prefersReducedMotion) {
        el.textContent = prefix + target + suffix;
        return;
      }

      if (window.gsap && window.ScrollTrigger) {
        var obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: duration,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
          onUpdate: function () {
            el.textContent = prefix + (isInt ? Math.round(obj.val) : obj.val.toFixed(1)) + suffix;
          },
        });
      } else {
        // Fallback: IntersectionObserver count-up
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            obs.unobserve(el);
            var startTime = Date.now();
            var ms = duration * 1000;
            (function tick() {
              var p = Math.min((Date.now() - startTime) / ms, 1);
              el.textContent = prefix + Math.round(target * p) + suffix;
              if (p < 1) requestAnimationFrame(tick);
            })();
          });
        }, { threshold: 0.3 });
        obs.observe(el);
      }
    });
  }

  /* ------------------------------------------
     6. SCROLL REVEALS (fallback — GSAP handles when loaded)
  ------------------------------------------ */
  function initScrollReveals() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.pulsar-reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    // If GSAP is ready, pulsar-animations.js handles reveals
    if (window.gsap && window.ScrollTrigger) return;

    var elements = document.querySelectorAll('.pulsar-reveal');
    if (!elements.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { obs.observe(el); });
  }

  /* ------------------------------------------
     INIT
  ------------------------------------------ */
  function init() {
    initHeaderScroll();

    if (prefersReducedMotion) {
      document.querySelectorAll('.pulsar-reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      initStatCounters(); // show final values immediately
      return;
    }

    // Try GSAP-powered counters first, fall back after 4s
    waitFor(
      function () { return window.gsap && window.ScrollTrigger; },
      function () {
        initGSAP();
        initStatCounters();
      }
    );
    setTimeout(initStatCounters, 4000); // fallback if CDN is slow

    // Lenis
    waitFor(
      function () { return typeof Lenis !== 'undefined'; },
      initLenis
    );

    // Fallback scroll reveals (if GSAP not loaded yet)
    setTimeout(initScrollReveals, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
