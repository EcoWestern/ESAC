# The ESAC constitution

**EcoWestern Short and Cheap Benchmark (ESAC)**

> **Status: normative.** This is the constitution of the ESAC program: the design basis
> that the amendments modify. It governs, and it is amended rather than rewritten.
>
> **Amendments live beside it**, one file each, in [`amendments/`](amendments/). An
> amendment names the provisions here that it supersedes, and where the two disagree, **the
> amendment governs**. Nothing below is edited to record a later decision, so a citation
> made from a suite repository keeps meaning what it meant when it was written.
>
> The register of amendments is in [`specs/README.md`](README.md).

Two suites are specified here. **ESAC-GI** (General Intelligence) is implemented, in
[EcoWestern/ESAC-GI](https://github.com/EcoWestern/ESAC-GI). **ESAC-AG** (Agentic Work and
Capability) is specified and not yet implemented. Both score out of **75**.

Full names follow the pattern *EcoWestern Short and Cheap [Suite] Benchmark, Version
[#]*, abbreviated as *ESAC-[Suite] v[#]*, for example **ESAC-GI v1.0**.

## How to read this document

The sections below are numbered, and a citation names the document and then the section:

| Citation | Refers to |
|---|---|
| `constitution §4` | section 4 of this document |
| `amendment 001 §2` | section 2 of the first amendment |
| `amendment 001` | the whole of the first amendment, which is one file |

A section here is never rewritten to record a later decision. The reasoning behind an
instrument is part of the instrument, so the basis is kept as it was written and the
decisions that changed it live beside it, each naming what it supersedes.

Three words are used with a specific meaning throughout:

- an *item* is one graded prompt that contributes points;
- an *instance* is one concrete realisation of an item under a given dataset seed;
- a *seed* is the deterministic input that selects that realisation.

---

## 1. Core tenets

Five principles govern every design decision in both suites.

1. **Short is not the same as easy.** Cost and time come from token volume and
   wall-clock, not from difficulty. A single-line answer can require a great deal of
   correct internal reasoning to reach. The suites optimise for *compressed difficulty*:
   small input, hard problem.
2. **Deterministic scoring wherever the task allows it.** Exact match, regex, unit
   tests, state diffs. Judgment-based grading is the exception rather than the norm, and
   every exception carries a cost and a reproducibility risk.
3. **No single vendor grades anyone.** Rubric-graded items are scored by a small,
   open-weight, self-hostable model, version-pinned per release. Anyone can rerun a
   score locally without an API key from the company being tested.
4. **The public item set is a self-check, not the scoreboard.** Vendors will see it and
   will be tempted to train toward it. The benchmark is structured so that doing so does
   not move the number that matters. See
   [contamination resistance](#3-contamination-resistance).
5. **Every score is meaningless without a version tag.** "58/75" means nothing on its
   own. "58/75 on ESAC-GI v1.0" is a result.

## 2. Shared architecture

Both suites share three architectural decisions.

**Scoring format.** Three things are always reported together:

- the total out of 75;
- the per-category subscore, both raw and normalised to a percentage, so that a
  10-point category and a 5-point category are visually comparable (raw points alone
  mislead people into overweighting the larger categories);
- a version tag.

A bar or radar chart of the category percentages beside the raw total is the point of
reporting cheaply. The total says whether a model is good; the breakdown says why.

**Run ordering.** Items run cheapest-and-fastest first, with categories interleaved
rather than blocked. Two reasons:

- if the harness or the API connection is broken, that is discovered on item 1 rather
  than after burning through 40 items;
- a live running tally, printed after every item, gives the progress feedback that a
  five-hour test cannot. Because each item resolves in seconds, the question "is this
  still working" is answered by watching the counter move.

**Replication protocol.** Decoding parameters (temperature, top_p) are pinned in the
specification itself rather than per run, so that a third party's rerun is comparable
rather than merely close. Amendment 001 §5 replaces the original proposal here, which was one
run for deterministic tasks and three runs with majority voting for anything with
model-side stochasticity, with an explicit protocol that separates model-side from
judge-side repetition.

## 3. Contamination resistance

This is what keeps the benchmark honest, and it is load-bearing from v1.0 rather than
bolted on later.

- **Parametrized items, not fixed strings.** Most items are templates with swappable
  surface details (names, numbers, entity order, distractor content), so the pattern is
  public while the exact instance a model sees is regenerated. Memorising "the answer to
  item 14" stops working, because item 14 is a different problem under every seed, and
  the model has to perform the task class rather than recall an answer.
- **Public set and held-out verification set.** The public pool is what anyone downloads
  and runs for a directional signal. It should be expected to be optimised against over
  time, which is acceptable, because it is not where the real claim comes from. The
  held-out pool, together with its scoring keys, stays private and is used only for runs
  that the maintainers or a trusted third party execute directly against a model.
  Official comparative claims should cite a held-out run and never a pure public-pool
  run.
- **Rotation.** Each versioned release swaps a fraction of the public item pool,
  targeting around 20 percent. A model that scores substantially higher on the public
  pool than on the held-out pool is a visible, publishable signal of overfitting to the
  benchmark, which is arguably one of the more useful things this project can surface.
- **Canary strings.** A unique, greppable marker is embedded in the public item files.
  If a future model completes canary-adjacent text unprompted, that is evidence the item
  leaked into a training corpus, which flags that it needs retiring rather than merely
  rotating.

Amendment 001 §3 replaces the 70/30 framing above with a content-balanced split, and §4
clarifies that parametrization is a principle rather than an absolute requirement.

## 4. Keeping items hard despite being short

Concrete techniques, not just a principle.

- **Long to think, short to answer.** Modelled on GPQA-style design: the correct answer
  is one token or one line, but reaching it requires real reasoning rather than
  pattern-matching the surface form of the question.
- **Tight step and tool-call budgets in the agentic suite.** A smaller allowed budget is
  what makes a toy environment hard, not a bigger environment. A five-step budget on a
  small mock filesystem is harder to satisfy cleanly than a 50-step budget on a large
  one, and it is still cheap.
- **Adversarial distractors, not just questions.** A short prompt with a well-placed
  wrong-but-plausible option does more work than a longer prompt with an obvious answer.
- **Calibration items are difficulty for free.** A question that a model should decline
  to answer confidently costs nothing extra to run, and it tests something a plain
  accuracy score cannot.

## 5. ESAC-GI: General Intelligence, 75 points

As originally specified:

| Category | Points | Format | Grading |
|---|---:|---|---|
| Logic & deduction | 10 | 5 items, constraint and syllogism puzzles | exact match |
| Math reasoning | 10 | 5 items, arithmetic through moderate word problems | numeric exact match |
| Factual knowledge | 10 | 10 items, broad domain spread | exact or regex |
| Reading comprehension | 10 | passages of roughly 200 words, inference questions | exact match |
| Abstraction / pattern recognition | 10 | small grid and analogy puzzles | exact match |
| Instruction-following | 10 | precise format and constraint tasks | programmatic check |
| Writing quality | 10 | 2 constrained short-writing tasks | open-weight judge, fixed rubric |
| Calibration | 5 | trick and unanswerable questions | exact match on hedge versus confabulate |

Approximately 42 items, each prompt and response well under 500 tokens. A full run is in
the low tens of thousands of tokens, which is well under a dollar even at frontier model
API pricing.

Amendment 001 §6 fixes the exact item distribution, and §2 replaces the last category.

## 6. ESAC-AG: Agentic Work and Capability, 75 points

ESAC-AG runs against a small, deterministic, redistributable mock environment: a toy
filesystem, a mock API with canned or state-machine responses, and a mock shell. It never
touches live services, which keeps runs cheap, free of flake, and fully reproducible from
the repository alone, with no external dependency that can go stale.

| Category | Points | Format | Grading |
|---|---:|---|---|
| Tool-call correctness | 10 | 5 mock-API tasks, right tool and right parameters on the first try | exact match on the call |
| Bounded multi-step planning | 10 | 2 to 3 tasks, tight step budget to reach a goal state | state diff, partial credit |
| Code generation and execution | 15 | 3 tasks, write then run against hidden tests, limited fix attempts | test pass or fail |
| Error recovery | 10 | 2 tasks, given a failing script or trace, diagnose and fix | test pass or fail |
| State tracking across steps | 10 | 2 multi-turn tasks requiring correct recall of earlier tool output | exact match or state diff |
| Ambiguity handling | 5 | 3 underspecified tasks, asking versus guessing sensibly | open-weight judge, fixed rubric |
| Injection and safety resistance | 10 | 5 items, malicious instructions embedded in tool output | did it comply or flag |

That is 70 of the 75 points. The remaining 5 points are an efficiency modifier rather
than a separate capability category, described in Amendment 001 §1.

Each task is capped at a small fixed number of tool-call turns, 10 to 15 at most, so no
single item can quietly become a long-running loop. That is what keeps the agentic suite
from re-becoming a five-hour test by accident.

## 7. Open questions

Three questions were left open in the original basis.

- **Judge model pinning.** Pin one fixed open-weight judge version per benchmark release,
  so that rubric scores do not drift silently when the judge model is updated upstream.
  The release names one judge version and treats it as fixed.
  *Status: resolved for v1.0. The judge pinned for this release is
  `xiaomi/mimo-v2.6-pro`, an open-weight model chosen for general capability and for an
  absence of bias in its chain of thought in the maintainers' private testing. A run
  under any other judge is reported without a verdict rather than as an ESAC-GI score,
  because the judge decides one of the eight categories and therefore the outcome.*
- **Ensemble judging.** Whether rubric items should be scored by one judge model or by
  two-out-of-three voting, to damp single-model idiosyncrasy in the writing and ambiguity
  categories. *Status: resolved by Amendment 001 §5, which adopts repeated judging rather than
  voting.*
- **Held-out set custody.** Who runs verification-set evaluations for published claims:
  a single maintainer, or a small trusted-third-party rotation. This determines how much
  trust the published numbers carry on release day. *Status: still open.*

