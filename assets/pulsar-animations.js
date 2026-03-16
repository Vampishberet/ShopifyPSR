/* ============================================
   PULSAR ANIMATIONS v1.0
   Preloader exit · Hero entrance stagger
   GSAP ScrollTrigger scroll reveals
   ============================================ */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------
     Utility: wait for GSAP + ScrollTrigger
  ------------------------------------------ */
  function waitForGSAP(cb, timeout) {
    timeout = timeout || 6000;
    var start = Date.now();
    (function check() {
      if (window.gsap && window.ScrollTrigger) {
        cb();
      } else if (Date.now() - start < timeout) {
        setTimeout(check, 50);
      }
    })();
  }

  /* ------------------------------------------
     1. PRELOADER EXIT
  ------------------------------------------ */
  function runPreloader() {
    var preloader = document.getElementById('pulsar-preloader');
    if (!preloader) { return; }

    // Skip if already seen this session
    if (sessionStorage.getItem('pulsarPreloaderSeen')) {
      preloader.style.display = 'none';
      revealHero();
      return;
    }

    if (prefersReducedMotion) {
      preloader.style.display = 'none';
      sessionStorage.setItem('pulsarPreloaderSeen', '1');
      revealHero();
      return;
    }

    var fill  = preloader.querySelector('.pulsar-preloader__progress-fill');
    var label = preloader.querySelector('.pulsar-preloader__label');

    var startTime = Date.now();
    var minDuration = 2600; // ms — always show for at least this long
    var currentProgress = 0;

    function setProgress(p) {
      currentProgress = p;
      if (fill)  fill.style.width = p + '%';
      if (label) label.textContent = Math.round(p) + '%';
    }

    // Phase 1: 0 → 80% in 1.6s
    var phase1 = { p: 0 };
    gsap.to(phase1, {
      p: 80,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: function () { setProgress(phase1.p); }
    });

    // Phase 2: 80 → 95% in 0.8s (slow crawl waiting for load)
    var phase2 = { p: 80 };
    gsap.to(phase2, {
      p: 95,
      duration: 0.8,
      delay: 1.6,
      ease: 'power1.out',
      onUpdate: function () { setProgress(phase2.p); }
    });

    function completePreloader() {
      var elapsed   = Date.now() - startTime;
      var remaining = Math.max(0, minDuration - elapsed);

      setTimeout(function () {
        var snap = { p: currentProgress };
        gsap.to(snap, {
          p: 100,
          duration: 0.35,
          ease: 'power1.inOut',
          onUpdate: function () { setProgress(snap.p); },
          onComplete: function () {
            setTimeout(exitPreloader, 320);
          }
        });
      }, remaining);
    }

    if (document.readyState === 'complete') {
      completePreloader();
    } else {
      window.addEventListener('load', completePreloader, { once: true });
    }
  }

  function exitPreloader() {
    var preloader = document.getElementById('pulsar-preloader');
    if (!preloader) return;

    preloader.classList.add('is-exiting');
    sessionStorage.setItem('pulsarPreloaderSeen', '1');

    gsap.to(preloader, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: function () {
        preloader.style.display = 'none';
        revealHero();
      }
    });
  }

  /* ------------------------------------------
     2. HERO ENTRANCE
  ------------------------------------------ */
  function revealHero() {
    var elements = document.querySelectorAll('[data-pulsar-hero-element]');
    if (!elements.length) return;

    gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.2,
        delay: 0.1,
      }
    );
  }

  /* ------------------------------------------
     3. SCROLL REVEAL ANIMATIONS (GSAP)
  ------------------------------------------ */
  function initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    // Section headings
    gsap.utils.toArray('.pulsar-heading-reveal').forEach(function (el) {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });

    // Stagger groups
    gsap.utils.toArray('.pulsar-stagger-group').forEach(function (group) {
      var children = group.querySelectorAll('.pulsar-stagger-item');
      if (!children.length) return;
      gsap.from(children, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: { trigger: group, start: 'top 80%', once: true }
      });
    });

    // Generic .pulsar-reveal (upgrade from CSS fallback)
    gsap.utils.toArray('.pulsar-reveal:not(.is-visible)').forEach(function (el) {
      gsap.from(el, {
        y: 28,
        opacity: 0,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: function () { el.classList.add('is-visible'); }
        }
      });
    });
  }

  /* ------------------------------------------
     INIT
  ------------------------------------------ */
  function init() {
    if (prefersReducedMotion) return;

    waitForGSAP(function () {
      gsap.registerPlugin(ScrollTrigger);
      runPreloader();
      initScrollAnimations();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
