# Verification — 2026-09-16

## Passed

- Production TypeScript/Vite build.
- 12 automated tests covering the 180 exercise records, bilingual content, distinct teaching/practice variants, exact teaching-line references, review scheduling, mastery, backup validation, lab integrity, engineering coverage, process timeouts, output limits, and invalid runner requests.
- Real compiler/interpreter verification for all 60 units: each reference program produces its expected result and its intentionally broken counterpart fails compilation, fails execution, or produces a different result. The 180 exercises share those 60 reference programs. Numeric variants beyond the reference run are checked structurally, not all executed exhaustively.
- Go 1.27.1, Rust 1.95.0, Azul JDK 21.0.12.1, CPython 3.9.6, Scala 3.9.0 through Scala CLI 1.17.0. Project-local compiler paths are in ignored `.env.local`.
- Desktop browser smoke checks: prediction/completion, visual-lab prediction gates, engineering responses, language changes, persisted level/language, and no runtime errors during the checked flows.
- Latest lesson sequence verified in the in-app browser: lesson → animation → two worked examples → a different practice variant. The question input is absent before the practice phase.
- Spanish mobile sequence verified at 390 × 844. No horizontal page overflow; animation explanation and code fit. Desktop/iPhone-sized Chromium checks also verified persistent mobile tabs and reduced motion.
- Production build loaded under `/code-dojo/`, reproducing a GitHub Pages repository path. The production bundle omits capability discovery and has no localhost runner connection.
- Local runner rejects an outside Origin with HTTP 403; a local Python execution returns the expected result.

## Limits and deployment status

- Physical iPhone Safari was not available for direct testing. Mobile Chromium/in-app checks do not establish full physical-device Safari compatibility.
- This is an authored conceptual teaching tool, not a live memory/thread debugger or a general browser compiler.
- Native execution is for trusted personal code and is not a security sandbox. Scala cold compilation may take significantly longer than a short drill.
- Initial GitHub authentication/connection problems were resolved on September 17. The public repository and GitHub Pages deployment are now live.
- Java's Maven networking failed on this host. Official Scala compiler artifacts were cached in ignored `.toolchains/maven` using `scripts/cache-scala.mjs`; Scala then passed all 12 unit checks without remote dependency access.

## Deployment — 2026-09-17

- Published at https://kevinmarathon3.github.io/code-dojo/ from the independent repository https://github.com/kevinmarathon3/code-dojo.
- GitHub Actions build, automated tests, and Pages deployment succeeded: https://github.com/kevinmarathon3/code-dojo/actions/runs/35275199214.
- Verified the public Spanish page in the in-app browser, including the conceptual animation, worked examples, and return to the lesson. Left the first lesson open in Spanish.

## Single-panel update — 2026-09-17

- Removed desktop split panels, resize controls, and separate mobile Code/Lesson tabs. Practice editor is inline; teaching phases show no editor.
- Added Simple/Technical animation views to guided lessons and visual labs, with shared playback and selectable source lines. Technical state is conceptual; unmodeled lines do not fabricate memory snapshots.
- Verified Spanish lesson, technical tab, and inline practice in the browser. No splitter remains. Production build and all 12 automated tests passed.

## Guided-game update — 2026-09-18

- Added a compact home path, one-action lesson cards, beginner numeric answer tiles, optional editor, and an end-of-round screen after three challenges. Preserved bilingual content, simple/technical animation tabs, two worked examples, advanced labs, and engineering topics.
- Browser verification completed a Spanish Python round through teaching, animation, examples, recognition, completion, repair, success, and next lesson. At 390 × 844, the home path had no horizontal overflow.
- Numeric recognition responses are recorded as assisted; existing unassisted mastery requirements remain in force. Production build and all 12 automated tests passed.

## Beginner-first teaching — 2026-09-18

- Replaced vague beginner titles with explicit learning goals across five languages. All 20 beginner units now introduce a real-world goal without code, explain a small expression, then offer an interactive full-program line walkthrough.
- Explained chosen identifiers (score, x, double/twice), declaration syntax, entrypoints, printing, conditions, loops, and list transformations. Technical line inspection uses the same authored explanations.
- Added SVG teaching scenes for points being stored/updated/copied to output, conditional paths, repeated accumulation, function input/result travel, and list mapping. CSS motion honors reduced-motion preferences. Scenes represent logical values, not physical allocations.
- Browser checks: Spanish Go intro contains no code; declaration explanation precedes full source; selecting func main explains both terms; play reaches final output while retaining score; animation fits a 390px viewport without horizontal overflow.
- Production build and 15 tests passed, including beginner intro coverage for both locales/all languages and animation before/after values.
- Official references reviewed: [Go packages](https://go.dev/tour/basics/1), [Go declarations](https://go.dev/tour/basics/10), [Rust mutability](https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html), [Java getting started](https://dev.java/learn/getting-started/), [Python introduction](https://docs.python.org/3/tutorial/introduction.html), [Scala basics](https://docs.scala-lang.org/tour/basics.html), and [Scala main methods](https://docs.scala-lang.org/scala3/book/methods-main-methods.html). Java examples retain the conventional explicit main signature used by this curriculum.
