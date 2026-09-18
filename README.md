# Code Dojo

A personal, bilingual coding dojo for **Go, Rust, Java, Python, and Scala 3**. Independent of any other project in its parent folder.

**Play online:** [Español](https://kevinmarathon3.github.io/code-dojo/?lang=es) · [English](https://kevinmarathon3.github.io/code-dojo/?lang=en). The online version supports lessons, conceptual animations, and constrained practice; native code execution requires the local runner.

## Start locally

Requires Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:5173/**. The development command starts Vite and the local runner (port 4318). Keep the terminal running. Select **English / Español** at the top; the selection is saved on this device. `?lang=es` can explicitly open a Spanish preview.

The interface uses one centered learning panel. The editor appears within practice. Animations offer **Simple** and **Technical** tabs with shared playback; the technical view includes conceptual state and selectable source lines. These authored models do not claim to trace arbitrary code or expose actual memory addresses.

Each unit begins with **Lesson → Animation → Two worked examples → Practice**. The practice values differ from the teaching examples. Use the numbered path to revisit an explanation. Practice has prediction, completion, and repair forms, and a real-code scratchpad when a local toolchain is available.

The curriculum contains 60 units, 180 exercise records, seven numeric variants per record, 12 two-scenario visual labs with prediction/application checkpoints, and 12 engineering case studies. Variants change small inputs; they are not a claim of 1,260 independently authored problems or complete coverage of these languages.

## Local compilers

Install the language tools you want on `PATH`:

| Language | Tool | Baseline used by the lessons |
|---|---|---|
| Go | `go` | Go 1.18+ (generics) |
| Rust | `rustc` | Rust 2021 edition |
| Java | `javac`, `java` | JDK 17+ |
| Python | `python3` | CPython 3.9+ |
| Scala | `scala-cli`, Java | Scala 3, JDK 17+ |

The runner checks availability at startup. Restart the app after installing tools. Scala CLI downloads its compiler on first use; warm that cache before relying on offline execution.

Optional `.env.local` can set `DOJO_GO`, `DOJO_RUST`, `DOJO_JAVAC`, `DOJO_JAVA`, `DOJO_PYTHON`, `DOJO_SCALA`, or `DOJO_SCALA_JAR`. Executable overrides are paths, not shell commands. `JAVA_HOME` and `COURSIER_REPOSITORIES` are passed to Scala CLI.

For this Apple Silicon development machine, optional installers place tools in ignored `.toolchains/` without modifying system installations:

```sh
node scripts/setup-local-tools.mjs
# Alternate official JDK + Maven Central distribution, if GitHub downloads fail:
node scripts/setup-jvm-tools.mjs
# If the JVM cannot fetch Maven dependencies, prepare an official local artifact cache:
node scripts/cache-scala.mjs
```

The convenience installers are macOS ARM64 specific. The ordinary app and runner work with installed toolchains on other systems. `.env.local` and `.toolchains/` must never be committed.

The cache helper pins Scala 3.9.0 in the local configuration. Standard installations can use the Scala CLI default. See `VERIFICATION.md` for the tested versions and remaining deployment/device limitations.

**Execution is for trusted personal code.** A native compiler process is not a security sandbox. The server binds to loopback, checks the host/origin, limits request/output size, applies timeouts, and uses temporary workspaces. It deliberately exposes no shell endpoint. Do not publish, forward, or tunnel the runner. Submitted programs retain the permissions of the user running the app.

## GitHub Pages

Publish **this folder as the repository root**, not the surrounding Monday webhook workspace. The included `.github/workflows/pages.yml` deploys the static `dist` build on pushes to `main`.

1. Create a GitHub repository for Code Dojo and push this folder.
2. Under **Settings → Pages**, select **GitHub Actions** as the source.
3. Run the Deploy Code Dojo workflow or push to `main`.
4. Open the resulting `https://OWNER.github.io/REPOSITORY/` URL on iPhone Safari.

The static build uses relative asset paths, has no server dependency, and **never contacts a localhost runner**. Visual labs and constrained answer checks work there. Arbitrary Go/Rust/Java/Python/Scala execution is local-only. Hosted exercise checks compare a documented token/expression or output, not a general semantic proof of arbitrary code correctness.

## Progress and learning

Progress and preferences use IndexedDB. Export/import a versioned JSON backup from settings. Import replaces current progress; export first if needed. Localhost, GitHub Pages, and different devices have separate storage. Browsers can clear site data, so backups matter.

Independent successful reviews are scheduled at approximately 1, 3, 7, and 14 days. Errors and revealed solutions return sooner. Belts require unassisted checkpoint success on different variants in sessions at least one day apart. Viewing an animation does not earn mastery. These rules are learning heuristics, not validated proficiency certification.

All simulations are deterministic authored conceptual models. They do not inspect arbitrary edited code or real runtime memory. The adjacent code editor is an independent execution surface. Python hints, Java erasure, Rust ownership, and event-loop scheduling have distinct semantics; examples state their language/model assumptions.

Sound effects are opt-in, default muted, and have visual equivalents. There is no narration. Reduced-motion settings disable moving transitions. Mobile uses persistent Lesson/Code tabs; diagrams remain usable without hover.

## Verification

```sh
npm test
npm run build
npm run verify:curriculum
```

`verify:curriculum` compiles/runs one reference and one intentionally broken variant for each of the 60 units, reports unavailable toolchains as skipped, and fails if a broken example passes. The three exercise forms share each unit's reference program.

`scripts/browser-check.mjs` is a repeatable development smoke test using Playwright, with optional `CHROME_PATH`. It checks lesson sequencing, drills, predictions, translations, persistence, mobile layouts, and reduced motion. The browser must be installed separately. iPhone viewport emulation is not physical iPhone Safari testing.

## Content sources and assumptions

- [Go language specification](https://go.dev/ref/spec): declarations, interfaces, channels, and type parameters.
- [Rust ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html) and [references](https://doc.rust-lang.org/core/primitive.reference.html): borrowing/lifetime models. Lifetime annotations do not extend object lifetime.
- [Java generics](https://docs.oracle.com/javase/tutorial/java/generics/types.html) and [type erasure](https://docs.oracle.com/javase/tutorial/java/generics/genTypes.html): compiler constraints do not imply reified type parameters.
- [Python threading](https://docs.python.org/3.13/library/threading.html): CPU parallelism depends on interpreter/build; free-threaded CPython differs from GIL-enabled builds.
- [Scala 3 book](https://docs.scala-lang.org/scala3/book/introduction.html) and [concurrency](https://docs.scala-lang.org/scala3/book/concurrency.html): Scala 3 syntax and futures.
- [Reduced-motion guidance](https://www.w3.org/WAI/WCAG21/Techniques/css/C39.html).

Engineering cases express tradeoffs under their stated constraints; they do not prescribe one architecture for all projects.
