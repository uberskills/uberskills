---
name: uber-skills
description: Save, view and remove trusted agent skills from your personal skill list. Use when the user wants to save a skill, see what skills they have saved, or remove a skill from their list.
---

# Uber-Skills

Manage your personal list of trusted agent skills.

## Skill list location

```
~/.config/uberskills/skills.json
```

## Skill list format

```json
{
  "version": "1",
  "name": "alice's skills",
  "skills": [
    "github:owner/repo",
    "npm:package-name",
    "https://example.com/some-skill"
  ]
}
```

## First use

If `~/.config/uberskills/skills.json` does not exist:

1. Scan `~/.claude/skills/` and `~/.agents/skills/` for installed skills — each subdirectory with a `SKILL.md` is a skill.
2. For each, read the `name` field from the SKILL.md frontmatter.
3. Try to find a matching GitHub source by checking if `https://github.com/<name>/<name>` exists (just note it as `github:<name>/<name>` — don't fetch). Otherwise record as `local:<name>`.
4. Run `whoami` to get the system username. Create `~/.config/uberskills/` if needed and write `skills.json` with `"name": "<username>'s skills"` and the discovered skills.
5. Say: "Found N installed skills and saved them as a starting point — not published yet. Here's your list: ..."

## Normalize a SkillRef

Before saving any skill, normalize the input to a SkillRef:

| Input | Result |
|-------|--------|
| `github.com/owner/repo` or `https://github.com/owner/repo` | `github:owner/repo` |
| `owner/repo` (two slash-separated tokens, no protocol) | `github:owner/repo` |
| npm package name (no slashes) | `npm:package-name` |
| Any other URL | use the URL as-is |

## Workflows

### List skills
Read `~/.config/uberskills/skills.json` and display the `skills` array. If the file does not exist, run the first-use flow.

### Add a skill
1. Normalize the input to a SkillRef.
2. If it already exists in the list, say so and stop.
3. Append to the `skills` array and write the file.
4. Confirm: "Saved `<ref>`. You now have N skills."

### Remove a skill
1. Match by SkillRef or by the last segment of the ref (e.g. `brave-search` matches `github:badlogic/pi-skills` if that's the only match — prefer exact matches).
2. Remove from the array and write the file.
3. Confirm: "Removed `<ref>`. N skills remaining."
