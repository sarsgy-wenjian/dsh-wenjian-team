# dsh-wenjian-team

A long-form manuscript verification team for DeepSeek Harness (DSH): 10 skills covering content/structure checking, three-tier revision proposals, handoff and cost discipline. It installs a **check → suggest → revise → re-check** pipeline with two human gates; it never edits the manuscript on its own.

## Install

```bash
dsh plugin --profile desktop add github:<sarsgy-wenjian>/dsh-wenjian-team
```

Restart DSH after installing. In a new session, ask the agent to run `wenjian_team status`; all 10 skills should be "up to date".

## Quick start

Load `wenjian-team-lead` and follow its team setup instructions; point it at your manuscript and baseline (setting bible, character cards, rulepack). The Lead runs six steps and stops for confirmation at each gate. Only checked items are applied by the reviser; a re-check must report zero blocking findings before finalising.

## Skills

`wenjian-team-lead`, `wenjian-content-checker`, `wenjian-structure-checker`, `wenjian-revision-advisor`, `wenjian-doc-reviser`, `wenjian-handoff-protocol`, `wenjian-rules-compiler`, `wenjian-planner`, `wenjian-setting-augmenter`, `wenjian-cost-discipline`.

## Scope

- Installs skills only; requires DSH Agent Teams to spawn teammates.
- No manuscript/project data is bundled.
- Internal measured cost: ¥3.781 (v2.2) → ¥2.559 (-32.3%, v2.3.2) on one 9k-character outline project; quality recall 8/8, false positives 0 in targeted verification.

## License

MIT.
