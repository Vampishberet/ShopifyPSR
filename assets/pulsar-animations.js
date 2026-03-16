/* ============================================================
   PULSAR ANIMATIONS v2.0
   Preloader exit → Hero entrance → ScrollTrigger reveals
   ============================================================ */

// @ts-nocheck

(function () {
  'use strict';
  var ScrollTrigger = window.ScrollTrigger;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Utility: poll until condition or timeout
   * @param {() => boolean} condition 
   * @param {() => void} cb 
   * @param {number} [interval=50] 
   * @param {number} [timeout=6000] 
   */
  function waitFor(condition, cb, interval, timeout) {
    interval = interval || 50;
    timeout  = timeout  || 6000;
    var start = Date.now();
    (function check() {
      if (condition()) {
        cb();
      } else if (Date.now() - start < timeout) {
        setTimeout(check, interval);
      }
    })();
  }

  /* ------------------------------------------
     1. PRELOADER EXIT
  ------------------------------------------ */
  function runPreloader() {
    var preloader = document.getElementById('pulsar-preloader');
    if (!preloader) {
      revealHero();
      return;
    }

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
    var minDuration = 2600;
    var currentProgress = 0;

    function setProgress(p) {
      currentProgress = p;
      if (fill)  fill.style.width = p + '%';
      if (label) label.textContent = Math.round(p) + '%';
    }

    var phase1 = { p: 0 };
    gsap.to(phase1, { p: 80, duration: 1.6, ease: 'power2.out', onUpdate: function () { setProgress(phase1.p); } });

    var phase2 = { p: 80 };
    gsap.to(phase2, { p: 95, duration: 0.8, delay: 1.6, ease: 'power1.out', onUpdate: function () { setProgress(phase2.p); } });

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
          onComplete: function () { setTimeout(exitPreloader, 300); }
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
    if (!preloader) { revealHero(); return; }

    preloader.classList.add('is-exiting');
    sessionStorage.setItem('pulsarPreloaderSeen', '1');

    gsap.to(preloader, {
      yPercent: -100,
      duration: 0.85,
      ease: 'power2.inOut',
      onComplete: function () {
        preloader.style.display = 'none';
        revealHero();
      }
    });
  }

  /* ------------------------------------------
     2. HERO ENTRANCE
     Calls window.pulsarRevealHero() defined in
     pulsar-hero.liquid (line-mask reveal).
     Falls back to data-pulsar-hero-element.
  ------------------------------------------ */
  function revealHero() {
    // New hero: defined inline in pulsar-hero.liquid
    if (typeof window.pulsarRevealHero === 'function') {
      window.pulsarRevealHero();
      return;
    }
    // Legacy fallback: data-pulsar-hero-element
    var elements = document.querySelectorAll('[data-pulsar-hero-element]');
    if (!elements.length || prefersReducedMotion) {
      elements.forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }
    if (window.gsap) {
      gsap.fromTo(elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.18, delay: 0.1 }
      );
    }
  }

  /* ------------------------------------------
     3. SCROLL ANIMATIONS
  ------------------------------------------ */
  function initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    /* Section headings — slide up 40px */
    gsap.utils.toArray('.pulsar-heading-reveal').forEach(function (el) {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });

    /* Stagger groups (product cards, player cards) */
    gsap.utils.toArray('.pulsar-stagger-group').forEach(function (group) {
      var items = group.querySelectorAll('.pulsar-stagger-item');
      if (!items.length) return;
      gsap.from(items, {
        y: 35,
        opacity: 0,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.09,
        scrollTrigger: { trigger: group, start: 'top 80%', once: true }
      });
    });

    /* Generic .pulsar-reveal */
    gsap.utils.toArray('.pulsar-reveal').forEach(function (el) {
      if (el.classList.contains('is-visible')) return;
      gsap.from(el, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 87%',
          once: true,
          onEnter: function () { el.classList.add('is-visible'); }
        }
      });
    });

    /* Stats section — staggered stat items */
    var statsSection = document.getElementById('pulsar-stats');
    if (statsSection) {
      var statItems = statsSection.querySelectorAll('.pulsar-stats__item');
      if (statItems.length) {
        gsap.from(statItems, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: { trigger: statsSection, start: 'top 80%', once: true }
        });
      }
    }

    /* Video showcase — scale in */
    var videoItems = document.querySelectorAll('.pulsar-videos__item');
    if (videoItems.length) {
      gsap.from(videoItems, {
        scale: 0.96,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: videoItems[0].closest('section') || videoItems[0],
          start: 'top 82%',
          once: true
        }
      });
    }

    /* Partner logos — stagger fade up */
    var partnerLogos = document.querySelectorAll('.pulsar-partners__logo-link');
    if (partnerLogos.length) {
      gsap.from(partnerLogos, {
        y: 20,
        opacity: 0,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: partnerLogos[0].closest('section') || partnerLogos[0],
          start: 'top 82%',
          once: true
        }
      });
    }

    /* CTA heading — dramatic scale entrance */
    var ctaHeading = document.querySelector('.pulsar-cta__heading');
    if (ctaHeading) {
      gsap.from(ctaHeading, {
        scale: 0.94,
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: ctaHeading, start: 'top 85%', once: true }
      });
    }

    /* Esports tabs — stagger entrance */
    var esTabs = document.querySelectorAll('.pulsar-esports-titles__tab');
    if (esTabs.length) {
      var esTabList = esTabs[0].closest('.pulsar-esports-titles__tabs') || esTabs[0];
      gsap.from(esTabs, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: { trigger: esTabList, start: 'top 88%', once: true }
      });
    }
  }

  /* ------------------------------------------
     INIT
  ------------------------------------------ */
  function init() {
    if (prefersReducedMotion) {
      document.querySelectorAll(
        '.pulsar-reveal, [data-pulsar-hero-element], .pulsar-hero__line-inner, .pulsar-hero__eyebrow, .pulsar-hero__tagline, .pulsar-hero__actions, .pulsar-hero__scroll-cue'
      ).forEach(function (el) {
        el.style.opacity  = '1';
        el.style.transform = 'none';
      });
      return;
    }

    waitFor(
      function () { return window.gsap && window.ScrollTrigger; },
      function () {
        gsap.registerPlugin(ScrollTrigger);
        runPreloader();
        initScrollAnimations();
      }
    );

    // Emergency fallback: if GSAP fails to load in 5s
    setTimeout(function () {
      if (!window.gsap) {
        revealHero();
        document.querySelectorAll('.pulsar-reveal').forEach(function (el) {
          el.classList.add('is-visible');
          el.style.opacity  = '1';
          el.style.transform = 'none';
        });
      }
    }, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
