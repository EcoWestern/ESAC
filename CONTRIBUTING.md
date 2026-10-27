# Contributing

This repository holds the ESAC program: the specification, the description of each suite,
and the program level documentation. Pull requests adding public model results are welcome.
Pull requests changing the specification remain subject to maintainer review.

Specification changes have a different review path because the specification is the normative
instrument. Every suite cites it by section number, so:

- **One clause to cite.** Every suite cites the specification by section number. If the
  document could change through an external merge path, a citation in a source comment would
  stop meaning what it meant.
- **Amendment, not edit.** A resolved clause is never rewritten in place. It is superseded by
  an amendment that says what it replaces, which keeps earlier readings of the document
  valid. See [specs/README.md](specs/README.md).
- **Version integrity.** An amendment that changes what a score measures is a major-version
  change for the affected suite. That decision has to be made deliberately and in one place.

## What is welcome

**Public model results.** Add one JSON file to [`_data/results/`](https://github.com/EcoWestern/ESAC/tree/main/_data/results)
using the [result format](results/README.md). The file becomes one model card on the
[public results page](results/index.md), and CI checks its required fields and score ranges.
Include a public report link and the exact benchmark version, pool, and evaluation date. Do not
include held-out seeds, answer keys, credentials, or private evaluation material.

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
as `amendments/001-first-amendment.md` works both on GitHub and on the published site.
`tools/check-links.mjs` verifies that every relative link resolves and that every page named in
the site navigation exists, so a rename cannot quietly break the site.

### Preview locally

Ruby 3.x is required; Ruby 4.x is not yet compatible with the GitHub Pages/Jekyll versions used
here. On macOS with Homebrew, install and select Ruby 3.3 first:

```bash
brew install ruby@3.3
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
```

Install the dependencies once, then start the same GitHub Pages-compatible Jekyll build used by
the deployment workflow:

```bash
bundle install
bundle exec jekyll serve --baseurl /ESAC
```

Open [http://localhost:4000/ESAC/](http://localhost:4000/ESAC/) in a browser. The public results
page is at `/ESAC/results/`. Jekyll watches the source files and rebuilds the site as they change;
refresh the browser after editing a JSON result entry.
