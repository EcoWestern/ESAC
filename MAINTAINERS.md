# Maintainer notes

Repository settings, and the chores that go with them. None of it is normative and none of it is
the reader's business, which is why it lives here rather than in the README.

Two repositories carry the program:

| Repository | What it is |
|---|---|
| `EcoWestern/ESAC` | this one. The constitution, the amendments, the suite pages, and the documentation site. |
| `EcoWestern/ESAC-GI` | the first suite. Harness, items, graders, CLI, tests. |

## Settings that live in a web form

Nothing below is a file, so nothing below is reviewable in a diff. That is the reason it is
written down at all.

### Description and topics

Both are edited on the repository page: **About**, then the gear icon. Paste the description,
then paste the topics, which the field splits on commas.

`EcoWestern/ESAC`, 312 characters:

```
A program of compact benchmarks that measure difficult capabilities without measuring budget. Two suites: ESAC-GI, released and runnable, and ESAC-AG, specified and not yet implemented. Items are generators rather than stored questions, and every score carries the version tag of the instrument that produced it.
```

```
benchmark, ai-benchmark, llm, llm-benchmark, llm-evaluation, evaluation, general-intelligence, agentic-ai, agentic-evaluation, specification, reproducibility, contamination, documentation, mit-license, ecowestern
```

`EcoWestern/ESAC-GI`, 277 characters:

```
A short, cheap benchmark that measures difficult capabilities: 42 generated items, 75 points across 8 categories. 60 points graded deterministically, 15 by a pinned open-weight judge. Answers are computed from a seed rather than stored, so the repository is the whole artifact.
```

```
benchmark, ai-benchmark, llm, llm-benchmark, llm-evaluation, evaluation, general-intelligence, reproducibility, contamination, judge, rubric, scoring, openai-compatible, openrouter, cli, typescript, zero-dependencies, mit-license
```

With the GitHub CLI installed (`winget install --id GitHub.cli`, then `gh auth login`), `gh repo
edit <repo> --description "..."` plus one `--add-topic` flag per topic does the same. Keep each
command on one line: a trailing backslash is a bash continuation, and PowerShell runs nothing at
all when it sees one, including the lines above it.

Set the website field to the Pages URL once the site is live.

### Rulesets

Two rulesets, as JSON in the suite repository's `.github/rulesets/`: `main.json` for the default
branch, which refuses deletion, force pushes, and merge commits and requires the CI checks, and
`tags.json` for `v*`, which refuses deletion and moving. Pushing them applies nothing; each is
imported once per repository through **Settings**, **Rules**, **Import a ruleset**.

Both carry a bypass for the repository admin role, and that is deliberate. Requiring status checks
without a bypass blocks direct pushes to `main` entirely, because a check cannot have passed on a
commit that does not exist yet, which would force the pull request flow that `CONTRIBUTING.md`
rules out. Removing the bypass is a policy change rather than a tightening.

The check names in `main.json` must match the CI job names exactly, matrix value included, and they
are only selectable once CI has run on the branch.

### Security features

| Setting | Why it matters here |
|---|---|
| Private vulnerability reporting | `SECURITY.md` in both repositories links to the advisory form. Until this is on, that link is dead and there is no private route for a report. |
| Secret scanning, with push protection | Neither repository should ever hold a held-out seed or an API key. |
| Dependabot alerts and security updates | The suites have no runtime dependencies, so the realistic risk is the dev toolchain. |
| CodeQL default setup | The CLI parses untrusted model output. |
| Actions default workflow permissions | Leave it read-only. Every workflow here declares what it needs. |

### Pages

**Settings**, **Pages**, **Source: GitHub Actions**. The site builds from `main` with
`.github/workflows/pages.yml` and publishes to `https://ecowestern.github.io/ESAC/`. The workflow
runs `tools/check-links.mjs` before the build, so a broken internal link fails the deploy instead
of shipping.

## Still to apply

- Rulesets on both repositories, if they are not already imported.
- Private vulnerability reporting on both. The advisory link in `SECURITY.md` does not work until
  this is on, which makes it the one worth doing first.
- Secret scanning with push protection, and Dependabot alerts, on both.
- Description, topics, and website on both.

## Release time

1. Push the tag. `.github/workflows/release.yml` refuses a tag that disagrees with `package.json`,
   with `src/version.ts`, or with a missing changelog section, and re-checks that the tagged tree
   still reproduces the published pool.
2. Create the GitHub release at that tag, using the matching changelog section as its body.
3. Never move or delete a published tag. The ruleset refuses both, and a moved tag makes every
   score attributed to that version unattributable.

## Pull requests

Neither repository accepts them, and both answer automatically: a pull request from outside the
organisation is commented with `.github/pull-request-notice.md` and closed by
`.github/workflows/close-pull-requests.yml`, and members, collaborators, and maintainers are
exempt. A pull request opened before that workflow existed stays open until it is closed by hand.
