# ESAC

**EcoWestern Short and Cheap Benchmark.** A program of compact benchmarks that measure
difficult capabilities without measuring budget.

Cost and difficulty are independent, and most evaluation conflates them. A question that
takes one line to answer can require a great deal of correct internal reasoning to reach,
and a question that takes ten thousand tokens to state can be trivially easy. ESAC exists to
measure the first thing, cheaply enough that anyone can rerun it.

This repository is the home of the program: what the suites are, what each one measures, how
the measurement works, and the [constitution](specs/constitution.md) and its
[amendments](specs/amendments/) that govern all of them.

## The suites

| Suite | What it measures | Status | Size | Code |
|---|---|---|---|---|
| **ESAC-GI** | General intelligence: logic, math, factual recall, reading comprehension, abstraction, instruction-following, writing quality, and response-depth calibration. | v1.0.0 released | 42 items, 75 points | [EcoWestern/ESAC-GI](https://github.com/EcoWestern/ESAC-GI) |
| **ESAC-AG** | Agentic work: tool-call correctness, planning under a tight step budget, code generation, error recovery, state tracking, ambiguity handling, and resistance to injected instructions. | Specified, not implemented | 75 points | none yet |

- **[ESAC-GI](benchmarks/gi.md)** is built, released, and runnable today. Its answers are
  computed rather than stored, and 60 of its 75 points are graded without a judge.
- **[ESAC-AG](benchmarks/ag.md)** is specified in full and implemented not at all. It runs
  against a mock environment so that agentic evaluation can be cheap and deterministic
  instead of slow and flaky.

## Five tenets

The specification opens with five principles that govern both suites. They are worth stating
here, because almost every design decision in either suite follows from them.

1. **Short is not the same as easy.** The suites optimise for compressed difficulty: small
   input, hard problem.
2. **Deterministic scoring wherever the task allows it.** Judgment-based grading is the
   exception, and every exception carries a reproducibility cost that is paid openly.
3. **No single vendor grades anyone.** Rubric-graded items are scored by a small,
   open-weight, self-hostable model, pinned per release, so anyone can rerun a score without
   an API key from the company being tested.
4. **The public item set is a self-check, not the scoreboard.** The benchmark is built so
   that training against what is public does not move the number that matters.
5. **Every score is meaningless without a version tag.** "58/75" means nothing. "58/75 on
   ESAC-GI v1.0" is a result.

## How a suite works

The architecture is shared, and it is the part that makes scores comparable rather than
merely numeric.

- **Items are generators, not stored questions.** An item produces an instance and its
  expected answer from a seed, so the answer is computed. Memorising an answer stops working,
  because the instance is a different problem under a different seed.
- **Determinism where it is possible.** ESAC-GI grades 60 of its 75 points programmatically.
  Instance identity derives from the dataset seed and the item id alone, never from the run,
  the timestamp, or the model, so every model in a comparison sees byte-identical instances.
- **A judge only where judgement is unavoidable.** 15 of ESAC-GI's 75 points are rubric
  graded, by a model that is open-weight, pinned per release, and reported with every result.
  A substituted judge produces no verdict, because the judge decides a whole category and
  therefore the outcome.
- **Both sources of variance are measured.** Judge-graded items run twice and are judged
  twice, so model variance and judge variance stay separable.
- **Failure is classified, not averaged.** Infrastructure failures are retried and never
  scored. A model failure is scored. An outage can never be reported as a low score.
- **Passing is a gate, not an average.** A suite result requires the threshold in every
  category and overall, so strength in one category cannot mask a hole in another.
- **Two pools, split by seed.** The public pool is a development and self-check surface. A
  held-out run uses a seed nobody has published. The split is by instance, so every category
  is represented in both.

## Documents

| Document | What it is |
|---|---|
| [specs/constitution.md](specs/constitution.md) | The constitution: the design basis, in numbered sections. It governs, and it is amended rather than rewritten. |
| [specs/amendments/](specs/amendments/) | One file per amendment. The first has ten decisions, each naming the provision it supersedes. |
| [specs/README.md](specs/README.md) | The register of amendments, and how to add the next one. |
| [benchmarks/gi.md](benchmarks/gi.md) | ESAC-GI in detail: the eight categories, the scoring, and how to run it. |
| [benchmarks/ag.md](benchmarks/ag.md) | ESAC-AG in detail: what is specified, and what does not exist yet. |
| [CHANGELOG.md](CHANGELOG.md) | Program-level changes: new suites, amendments, and documentation moves. |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution policy: issues and forks, not pull requests. |

## Running a suite

Each suite carries its own harness, and each one runs offline apart from the model calls.
ESAC-GI requires Node 22.6 or newer and has no runtime dependencies:

```bash
git clone https://github.com/EcoWestern/ESAC-GI
cd ESAC-GI
npm install
npm run esac -- selftest
```

That last command checks the harness end to end without contacting a model. To measure a
model, `npm run auto` walks through the configuration and then runs the suite. The full
instructions are in the [ESAC-GI README](https://github.com/EcoWestern/ESAC-GI#readme).

## Status

- **ESAC-GI v1.0.0** is released and runnable.
- **ESAC-AG** is specified and unimplemented. No part of it may be cited as a result.
- **Held-out custody** is the one question the specification still leaves open: whether
  published held-out evaluations are run by a single maintainer or by a small trusted
  rotation. It determines how much weight a published number carries on release day, and it
  is flagged as open in the specification.

## Repository settings

Some of what this repository relies on is not a file, so it is recorded here: a fork can
reproduce it, and nothing is lost when a setting lives only in a web form.

The repository description, 312 characters, inside GitHub's limit of 350:

> A program of compact benchmarks that measure difficult capabilities without measuring
> budget. Two suites: ESAC-GI, released and runnable, and ESAC-AG, specified and not yet
> implemented. Items are generators rather than stored questions, and every score carries the
> version tag of the instrument that produced it.

Topics, most load-bearing first. Fifteen of GitHub's twenty slots, all lowercase and
hyphenated as GitHub requires:

```
benchmark, ai-benchmark, llm, llm-benchmark, llm-evaluation, evaluation,
general-intelligence, agentic-ai, agentic-evaluation, specification,
reproducibility, contamination, documentation, mit-license, ecowestern
```

Both are set from the repository page, with no tooling: **About**, then the gear icon. Paste the
description, then paste the topic list, which the field splits on commas.

The GitHub CLI does the same thing in two commands, if it is installed: `winget install --id
GitHub.cli`, then `gh auth login`. Each command below is one line on purpose, because a trailing
backslash is a bash continuation and pasting one into PowerShell runs nothing at all, including
the lines above it.

```bash
gh repo edit EcoWestern/ESAC --description "A program of compact benchmarks that measure difficult capabilities without measuring budget. Two suites: ESAC-GI, released and runnable, and ESAC-AG, specified and not yet implemented. Items are generators rather than stored questions, and every score carries the version tag of the instrument that produced it."
```

```bash
gh repo edit EcoWestern/ESAC --add-topic benchmark --add-topic ai-benchmark --add-topic llm --add-topic llm-benchmark --add-topic llm-evaluation --add-topic evaluation --add-topic general-intelligence --add-topic agentic-ai --add-topic agentic-evaluation --add-topic specification --add-topic reproducibility --add-topic contamination --add-topic documentation --add-topic mit-license --add-topic ecowestern
```

Still to apply here, for the same reasons as in the suite repository: branch and tag rulesets,
private vulnerability reporting, which `SECURITY.md` links to, secret scanning with push
protection, and Dependabot alerts. All of them are repository settings pages, and the rulesets
can be imported straight from this repository's or the suite's `.github/rulesets/` JSON through
**Settings**, **Rules**, **Import a ruleset**. No command line tool is required for any of it.

## Governance

ESAC is published under the MIT licence, to be read, run, audited, and forked. Issues are
open and welcome, especially corrections to the specification and challenges to an item.
Pull requests are not accepted, and the reason is in [CONTRIBUTING.md](CONTRIBUTING.md): a
published score has to be traceable to a specific, trusted revision, so the measurement
cannot change through an external merge path.

The specification lives here rather than in a suite repository for the same reason. When two
suites cite the same clause, there has to be one clause to cite.
