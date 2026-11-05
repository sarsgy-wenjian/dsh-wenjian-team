# Changelog

## 1.0.0 — 2026-11-05

- Initial release: 10 skills (content/structure checking, revision advice, revision, handoff, rulepack compiler, planner, setting augmenter, cost discipline, team lead).
- Host plugin `lib/index.js`: installs skills to `$DSH_HOME/skills`, registers `wenjian_team` (status/install/uninstall).
- Based on the public team pack v2.4 (team v2.3.2: 09 v2.3.1, 02 v2.7).
- Internal measured: full pipeline ¥2.559 (-32.3% vs v2.2 ¥3.781), recall 8/8, false positives 0 (targeted verification).
