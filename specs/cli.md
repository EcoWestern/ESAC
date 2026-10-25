# The common command line

**ESAC program interface specification.**

> **Status: normative.** This document specifies the command-line contract every ESAC suite
> exposes. It is not a style guide and not a description of two implementations: it is the
> interface a new suite is required to provide, so that a reader who has run one ESAC suite can
> run the next one without learning a second vocabulary.
>
> Where this document and a suite's implementation disagree, the suite is wrong. Where this
> document and the [constitution](constitution.md) disagree, the constitution governs; nothing
> here changes what a score measures, only how a run is invoked and how its outcome is reported.

## 1. Why this exists

Two things produced this document, and both are worth stating because they explain why it is
normative rather than advisory.

**The suites drifted.** ESAC-GI and ESAC-AG were written a month apart and accumulated four
differences that no design decision justified: one required a complete adapter spec where the
other accepted a bare model id, one treated an incomplete run as a success, one skipped its own
documented dry run because a guard was too strict, and one printed a verdict label that did not
match the other's. Each was small. Together they meant that experience with one suite did not
transfer to the other, which is exactly the cost a program repo exists to avoid.

**A program is a promise about transferability.** Tenet 5 says a score is meaningless without a
version tag. The weaker claim behind it is that a person who has learned to read one ESAC result
can read the next one. That is only true if the interface that produces results is the same
interface, and "the same" has to mean something checkable.

The rule that follows: **a suite may add commands and flags, and may not change the meaning of
the ones specified here.** An addition is recorded in the suite's own README. A change of meaning
is a program-level decision and belongs in an amendment, because it makes the two suites
incomparable in a way that has nothing to do with what they measure.

## 2. Scope

This document specifies:

- the command set, and which commands are required;
- the adapter spec grammar, which names a model and a judge;
- the run flags;
- the verdict vocabulary and the exit codes, which together are how a caller distinguishes a
  result from a non-result;
- the judge discipline, which is what makes a rubric score comparable;
- pool selection and held-out seed custody;
- the output and environment rules that keep a run reproducible and keep secrets out of it.

It does not specify item format, grading internals, report layout, or how a suite stores its
bank. Those are per-suite concerns, and the sections that follow name the boundary where it
matters.

## 3. The command set

Every suite exposes these commands. The names and the semantics are fixed; the output text is
not.

| Command | Required | What it must do |
|---|---|---|
| `list` | yes | Print the item bank: every category, its points, and every item id. |
| `run` | yes | Execute a selection and print a report. The only command that produces a score. |
| `auto` | yes | Ask for the configuration, then run by the same code path `run` uses. |
| `selftest` | yes | Verify the harness offline, without a network and without measuring anything. |
| `inspect <itemId>` | yes | Render one generated instance, including what it would be graded on. |
| `version` | yes | Print the version tag and the canary string. |
| `help` | yes | Print usage. Invoked by `help`, `--help`, or no command at all. |
| `export` | yes | Write a JSONL snapshot of one pool, with answers removed. |
| `key` | yes | Emit the scoring key for one pool. This is the held-out artifact. |
| `seed` | yes | Generate or inspect the held-out seed. |
| `judge` | when judged | Report the pinned judge, its replication protocol, and whether its key is set. |
| `sandbox` | when executing code | Report whether generated code can be run here, and why not. |

`selftest` is required of every suite and must be runnable with no credentials, because it is
what a reader runs first. A suite whose only verification needs an API key has no offline
verification.

An unknown command is a usage error (§5.3). A suite may add commands; `sandbox` and `judge` are
the two examples, required only of suites whose design needs them.

## 4. Naming a model

A model and a judge are both named by an **adapter spec**. One grammar, because one protocol:
every suite speaks OpenAI-compatible chat completions with tool calling, and a runner that
supports two spec grammars for one protocol is a runner with two bugs waiting.

### 4.1 Grammar

```
spec := "oracle" | baseUrl "|" model [ "|" apiKeyEnvVar ]
```

- `oracle` selects the built-in scripted adapter (§4.4).
- `baseUrl` is a URL including its scheme, for example `https://openrouter.ai/api/v1`. The
  request goes to `<baseUrl>/chat/completions`.
- `model` is the model identifier the endpoint expects.
- `apiKeyEnvVar` names an environment variable, **never the key itself**. The third part is
  optional; when it is absent the request is sent unauthenticated, which is what a local
  endpoint needs.

