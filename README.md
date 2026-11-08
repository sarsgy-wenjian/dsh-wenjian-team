# 文稿校验团队 · dsh-wenjian-team

> 给 DeepSeek Harness（DSH）的长篇/设定集「校验 → 建议 → 修订 → 复核」工作流。安装 **10 个技能**，不碰你的稿件，不自动改稿。

![icon](assets/icon.png)

## 它解决什么问题

长篇小说、剧情大纲、设定集写到几万字后，最容易出的不是文笔问题，而是：

- 设定前后矛盾（时间线、年龄、地名、物件）；
- 内容与「设定总纲/人物卡」对不上（吃书）；
- 修改时越改越乱，没有确认单和第二道复核；
- 单次通读成本高，且一轮很难查全。

这个插件把一套已经跑了多轮实测的团队工作流做成 10 个可复用技能：**只读校验 → 三档建议 → 作者勾选 → 定点替换 → 逐字复核**，并通过「两道闸门」保证不替作者做决定。

## 它不做什么

- **不会自动组队**：安装后仍由主控（Lead）按 `wenjian-team-lead` 技能里的组建指令 spawn 队友；需要 DSH Agent Teams。
- **不改你的稿**：校验/建议角色只读；修订只按作者勾选的逐字包执行；落盘要单独授权。
- **不携带任何项目数据**：插件只有技能与模板，不含任何小说稿件、设定或评分答案。

## 配套插件（可选）

[dsh-intake-guard](https://github.com/sarsgy-wenjian/dsh-intake-guard)：材料接管闸门——用户新递进来的资料默认标成「外部材料·非基准」，文档出六行接管卡并硬拦记忆/基准写入，截图/代码等问答上下文只留一行标记。独立安装、互不依赖。

```bash
dsh plugin --profile desktop add github:sarsgy-wenjian/dsh-intake-guard
```

## 安装

从 GitHub（发布后）：

```bash
dsh plugin --profile desktop add github:<sarsgy-wenjian>/dsh-wenjian-team
```

本地开发（本仓库目录）：

```bash
dsh plugin --profile desktop add link:/path/to/dsh-wenjian-team
```

> 安装后重启 DSH（bundle 在进程启动时加载），再新开一个会话。

## 验证

在新会话里对 AI 说：

> 用 `wenjian_team` 工具看一下文稿校验团队的技能状态

应返回 10 个技能均为「已是最新」，并提示加载 `wenjian-team-lead`。

## 快速开始

1. 准备好你的**待校验稿**（大纲/正文/设定集），以及**基准**（设定总纲、人物卡、项目规则包）；没有规则包可让 `wenjian-rules-compiler` 先引导建包。
2. 对 AI 说：

> 加载 `wenjian-team-lead` 技能，按 00 团队组建指令组队，用这套流程校验《我的稿》。稿在 ……，基准在 ……。

3. 主控会走六步：**建包 → 校验（内容＋结构） → 三档建议 → 你逐条勾选 → 定点替换 → 复核**；每步停下等你确认。
4. 定稿前看复核表：blocking 必须清零；不勾选的条目不会执行。

## 10 个技能

| 技能 | 角色 |
|---|---|
| `wenjian-team-lead` | 主控：组队、派任务包、两道闸门、成本纪律 |
| `wenjian-content-checker` | 内容只读校验：硬冲突/背景/人设/逻辑/遗漏/口径 |
| `wenjian-structure-checker` | 结构只读校验：时间线/伏笔/衔接/多线/视角 |
| `wenjian-revision-advisor` | 参考建议：每条三档方案＋确认单 |
| `wenjian-doc-reviser` | 修订：只按确认单定点替换 |
| `wenjian-handoff-protocol` | 交接协议：编号、任务包、复核表、闸门 |
| `wenjian-rules-compiler` | 规则包整理：建包/校对/C-X 索引 |
| `wenjian-planner` | 规划员：长文拆块、跨块关联 |
| `wenjian-setting-augmenter` | 设定增补：只在复核通过后按需 |
| `wenjian-cost-discipline` | 降本纪律 v2.3.1：召唤矩阵、输出预算、建议三段式 |

`references/roles/` 里是 10 个角色的完整原文，`references/templates/` 是规则包/建包/任务包模板。

## 实测成本（内部记录）

- v2.2 单项目全链：**¥3.781**；
- v2.3.2 降本版：**¥2.559（-32.3%）**，输出 token -18.9%；结构/建包臂仍未完全压下来，后续继续优化。
- 校验质量：旧项 recall 8/8（定向复核合并口径）、误报 0、blocking 0（终版）。

> 数字来自同一个约 9k 字的大纲项目，仅作量级参考；不同稿件/基准/模型路由会不同。

## 目录

```
lib/index.js           Host 插件：部署技能 + wenjian_team 工具
skills/                10 个 SKILL.md（安装时部署到 ~/.dsh/skills）
references/roles/      10 个角色完整原文
references/templates/  规则包/建包/任务包模板
cordis.patch.yml       DSH bundle patch
```

## 卸载

```bash
dsh plugin --profile desktop remove dsh-wenjian-team
```

或在新会话里让 AI 调 `wenjian_team` 的 `uninstall`（只删除内容未改过的技能；用户改过的会保留）。

## 反馈与交流

- **问题 / 建议**：本仓库 GitHub Issues，或邮件 `sarsgy01@outlook.com`
- **国内访问**：Gitee 镜像 https://gitee.com/the-color-of-the-night-sky/wenjian-agent-team （可能滞后，以 GitHub 为准）
- **欢迎分享改进**：MIT，fork/PR 或邮件都行；调试好的版本请注明改了什么、怎么验证的。
- 反馈时请勿贴稿件正文、密钥或隐私，给最小复现即可。

## License

MIT。见 `LICENSE`。
