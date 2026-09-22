# ESAC-AG

**Agentic Work and Capability. Specified in full, implemented not at all.**

> **Status: not implemented.** There is no code, no harness, and no item bank. Nothing in
> this page may be cited as a result, and no model has an ESAC-AG score. It is published
> because the design decisions are the hard part, and they are already made.

ESAC-AG is the second suite in the ESAC program. Where ESAC-GI measures compressed reasoning
in a single turn, ESAC-AG measures work performed across turns against an environment:
choosing tools, planning under a budget, writing and running code, recovering from failure,
and resisting instructions that arrive inside tool output rather than from the user.

The full specification is in [the constitution](../specs/constitution.md), which is the design
basis for both suites and is amended rather than rewritten.

## What it is specified to measure

| Category | Points | Format | Grading |
|---|---:|---|---|
| Tool-call correctness | 10 | 5 mock-API tasks, the right tool with the right parameters on the first try | exact match on the call |
| Bounded multi-step planning | 10 | 2 to 3 tasks, tight step budget to reach a goal state | state diff, partial credit |
| Code generation and execution | 15 | 3 tasks, write then run against hidden tests, limited fix attempts | test pass or fail |
| Error recovery | 10 | 2 tasks, given a failing script or trace, diagnose and fix | test pass or fail |
| State tracking across steps | 10 | 2 multi-turn tasks requiring correct recall of earlier tool output | exact match or state diff |
| Ambiguity handling | 5 | 3 underspecified tasks, asking versus guessing sensibly | open-weight judge, fixed rubric |
| Injection and safety resistance | 10 | 5 items, malicious instructions embedded in tool output | did it comply or flag |

That is 70 of the 75 points. The remaining 5 are an **efficiency modifier** rather than a
capability category, which is the first amendment to the specification: the modifier applies
to how the work was done, not to what was known, so folding it into a category would make the
category mean two things at once.

## Why a mock environment

The whole suite runs against a small, deterministic, redistributable mock environment: a toy
filesystem, a mock API with canned or state-machine responses, and a mock shell. It never
touches a live service.

That choice is what makes agentic evaluation affordable and repeatable. A live environment
brings network flake, credential handling, rate limits, cost that scales with retries, and a
dependency that can change under the benchmark without a version increment. A mock
environment brings a run that costs the same every time, reproduces exactly from the
repository alone, and can be audited by reading it.

Each task is capped at a small fixed number of tool-call turns, 10 to 15 at most, so no item
can quietly become a long-running loop. A five-step budget on a small mock filesystem is
harder to satisfy cleanly than a fifty-step budget on a large one, and it is still cheap.
That is the same compressed-difficulty principle as ESAC-GI, applied to a different axis.

## What carries over from ESAC-GI

The shared architecture in the [program overview](../README.md#how-a-suite-works) is
intended to apply here without modification:

- items as generators rather than stored questions, so expected answers are computed;
- deterministic grading wherever the task allows it, with a pinned open-weight judge only
  for the ambiguity category, where judgement is unavoidable;
- instance identity derived from the dataset seed and the item id alone, so every model in a
  comparison sees byte-identical instances;
- public and held-out pools split by seed rather than by item;
- the dual gate, so partial agentic competence cannot be averaged into a pass;
- infrastructure failure kept strictly separate from model failure, which matters more here
  than in ESAC-GI because a mock environment makes infrastructure failure rarer and therefore
  easier to misclassify.

## What does not exist yet

Recorded plainly, so that progress is measurable rather than asserted:

- the mock environment: filesystem, API, and shell, with a state model that can be diffed;
- the item bank and its generators, with reference solutions for the deterministic categories;
- the harness: multi-turn execution, budget enforcement, and state-diff grading;
- hidden tests for the code and error-recovery tasks;
- the rubric and the pinned judge for the ambiguity category;
- injection payloads that are realistic enough to be worth resisting;
- a suite repository, which will be created when there is something to put in it.

## Open questions

- **Held-out custody.** The same open question as the rest of the program: whether published
  held-out evaluations are run by one maintainer or by a small trusted rotation. It is
  [flagged as open in the constitution](../specs/constitution.md#7-open-questions).
- **Budget calibration.** The turn budgets above are specified but not yet validated against
  real models, and a budget that is merely generous measures nothing.
- **What counts as compliance under injection.** The category distinguishes complying from
  flagging, which is checkable, from being manipulated, which is not. The line between
  complying and flagging has to be drawn tightly enough to be deterministic.
