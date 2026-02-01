#!/usr/bin/env node
/**
 * Session End Hook
 *
 * Prompts for learnings and saves session summary.
 * Core of the self-correction loop - captures patterns at session end.
 *
 * From Twitter thread: "After each session, have Claude update CLAUDE.md with learnings"
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function log(msg) {
  console.error(msg);
}

function getDateString() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function getTimeString() {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
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
  const sessionsDir = path.join(os.tmpdir(), 'pro-workflow', 'sessions');
  ensureDir(sessionsDir);

  const today = getDateString();
  const time = getTimeString();
  const sessionId = process.env.CLAUDE_SESSION_ID || process.ppid || 'default';
  const shortId = String(sessionId).slice(-6);

  const sessionFile = path.join(sessionsDir, `${today}-${shortId}.md`);

  // Create or update session file
  if (fs.existsSync(sessionFile)) {
    // Update end time
    let content = fs.readFileSync(sessionFile, 'utf8');
    content = content.replace(/\*\*Ended:\*\*.*/, `**Ended:** ${time}`);
    fs.writeFileSync(sessionFile, content);
  } else {
    // Create new session record
    const template = `# Session: ${today}
**Started:** ${time}
**Ended:** ${time}
**Project:** ${path.basename(projectRoot)}

## Summary
[What was accomplished]

## Learnings
[Patterns discovered]

## Next Steps
[What to do next]
`;
    fs.writeFileSync(sessionFile, template);
  }

  // Final reminder
  log('[ProWorkflow] Session ending...');
  log('[ProWorkflow] Did you run /wrap-up? Learnings captured?');
  log('[ProWorkflow] Check: git status | for uncommitted changes');

  // Check for uncommitted changes
  try {
    const { execSync } = require('child_process');
    const status = execSync('git status --porcelain 2>/dev/null', {
      encoding: 'utf8',
      cwd: projectRoot
    });

    if (status.trim()) {
      const changes = status.split('\n').filter(l => l.trim()).length;
      log(`[ProWorkflow] WARNING: ${changes} uncommitted changes!`);
    }
  } catch (e) {
    // Not a git repo
  }

  process.exit(0);
}

main().catch(err => {
  console.error('[ProWorkflow] Error:', err.message);
  process.exit(0);
});
