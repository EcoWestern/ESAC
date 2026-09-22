#!/usr/bin/env node
/**
 * Internal link check.
 *
 * A documentation repository has one failure mode that matters: a relative link that no
 * longer resolves. Renaming a page, or moving the specification, silently breaks every
 * citation of it, and a citation is exactly what suite repositories rely on.
 *
 * Three things are checked, all of them offline:
 *
 *   1. every relative link in every Markdown file resolves to a file that exists;
 *   2. every page named in the site navigation exists;
 *   3. every `.html` target hard-coded in the layout corresponds to a `.md` file, since the
 *      site build turns one into the other.
 *
 * External links are not checked. A network check in CI fails for reasons that have nothing
 * to do with this repository, and a checker nobody trusts gets switched off.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "node_modules", "_site", ".jekyll-cache", "vendor"]);

/** Pages the site navigation offers. Each one has to exist, or the navigation is broken. */
const NAVIGATION_PAGES = [
  "README.md",
  "benchmarks/gi.md",
  "benchmarks/ag.md",
  "specs/spec.md",
  "specs/README.md",
  "CHANGELOG.md",
];

/** A scheme such as https:, or a protocol-relative //host. Not our problem to check. */
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/** `[text](target)` and `[text](target "title")`. Images are checked as well. */
const LINK = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

function markdownFiles(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
      markdownFiles(join(dir, entry.name), found);
    } else if (entry.name.endsWith(".md")) {
      found.push(join(dir, entry.name));
    }
  }
  return found;
}

const show = (path) => relative(ROOT, path).split("\\").join("/");

const files = markdownFiles(ROOT);
const problems = [];
let linkCount = 0;

for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(LINK)) {
    const raw = match[1];
    if (EXTERNAL.test(raw) || raw.startsWith("#")) continue;

    // A link may point at a heading inside another file; the file is what has to exist.
    const target = raw.split("#")[0];
    if (target.length === 0) continue;
    linkCount++;

    const targetPath = target.startsWith("/")
      ? resolve(ROOT, target.slice(1))
      : resolve(dirname(file), target);
    if (!existsSync(targetPath)) {
      problems.push(`${show(file)}: ${raw} does not resolve`);
    }
  }
}

for (const page of NAVIGATION_PAGES) {
  if (!existsSync(resolve(ROOT, page))) {
    problems.push(`the site navigation names ${page}, which does not exist`);
  }
}

const layoutPath = resolve(ROOT, "_layouts/default.html");
if (existsSync(layoutPath)) {
  const layout = readFileSync(layoutPath, "utf8");
  for (const match of layout.matchAll(/'(\/[^']*)\.html'/g)) {
    const stem = match[1].replace(/^\//, "");
    if (!existsSync(resolve(ROOT, `${stem}.md`))) {
      problems.push(`_layouts/default.html links to ${match[0]}, but ${stem}.md does not exist`);
    }
  }
} else {
  problems.push("_layouts/default.html is missing, so the site would build without a layout");
}

console.log(`checked ${linkCount} internal links across ${files.length} Markdown files`);

if (problems.length > 0) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? "" : "s"}:`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log("every internal link resolves, and every navigation target exists");