A bare model id that is neither `oracle` nor contains a pipe is expanded against the default
aggregator, `https://openrouter.ai/api/v1`, with the key read from `OPENROUTER_API_KEY`. This is
what makes `--model gpt-5` work, and it is the only defaulting in the grammar.

### 4.2 Two rules the grammar carries

**A key is never accepted on the command line.** Only the *name* of the variable is. A key in an
argument ends up in shell history, in a process listing, and in whatever logs the caller keeps.
A suite that reads a key from argv is non-conforming.

**An empty or unset variable is a refusal, not a silent no-key request.** If a spec names
`OPENROUTER_API_KEY` and that variable is unset, the run stops before contacting anything and
names the variable. Sending an unauthenticated request instead would surface as a provider 401
three minutes into a run, which reads like an outage rather than like a configuration mistake.

### 4.3 Validation

An adapter spec is validated before a run starts, not at the first API call. The checks, in
order: the parts are non-empty, the base URL parses and has a host, and the named variable is
set. A failure is a usage error (§5.3).

### 4.4 The oracle

`oracle` selects a scripted adapter that answers from the item bank instead of calling a model.
It exists so that the harness can be exercised end to end with no network, and it measures
nothing.

Two consequences, both normative:

- **A run against the oracle is not a score.** It is exempt from the judge requirement (§6.1),
  because a dry run that demands a judge is a dry run nobody can perform. A judged item under
  the oracle is graded by a scripted judge.
- **The oracle must never be the default for a real run.** `auto` requires an explicit
  `--model` when it is told not to prompt, because a defaulted oracle run looks like a result.

## 5. Running

### 5.1 The base command

```
esac run --model <spec> [--judge <spec>] [--split <pool>] [--items <list>] [options]
```

`--model` defaults to `oracle` for `run` only, so that the bare command is a dry run rather than
a request for a model the caller never named. `auto` supplies it through its conversation.

### 5.2 Run flags

| Flag | Value | Meaning |
|---|---|---|
| `--model` | adapter spec | The model under test. Default `oracle`. |
| `--judge` | adapter spec | The judge. Required when the selection includes a judged item, except for a dry run. |
| `--allow-unpinned-judge` | none | Accept a judge that is not the pinned one. The resulting run is `NOT VALID`. |
| `--split` | `public` \| `heldout` | The pool. Default `public`. There is no combined mode. |
| `--items` | comma list | Item ids or category ids. A filter, not a pool selection. |
| `--seed` | string | Dataset seed. Defaults to the published public seed; a held-out run refuses to invent one. |
| `--max-tokens` | positive integer | Output cap for the model under test. |
| `--thinking-tokens` | positive integer | Separate hidden-reasoning budget, where the endpoint supports one, so reasoning does not consume the answer cap. |
| `--extra-body` | JSON object | Merged into each model request, for provider parameters this document does not name. An explicit value wins over one `--thinking-tokens` produced. |
| `--json` | path | Write the full report as JSON. |
| `--verbose` | none | Include per-check detail in the report. |
| `--quiet` | none | Suppress the per-item tally. Does not suppress the report. |

`--max-tokens` and `--thinking-tokens` are **positive integers**. A fractional value is a usage
error, because it cannot describe a token budget and silently truncating it would make two
runs' stated conditions false.

### 5.3 Usage errors

A malformed invocation — an unknown command, a flag with an unusable value, a missing
prerequisite, a spec that does not parse — must:

1. write a message to **stderr** beginning with `error:`;
2. print **no report**, and no partial score;
3. exit **1**.

Exit 1 is shared with a valid fail, which is why the other two rules are normative: a usage
error is distinguishable from a result because it prints no report and because it writes to
stderr. A caller that needs to branch on the difference parses the report, not the code.

A future major revision may give usage errors a distinct code. It is recorded here as a known
imprecision rather than fixed, because changing it would change the exit contract of two
released suites at once, and that is a decision for an amendment.

### 5.4 Argument parsing

Flags are `--name value` or `--name=value`. A boolean flag takes no value. Positional arguments
follow the command. A flag appearing more than once takes its last value.

**An option a command does not define is a usage error, not a no-op.** This is the least obvious
rule here and the one that cost the most to learn: a permissive parser that ignores `--itemz`
(a typo for `--items`) does not fail, it runs the whole suite, which spends money and produces a
result nobody asked for. Every command therefore carries a list of the options it accepts, and
anything else is refused before the run starts.

## 6. Judge discipline

The judge is the part of a score that a caller cannot audit by rereading the arithmetic, so the
rules around it are stricter than for anything else.

