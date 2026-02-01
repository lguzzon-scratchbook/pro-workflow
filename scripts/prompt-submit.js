#!/usr/bin/env node
/**
 * UserPromptSubmit Hook
 *
 * Runs before user prompt is sent to Claude.
 * Detects correction patterns to support self-correction loop.
 *
 * Input (stdin): { session_id, prompt }
 * Output (stdout): Same JSON, optionally modified
 * Exit 0: Continue
 * Exit 2: Block with message
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
  let data = '';

  process.stdin.on('data', chunk => {
    data += chunk;
  });

  process.stdin.on('end', () => {
    try {
      const input = JSON.parse(data);
      const prompt = input.prompt || '';

      // Detect correction patterns
      const correctionPatterns = [
        /no,?\s*(that's|thats)?\s*(wrong|incorrect|not right)/i,
        /you\s*(should|shouldn't|need to|forgot)/i,
        /that's not what I (meant|asked|wanted)/i,
        /wrong file/i,
        /undo that/i,
        /revert/i,
        /don't do that/i,
        /stop/i,
        /wait/i
      ];

      const isCorrection = correctionPatterns.some(p => p.test(prompt));

      if (isCorrection) {
        log('[ProWorkflow] Correction detected - remember to capture with [LEARN]');
      }

      // Detect learning triggers
      const learnPatterns = [
        /remember (this|that)/i,
        /add (this|that) to (your )?rules/i,
        /don't (do|make) that (again|mistake)/i,
        /learn from this/i,
        /\[LEARN\]/i
      ];

      const isLearnTrigger = learnPatterns.some(p => p.test(prompt));

      if (isLearnTrigger) {
        log('[ProWorkflow] Learning trigger detected');
      }

      // Track prompt count
      const tempDir = getTempDir();
      ensureDir(tempDir);
      const sessionId = input.session_id || 'default';
      const countFile = path.join(tempDir, `prompt-count-${sessionId}`);

      let count = 1;
      if (fs.existsSync(countFile)) {
        count = parseInt(fs.readFileSync(countFile, 'utf8').trim(), 10) + 1;
      }
      fs.writeFileSync(countFile, String(count));

      // Output unchanged
      console.log(data);
    } catch (err) {
      console.log(data);
    }
  });
}

main().catch(err => {
  console.error('[ProWorkflow] Error:', err.message);
  process.exit(0);
});
