---
name: uberskills
description: Save, share and discover trusted agent skills. Build a
  personal skill list, share it as a URL, load lists from people you
  trust, and discover new skills through your network.
---

# UberSkills

Helps you save, discover and share trusted agent skills.

## When to use this skill

Use when the user wants to:
- Save a skill they trust
- See what skills they have saved
- Share their skill list with someone
- Load someone else's skill list
- Find skills from the community registry
- Find skills from people they follow (GitHub, Bluesky)
- Add or remove trusted authors

## Skill list location

Local:  ~/.config/uberskills/skills.json
Remote: GitHub Gist (public, shareable)

## On first use

1. Scan installed skills in the agent's skills directory.
2. Normalize each to a SkillRef ("github:owner/repo" if source known,
   else "local:name" as fallback).
3. Write to ~/.config/uberskills/skills.json.
4. Tell the user: "Found N installed skills. Added them as a starting
   point — not published yet. Want to review before sharing?"

## Workflow: save a skill

1. Accept a URL, GitHub ref, or npm package name.
2. Normalize to SkillRef.
3. Append to skills.json.
4. If a Gist exists, re-publish silently.
5. Confirm: "Saved github:owner/repo. 9 skills in your list."

## Workflow: share a list (P2P track)

1. Read skills.json.
2. Ask: "This will publish your list publicly. Ready?"
3. Create or update a GitHub Gist.
4. Return the raw URL.

## Workflow: load someone else's list (P2P track)

1. Fetch the URL.
2. Validate (must be version "1" JSON with a skills array).
3. Show what's in it: "12 skills. 3 you already have. 9 new."
4. Ask: "Add to your trusted sources? (won't merge into your list)"
5. Save reference in skills.json under "extends".

## Workflow: discover new skills (autonomous track)

1. Run `node ~/.config/uberskills/fetch-registry.js "<query>" --limit 20`.
   (falls back to `node <skill-dir>/fetch-registry.js` if not found locally)
2. Cross-reference with skills.json and any extended lists.
3. Rank: trusted list first, then by registry score.
4. Present top N with name, description, author, install command.

## Workflow: trust an author (autonomous track)

1. Accept a GitHub username, Bluesky handle, or Substack URL.
2. Resolve to an AuthorRef.
3. Add to lens.trusted_authors.
4. Fetch their skills from the registry.
5. Confirm: "Added github:alice as trusted. They have 3 indexed skills."

## Normalize a SkillRef

Before saving any skill, normalize the input to a SkillRef:

| Input | Result |
|-------|--------|
| `github.com/owner/repo` or `https://github.com/owner/repo` | `github:owner/repo` |
| `owner/repo` (two slash-separated tokens, no protocol) | `github:owner/repo` |
| npm package name (no slashes) | `npm:package-name` |
| Any other URL | use the URL as-is |

## Skill list format

```json
{
  "version": "1",
  "name": "alice's skills",
  "skills": ["github:owner/repo", "npm:package-name"],
  "extends": ["https://gist.github.com/bob/abc/raw"]
}
```

## Rules

- Never store tokens in skills.json.
- The list is public — treat all content as shareable.
- Always confirm before publishing to a Gist.
- "Installed" ≠ "endorsed". Confirm intent before sharing.
