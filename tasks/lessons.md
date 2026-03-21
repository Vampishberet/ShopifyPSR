# Claude Lessons Learned

## BASELINE RULE — All Subagents Must Read This File

Every subagent in `.claude/agents/` must read `tasks/lessons.md` at the start of execution, before touching any file. No exceptions. The rules in this file override any prior assumption, default behavior, or individual agent prompt. If a lesson conflicts with what an agent was about to do, the lesson wins.

---

[2026-03-18] 
- **What went wrong**: Wrote a glitchy, unreliable `requestAnimationFrame` loop for the stats counter instead of using a modern browser API.
- **Rule to follow next time**: ALL scroll-driven element reveals or logic (like stat counters, number tickers, or autoplay videos) MUST use `IntersectionObserver`. Never write a blind scroll listener or looping script for viewport detection. Code reliability is the baseline for premium UI.
