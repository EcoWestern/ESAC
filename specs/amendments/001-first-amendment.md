# Amendment 001: the first amendment

> **Adopted 2026-09-22. In force.** Ten decisions taken after reviewing the
> [constitution](../constitution.md) and before implementation. Each resolves a specific
> ambiguity or gap without changing the central purpose: a short, cheap benchmark that
> measures difficult capabilities while remaining reproducible and resistant to
> contamination.
>
> **Where this amendment and the constitution disagree, this amendment governs.** Each
> decision names the provision it supersedes or clarifies, and the
> [supersession map](#supersession-map) at the end of this file collects them in one place.
> The program's register of amendments is in [`specs/README.md`](../README.md).

Suite repositories cite these decisions as `amendment 001 §N`.

## 1. ESAC-AG remains a 75-point benchmark

*Supersedes the efficiency-modifier paragraph in the constitution, under section 6.*

The seven ESAC-AG capability categories intentionally total 70 points. The remaining 5
points are an **efficiency modifier** rather than an additional capability category.

The modifier is deliberately separate from the task scores. A model's capability score
reflects whether it successfully completed a task. The efficiency modifier provides a
limited additional boost for models that complete successful tasks economically.

Efficiency therefore cannot compensate for an unsuccessful task. A task that is not
successfully completed receives no efficiency credit.

The purpose of the modifier is not to reward the fewest possible steps. The desired
behaviour is **efficient, correct execution that does not create downstream problems
requiring further work to repair**. An agent that reaches the correct state quickly and
cleanly earns more efficiency credit than one that reaches the same state through
unnecessary actions, redundant tool calls, avoidable corrections, or rework.

Each eligible task defines its own internal efficiency scale from 1 to 6. The benchmark
author specifies what efficient successful execution means for that task and defines the
acceptable solution envelope. The harness performs the objective parts of the
calculation, including measurable action and tool usage, token usage, and detectable
rework or redundant activity.

Action efficiency is weighted more heavily than token efficiency. The allocation is 3.5
of the 5 modifier points for action efficiency and 1.5 for token efficiency.

The local 1-to-6 task score is normalised into the common modifier scale. The
task-specific rubric is authored in advance, and individual runs are not manually graded
for efficiency.

This allows different kinds of agentic task to define efficient behaviour differently,
rather than pretending that a universal number of tool calls constitutes efficiency in
every environment.

## 2. Calibration is response-depth calibration

*Supersedes the "Calibration" row in the constitution, under section 5.*

The original description of calibration was too close to conventional uncertainty
calibration, and it did not reflect the intended construct. The category instead measures
**whether a model can infer the appropriate depth of response from contextual cues**.

Real-world communication does not always state how much explanation is wanted. A short
prompt can require a substantial explanation, and a long prompt can ultimately call for a
very short answer. The category therefore tests whether a model recognises the
communicative demands of a situation, rather than matching response length to prompt
length or following an instruction to "be detailed" or "be concise".

The category contains five items:

- 2 items where a substantive, in-depth response is appropriate;
- 2 items where a concise response is appropriate;
- 1 boundary item where either a concise or a substantive response can reasonably satisfy
  the task.

The first four items carry the primary directional test. The boundary item carries half
the weight of a normal item, because both response styles can be valid. The category is
normalised to its full 5-point allocation when it is reported, so the half weight does
not reduce the category total.

The grading criterion is therefore not raw response length. A response earns credit when
its level of detail is appropriate to the apparent information need, the context, and the
communicative situation. Every rubric in this category carries a heavily weighted
"answered the actual question" criterion, so an empty response cannot win on brevity and
a padded response cannot win on length.

## 3. The public and held-out split is content-balanced

*Supersedes the public and held-out clause in the constitution, under section 3.*

The 70/30 split is a target rather than an absolute numerical requirement.

The priority is that the held-out set adequately represents the benchmark's content and
categories. A mechanically exact 70/30 split matters less than ensuring that every
category has meaningful hidden evaluation material.

The two pools are therefore constructed deliberately rather than by partitioning the
complete item bank. The held-out pool may deviate from exactly 30 percent where that is
necessary to preserve category and construct coverage.

In practice the harness splits by *instance* rather than by template. The same generator
is instantiated under a public dataset seed and under an evaluator-controlled held-out
seed, which gives every category held-out coverage even where a category has only two
items.

The public pool remains the self-checking and development surface. Official comparative
claims continue to rely on held-out verification runs.

## 4. Parametrization is a principle, not an absolute requirement

*Supersedes the parametrized-items clause in the constitution, under section 3.*

The benchmark avoids dependence on fixed question strings wherever practical.

Objective items use parametrization, rotation, or equivalent variation where that can be
done without changing the capability being tested. The purpose is to prevent memorisation
of particular answers from becoming an effective strategy.

Not every item needs to be generated dynamically, however. Some tasks, particularly
writing tasks, are better represented by carefully authored prompt families than by
artificial parameterization.

The requirement is therefore conceptual rather than absolute:

> The benchmark should resist memorisation of exact instances wherever reasonably
> possible, while preserving the validity and quality of the underlying task.

Parametrization is an implementation feature of the applicable item classes rather than
something assumed to be free. Where an item is parametrized, its generation and its
scoring logic must both be reproducible, which is why expected answers are computed from
the seed rather than stored.

## 5. Model and judge replication are both repeated

*Supersedes the replication-protocol clause in the constitution, under section 2.*

For judge-graded tasks, both sources of stochasticity are evaluated:

- the evaluated model is run twice on the item;
- each resulting response is judged twice by the pinned judge model.

The four observations are averaged into the item's final score. This separates model-side
variance from judge-side variance, and it replaces the vague phrase "three runs" with a
statement of what is actually being repeated.

Deterministic, programmatically scored tasks remain single-run unless the specification
for that task explicitly requires otherwise.

## 6. ESAC-GI remains deliberately small

*Supersedes the approximate item count in the constitution, under section 5.*

The benchmark's shortness is a core design requirement, not an incidental optimisation.
The response to the item-count concern is therefore to make the count explicit rather
than to expand the suite for statistical volume.

The ESAC-GI distribution is:

| Category | Items |
|---|---:|
| Logic & deduction | 5 |
| Math reasoning | 5 |
| Factual knowledge | 10 |
| Reading comprehension | 5 |
| Abstraction / pattern recognition | 5 |
| Instruction-following | 5 |
| Writing quality | 2 |
| Response-depth calibration | 5 |
| **Total** | **42** |

This preserves the intended low-cost execution profile while making the item count
internally verifiable. The harness asserts both totals at load time, so a drift in either
is a hard failure rather than a silently wrong score.

## 7. Writing remains small but is evaluated repeatedly

*Clarifies the writing row in the constitution, under section 5.*

Writing quality remains a 10-point category based on two distinct constrained-writing
tasks.

The category is intentionally small, because expanding it substantially would work
against the central short-and-cheap objective. The two tasks should therefore differ
meaningfully in their writing demands rather than being near-duplicates.

The replication protocol for judge-graded tasks provides additional response and judgment
observations without requiring a much larger authored item set.

The writing category should be read as a relatively small sample of writing behaviour.
Two prompts do not constitute a comprehensive evaluation of general writing ability.

## 8. Model failures and infrastructure failures are separate

*Clarifies the failure handling implied throughout the constitution.*

The harness distinguishes between a model response that fails the task and an evaluation
that could not be completed at all.

A returned empty answer, an ordinary refusal, or a model-generated statement of inability
is a model response and is scored according to the task. On a normally answerable item,
such a response is incorrect. Where the benchmark explicitly allows an abstention or a
decline, the task's own scoring rules determine whether it is valid.

The same applies to a model that reaches the item's output budget without producing an
answer. That budget is part of the benchmark definition, like the time budget, and is set
generously enough that it is not what decides a score. Such a response is a model failure,
and it is not retried, because repeating the request under the same budget reaches the same
conclusion.

By contrast, API errors, transport failures, rate limits, evaluator-side failures,
mock-environment failures, and any other case where a valid model response was never
obtained are infrastructure failures. They are not scored as model errors, and they are
retried under identical benchmark conditions. If an infrastructure failure persists, the
run aborts rather than reporting an outage as a low score.

The benchmark therefore never turns an evaluation-system failure into an artificial zero.

## 9. Versioning separates content changes from scoring changes

*Clarifies tenet 5.*

Version numbers are meaningful.

**Minor releases** cover changes to content and organisation that preserve the measurement
and the scoring philosophy. This includes item replacement or rotation, new parametrized
instances, prompt and content changes, and changes to the internal structure of a section
that do not alter what the resulting score means.

**Major releases** cover changes that alter the measurement itself. This includes changes
to scoring methodology, judging methodology, scoring criteria, category definitions, pass
criteria, and any other rule that makes results meaningfully non-equivalent to previous
versions.

Results must always be associated with their exact benchmark version. Scores are
comparable across minor releases of the same major version, and never comparable across
major versions.

## 10. Passing criteria are defined from the beginning

*Clarifies the reporting requirements in the constitution, under section 2.*

The passing threshold is defined from the initial release rather than introduced after
observing model results.

The threshold is **60 percent in every capability category and 60 percent overall**. For a
10-point category that is 6 out of 10; for a 5-point category it is 3 out of 5. Both
conditions are required, so a strong average does not rescue a weak category.

The ESAC-AG efficiency modifier is not itself a capability category, and therefore has no
independent passing threshold.

The passing threshold is part of the scoring protocol, so a change to it is a
major-version change.

## Supersession map

| Section | Supersedes or clarifies in the constitution |
|---|---|
| 1 | the efficiency modifier paragraph under "ESAC-AG" |
| 2 | the "Calibration" row under "ESAC-GI" |
| 3 | the public and held-out clause under "Contamination resistance" |
| 4 | the parametrized-items clause under "Contamination resistance" |
| 5 | the replication-protocol clause under "Shared architecture" |
| 6 | the approximate item count under "ESAC-GI" |
| 7 | clarifies the writing row under "ESAC-GI" |
| 8 | clarifies failure handling across the suites |
| 9 | clarifies tenet 5 |
| 10 | clarifies the reporting format under "Shared architecture" |

## Result

The amendment preserves the original philosophy rather than turning ESAC into a
conventional large-scale benchmark. The benchmark remains short, cheap, deterministic
wherever possible, and designed around compressed difficulty. The public pool remains
useful for self-checking, while the held-out pool supports stronger comparative claims.
Efficiency is rewarded without allowing cheap failure to masquerade as capability, and
response-depth calibration measures contextual communication rather than instruction
compliance.
