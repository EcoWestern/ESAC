# The specification

The ESAC specification is two kinds of document, and the split is deliberate.

| Document | What it is |
|---|---|
| [constitution.md](constitution.md) | The design basis, in numbered sections. It governs, and it is amended rather than rewritten. |
| [amendments/](amendments/) | One file per amendment. Each names the provisions of the constitution it supersedes, and each governs where it disagrees with the constitution. |

## Register of amendments

| Amendment | Adopted | Status | Constitution provisions it supersedes or clarifies |
|---|---|---|---|
| [001: the first amendment](amendments/001-first-amendment.md) | 2026-09-22 | In force | §1, §2, §3, §5, §6, and the failure handling implied throughout |

A row here is one file. The per-decision detail, including which clause each decision
replaces, is in the supersession map at the end of the amendment itself.

## Why it is split this way

Citations have to keep resolving. Suite repositories cite the design by section number, in
prose and in source comments, and a clause that quietly changes meaning breaks every citation
to it. So the basis is written once and kept as it was written, and later decisions are
appended beside it as amendments that say what they replace.

That is also why an amendment is never edited after adoption. If a later decision changes an
earlier amendment, it becomes a new amendment that supersedes it, so that a reader can follow
the sequence rather than a document that has been rewritten underneath them.

## Citing the specification

| Citation | Refers to |
|---|---|
| `constitution §4` | section 4 of the constitution |
| `amendment 001 §2` | section 2 of the first amendment |
| `amendment 001` | the whole of the first amendment, which is one file |
| `ESAC-GI v1.0` | a suite release. The unit a score is comparable within, per constitution §7 and amendment 001 §9 |

A bare section number is never used on its own, because the constitution and each amendment
are numbered independently. `§4` is ambiguous; `constitution §4` and `amendment 001 §4` are
not.

## Adding an amendment

1. **New file, next number.** `amendments/002-<short-slug>.md`. Never edit an adopted
   amendment, and never renumber one.
2. **Open with a header block**: the date adopted, its status, and what it took as input.
   The first amendment's header is the shape to copy.
3. **One numbered section per decision**, with a title that says what the decision is. Not a
   changelog entry: the reasoning is the part that has to survive contact with the next
   decision.
4. **Name what it supersedes.** Every decision that replaces a provision of the constitution
   quotes that provision in a line such as `*Supersedes the ... clause in the constitution,
   under section 3.*` A decision that supersedes nothing is an addition, and says so.
5. **End with that amendment's supersession map**, in the form the first amendment uses.
6. **Add a row to the register above.**
7. **Decide whether it is major or minor**, per constitution §7 and amendment 001 §9, and
   record the consequence in the affected suite's changelog. Changing what a score measures
   is a major version and is not a decision to make in passing.

## What an amendment is not

- **Not implementation detail.** How a suite stores its items or names its classes belongs in
  that suite's repository. The specification says what is measured and why.
- **Not a place to record results.** Scores, comparisons, and model rankings belong with the
  suite release they were produced against.
- **Not retroactive.** An amendment governs from the version that adopts it. Earlier scores
  are read against the specification as it stood at their version tag, which is why the tag
  and not the document is the unit of comparability.

## History

Until 2026-09-22 this was a single document: the design basis followed by the first amendment,
in one file, with the two halves labelled Part I and Part II. It was split because a document
that is amended in place cannot be cited safely, and because a second suite made the design
program-level rather than the property of one repository. Citations written as
`first-amendment §N` mean `amendment 001 §N`.
