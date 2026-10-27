#!/usr/bin/env node
/** Validate the JSON entries that feed the public results page. */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = process.cwd();
const DATA_DIR = resolve(ROOT, "_data/results");
const REQUIRED_RESULT_STRING_FIELDS = ["benchmark", "version", "verdict", "pool", "evaluated_at", "report_url"];
const VERDICTS = new Set(["PASS", "FAIL", "INCOMPLETE", "NOT VALID"]);
const POOLS = new Set(["public", "held-out"]);
const problems = [];

function required(object, field, label) {
  if (typeof object[field] !== "string" || object[field].trim() === "") problems.push(`${label}.${field} must be a non-empty string`);
}

function publicUrl(value, label) {
  if (typeof value !== "string") return;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) problems.push(`${label} must use http or https`);
  } catch {
    problems.push(`${label} must be a valid public URL`);
  }
}

if (!existsSync(DATA_DIR)) {
  console.log("no results directory; nothing to validate");
  process.exit(0);
}

const files = readdirSync(DATA_DIR).filter((file) => file.endsWith(".json")).sort();
for (const file of files) {
  const label = `_data/results/${file}`;
  const filenameDate = file.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}-/.test(file)) problems.push(`${label} must start with YYYY-MM-DD- for recency ordering`);
  let entry;
  try {
    entry = JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));
  } catch (error) {
    problems.push(`${label} is not valid JSON: ${error.message}`);
    continue;
  }
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    problems.push(`${label} must contain a JSON object`);
    continue;
  }
  required(entry, "name", label);
  required(entry, "published_at", label);
  if (entry.model_url !== undefined) publicUrl(entry.model_url, `${label}.model_url`);
  if (typeof entry.published_at === "string" && !/^\d{4}-\d{2}-\d{2}$/.test(entry.published_at)) problems.push(`${label}.published_at must be YYYY-MM-DD`);
  if (/^\d{4}-\d{2}-\d{2}-/.test(file) && entry.published_at !== filenameDate) problems.push(`${label} filename date must match published_at`);
  if (!Array.isArray(entry.results) || entry.results.length === 0) {
    problems.push(`${label}.results must be a non-empty array`);
    continue;
  }
  entry.results.forEach((result, index) => {
    const resultLabel = `${label}.results[${index}]`;
    if (!result || typeof result !== "object" || Array.isArray(result)) {
      problems.push(`${resultLabel} must be an object`);
      return;
    }
    for (const field of REQUIRED_RESULT_STRING_FIELDS) required(result, field, resultLabel);
    publicUrl(result.report_url, `${resultLabel}.report_url`);
    if (!VERDICTS.has(result.verdict)) problems.push(`${resultLabel}.verdict is not recognised`);
    if (!POOLS.has(result.pool)) problems.push(`${resultLabel}.pool is not recognised`);
    if (typeof result.score !== "number" || typeof result.max_score !== "number" || result.max_score <= 0 || result.score < 0 || result.score > result.max_score) {
      problems.push(`${resultLabel}.score must be between zero and max_score`);
    }
    for (const field of ["published_at", "evaluated_at"]) {
      if (typeof result[field] === "string" && !/^\d{4}-\d{2}-\d{2}$/.test(result[field])) problems.push(`${resultLabel}.${field} must be YYYY-MM-DD`);
    }
  });
}

console.log(`checked ${files.length} result file${files.length === 1 ? "" : "s"}`);
if (problems.length > 0) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? "" : "s"}:`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log("every result entry is valid");
