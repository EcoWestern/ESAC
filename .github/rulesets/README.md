# Rulesets as code

Two rulesets, kept here so the settings are reviewable and versioned rather than living only in a
web form. GitHub does not apply them automatically: nothing in this directory takes effect on
push. Apply them once per repository, by hand.

The suite repository, `EcoWestern/ESAC-GI`, carries its own copies of these files with its own
required checks. The two repositories have different CI, so they cannot share one ruleset.

## What they do

`main.json` protects the default branch:

| Rule | Effect |
|---|---|
| `deletion` | The branch cannot be deleted. |
| `non_fast_forward` | Force pushes are refused, so a rewritten history cannot silently replace what CI verified. |
| `required_linear_history` | Merge commits are refused, so history stays a readable sequence of one commit per change. |
| `required_status_checks` | The `Check links` job must have passed for the commit. |

`tags.json` protects release tags:

| Rule | Effect |
|---|---|
| `deletion` | A published `v*` tag cannot be deleted. |
| `update` | A published tag cannot be moved to a different commit, so a version tag keeps meaning one specific tree. |

Both carry a bypass for the repository admin role (`actor_id: 5`). That is deliberate, and it is
the part worth thinking about:

- **With the bypass**, the maintainer can still push to `main` directly, which is how this project
  is developed, and CI stays advisory for that role while remaining binding for anyone else.
- **Without the bypass**, `required_status_checks` blocks direct pushes entirely, because a check
  cannot have passed on a commit that does not exist yet. That effectively requires a
  pull-request flow, which contradicts the policy in `CONTRIBUTING.md`. Removing the
  `bypass_actors` block is a policy change rather than a tightening of one.

## The required check

`Check links` is a job in `.github/workflows/pages.yml`. It is split out from the site build on
purpose: it runs on pull requests as well as on `main`, it takes seconds, and it does not depend
on Pages being enabled, so it is meaningful as a gate. It runs `tools/check-links.mjs`, which
fails when a relative link does not resolve or when a page named in the site navigation is
missing.

The context string must match the job's `name:` exactly. To read the names that actually ran:

```bash
gh api repos/EcoWestern/ESAC/commits/main/check-runs --jq '.check_runs[].name'
```

A check is only selectable in the ruleset after it has run on the branch at least once.

## Applying them

Through the interface, which needs no tooling: **Settings**, **Rules**, **Import a ruleset**, then
choose the file. The interface shows the resulting diff before saving, which is the safer way to
do it once.

With the GitHub CLI installed and authenticated as a repository admin:

```bash
gh api --method POST repos/EcoWestern/ESAC/rulesets --input .github/rulesets/main.json

gh api --method POST repos/EcoWestern/ESAC/rulesets --input .github/rulesets/tags.json
```

Both are single lines on purpose: a trailing backslash is a bash continuation, and pasting one
into PowerShell is a parse error that runs nothing at all, including the lines above it.

Verify afterwards, and confirm the enforcement level reads `active` rather than `evaluate`, which
would only report violations instead of preventing them:

```bash
gh api repos/EcoWestern/ESAC/rulesets --jq '.[] | "\(.name) \(.enforcement)"'
```

If the API rejects a rule type, it is the rule rather than the file: remove that rule and re-run.
The interface names the equivalent checkbox.
