# Owner guide: Git, branches and cloud sessions

For Amul. Short on purpose. Rules live in [PLANNING](PLANNING.md) (who may do what), [AGENTS](AGENTS.md) (how deploys work) and [PUBLISHING](PUBLISHING.md) (content flow).

## Workspace versus branch
A **workspace** is a temporary copy of the repository on some machine (your laptop, or a cloud session). A **branch** is a named line of work inside the repository on GitHub. A cloud workspace is not a kept copy: what lasts is what was **committed and pushed**. Retention beyond that is environment-specific.

## The branches
- **`main`**: the source of the live website.
- **`staging`**: a rehearsal copy of the website, blocked from search engines.
- **`planner/context`**: notes, plans, tickets and audit reports. Pushing to it deploys nothing automatically.
- **Task branches**: one job's draft. Unmerged work on them changes nothing on the site.

## The Git words
- **Fetch**: look at what is new on GitHub without changing your copy. **Pull**: fetch, then bring it in.
- **Commit**: save a snapshot in your copy. **Push**: upload commits to a branch on GitHub.
- **Pull request**: a request to bring one branch into another. **Merge**: do it. Merging into `main` counts as pushing to `main`.

## What deploys the website
Three things run the deploy workflow:
1. A push to `main` or `staging`, including merging a pull request into either.
2. **Run workflow** on the [Actions page](https://github.com/amulbham/cybernetics-mbp/actions/workflows/deploy-pages.yml) by hand.
3. **Re-run** of an earlier run.

Pushing `planner/context` or a task branch, or opening a pull request, deploys nothing automatically. Treat all three actions as deployments that need your authorization. An approval that already covers an action stands; a retry is covered only if you said so.

## `main` is source, not proof
What is live is whatever the last run uploaded in its "Deploy to Cloudflare Pages" step. If a run on `main` fails before that step (the PDF safety guard, a build or a check), production stays on the earlier deployment even though `main` has the new commit. If it fails after that step, the upload may already have happened and only the final verification complained; a red run is not proof that nothing deployed, so ask the Planner to look. Check the run's steps before saying "it's live".

## Who does what
**The agent does routinely** (inside one sealed ticket): fetch, read, edit only the ticket's paths, commit, push to its permitted branch, validate and report evidence. **You approve**: the initial ticket scope and publishing risk, substantive manuscript/identity/DOI/indexing choices, any action not already authorized by the ticket, and production release. **Staging is a deployment, but a future sealed ticket may explicitly preauthorize its closed-indexing fast-forward/deploy once named checks PASS**; do not ask twice for that same action. If the ticket instead requires a separate exact-candidate owner go (as T25.5 did), obtain it. Manual reruns/rollback are not automatically permitted. See [PLANNING.md §7](PLANNING.md) for approval-by-exception, stop conditions and proportional verification.

## Branch custody
Keep a task branch until its work is accepted, merged or deliberately abandoned, and anything you need from it is preserved elsewhere. Deleting a branch removes its name, and unmerged commits are not in `main`'s history. A pushed branch is the handoff; a chat message is not.

## Starting a session and getting results
Start a Claude Code session: choose the repository and the branch named in the ticket (`planner/context` for notes), and paste the prompt for the role from the [review and task entry](planning/audits/sprint-25/README.md):
- **Reviewer**: reads an exact commit and writes a review file; needs explicit write permission.
- **Planner**: resumes from `planner/STATE.md` (see the [Planner README](../planner/README.md)), checks the latest branches, proposes the next gate.
- **Executor**: runs one sealed ticket and stops at its gate.

Find results in the commit the agent reports, the file on its branch, the ticket's completion report, or the Actions run. Return them by giving the Planner the commit; the Planner records acceptance in STATE.

## What cloud sessions have shown so far
Reading Actions runs and logs and pushing a report to `planner/context` worked. Reading repository variables was blocked (access denied) in the session that tried; a full PDF build in the cloud is untested.
