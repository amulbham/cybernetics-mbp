# Owner guide: Git, branches and cloud sessions

For Amul. Short on purpose; the rules live in [PLANNING](PLANNING.md) (who may do what), [AGENTS](AGENTS.md) (how deploys work) and [PUBLISHING](PUBLISHING.md) (content flow).

## Workspace versus branch
A **workspace** is a temporary copy of the repository on some machine (your laptop, or a cloud session). A **branch** is a named line of work inside the repository on GitHub. A cloud workspace is not a kept copy: what lasts is what was **committed and pushed**. Retention beyond that depends on the environment, so don't rely on it.

## The branches
- **`main`**: the source of the live website.
- **`staging`**: a rehearsal copy of the website, blocked from search engines.
- **`planner/context`**: notes, plans, tickets and audit reports. It never publishes.
- **Task branches** (for example a reviewer's): one job's draft. Unmerged work on them changes nothing on the site.

## The Git words
- **Fetch**: look at what is new on GitHub without changing your copy. **Pull**: fetch, then bring it in.
- **Commit**: save a snapshot in your copy. **Push**: upload commits to a branch on GitHub.
- **Pull request**: a request to bring one branch into another. **Merge**: do it. Merging into `main` counts as pushing to `main`.

## What deploys the website
Three things, all running the same GitHub Actions workflow:
1. A push to `main` or `staging`, including merging a pull request into either.
2. **Run workflow** on the [Actions page](https://github.com/amulbham/cybernetics-mbp/actions/workflows/deploy-pages.yml) by hand.
3. **Re-run** of an earlier run.

Pushing `planner/context` or a task branch, or opening a pull request, deploys nothing. Treat all three actions as deployments: ask before doing them on `main`.

## `main` is source, not proof
Live is only what the last **successful** run deployed. If a run on `main` fails before its "Deploy to Cloudflare Pages" step (the PDF safety guard or a check), production stays on the earlier deployment even though `main` already has the new commit. If it fails after that step, the files were uploaded but a final check complained; ask the Planner to look. Check the run for `main`'s latest commit before saying "it's live".

## Who does what
**The agent does routinely** (inside one sealed ticket): fetch, read, edit only the ticket's paths, commit, push to the assigned branch, report evidence. **You approve**: tickets and scope, accepting results, anything reaching `main` or `staging`, running or re-running the workflow, repository variables, indexing, wording, Zenodo and DOI steps, and deleting a branch that holds unaccepted work.

## Branch custody
Keep a task branch until its work is accepted, merged or deliberately abandoned, and any file you need from it has been copied somewhere durable. Deleting a branch removes its name, and unmerged commits are not part of `main`'s history. A pushed branch is the handoff; a chat message is not.

## Starting a session and getting results
Open Claude Code on the web, choose the repository and the branch named in the ticket (`planner/context` for notes), and paste the prompt for the role from the [review and task entry](planning/audits/sprint-25/README.md):
- **Reviewer**: reads an exact commit and writes a review file; needs explicit write permission.
- **Planner**: resumes from `planner/STATE.md` (see the [Planner README](../planner/README.md)), checks the latest branches, proposes the next gate.
- **Executor**: runs one sealed ticket and stops at its gate.

Find results in the commit the agent reports, the file on its branch, the ticket's completion report, or the Actions run for deployments. Return it by giving the Planner the commit; the Planner records acceptance in STATE.

## What cloud sessions have shown so far
Reading Actions runs and logs and pushing a report to `planner/context` worked. Reading repository variables and running the full PDF build in the cloud are untested.
