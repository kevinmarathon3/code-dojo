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
- GitHub authentication/connection did not work on this machine, so no GitHub repository was created remotely and no Pages site was published. The GitHub Actions workflow and independent local repository are prepared.
- Java's Maven networking failed on this host. Official Scala compiler artifacts were cached in ignored `.toolchains/maven` using `scripts/cache-scala.mjs`; Scala then passed all 12 unit checks without remote dependency access.
