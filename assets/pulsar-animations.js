/* ============================================================
   PULSAR ANIMATIONS v3.1
   Single owner of: reveal logic, stat counters, scroll animations, preloader.
   Exposes: window.PulsarAnimations = { initSection, destroySection }
   Shopify editor lifecycle safe — supports section load/unload/reorder.
   ============================================================ */

// @ts-nocheck

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nativeRevealObserver = null;

  /* ------------------------------------------
     UTILITY: poll until condition or timeout
  ------------------------------------------ */
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

  function addVisibleState(el) {
    if (!el) return;
    el.classList.add('is-visible');
  }

  function finalizeVisibleState(el) {
    if (!el) return;
    addVisibleState(el);
    el.style.opacity = '1';
    el.style.transform = 'none';
  }

  function finalizeVisibleSet(root, selector) {
    if (!root) return;
    root.querySelectorAll(selector).forEach(function (el) {
      finalizeVisibleState(el);
    });
  }

  function resetAnimatedStyles(el) {
    if (!el || !window.gsap) return;
    addVisibleState(el);
    gsap.set(el, { clearProps: 'opacity,transform' });
  }

  function claimInit(el, key) {
    if (!el || el[key]) return false;
    el[key] = true;
    return true;
  }

  function getScope(root) {
    return root === document ? document : (root || document);
  }

  function ensureNativeRevealObserver() {
    if (nativeRevealObserver) return nativeRevealObserver;

    nativeRevealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        observer.unobserve(el);

        if (typeof el._pulsarRevealCallback === 'function') {
          el._pulsarRevealCallback();
        } else {
          finalizeVisibleState(el);
        }

        delete el._pulsarRevealCallback;
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    return nativeRevealObserver;
  }

  function observeNativeReveal(el, key, callback) {
    if (!el || !claimInit(el, key)) return;

    if (prefersReducedMotion) {
      if (callback) {
        callback();
      } else {
        finalizeVisibleState(el);
      }
      return;
    }

    el._pulsarRevealCallback = callback || function () {
      finalizeVisibleState(el);
    };
    ensureNativeRevealObserver().observe(el);
  }

  function initNativeScrollAnimationsIn(root) {
    var scope = getScope(root);

    scope.querySelectorAll('.pulsar-heading-reveal').forEach(function (el) {
      observeNativeReveal(el, '_pulsarHeadingRevealInit');
    });

    scope.querySelectorAll('.pulsar-stagger-group').forEach(function (group) {
      if (!claimInit(group, '_pulsarStaggerInit')) return;
      var items = group.querySelectorAll('.pulsar-stagger-item');
      if (!items.length) return;

      observeNativeReveal(group, '_pulsarStaggerRevealInit', function () {
        items.forEach(function (item, index) {
          setTimeout(function () {
            finalizeVisibleState(item);
          }, index * 90);
        });
      });
    });

    scope.querySelectorAll('.pulsar-reveal').forEach(function (el) {
      observeNativeReveal(el, '_pulsarRevealInit');
    });

    var videoItems = scope.querySelectorAll('.pulsar-videos__item');
    if (videoItems.length) {
      observeNativeReveal(videoItems[0].closest('section') || videoItems[0], '_pulsarVideoRevealInit', function () {
        videoItems.forEach(function (item, index) {
          setTimeout(function () {
            finalizeVisibleState(item);
          }, index * 120);
        });
      });
    }

    var partnerLogos = scope.querySelectorAll('.pulsar-partners__logo-link');
    if (partnerLogos.length) {
      observeNativeReveal(partnerLogos[0].closest('section') || partnerLogos[0], '_pulsarPartnerRevealInit', function () {
        partnerLogos.forEach(function (logo, index) {
          setTimeout(function () {
            finalizeVisibleState(logo);
          }, index * 110);
        });
      });
    }

    scope.querySelectorAll('.pulsar-cta__heading').forEach(function (el) {
      observeNativeReveal(el, '_pulsarCtaHeadingInit');
    });

    scope.querySelectorAll('.pulsar-esports-titles__tab').forEach(function (el) {
      observeNativeReveal(el, '_pulsarEsportsTabRevealInit');
    });
  }

  function initTickerIn(root) {
    var scope = getScope(root);
    var tickers;

    if (root && root !== document && root.classList && root.classList.contains('pulsar-ticker-section')) {
      tickers = [root];
    } else {
      tickers = Array.prototype.slice.call(scope.querySelectorAll('.pulsar-ticker-section'));
    }

    tickers.forEach(function (tickerSection) {
      if (tickerSection._pulsarTickerTween || tickerSection._pulsarTickerAnimation) return;

      var track = tickerSection.querySelector('.pulsar-ticker-track');
      var firstGroup = tickerSection.querySelector('.pulsar-ticker-group');
      if (!track || !firstGroup) return;

      if (prefersReducedMotion) {
        track.style.transform = 'translate3d(0, 0, 0)';
        return;
      }

      var width = firstGroup.offsetWidth;
      if (!width) {
        requestAnimationFrame(function () {
          initTickerIn(tickerSection);
        });
        return;
      }

      var speedSetting = parseFloat(tickerSection.dataset.tickerSpeed) || 0.7;
      var duration = width / (speedSetting * 60);

      if (window.gsap) {
        tickerSection._pulsarTickerTween = gsap.to(track, {
          x: -width,
          duration: duration,
          ease: 'none',
          repeat: -1
        });
      } else if (typeof track.animate === 'function') {
        tickerSection._pulsarTickerAnimation = track.animate(
          [
            { transform: 'translate3d(0, 0, 0)' },
            { transform: 'translate3d(-' + width + 'px, 0, 0)' }
          ],
          {
            duration: duration * 1000,
            easing: 'linear',
            iterations: Infinity
          }
        );
      }

      var motionHandle = tickerSection._pulsarTickerTween || tickerSection._pulsarTickerAnimation;
      if (!motionHandle || tickerSection._pulsarTickerHoverBound || tickerSection.dataset.pauseOnHover === 'false') return;

      tickerSection.addEventListener('mouseenter', function () {
        if (motionHandle.pause) motionHandle.pause();
      });
      tickerSection.addEventListener('mouseleave', function () {
        if (motionHandle.play) motionHandle.play();
      });
      tickerSection._pulsarTickerHoverBound = true;
    });
  }

  function initInteractiveFeatures(root) {
    initTickerIn(root);
    initHeroSlider(root);
    initCardTilt(root);
    initQuickAddFeedback(root);
    initEsportsTabs(root);
    initPlayerDrawer();
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

    var fill       = preloader.querySelector('.pulsar-preloader__progress-fill');
    var label      = preloader.querySelector('.pulsar-preloader__label');
    var startTime  = Date.now();
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
        preloader.remove(); // Free DOM + video decode resources after exit
        revealHero();
      }
    });
  }

  /* ------------------------------------------
     2. HERO ENTRANCE
     Animates [data-pulsar-hero-element] elements.
     Also triggers mask reveals (.pulsar-hero__mask-inner) and hero slider.
  ------------------------------------------ */
  function revealHero() {
    var elements = document.querySelectorAll('[data-pulsar-hero-element]');
    var masks    = document.querySelectorAll('.pulsar-hero__mask-inner');

    if (prefersReducedMotion) {
      elements.forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
      masks.forEach(function (m) { m.style.transform = 'none'; });
      return;
    }

    if (window.gsap) {
      if (elements.length) {
        gsap.fromTo(elements,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.18, delay: 0.1 }
        );
      }
      // Mask reveals for Monument Extended headings (yPercent slide-up from overflow wrapper)
      if (masks.length) {
        gsap.fromTo(masks,
          { yPercent: 105 },
          { yPercent: 0, duration: 0.78, ease: 'power2.out', stagger: 0.14, delay: 0.2 }
        );
      }
    } else {
      elements.forEach(function (el) { el.style.opacity = '1'; });
      masks.forEach(function (m) { m.style.transform = 'none'; });
    }

    // Start multi-slide crossfade timer if 2+ slides present
    initHeroSlider(document);
  }

  /* ------------------------------------------
     3. SCROLL ANIMATIONS
     Single owner of all .pulsar-reveal, .pulsar-heading-reveal,
     .pulsar-stagger-group, counter, video, partner, CTA, esports reveals.

     root: HTMLElement | Document — scope for selectors.
     Pass a section element on shopify:section:load re-init.
  ------------------------------------------ */
  function initScrollAnimationsIn(root) {
    root = root || document;
    if (!window.gsap || !window.ScrollTrigger) {
      initNativeScrollAnimationsIn(root);
      initInteractiveFeatures(root);
      return;
    }

    gsap.utils.toArray('.pulsar-heading-reveal', root).forEach(function (el) {
      if (el.classList.contains('pulsar-word-reveal')) return; // owned by initWordMaskReveal
      if (!claimInit(el, '_pulsarHeadingRevealInit')) return;
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          onComplete: function () { resetAnimatedStyles(el); },
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: function () { addVisibleState(el); }
          }
        }
      );
    });

    gsap.utils.toArray('.pulsar-stagger-group', root).forEach(function (group) {
      if (!claimInit(group, '_pulsarStaggerInit')) return;
      var items = group.querySelectorAll('.pulsar-stagger-item');
      if (!items.length) return;
      gsap.fromTo(items,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power2.out',
          stagger: 0.09,
          onComplete: function () {
            items.forEach(function (item) { resetAnimatedStyles(item); });
          },
          scrollTrigger: {
            trigger: group,
            start: 'top 80%',
            once: true,
            onEnter: function () {
              items.forEach(function (item) { addVisibleState(item); });
            }
          }
        }
      );
    });

    /* Stats items — scale + back.out bounce entrance.
       Runs before generic .pulsar-reveal so items can be claimed here first. */
    var statsItems = (root === document ? document : root).querySelectorAll('.pulsar-stats__item.pulsar-reveal');
    if (statsItems.length) {
      var statsTrigger = statsItems[0].closest('.pulsar-stats__grid') || statsItems[0].closest('section') || statsItems[0];
      statsItems.forEach(function (el) { claimInit(el, '_pulsarRevealInit'); });
      gsap.fromTo(statsItems,
        { y: 50, opacity: 0, scale: 0.85 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.72,
          ease: 'back.out(1.4)',
          stagger: 0.12,
          onComplete: function () {
            statsItems.forEach(function (el) { resetAnimatedStyles(el); });
          },
          scrollTrigger: {
            trigger: statsTrigger,
            start: 'top 78%',
            once: true,
            onEnter: function () { statsItems.forEach(function (el) { addVisibleState(el); }); }
          }
        }
      );
    }

    /* Generic .pulsar-reveal — single owner, no duplicate in enhancements.js.
       Uses gsap.fromTo so elements whose CSS default is already opacity:0
       are explicitly animated to a visible final state. */
    gsap.utils.toArray('.pulsar-reveal', root).forEach(function (el) {
      if (!claimInit(el, '_pulsarRevealInit') || el.classList.contains('is-visible')) return;
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          onComplete: function () { resetAnimatedStyles(el); },
          scrollTrigger: {
            trigger: el,
            start: 'top 87%',
            once: true,
            onEnter: function () { addVisibleState(el); }
          }
        }
      );
    });

    var videoItems = (root === document ? document : root).querySelectorAll('.pulsar-videos__item');
    if (videoItems.length) {
      gsap.fromTo(videoItems,
        { scale: 0.96, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: videoItems[0].closest('section') || videoItems[0],
            start: 'top 82%',
            once: true
          }
        }
      );
    }

    var partnerLogos = (root === document ? document : root).querySelectorAll('.pulsar-partners__logo-link');
    if (partnerLogos.length) {
      gsap.fromTo(partnerLogos,
        { y: 20, opacity: 0, filter: 'blur(8px)', scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          duration: 0.65,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: partnerLogos[0].closest('section') || partnerLogos[0],
            start: 'top 82%',
            once: true
          }
        }
      );
    }

    var ctaHeading = (root === document ? document : root).querySelector('.pulsar-cta__heading');
    if (ctaHeading && claimInit(ctaHeading, '_pulsarCtaHeadingInit')) {
      gsap.fromTo(ctaHeading,
        { scale: 0.94, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaHeading,
            start: 'top 85%',
            once: true,
            onEnter: function () {
              /* Char scramble — resolves to real text over ~1.6s */
              var origHTML = ctaHeading.innerHTML;
              var origText = (ctaHeading.innerText || ctaHeading.textContent || '').replace(/\s+/g, ' ').trim();
              var SCHARS   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%';
              var dur = 1600;
              var t0  = Date.now();
              ctaHeading.textContent = origText;
              (function tick() {
                var prog = Math.min((Date.now() - t0) / dur, 1);
                var rev  = Math.floor(prog * prog * origText.length);
                var out  = '';
                for (var i = 0; i < origText.length; i++) {
                  var c = origText[i];
                  out += (c === ' ' || c === '\n') ? c : i < rev ? c : SCHARS[Math.floor(Math.random() * SCHARS.length)];
                }
                ctaHeading.textContent = out;
                if (prog < 1) { requestAnimationFrame(tick); } else { ctaHeading.innerHTML = origHTML; }
              })();
            }
          }
        }
      );
    }

    var esTabs = (root === document ? document : root).querySelectorAll('.pulsar-esports-titles__tab');
    if (esTabs.length) {
      var esTabList = esTabs[0].closest('.pulsar-esports-titles__tabs') || esTabs[0];
      gsap.fromTo(esTabs,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: { trigger: esTabList, start: 'top 88%', once: true }
        }
      );
    }

    // Phase 3 feature inits — scoped to root
    initWordMaskReveal(root);
    initParallax(root);
    initInteractiveFeatures(root);
  }

  /* ------------------------------------------
     4. STAT COUNTERS
     Single owner. pulsar-enhancements.js contains no counter logic.
     Uses IntersectionObserver for scroll detection (never window scroll events).
     data-pulsar-duration is in milliseconds.

     root: HTMLElement | Document — scope for counter selectors.
  ------------------------------------------ */
  function initStatCountersIn(root) {
    root = root || document;
    var counters = root.querySelectorAll('[data-pulsar-counter]');
    if (!counters.length) return;

    counters.forEach(function (el) {
      if (el.dataset.pulsarCounterInit) return;
      el.dataset.pulsarCounterInit = '1';

      var target     = parseFloat(el.dataset.pulsarCounter || '0');
      var decimals   = parseInt(el.dataset.pulsarDecimals  || '0', 10);
      var prefix     = el.dataset.pulsarPrefix  || '';
      var suffix     = el.dataset.pulsarSuffix  || '';
      var durationMs = parseInt(el.dataset.pulsarDuration  || '2000', 10);
      var durationS  = durationMs / 1000;

      function format(val) {
        return prefix + (decimals > 0 ? val.toFixed(decimals) : Math.round(val)) + suffix;
      }

      if (prefersReducedMotion) {
        el.textContent = format(target);
        return;
      }

      el.textContent = format(0);

      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          obs.unobserve(el);

          if (window.gsap) {
            var obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: durationS,
              ease: 'power1.out',
              onUpdate: function () { el.textContent = format(obj.val); },
              onComplete: function () { el.textContent = format(target); }
            });
          } else {
            var startTime = Date.now();
            (function tick() {
              var p     = Math.min((Date.now() - startTime) / durationMs, 1);
              var eased = 1 - Math.pow(1 - p, 3);
              el.textContent = format(target * eased);
              if (p < 1) {
                requestAnimationFrame(tick);
              } else {
                el.textContent = format(target);
              }
            })();
          }
        });
      }, { threshold: 0.1 });

      obs.observe(el);
    });
  }

  /* ------------------------------------------
     5. PUBLIC API
     initSection  — init all animations inside a section element.
     destroySection — kill ScrollTriggers scoped to a section element.
     Exposed as window.PulsarAnimations for use by external modules.
  ------------------------------------------ */
  function initSection(sectionEl) {
    if (!sectionEl) return;

    if (prefersReducedMotion) {
      finalizeVisibleSet(
        sectionEl,
        '.pulsar-reveal, .pulsar-heading-reveal, [data-pulsar-hero-element], .pulsar-stagger-item, .pulsar-videos__item, .pulsar-partners__logo-link, .pulsar-esports-titles__tab, .pulsar-cta__heading'
      );
      sectionEl.querySelectorAll('.pulsar-hero__mask-inner').forEach(function (el) {
        el.style.transform = 'none';
      });
      initInteractiveFeatures(sectionEl);
      initStatCountersIn(sectionEl);
      return;
    }

    if (window.gsap && window.ScrollTrigger) {
      initScrollAnimationsIn(sectionEl);
      initStatCountersIn(sectionEl);
      requestAnimationFrame(function () {
        ScrollTrigger.refresh();
      });
    } else {
      initScrollAnimationsIn(sectionEl);
      initStatCountersIn(sectionEl);
    }
  }

  function destroySection(sectionEl) {
    if (!sectionEl) return;

    if (window.ScrollTrigger) {
      ScrollTrigger.getAll().forEach(function (st) {
        if (st.trigger && sectionEl.contains(st.trigger)) {
          st.kill();
        }
      });
    }

    // Kill ticker tweens
    sectionEl.querySelectorAll('.pulsar-ticker-section').forEach(function(ticker) {
      if (ticker._pulsarTickerTween) {
        ticker._pulsarTickerTween.kill();
        delete ticker._pulsarTickerTween;
      }
      if (ticker._pulsarTickerAnimation) {
        ticker._pulsarTickerAnimation.cancel();
        delete ticker._pulsarTickerAnimation;
      }
      delete ticker._pulsarTickerHoverBound;
    });

    sectionEl.querySelectorAll('.pulsar-heading-reveal').forEach(function (el) {
      delete el._pulsarHeadingRevealInit;
    });

    // Reset word mask reveal so it can re-split on section reload
    sectionEl.querySelectorAll('.pulsar-word-reveal').forEach(function (el) {
      delete el._pulsarWordRevealInit;
    });

    // Reset CTA heading scramble guard
    sectionEl.querySelectorAll('.pulsar-cta__heading').forEach(function (el) {
      delete el._pulsarCtaHeadingInit;
    });

    sectionEl.querySelectorAll('.pulsar-reveal').forEach(function (el) {
      delete el._pulsarRevealInit;
    });

    sectionEl.querySelectorAll('.pulsar-stagger-group').forEach(function (group) {
      delete group._pulsarStaggerInit;
    });

    // Reset counter init flags so they re-animate if section reloads
    sectionEl.querySelectorAll('[data-pulsar-counter]').forEach(function (el) {
      delete el.dataset.pulsarCounterInit;
    });

    // Kill hero slider timer and reset init guard
    sectionEl.querySelectorAll('.pulsar-hero__slides').forEach(function (c) {
      if (c._pulsarSliderTimer) { clearInterval(c._pulsarSliderTimer); delete c._pulsarSliderTimer; }
      delete c._pulsarHeroSliderInit;
    });

    // Kill 3D tilt listeners
    sectionEl.querySelectorAll('[data-pulsar-tilt]').forEach(function (card) {
      if (card._pulsarTiltEnter) card.removeEventListener('mouseenter', card._pulsarTiltEnter);
      if (card._pulsarTiltLeave) card.removeEventListener('mouseleave', card._pulsarTiltLeave);
      if (card._pulsarTiltMove)  card.removeEventListener('mousemove',  card._pulsarTiltMove);
      card.classList.remove('has-pulsar-tilt');
      delete card._pulsarTiltBound;
      delete card._pulsarTiltEnter;
      delete card._pulsarTiltLeave;
      delete card._pulsarTiltMove;
      if (window.gsap) gsap.set(card, { clearProps: 'transform,rotateX,rotateY,scale' });
    });

    // Reset quick-add init flags
    sectionEl.querySelectorAll('.pulsar-merch__quick-add').forEach(function (btn) {
      delete btn._pulsarQaInit;
    });

      // Reset esports tabs init guard
      sectionEl.querySelectorAll('[data-pulsar-esports]').forEach(function (s) {
        if (s._pulsarEsportsMq && s._pulsarEsportsMqHandler) {
          if (s._pulsarEsportsMq.removeEventListener) {
            s._pulsarEsportsMq.removeEventListener('change', s._pulsarEsportsMqHandler);
          } else if (s._pulsarEsportsMq.removeListener) {
            s._pulsarEsportsMq.removeListener(s._pulsarEsportsMqHandler);
          }
        }
        delete s._pulsarEsportsInit;
        delete s._pulsarEsportsMq;
        delete s._pulsarEsportsMqHandler;
      });
    }

  /* ------------------------------------------
     6b. WORD MASK REVEAL
     Owner: pulsar-animations.js.
     Target: .pulsar-word-reveal
     JS splits innerHTML into per-word overflow:hidden mask pairs, then
     staggers GSAP yPercent 110 → 0 for a premium cinema-style heading reveal.
     <br> tags are preserved. Safe fallback: if element also has
     .pulsar-heading-reveal, CSS keeps it opacity:0 until JS runs.
  ------------------------------------------ */
  function initWordMaskReveal(root) {
    root = root || document;
    if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) return;
    var scope = root === document ? document : root;

    scope.querySelectorAll('.pulsar-word-reveal').forEach(function (el) {
      if (!claimInit(el, '_pulsarWordRevealInit')) return;

      // Tokenise: split on <br> first, then split each chunk on spaces
      var raw    = el.innerHTML.trim();
      var chunks = raw.split(/(<br\s*\/?>)/gi);
      var rebuilt = chunks.map(function (chunk) {
        if (/^<br/i.test(chunk)) return chunk; // preserve line breaks as-is
        return chunk.split(/(\s+)/).map(function (part) {
          if (!part || /^\s+$/.test(part)) return part;
          return '<span class="pulsar-word-wrap" aria-hidden="false">' +
                   '<span class="pulsar-word-inner">' + part + '</span>' +
                 '</span>';
        }).join('');
      }).join('');
      el.innerHTML = rebuilt;

      var inners = el.querySelectorAll('.pulsar-word-inner');
      // Pin words out-of-view immediately (before paint)
      gsap.set(inners, { yPercent: 110 });
      // Container was opacity:0 from .pulsar-heading-reveal CSS — reveal it now
      el.style.opacity   = '1';
      el.style.transform = 'none';

      gsap.to(inners, {
        yPercent: 0,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.065,
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true,
          onEnter: function () { addVisibleState(el); }
        }
      });
    });
  }

  /* ------------------------------------------
     7. PARALLAX SCROLL
     Owner: pulsar-animations.js.
     Target: [data-pulsar-parallax]. Disabled on mobile < 768px.
     Strength controlled via data-pulsar-parallax-strength (default 30px).
  ------------------------------------------ */
  function initParallax(root) {
    root = root || document;
    if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) return;
    if (window.matchMedia('(max-width: 767px)').matches) return;

    var scope = root === document ? document : root;
    scope.querySelectorAll('[data-pulsar-parallax]').forEach(function (el) {
      if (el._pulsarParallaxInit) return;
      el._pulsarParallaxInit = true;
      var strength = parseFloat(el.dataset.pulsarParallaxStrength || '30');
      var trigger  = el.closest('section') || el.parentElement;
      gsap.fromTo(el,
        { y: 0 },
        {
          y: strength,
          ease: 'none',
          scrollTrigger: { trigger: trigger, start: 'top bottom', end: 'bottom top', scrub: true }
        }
      );
    });
  }

  /* ------------------------------------------
     8. HERO SLIDER — Multi-slide crossfade
     Owner: pulsar-animations.js.
     Single slide: no-op (mask reveals handled by revealHero).
     Multi-slide: GSAP crossfade + mask reveal per slide.
     data-slide-interval on .pulsar-hero__slides (ms, default 5000).
  ------------------------------------------ */
  function initHeroSlider(root) {
    root = root || document;
    var scope = root === document ? document : root;
    var slidesContainer = scope.querySelector('.pulsar-hero__slides');
    if (!slidesContainer || slidesContainer._pulsarHeroSliderInit) return;

    var slides = slidesContainer.querySelectorAll('.pulsar-hero__slide');
    if (slides.length < 2) return; // Single slide — revealHero already handled masks

    slidesContainer._pulsarHeroSliderInit = true;

    if (prefersReducedMotion) {
      slides.forEach(function (s, i) {
        s.style.opacity = i === 0 ? '1' : '0';
        if (i !== 0) s.setAttribute('aria-hidden', 'true');
      });
      return;
    }

    var current      = 0;
    var slideInterval = parseInt(slidesContainer.dataset.slideInterval || '5000', 10);

    function crossfadeTo(next) {
      if (next === current || !window.gsap) return;
      var from = slides[current];
      var to   = slides[next];

      // Animate out: mask-inner up, fade elements, fade slide
      var outMasks = from.querySelectorAll('.pulsar-hero__mask-inner');
      var outFade  = from.querySelectorAll('[data-pulsar-hero-element]');
      if (outMasks.length) gsap.to(outMasks, { yPercent: -105, duration: 0.38, ease: 'power2.in', stagger: 0.06 });
      if (outFade.length)  gsap.to(outFade,  { opacity: 0, y: -15, duration: 0.3, ease: 'power2.in', stagger: 0.06 });

      gsap.to(from, {
        opacity: 0,
        duration: 0.4,
        delay: 0.2,
        ease: 'power2.inOut',
        onComplete: function () {
          from.classList.remove('is-active');
          from.setAttribute('aria-hidden', 'true');
          // Reset outgoing for next cycle
          if (outMasks.length) gsap.set(outMasks, { yPercent: 105 });
          if (outFade.length)  gsap.set(outFade,  { opacity: 0, y: 30 });

          to.classList.add('is-active');
          to.removeAttribute('aria-hidden');
          current = next;

          // Animate in new slide
          var inMasks = to.querySelectorAll('.pulsar-hero__mask-inner');
          var inFade  = to.querySelectorAll('[data-pulsar-hero-element]');
          gsap.fromTo(to, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'none' });
          if (inMasks.length) {
            gsap.fromTo(inMasks, { yPercent: 105 }, { yPercent: 0, duration: 0.72, ease: 'power2.out', stagger: 0.12 });
          }
          if (inFade.length) {
            gsap.fromTo(inFade, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.12 });
          }
        }
      });
    }

    slidesContainer._pulsarSliderTimer = setInterval(function () {
      crossfadeTo((current + 1) % slides.length);
    }, slideInterval);
  }

  /* ------------------------------------------
     9. 3D CARD TILT
     Owner: pulsar-animations.js.
     Target: [data-pulsar-tilt]. Disabled on mobile + reduced-motion.
     Adds .has-pulsar-tilt class so CSS removes conflicting transform transition.
  ------------------------------------------ */
  function initCardTilt(root) {
    root = root || document;
    if (prefersReducedMotion || !window.gsap) return;
    if (window.matchMedia('(max-width: 767px)').matches) return;

    var scope = root === document ? document : root;
    scope.querySelectorAll('[data-pulsar-tilt]').forEach(function (card) {
      if (card._pulsarTiltBound) return;

      function onEnter() {
        gsap.to(card, { scale: 1.025, duration: 0.3, ease: 'power2.out' });
      }
      function onLeave() {
        gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: 'power2.out' });
      }
      function onMove(e) {
        var rect = card.getBoundingClientRect();
        var dx   = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
        var dy   = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
        gsap.to(card, {
          rotateY: dx * 9,
          rotateX: -dy * 6,
          transformPerspective: 900,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
      card.addEventListener('mousemove',  onMove);
      card._pulsarTiltBound = true;
      card._pulsarTiltEnter = onEnter;
      card._pulsarTiltLeave = onLeave;
      card._pulsarTiltMove  = onMove;
      card.classList.add('has-pulsar-tilt');
    });
  }

  /* ------------------------------------------
     10. QUICK-ADD MICRO-ANIMATION
     Owner: pulsar-animations.js.
     Target: .pulsar-merch__quick-add buttons.
     Scale pulse on card + opacity flash on button.
  ------------------------------------------ */
  function initQuickAddFeedback(root) {
    root = root || document;
    if (!window.gsap) return;

    var scope = root === document ? document : root;
    scope.querySelectorAll('.pulsar-merch__quick-add').forEach(function (btn) {
      if (btn._pulsarQaInit) return;
      btn._pulsarQaInit = true;

      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        var card = btn.closest('.pulsar-merch__card');
        if (!card) return;
        // Card pulse
        gsap.fromTo(card,
          { scale: 1 },
          { scale: 0.965, duration: 0.1, ease: 'power2.in', yoyo: true, repeat: 1,
            onComplete: function () { gsap.to(card, { scale: 1, duration: 0.2, ease: 'power2.out' }); }
          }
        );
        // Button flash for immediate submit feedback
        gsap.fromTo(btn,
          { opacity: 1 },
          { opacity: 0.45, duration: 0.12, ease: 'power2.in', yoyo: true, repeat: 1 }
        );
      });
    });
  }

  /* ------------------------------------------
     11. ESPORTS TAB / ACCORDION SYSTEM
     Owner: pulsar-animations.js. Replaces inline <script> in pulsar-esports-titles.liquid.
     Desktop (≥ 768px): GSAP opacity+y crossfade between panels.
     Mobile (< 768px):  GSAP height accordion via .pulsar-esports-titles__accordion-header.
  ------------------------------------------ */
  function initEsportsTabs(root) {
    root = root || document;
    var sections;
    if (root === document) {
      sections = Array.prototype.slice.call(document.querySelectorAll('[data-pulsar-esports]'));
    } else if (root.dataset && 'pulsarEsports' in root.dataset) {
      sections = [root];
    } else {
      sections = Array.prototype.slice.call(root.querySelectorAll('[data-pulsar-esports]'));
    }

    sections.forEach(function (section) {
      if (!section || section._pulsarEsportsInit) return;
      section._pulsarEsportsInit = true;

      var tabs = section.querySelectorAll('.pulsar-esports-titles__tab');
      var accordionHeaders = section.querySelectorAll('.pulsar-esports-titles__accordion-header');
      var panels = section.querySelectorAll('.pulsar-esports-titles__panel');
      var mq = window.matchMedia('(max-width: 767px)');

      function isMobile() { return mq.matches; }

      function getActiveKey() {
        var activeTab = section.querySelector('.pulsar-esports-titles__tab.is-active');
        if (activeTab) return activeTab.dataset.tab;
        var activePanel = section.querySelector('.pulsar-esports-titles__panel.is-active');
        if (activePanel) return activePanel.dataset.panel;
        return panels.length ? panels[0].dataset.panel : '';
      }

      function getPanelBody(panel) {
        return panel ? panel.querySelector('.pulsar-esports-titles__panel-body') : null;
      }

      function setActiveStates(key) {
        tabs.forEach(function (t) {
          var on = t.dataset.tab === key;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.setAttribute('tabindex', on ? '0' : '-1');
        });
        accordionHeaders.forEach(function (h) {
          var on = h.dataset.tab === key;
          h.setAttribute('aria-expanded', on ? 'true' : 'false');
          h.classList.toggle('is-active', on);
        });
      }

      function syncDesktopPanels(key) {
        panels.forEach(function (panel) {
          var on = panel.dataset.panel === key;
          var body = getPanelBody(panel);
          panel.classList.toggle('is-active', on);
          if (on) {
            panel.removeAttribute('hidden');
          } else {
            panel.setAttribute('hidden', '');
          }
          if (body) {
            body.removeAttribute('hidden');
            body.style.height = '';
            body.style.overflow = '';
            body.style.opacity = '';
          }
        });
      }

      function syncMobilePanels(key) {
        panels.forEach(function (panel) {
          var on = panel.dataset.panel === key;
          var body = getPanelBody(panel);
          panel.classList.toggle('is-active', on);
          panel.removeAttribute('hidden');
          if (!body) return;
          body.style.height = '';
          body.style.overflow = '';
          body.style.opacity = '';
          if (on) {
            body.removeAttribute('hidden');
          } else {
            body.setAttribute('hidden', '');
          }
        });
      }

      function syncMode(key) {
        setActiveStates(key);
        if (isMobile()) {
          syncMobilePanels(key);
        } else {
          syncDesktopPanels(key);
        }
      }

      function switchDesktop(key) {
        var from = section.querySelector('.pulsar-esports-titles__panel.is-active');
        var to   = section.querySelector('#panel-' + key);
        var fromBody = getPanelBody(from);
        var toBody = getPanelBody(to);
        if (!to || from === to) return;

        setActiveStates(key);

        if (window.gsap && from) {
          gsap.fromTo(from,
            { opacity: 1, y: 0 },
            {
              opacity: 0, y: -10, duration: 0.25, ease: 'power2.in',
              onComplete: function () {
                from.classList.remove('is-active');
                from.setAttribute('hidden', '');
                if (fromBody) fromBody.removeAttribute('hidden');
                to.removeAttribute('hidden');
                to.classList.add('is-active');
                if (toBody) toBody.removeAttribute('hidden');
                gsap.fromTo(to,
                  { opacity: 0, y: 15 },
                  { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                );
              }
            }
          );
        } else {
          syncDesktopPanels(key);
        }
      }

      function switchMobile(key) {
        var from = section.querySelector('.pulsar-esports-titles__panel.is-active');
        var to   = section.querySelector('#panel-' + key);
        var fromBody = getPanelBody(from);
        var toBody = getPanelBody(to);
        if (!to || from === to || !toBody) return;

        setActiveStates(key);

        function openBody(body, panel) {
          panel.classList.add('is-active');
          body.removeAttribute('hidden');
          if (!window.gsap) return;
          var h = body.scrollHeight;
          gsap.fromTo(body,
            { height: 0, opacity: 0, overflow: 'hidden' },
            { height: h, opacity: 1, duration: 0.4, ease: 'power2.out',
              onComplete: function () {
                body.style.height = 'auto';
                body.style.overflow = '';
                body.style.opacity = '';
              }
            }
          );
        }

        if (from && fromBody && window.gsap) {
          gsap.fromTo(fromBody,
            { height: fromBody.offsetHeight, opacity: 1, overflow: 'hidden' },
            {
              height: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut',
              onComplete: function () {
                from.classList.remove('is-active');
                fromBody.setAttribute('hidden', '');
                fromBody.style.height = '';
                fromBody.style.overflow = '';
                fromBody.style.opacity = '';
                openBody(toBody, to);
              }
            }
          );
        } else {
          if (from && fromBody) {
            from.classList.remove('is-active');
            fromBody.setAttribute('hidden', '');
          }
          openBody(toBody, to);
        }
      }

      function onSwitch(key) {
        if (isMobile()) {
          switchMobile(key);
        } else {
          switchDesktop(key);
        }
      }

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () { onSwitch(this.dataset.tab); });
      });
      accordionHeaders.forEach(function (h) {
        h.addEventListener('click', function () { onSwitch(this.dataset.tab); });
      });

      tabs.forEach(function (tab, i) {
        tab.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(i + 1) % tabs.length].focus(); }
          if (e.key === 'ArrowLeft')  { e.preventDefault(); tabs[(i - 1 + tabs.length) % tabs.length].focus(); }
        });
      });

      section._pulsarEsportsMq = mq;
      section._pulsarEsportsMqHandler = function () {
        syncMode(getActiveKey());
      };

      if (mq.addEventListener) {
        mq.addEventListener('change', section._pulsarEsportsMqHandler);
      } else if (mq.addListener) {
        mq.addListener(section._pulsarEsportsMqHandler);
      }

      syncMode(getActiveKey());
    });

    initPlayerDrawer();
  }

  /* ------------------------------------------
     12. PLAYER SOCIAL DRAWER — Global singleton
     Owner: pulsar-animations.js. Replaces inline <script> in pulsar-esports-titles.liquid.
     Uses document-level event delegation — safe across section reloads.
  ------------------------------------------ */
  var _drawerDocListenersAdded = false;
  var _drawerFocusPrev         = null;

  function _getDrawerEls() {
    return {
      drawer: document.getElementById('pulsar-player-drawer'),
      nameEl: document.getElementById('pulsar-drawer-name'),
      gameEl: document.getElementById('pulsar-drawer-game')
    };
  }

  function _openDrawer(playerName, game) {
    var els = _getDrawerEls();
    if (!els.drawer) return;
    els.nameEl.textContent = 'PSR ' + playerName;
    els.gameEl.textContent = game.toUpperCase();
    els.drawer.removeAttribute('hidden');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { els.drawer.classList.add('is-open'); });
    });
    document.body.style.overflow = 'hidden';
  }

  function _closeDrawer() {
    var els = _getDrawerEls();
    if (!els.drawer || !els.drawer.classList.contains('is-open')) return;
    els.drawer.classList.remove('is-open');
    document.body.style.overflow = '';
    var panel = els.drawer.querySelector('.pulsar-player-drawer__panel');
    if (!panel) { els.drawer.setAttribute('hidden', ''); return; }
    var onEnd = function () {
      els.drawer.setAttribute('hidden', '');
      panel.removeEventListener('transitionend', onEnd);
      if (_drawerFocusPrev) { _drawerFocusPrev.focus(); _drawerFocusPrev = null; }
    };
    panel.addEventListener('transitionend', onEnd);
  }

  function initPlayerDrawer() {
    if (_drawerDocListenersAdded) return;
    _drawerDocListenersAdded = true;

    document.addEventListener('click', function (e) {
      var card = e.target.closest('[data-pulsar-player]');
      if (card) { _drawerFocusPrev = card; _openDrawer(card.dataset.pulsarPlayer, card.dataset.pulsarGame || ''); return; }
      if (e.target.closest('.pulsar-player-drawer__close') || e.target.id === 'pulsar-drawer-backdrop') {
        _closeDrawer();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        var card = e.target.closest('[data-pulsar-player]');
        if (card) { e.preventDefault(); _drawerFocusPrev = card; _openDrawer(card.dataset.pulsarPlayer, card.dataset.pulsarGame || ''); }
      }
      if (e.key === 'Escape') { _closeDrawer(); }
    });
  }

  /* ------------------------------------------
     6. SHOPIFY EDITOR SECTION LIFECYCLE
  ------------------------------------------ */
  document.addEventListener('shopify:section:load', function (e) {
    var sectionEl = e.target;
    if (!sectionEl) return;
    destroySection(sectionEl); // clean stale state before re-init
    initSection(sectionEl);
  });

  document.addEventListener('shopify:section:unload', function (e) {
    if (e.target) destroySection(e.target);
  });

  /* ------------------------------------------
     INIT
  ------------------------------------------ */
  function init() {
    if (prefersReducedMotion) {
      finalizeVisibleSet(
        document,
        '.pulsar-reveal, .pulsar-heading-reveal, [data-pulsar-hero-element], .pulsar-stagger-item, .pulsar-videos__item, .pulsar-partners__logo-link, .pulsar-esports-titles__tab, .pulsar-cta__heading'
      );
      document.querySelectorAll('.pulsar-hero__mask-inner').forEach(function (el) {
        el.style.transform = 'none';
      });
      initInteractiveFeatures(document);
      initStatCountersIn(document);
      return;
    }

    waitFor(
      function () { return window.gsap && window.ScrollTrigger; },
      function () {
        gsap.registerPlugin(ScrollTrigger);
        runPreloader();
        initScrollAnimationsIn(document);
        initStatCountersIn(document);
        requestAnimationFrame(function () {
          ScrollTrigger.refresh();
        });
      }
    );

    // Emergency fallback: GSAP failed to load within 5s
    setTimeout(function () {
      if (!(window.gsap && window.ScrollTrigger)) {
        revealHero();
        initScrollAnimationsIn(document);
        initStatCountersIn(document);
      }
    }, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose public API
  window.PulsarAnimations = {
    initSection:    initSection,
    destroySection: destroySection
  };

})();
