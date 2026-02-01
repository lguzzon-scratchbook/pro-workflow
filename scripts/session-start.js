#!/usr/bin/env node
/**
 * Session Start Hook
 *
 * Loads context from previous sessions and LEARNED patterns.
 * Part of the self-correction loop - memory compounds over time.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

function log(msg) {
  console.error(msg);
}

function findProjectRoot() {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, '.git'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

async function main() {
  const projectRoot = findProjectRoot();
  const claudeDir = path.join(projectRoot, '.claude');
  const learnedFile = path.join(claudeDir, 'LEARNED.md');

  // Check for LEARNED.md and count patterns
  if (fs.existsSync(learnedFile)) {
    const content = fs.readFileSync(learnedFile, 'utf8');
    const learnedPatterns = (content.match(/\[LEARN\]/g) || []).length;

    if (learnedPatterns > 0) {
      log(`[ProWorkflow] Loaded ${learnedPatterns} learned patterns from LEARNED.md`);
    }
  }

  // Check for previous session notes
  const sessionsDir = path.join(os.tmpdir(), 'pro-workflow', 'sessions');
  if (fs.existsSync(sessionsDir)) {
    const files = fs.readdirSync(sessionsDir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse();

    if (files.length > 0) {
      const lastSession = files[0];
      log(`[ProWorkflow] Previous session: ${lastSession}`);
    }
  }

  // Check for parallel worktrees
  try {
    const { execSync } = require('child_process');
    const worktrees = execSync('git worktree list 2>/dev/null', { encoding: 'utf8' });
    const count = worktrees.split('\n').filter(l => l.trim()).length;

    if (count > 1) {
      log(`[ProWorkflow] ${count} worktrees available for parallel work`);
    }
  } catch (e) {
    // Not a git repo or git not available
  }

  log('[ProWorkflow] Ready. Use /wrap-up before ending, /learn-rule to capture corrections.');

  process.exit(0);
}

main().catch(err => {
  console.error('[ProWorkflow] Error:', err.message);
  process.exit(0);
});
