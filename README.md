# Pro Workflow Skill

Professional Claude Code workflow patterns from community best practices and the Claude Code creator's recommendations.

## What's Included

### Core Patterns

| Pattern | Description |
|---------|-------------|
| **Self-Correcting CLAUDE.md** | Claude writes its own rules after corrections |
| **Plan Mode First** | Always plan before executing multi-file changes |
| **Git Worktrees** | Run parallel Claude sessions with zero dead time |
| **Split Architecture** | Organize CLAUDE.md into focused files |
| **DevOps Wrap-Up** | End-of-session review and learning capture |
| **Subagent Strategy** | When and how to use subagents effectively |
| **Context Discipline** | Verification-first workflows |
| **Model Selection** | Choose the right model for the task |

## Quick Start

Use the skill by invoking `/pro-workflow` or asking Claude about workflow optimization.

### Add to Your Project

Copy the essential rules to your project's CLAUDE.md:

```markdown
## Pro Workflow Settings

### Self-Correction
When I correct you, update CLAUDE.md with the lesson learned.

### Planning
For multi-file changes: plan first, wait for approval, then execute.

### Quality Gates
After edits: lint, typecheck, test before considering done.
```

### Use Split Architecture

Copy templates from `templates/split-claude-md/` to your project:

```bash
cp -r ~/.claude/skills/pro-workflow/templates/split-claude-md/* ./.claude/
```

## Files

```
pro-workflow/
├── SKILL.md           # Main skill definition
├── README.md          # This file
├── config.json        # Configuration options
└── templates/
    └── split-claude-md/
        ├── CLAUDE.md      # Main entry point
        ├── AGENTS.md      # Workflow rules
        ├── SOUL.md        # Style/personality
        ├── COMMANDS.md    # Custom commands
        └── LEARNED.md     # Auto-populated corrections
```

## Configuration

Edit `config.json` to customize behavior:

- `self_correction.auto_update_claude_md` - Auto-update without approval
- `plan_mode.threshold_files` - Files count that triggers plan mode
- `quality_gates.*_command` - Customize lint/test commands

## Credits

Patterns distilled from:
- Boris Cherny (Claude Code creator) - X thread
- Community best practices - Various contributors
- everything-claude-code skill collection
