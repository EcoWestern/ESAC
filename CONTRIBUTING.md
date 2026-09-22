# Contributing

This repository holds the ESAC program: the specification, the description of each suite,
and the program level documentation. **Pull requests are not accepted**, and they are closed
without review.

That is a policy about the instrument rather than about any individual piece of work. The
same reasoning that applies to the suites applies here, and it is worth repeating because the
document is the normative one:

- **One clause to cite.** Every suite cites the specification by section number. If the
  document could change through an external merge path, a citation in a source comment would
  stop meaning what it meant.
- **Amendment, not edit.** A resolved clause is never rewritten in place. It is superseded by
  an amendment that says what it replaces, which keeps earlier readings of the document
  valid. See [specs/README.md](specs/README.md).
- **Version integrity.** An amendment that changes what a score measures is a major-version
  change for the affected suite. That decision has to be made deliberately and in one place.

## What is welcome

**Specification corrections.** If a clause is ambiguous, contradicts another clause, or
describes something the suites cannot implement, open an issue. Quote the section number and
say what it should decide instead. This is the most useful report this repository can
receive.

**Item challenges.** An item that is wrong, ambiguous, guessable, or measures something other
than its category claims is the most valuable report the program as a whole can receive.
Raise it against the suite repository, [EcoWestern/ESAC-GI](https://github.com/EcoWestern/ESAC-GI/issues),
which has a template for it.

**Harness defects.** Bugs in the code, the CLI, the adapters, or the scoring belong in the
suite repository too, not here.

## Forks

The MIT licence permits forking, and a fork is the intended path for anyone who wants a
different instrument: different categories, different rubrics, different thresholds. If you
publish results from a fork, give it its own name and version tag rather than labelling them
ESAC scores, because the version tag is what makes a number traceable.

## How the site is built

The documentation site is generated from the same Markdown that this repository renders, so
there is one copy of every document rather than a site copy that drifts. The build runs in
GitHub Actions ([`.github/workflows/pages.yml`](.github/workflows/pages.yml)) and relies on
Jekyll plugins from the GitHub Pages allowlist, listed with their reasons in `_config.yml`.

The consequence for editing: a page needs no YAML front matter, and a relative link written
as `specs/spec.md` works both on GitHub and on the published site. `tools/check-links.mjs`
verifies that every relative link resolves and that every page named in the site navigation
exists, so a rename cannot quietly break the site.
