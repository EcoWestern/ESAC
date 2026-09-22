# Security policy

## Reporting

Do not open a public issue for a security concern. Report it privately through GitHub's
advisory channel:

https://github.com/EcoWestern/ESAC/security/advisories/new

This is a best-effort project with no bug bounty and no response SLA. Reports are read and
taken seriously. Please allow a reasonable window for a fix before public disclosure.

## What counts as a security issue

This repository holds documents. The code lives in the suite repositories, and harness
vulnerabilities belong in the repository that ships the harness. What is in scope here is
anything that damages the integrity of the specification or of the measurements taken
against it:

- **Specification integrity.** A clause that can be read two ways and would produce two
  different scores, a citation in a suite repository that no longer resolves to the clause it
  named, or an amendment that changes what a score measures without the corresponding
  major-version change.
- **Held-out disclosure.** The held-out pool is only meaningful while its seed stays private.
  Any path that causes a held-out seed, a held-out scoring key, or held-out instance text to
  appear in this repository, in a page built from it, or in a published report.
- **Canary exposure.** The canary string embedded in public item files exists to detect
  contamination. Evidence that it, or adjacent item text, has entered a training corpus is
  worth reporting and may justify retiring the affected item.
- **Misleading capability claims.** Documentation that describes a suite as measuring
  something it does not, or that presents specified-but-unimplemented work as though it were
  a result. ESAC-AG is the current example, and any page that implies otherwise is a defect.
- **Credential handling.** Documentation should never encourage committing a key or a seed.
  An example that does is a bug in the documentation.

## Out of scope

- **Harness vulnerabilities.** Report those against
  [EcoWestern/ESAC-GI](https://github.com/EcoWestern/ESAC-GI/security/advisories/new), which
  ships the code.
- **A model scoring badly.** That is a result, not a vulnerability.
- **Disagreement with the thresholds, category weights, or item selection.** Those are design
  decisions and are recorded as such. Open an issue instead.
- **The public pool being inferable.** That is expected. The public pool is a self-check
  surface, not the scoreboard.

## What happens next

- The report is confirmed and assessed.
- A specification fix is published as an amendment (or as a correction where the wording was
  never in doubt), per [specs/README.md](specs/README.md).
- A suite-affecting decision is reflected in that suite's version, and the consequence is
  recorded in its changelog.
- Reporters are credited unless they prefer otherwise.
