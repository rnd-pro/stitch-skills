# Contributing

`stitch-skills` contains agent skills for Stitch MCP, Project Graph MCP, and Symbiote.js component generation.

Keep changes close to the owning area:

- Skill instructions: `skills/<skill-name>/SKILL.md`
- Skill examples: `skills/<skill-name>/examples/`
- Skill scripts: `skills/<skill-name>/scripts/`
- Shared references: `resources/`

Before opening a change:

```sh
find skills resources -type f | sort
```

Review changed `SKILL.md` files, examples, and scripts together. Do not commit private prompts, generated private designs, local paths, credentials, screenshots containing private data, or temporary audits.
