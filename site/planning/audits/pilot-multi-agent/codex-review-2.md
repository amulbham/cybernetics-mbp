1. **Stale baseline — RESOLVED:** P1 replaces obsolete edit assumptions with a link audit; its named branch and full baseline SHA match the checkout.
2. **Hash rule — RESOLVED:** P1 explicitly treats `2a50965` as an intentional historical pointer and limits verification to `git cat-file -t`.
3. **Branch/baseline/commit-push boundary — RESOLVED:** Execution branch and immutable diff baseline are named, audit artifacts are allowed, and commit/push are forbidden.
4. **Line counting — RESOLVED:** The former changed-line limit is replaced by a straightforward maximum of 60 lines in the single output file.

New issues:

- **REQUIRED — Scope/method mismatch:** The goal covers every relative link **and path**, but the method covers only Markdown link targets; explicitly include bare/backticked paths or narrow the goal so completeness is reproducible.