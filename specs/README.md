# The specification, and how it changes

`spec.md` is the normative document of the ESAC program. It is the only copy that governs:
suite repositories cite it rather than holding their own.

This repository is where the specification lives and where every future amendment is
appended, which is the reason the program has a repository of its own.

## How the document is built

The specification has two parts, and the split is deliberate.

- **Part I: the original design basis.** The design as first set out, including the
  reasoning behind it and the questions that were still open at the time.
- **Part II: the first amendment.** Ten decisions taken after reviewing Part I, each
  resolving a specific ambiguity or gap.

Part I is kept rather than rewritten, because the reasoning behind an instrument is part of
the instrument, and because it should stay visible what changed and why. Where the two
disagree, **Part II governs**.

## Adding an amendment

An amendment is a numbered part appended to `spec.md`, in the same shape as Part II. The
procedure, such as it is, is short and exists so that a decision is findable later:

1. **Append a part**, not an edit. Part III follows Part II, and so on. Never rewrite a
   resolved clause in place: a suite repository in the wild cites section numbers, and those
   citations have to keep resolving.
2. **Number the decisions within the part** and give each one a title that says what it
   decides. Existing amendments use the form `## 4. Parametrization is a principle, not an
   absolute requirement`.
3. **Name what each decision supersedes**, quoting the Part I clause it replaces. A decision
   that supersedes nothing is an addition, and should say so.
4. **Extend the supersession map** at the end of the document, which is the single place
   those relationships are collected.
5. **Match the style of the document**: prose that explains the reasoning, not a changelog
   entry. The reasoning is the part that has to survive contact with the next decision.
6. **Decide whether it is a major or a minor change.** Changing what a score measures is a
   major version and makes earlier scores incomparable. Rotating items or clarifying wording
   is minor. Part II §9 governs, and a suite's `CHANGELOG.md` records the consequence.

## What an amendment is not

- **Not a place for implementation detail.** How a suite stores its items or names its
  classes belongs in that suite's repository. The specification says what is measured and
  why.
- **Not a place to record results.** Scores, comparisons, and model rankings belong in the
  suite release they were produced against.
- **Not retroactive.** An amendment governs from the version that adopts it. Earlier scores
  are read against the specification as it stood at their version tag, which is why the
  tag, not the document, is the unit of comparability.

## Citing the specification

| Reference | Meaning |
|---|---|
| `ESAC spec §N` | Part II section N, the part that governs |
| `first-amendment §N` | The same section, under the name it had when amendments were separate documents |
| `ESAC spec, Part I` | The original basis, which is superseded wherever Part II disagrees |
| `ESAC-GI v1.0` | A suite release. The unit a score is comparable within, per Part II §9 |

Suite repositories cite sections this way in source comments, so the numbers matter. If a
citation ever stops resolving, that is a defect in the amendment, not in the citation.
