---
name: pro-workflow
description: Professional Claude Code workflow patterns from community best practices. Covers self-correcting CLAUDE.md, plan mode, parallel sessions with git worktrees, subagent strategies, DevOps wrap-up commands, context discipline, and model selection. Use when setting up optimal Claude Code workflows or seeking productivity improvements.
tools: Read, Glob, Grep, Bash, Edit, Write
---

# Pro Workflow Skill

Battle-tested Claude Code workflow patterns distilled from power users and the Claude Code creator's recommendations.

## Core Principles

### 1. Self-Correcting CLAUDE.md

The most powerful feedback loop: have Claude write its own rules after corrections.

**How it works:**
1. When you correct Claude, ask it to update CLAUDE.md with the lesson
2. Over time, your CLAUDE.md "trains itself" based on real corrections
3. Creates a compounding improvement loop

**Implementation:**
```markdown
## CLAUDE.md Auto-Update Rule

When I make a mistake and the user corrects me, I should:
1. Acknowledge the correction
2. Propose an addition to CLAUDE.md that prevents the same mistake
3. Ask for approval before updating

Format for learned rules:
## Learned: [Category]
- [Specific rule from correction]
- Context: [When this applies]
```

**Trigger phrases:**
- "Add that to CLAUDE.md"
- "Remember this for next time"
- "Update your rules with this"

### 2. Plan Mode First

Quality difference between "just do it" and planning first is significant.

**When to use plan mode:**
- Multi-file changes
- Architectural decisions
- Features touching >3 files
- Anything requiring >10 tool calls

**Plan mode workflow:**
1. Enter plan mode: `/plan` or ask Claude to plan first
2. Claude explores codebase, identifies files
3. Presents implementation plan
4. Wait for explicit approval
5. Execute plan step by step

**CLAUDE.md instruction:**
```markdown
## Planning Rule
For any task that:
- Touches more than 3 files
- Involves architectural decisions
- Has multiple valid approaches

ALWAYS enter plan mode first. Present plan and wait for "proceed" before executing.
```

### 3. Git Worktrees for Parallel Sessions

Zero dead time by running multiple Claude sessions in parallel.

**Setup:**
```bash
# Create worktrees for parallel work
git worktree add ../project-feature-a feature-a
git worktree add ../project-feature-b feature-b
git worktree add ../project-bugfix bugfix-branch

# Each worktree gets its own Claude session
cd ../project-feature-a && claude
# In another terminal:
cd ../project-feature-b && claude
```

**Benefits:**
- Work on feature while waiting for long operation
- Parallel exploration of different approaches
- Like having a small dev team you can clone

**CLAUDE.md instruction:**
```markdown
## Parallel Work Pattern
This project uses git worktrees for parallel development.
- Main codebase: ~/project
- Feature work: ~/project-feature-*
- Bugfixes: ~/project-bugfix

When blocked on a long operation, suggest user can start a parallel session.
```

### 4. Split CLAUDE.md Architecture

For complex projects, split configuration by concern.

**File structure:**
```
.claude/
├── CLAUDE.md          # Main entry, imports others
├── AGENTS.md          # Workflow rules, subagent config
├── SOUL.md            # Personality, style, tone
├── COMMANDS.md        # Custom commands/skills
└── LEARNED.md         # Auto-populated corrections
```

**CLAUDE.md (main entry):**
```markdown
# Project Context

## Quick Links
- Workflow rules: see .claude/AGENTS.md
- Style guide: see .claude/SOUL.md
- Custom commands: see .claude/COMMANDS.md
- Learned patterns: see .claude/LEARNED.md

[Project-specific content here]
```

### 5. DevOps Agent & Wrap-Up Command

End-of-session review ensures nothing is forgotten.

**Setup /wrap-up command:**
```markdown
## /wrap-up Command

At end of session, this command:
1. Reviews all changes made
2. Checks for uncommitted work
3. Verifies tests still pass
4. Updates CLAUDE.md with learnings
5. Creates session summary

Trigger: User says "wrap up" or "/wrap-up"
```

**Wrap-up checklist:**
- [ ] All changes committed?
- [ ] Tests passing?
- [ ] Documentation updated?
- [ ] TODOs addressed or noted?
- [ ] CLAUDE.md updated with learnings?

### 6. Subagent Strategy

Use subagents strategically with clear instructions.

**CLAUDE.md instruction:**
```markdown
## Subagent Rules

Use subagents (Task tool) for:
- Parallel exploration of multiple files
- Long-running operations that can background
- Independent research tasks

Provide subagents with:
1. Clear, specific objective
2. Relevant file paths
3. Success criteria
4. What to return

Avoid subagents for:
- Simple single-file reads
- Sequential dependent operations
- Tasks requiring full conversation context
```

### 7. Context Window Discipline

Verification-first workflows and planning before execution.

**Principles:**
1. Read before write - always understand existing code
2. Verify before proceeding - run tests, check types
3. Compact strategically - at task boundaries, not mid-work
4. Summarize complex explorations

**CLAUDE.md instruction:**
```markdown
## Context Discipline

Before any edit:
1. Read the file first (ALWAYS)
2. Understand the surrounding context
3. Verify approach with user if ambiguous

After significant work:
1. Run relevant tests
2. Check for type errors
3. Offer to compact at logical boundaries
```

### 8. Model Selection Strategy

Choose the right model for the task.

**Guidelines:**
| Task Type | Recommended Model |
|-----------|------------------|
| Quick fixes, typos | Sonnet/Haiku |
| Multi-file refactors | Opus |
| Complex architecture | Opus 4.5 + Thinking |
| Code generation | Sonnet |
| Debugging complex issues | Opus 4.5 + Thinking |

**Opus 4.5 with Thinking:**
- Slower but often "one-shot" solution
- Saves time by avoiding correction cycles
- Best for non-trivial professional development

### 9. Post-Hooks for Quality Gates

Automatic linting and type checking after edits.

**Note:** Hooks execute after response is complete.

**Alternative - CLAUDE.md instruction:**
```markdown
## Quality Gates

After ANY code edit, before marking task complete:
1. Run: `npm run lint` (or equivalent)
2. Run: `npm run typecheck` (or equivalent)
3. Run: `npm test -- --related` (affected tests)

Do NOT submit work until all gates pass.
```

## Quick Setup

Add to your root CLAUDE.md:

```markdown
## Pro Workflow Settings

### Self-Correction
When I correct you, update CLAUDE.md with the lesson learned.

### Planning
For multi-file changes: plan first, wait for approval, then execute.

### Quality Gates
After edits: lint, typecheck, test before considering done.

### Context
Read files before editing. Verify understanding before proceeding.

### Wrap-Up
On "/wrap-up": review changes, check for uncommitted work, update learnings.
```

## Commands This Skill Provides

| Command | Purpose |
|---------|---------|
| `/wrap-up` | End-of-session review |
| `/learn` | Extract pattern to CLAUDE.md |
| `/plan` | Enter planning mode |
| `/parallel` | Suggest worktree setup |

## Related Resources

- [Boris Cherny's Claude Code Thread](https://x.com/bcherny) - Original insights
- `strategic-compact` skill - Context compaction strategy
- `continuous-learning` skill - Auto pattern extraction
- `plan` skill - Detailed planning workflow
