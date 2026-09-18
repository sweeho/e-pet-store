#!/usr/bin/env node
/**
 * Fail on a relative markdown link whose target file does not exist.
 *
 * This exists because renaming `AGENT.md` to `AGENTS.md` left every
 * `[AGENT.md](./AGENT.md#gotchas)` pointing at a file that was no longer there —
 * across five documents, invisibly, because nothing reads a link until a human
 * clicks it. A rename is exactly the change that breaks links and exactly the
 * change nobody re-checks.
 *
 * Scope is deliberately narrow: relative links only. Anchors within a page are
 * not resolved (that needs a heading index and produces false positives on
 * generated slugs), and external URLs are not fetched (a network call in CI is a
 * flake source, not a guard). Symlinked markdown is skipped — CLAUDE.md and
 * GEMINI.md point at AGENTS.md, and checking the same bytes three times only
 * triples the output. `artifacts/` is skipped: those are historical sprint
 * records, and a link that was correct when written is not a defect now.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const files = execFileSync('git', ['ls-files', '*.md'], { encoding: 'utf8' })
  .split('\n')
  .filter(f => f && !f.startsWith('artifacts/') && !lstatSync(f).isSymbolicLink());

const broken = [];
for (const file of files) {
  const dir = dirname(file);
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/\]\((\.{1,2}\/[^)#\s]+)/g)) {
      const target = m[1];
      if (!existsSync(join(dir, target))) broken.push(`${file}:${i + 1} -> ${target}`);
    }
  });
}

if (broken.length > 0) {
  console.error(`${broken.length} broken relative link(s):`);
  for (const b of broken) console.error(`  ${b}`);
  process.exit(1);
}
console.log(`doc-links: ${files.length} file(s) checked, all relative links resolve`);
