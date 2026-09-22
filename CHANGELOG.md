# Changelog

All notable changes to the ESAC program are recorded here.

This file covers the program: the specification, the set of suites, and the documentation.
Changes to a suite are recorded in that suite's own changelog, because a suite release is
what a score is comparable against.

Two things carry versions, and they are not the same kind of thing:

- **The constitution** is amended rather than versioned. It is the design basis, in numbered
  sections, and each amendment is a separate file that names the provisions it supersedes.
- **Each suite** has a semantic version, and that is the unit a score is comparable within,
  per constitution §7 and amendment 001 §9. `ESAC-GI v1.0` is a version. "75 points" is not.

## [Unreleased]

## [2026-09-22]

### Added

- **The program repository.** An overview of what ESAC is, a page for each suite, and the
  documentation site built from the same Markdown that the repository renders, so there is
  one copy of every document rather than a site copy that drifts from it.
- **A page for ESAC-AG** recording what is specified, what carries over from ESAC-GI, and
  what does not exist yet. It states in its first line that nothing in it may be cited as a
  result, because the suite is not implemented.
- **`specs/README.md`**, which documents how the specification is amended: amendments append
  rather than edit, they name what they supersede, the supersession map is extended, and the
  major-or-minor consequence is decided and recorded.
- **A repository settings section** in the README, recording the repository description and
  the topic list, since neither of those lives in a file.

### Changed

- **The specification moved here** from `EcoWestern/ESAC-GI`, which was its home while
  ESAC-GI was the only suite. It is now the only copy that governs, and it covers the program
  rather than one suite: both ESAC-GI and ESAC-AG are specified in it, and every future
  amendment is appended to it here.
- **The specification's status header** now states that it is normative and program-wide, and
  records the naming convention by which suite repositories cite it.
