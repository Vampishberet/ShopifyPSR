# Claude Lessons Learned

[2026-03-18] 
- **What went wrong**: Wrote a glitchy, unreliable `requestAnimationFrame` loop for the stats counter instead of using a modern browser API.
- **Rule to follow next time**: ALL scroll-driven element reveals or logic (like stat counters, number tickers, or autoplay videos) MUST use `IntersectionObserver`. Never write a blind scroll listener or looping script for viewport detection. Code reliability is the baseline for premium UI.
