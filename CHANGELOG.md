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

## [2026-09-23]

### Added

- **ESAC-AG has a start.** [EcoWestern/ESAC-AG](https://github.com/EcoWestern/ESAC-AG) now
  carries the mock environment (a filesystem, a stateful service, and a shell, all in memory),
  the harness (a multi-turn loop with a per-task cap of 10 to 15 tool calls and a failure
  taxonomy), and the first of the seven categories, tool-call correctness, which is 10 of the
  75 points. Nothing there is a score: a run covers part of the suite and is reported as
  `INCOMPLETE`, which is the suite being honest rather than unfinished.

### Changed

- **The ESAC-AG page** now separates what exists from what does not, instead of saying the suite
  is unimplemented, and names generated-code execution and the efficiency modifier's
  normalisation among what is still missing.

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
- **Maintainer notes**, in `MAINTAINERS.md`: the settings that live in a web form rather than in
  a file, for both repositories, covering descriptions, topics, rulesets, the security features
  that have to be switched on, and what to do at release time. Kept out of the README, which is
  written for readers rather than for whoever runs the repositories.
- **Rulesets as code**, in `.github/rulesets/`: the default-branch and release-tag rulesets as
  JSON, with the reasoning behind the admin bypass that keeps direct pushes to `main` working.
  Pushing them applies nothing, so each is imported once per repository.
- **A required check that runs on pull requests.** The Pages workflow now runs its internal link
  check as a job of its own, named `Check links`, on pull requests as well as on `main`. It is the
  context the ruleset requires, and it is deliberately independent of the site build so that it
  does not depend on Pages being enabled.
- **The pull request policy is enforced, not just stated.** `.github/workflows/close-pull-requests.yml`
  answers a pull request from outside the organisation with the notice in
  `.github/pull-request-notice.md` and closes it, exempting members, collaborators, and
  maintainers, and checking out only the base commit.

### Changed

- **The specification moved here** from `EcoWestern/ESAC-GI`, which was its home while
  ESAC-GI was the only suite. It is now the only copy that governs, and it covers the program
  rather than one suite: both ESAC-GI and ESAC-AG are specified in it, and every future
  amendment is appended to it here.
- **The specification's status header** now states that it is normative and program-wide, and
  records the naming convention by which suite repositories cite it.
