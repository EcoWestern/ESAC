# ESAC-GI

**General Intelligence. 42 items, 75 points, eight categories. Released as v1.0.0.**

ESAC-GI is the first suite in the ESAC program and the only one implemented. It measures
general cognitive capability in the compressed-difficulty style: every prompt is short,
every answer is short, and none of the items can be answered by recalling the shape of the
question.

- **Code and harness:** [EcoWestern/ESAC-GI](https://github.com/EcoWestern/ESAC-GI)
- **Item-level scoring reference:** [ESAC-GI specs/scoring.md](https://github.com/EcoWestern/ESAC-GI/blob/main/specs/scoring.md)
- **Specification:** [ESAC spec, Part I](../specs/spec.md) and the amendments that govern it
- **Version tag:** `ESAC-GI v1.0`. Scores are comparable within a major version and nowhere
  else.

## What it measures

| Category | Items | Points | Grading | What the items are |
|---|---:|---:|---|---|
| Logic and deduction | 5 | 10 | deterministic | Constraint satisfaction, knight and knave reasoning, formal entailment, transitive ordering, joint constraint solving. |
| Math reasoning | 5 | 10 | deterministic | Simultaneous congruences, modular exponentiation, divisor enumeration, two-phase rates, and a small integer program where the greedy answer is wrong. |
| Factual knowledge | 10 | 10 | deterministic | Uncontested facts across domains, graded so that formatting never decides the point. |
| Reading comprehension | 5 | 10 | deterministic | Short passages, with the work in locating and combining the relevant material rather than in the reading. |
| Abstraction and pattern recognition | 5 | 10 | deterministic | Grid rules, analogies, second-order sequences, odd-one-out by property, and two-axis matrices. |
| Instruction-following | 5 | 10 | deterministic | Joint constraints with partial credit per constraint, including prohibitions, where the tested behaviour is omission. |
| Writing quality | 2 | 10 | judge | Register control under a hard constraint, and committed argumentation that concedes a real objection. |
| Response-depth calibration | 5 | 5 | judge | Whether the model infers how much answer a situation needs, in both directions, with no prompt saying so. |

Sixty of the 75 points are graded programmatically. The remaining 15, one rubric-graded
category and one of two writing tasks, are scored by the judge pinned for the release,
`xiaomi/mimo-v2.6-pro`, an open-weight model.

## How it is scored

- **Checks produce points.** An item's checks are weighted and normalised, so partial credit
  is per check. The category denominator is its declared allocation, not the items that
  happened to run, so a partial run cannot inflate a percentage.
- **Passing is a dual gate:** 60 percent in every category **and** 60 percent overall. In
  concrete terms, 6.00 of 10, 3.00 of 5, and 45.00 of 75. A strong average does not rescue a
  weak category.
- **Verdicts are explicit.** `PASS`, `FAIL`, `INCOMPLETE` for a run that did not cover the
  suite, and `NOT VALID` for a run under a judge that is not the pinned one, which is
  reported without a verdict because the judge decides a whole category. Exit codes
  distinguish these, and an infrastructure failure exits separately rather than reporting an
  outage as a score.
- **Replication.** Deterministic items run once. Judge-graded items run twice and each
  response is judged twice, so model and judge variance can be told apart.
- **Reported context.** Every report records the version tag, the seed fingerprint, the
  judge actually used, and the output cap, because a score without its conditions is not a
  result.

## How it resists contamination

The public pool is disclosed on purpose and carries a canary string so that leakage into
training data can be detected. What protects the measurement is that items are generators:
the same item is a different problem under a different seed.

The public and held-out pools are the same 42 templates instantiated under different dataset
seeds. The public seed ships with the repository. The held-out seed is generated locally by
the evaluator and never committed, and a held-out run refuses to start rather than inventing
one, because a run nobody can repeat is worth nothing.

The consequence worth stating plainly: two held-out runs are item-identical only when they
share a seed. Publish the fingerprint recorded in the report, not the seed, and treat
comparison across different seeds as distributional rather than exact.

## What it does not claim

- The bank is small by design. Forty-two items across eight categories is enough for a
  directional signal and not enough for fine-grained ranking.
- It is text-only. No tools, no agency, no multi-turn environment. That is what
  [ESAC-AG](ag.md) is specified to cover.
- Fifteen of the 75 points depend on a judge, and two of the eight categories are small
  samples: two writing items and five depth items.
- It is not a safety evaluation.
- A score is a measurement under a stated configuration, not a verdict on a model.

## Running it

Node 22.6 or newer, no runtime dependencies, no build step:

```bash
git clone https://github.com/EcoWestern/ESAC-GI
cd ESAC-GI
npm install
npm run auto
```

`npm run auto` asks for the model, the judge, the pool, and the categories, then runs the
suite and reports each section as it completes. The client is OpenAI-compatible, so any
chat-completions endpoint works, and an aggregator such as OpenRouter is the recommended
route because it serves the open-weight judge and the model under test behind one key.