### 6.1 Requirements

- **A judged selection needs `--judge`.** A run that would score a judged item with no judge is
  refused rather than scored zero, because a zero there would be a fact about the invocation
  and not about the model.
- **A dry run is exempt.** Under `--model oracle`, a scripted judge is supplied. This is the
  one exemption and it is deliberate: `run --model oracle` is the documented way to prove a
  harness works, and a guard that rejects it leaves the documented command broken.
- **The pinned judge is required by default.** A judge that is not the model pinned for the
  release is refused unless `--allow-unpinned-judge` is passed.
- **An accepted substitution produces no verdict.** With the flag, the run proceeds and is
  reported `NOT VALID` (§7): the judged share answers a different question, so reporting `PASS`
  or `FAIL` would be a claim about the wrong instrument.

### 6.2 Judge identity

The pin is checked on the model id, normalised as the final path segment with any `:tag`
removed, compared case-insensitively. So `xiaomi/mimo-v2.6-pro`, `mimo-v2.6-pro`, and
`mimo-v2.6-pro:latest` are all the pinned judge, and `mimo-v2.6` is not. The normalisation exists
so that a self-hosted copy of the pinned weights satisfies the pin; the strictness exists so that
a different version does not.

### 6.3 Replication

Judge-graded items run the model twice and judge each response twice, averaging the four
observations, per [amendment 001 §5](amendments/001-first-amendment.md). Deterministic items run
once. The counts are part of the measurement, not configuration, and a suite may not expose them
as flags.

## 7. Verdicts

A completed run reports exactly one of four verdicts. The vocabulary is closed: a suite may not
add one, because a fifth word would mean a reader has to learn which suite they are reading.

| Verdict | Meaning |
|---|---|
| `PASS` | Every category met the threshold and the total met the threshold. Both are required. |
| `FAIL` | The run covered the suite and missed at least one threshold. |
| `INCOMPLETE` | The run did not cover the suite, so the percentage is against the whole suite and is not a comparable score. |
| `NOT VALID` | The judge was not the pinned judge. No verdict is offered on the model. |

The verdict is a property of the run, not of the model: `INCOMPLETE` and `NOT VALID` describe how
the measurement was taken, and only `PASS` and `FAIL` describe what was measured.

`NOT VALID` takes precedence over `INCOMPLETE`. Both are defects, but they are different kinds:
an incomplete run has no score yet, while a run under a substituted judge has an answer to a
different question, and the second is the more dangerous thing to quote.

## 8. Exit codes

| Code | Meaning |
|---:|---|
| 0 | `PASS`. |
| 1 | `FAIL` or `INCOMPLETE`, or a usage error (§5.3). |
| 2 | Infrastructure failure. Nothing was scored. |
| 3 | `NOT VALID`. |

These four are the whole contract, and they exist so a caller can tell a result from a non-result
without parsing prose. Two rules make them meaningful:

**Infrastructure failure never becomes a score.** A transport error, a non-2xx status, an
unparseable body, or a rate limit is retried under identical conditions and, if it survives,
aborts the run with exit 2. A model failure — an empty answer, a refusal, a response that hit the
output cap — is scored and is not retried, per
[amendment 001 §8](amendments/001-first-amendment.md). The distinction is the whole point:
an outage that reports as a low score is worse than an outage.

**Exit 3 is not a failure and not a pass.** It says the instrument was wrong. A caller that
treats it as a fail will publish a number about the wrong judge.

## 9. Pools and seeds

### 9.1 One pool per run

`--split` takes `public` or `heldout`. There is no combined mode, because the pool decides which
seed the run resolves and there is no single seed for two pools. A request for a combined mode is
a usage error that says so, rather than a generic rejection, because the request is reasonable
and the answer is "run them separately".

### 9.2 Seed resolution

A held-out run resolves its seed from `--seed`, then the suite's seed environment variable, then
`.heldout/seed`. If none is present it **refuses to start**. Inventing a seed is prohibited: a run
nobody can repeat is worth nothing, and a seed generated as a side effect is a seed that will be
lost.

### 9.3 Seed custody

`esac seed` generates a seed from the platform CSPRNG, prefixed so that a leaked seed is
recognisable on sight, and writes it to `.heldout/seed`, which is gitignored. `esac seed show`
reports that a seed exists and prints only its fingerprint; `--reveal` prints the value and says
what that costs.

A seed must never appear in Git, a log, an issue, or documentation. Reports carry the pool and a
**fingerprint** of the seed, never the seed.

