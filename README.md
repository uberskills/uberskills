# UberSkills

Trusted agent skill discovery. Find skills from the cross-registry catalogue
ranked by your personal trust network — not just raw popularity.

## Install the skill

```bash
npx skills add uberskills/uberskills
```

## What it does

Gives you trust-aware skill discovery in any agent conversation — no global
install required. The agent runs the CLI via `npx uberskills` automatically.

```
"Find me a git skill"
"Trust alice on GitHub"
"Show my trust network"
"Find skills from people I trust"
```

Results are labelled `✓ trusted` or `⚠ unknown` based on three tiers:

| Tier | Source |
|------|--------|
| Tier 1 | Public signals from the registry (stars, license, security scans) |
| Tier 2 | Local signals from `~/.config/uberskills/db.json` (what you actively use) |
| Tier 3 | Your trust network in `~/.config/uberskills/trust.json` |

## Quick reference

```bash
npx uberskills find git                              # search with trust overlay
npx uberskills trust list                            # view your trust network
npx uberskills trust add alice                       # trust a GitHub author
npx uberskills trust add --source github_following alice   # import alice's following list
npx uberskills trust remove alice                    # remove a trusted author
```

## Privacy

- The trust network is resolved client-side and sent anonymously with each search
- No user identity, session token, or device ID is created or stored
- `db.json` (local usage data) is never transmitted

## License

MIT
