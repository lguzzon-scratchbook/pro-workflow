#!/usr/bin/env node
/**
 * Quality Gate Tracker
 *
 * Tracks file edits and reminds about quality gates.
 * Part of the 80/20 review pattern - batch reviews at checkpoints.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

function getTempDir() {
  return path.join(os.tmpdir(), 'pro-workflow');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function log(msg) {
  console.error(msg);
}

async function main() {
  const tempDir = getTempDir();
  ensureDir(tempDir);

  const sessionId = process.env.CLAUDE_SESSION_ID || process.ppid || 'default';
  const editCountFile = path.join(tempDir, `edit-count-${sessionId}`);

  let count = 1;

  if (fs.existsSync(editCountFile)) {
    count = parseInt(fs.readFileSync(editCountFile, 'utf8').trim(), 10) + 1;
  }

  fs.writeFileSync(editCountFile, String(count));

  // Review checkpoint at 5 edits (from Twitter thread: "after >5 file edits")
  if (count === 5) {
    log('[ProWorkflow] 5 edits reached - good checkpoint for review');
    log('[ProWorkflow] Run: git diff --stat | to see changes');
  }

  // Remind at 10 edits
  if (count === 10) {
    log('[ProWorkflow] 10 edits - strongly consider quality gates:');
    log('[ProWorkflow]   npm run lint && npm run typecheck && npm test --changed');
  }

  // Every 10 edits after that
  if (count > 10 && count % 10 === 0) {
    log(`[ProWorkflow] ${count} edits - run quality gates before continuing`);
  }

  process.exit(0);
}

main().catch(err => {
  console.error('[ProWorkflow] Error:', err.message);
  process.exit(0);
});