### 9.4 Export and key

`export` writes a JSONL snapshot of one pool through a single builder that both the command and
the repository's own verification script use, so the shipped artifact and the documented command
cannot drift apart. `--verify` regenerates in memory and compares **before** writing; a verifier
that writes first and then compares to itself can only ever pass, and one that always passes is
worse than none. Where the comparison needs a file on disk, `--verify` requires `--out` and says
so, rather than verifying nothing.

An export omits everything that makes an item gradable: hidden tests, reference solutions,
expected tool arguments, and expected state. `key` is the complement and is the held-out
artifact; it is not published.

## 10. Configuration and output

### 10.1 Environment

Credentials arrive through the environment, or from a `.env` file in the working directory, read
by the platform's own loader. **A variable already set in the environment wins**, so a CI secret
is never shadowed by a stale file.

### 10.2 Streams

- **stdout** carries the report, the item bank, and progress. It is the thing a caller may pipe.
- **stderr** carries errors and warnings: usage errors, the unpinned-judge warning, and the
  infrastructure-failure notice.

A warning never replaces a report. A run that prints "the judge is unpinned" and then no verdict
has hidden the thing it was warning about.

### 10.3 Secrets

No command echoes a key. `esac judge` reports whether a variable is **set**, not its value, and
`esac seed show` reports a fingerprint until it is asked to reveal. The `--json` report carries
the pool, the seed fingerprint, the model id, and the judge id — never a credential and never a
held-out seed.

### 10.4 Reproducibility of the report

A report must carry enough to say what the number is a measurement *of*: the version tag, the
pool, the seed fingerprint, the model, the judge actually used, and whether that judge was the
pinned one. A score without them is not a result, per tenet 5. The layout is the suite's choice;
the content is not.

## 11. Dry run and self-test

Two different checks, and a suite needs both.

**`run --model oracle`** exercises the real execution path — real items, real grading, real
report — against a scripted model. It measures nothing and must say so in the report.

**`selftest`** asserts the properties the suite claims about itself, offline: that the bank
matches the specified distribution, that instance identity depends only on the seed and the item
id, that every reference solution passes its own tests, that no item is passed by a run that does
nothing, and that a partial run is reported `INCOMPLETE` rather than as a score.

`selftest` exits 0 when every assertion holds and non-zero when any fails, listing what failed.
It must not require credentials.

## 12. Conformance

A suite conforms when it satisfies §3 through §11. The check is behavioural, and it is short
enough to perform by hand:

1. `esac help` and `esac` both print usage and exit 0.
2. `esac --nonsense` exits 1, prints `error:` on stderr, and prints no report.
3. `esac list` enumerates every item without credentials.
4. `esac selftest` passes with no network and no key.
5. `esac run --model oracle` completes on a suite with judged items, and prints no score claim.
6. `esac run --model oracle --split both` exits 1 and explains that one run is one pool.
7. `esac run --model <spec> --items <a judged item>` with no `--judge` exits 1 and names `--judge`.
8. `esac run --model oracle --judge <unpinned>` exits 1 and names `--allow-unpinned-judge`.
9. With that flag, the same run reports `NOT VALID` and exits 3.
10. `esac run --model oracle --items <one category>` reports `INCOMPLETE`, not `PASS`.
11. `esac export --out <artifact> --verify` fails loudly when the file on disk differs from what
    the build produces, and `esac export --verify` with no `--out` refuses rather than passing.
12. `esac run --model <spec> --itemz x` exits 1 naming the unknown option. A parser that ignores
    an option it does not know turns a typo into a full billable run.
13. `esac seed` then `esac seed show` reports existence and a fingerprint, and prints no seed.

## 13. What a suite may change

Recorded so that the boundary is not argued case by case.

**May change:** report layout and wording; which optional commands exist; the item bank and its
categories; how grading works inside a category; the pass thresholds, subject to the amendment
process; the default output cap; extra provider flags, provided they are additive.

**May not change:** the command names in §3; the adapter spec grammar in §4; the meaning of any
flag in §5.2; the verdict vocabulary in §7; the exit codes in §8; that secrets arrive by
environment variable name and are never echoed; that a held-out run refuses to invent a seed.

A suite that needs to violate the second list is proposing a program-level change, and the route
is an amendment in [`amendments/`](amendments/), not a local decision. The reason is the same one
that keeps the constitution unedited: the interface is cited by habit and by script, and an
interface that changes quietly underneath a citation is not a contract.
