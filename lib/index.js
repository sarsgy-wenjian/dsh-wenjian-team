import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

export const name = "wenjian-team";
export const inject = ["tools"];

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_ROOT = path.join(PKG_ROOT, "skills");
const VERSION = "1.0.0";
const DEFAULTS = { skillsDir: "", autoInstall: true, force: false };

function cfg(config) { return { ...DEFAULTS, ...(config || {}) }; }
function textBlock(text) { return [{ type: "text", text: String(text) }]; }
function sha256File(file) { return createHash("sha256").update(fs.readFileSync(file)).digest("hex"); }
function dshHome() { return process.env.DSH_HOME || path.join(os.homedir(), ".dsh"); }
function resolveSkillsDir(c) { return c.skillsDir ? path.resolve(c.skillsDir) : path.join(dshHome(), "skills"); }

function bundledSkills() {
  if (!fs.existsSync(SKILLS_ROOT)) return [];
  return fs.readdirSync(SKILLS_ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => ({ name: d.name, file: path.join(SKILLS_ROOT, d.name, "SKILL.md") }))
    .filter(s => fs.existsSync(s.file));
}

function readManifest(dir) {
  const p = path.join(dir, ".wenjian-team.json");
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
}
function writeManifest(dir, data) {
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, ".wenjian-team.json"), JSON.stringify(data, null, 2), "utf8");
  } catch { /* 部署目录不可写时由工具状态报错，不阻塞插件加载 */ }
}

function deploy(c, opts = {}) {
  const dir = resolveSkillsDir(c);
  const force = Boolean(opts.force ?? c.force);
  fs.mkdirSync(dir, { recursive: true });
  const results = { dir, version: VERSION, installed: [], updated: [], skipped: [], failed: [] };
  const files = {};
  for (const s of bundledSkills()) {
    const dest = path.join(dir, s.name, "SKILL.md");
    try {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const newHash = sha256File(s.file);
      files[s.name] = newHash;
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(s.file, dest); results.installed.push(s.name);
      } else if (sha256File(dest) === newHash) {
        results.skipped.push(s.name);
      } else if (force) {
        fs.copyFileSync(s.file, dest); results.updated.push(s.name);
      } else {
        results.skipped.push(s.name + "（已存在且内容不同；传 force:true 覆盖）");
      }
    } catch (e) { results.failed.push(s.name + "：" + String(e.message || e)); }
  }
  writeManifest(dir, { plugin: "dsh-wenjian-team", version: VERSION, installedAt: new Date().toISOString(), skills: files });
  return results;
}

function status(c) {
  const dir = resolveSkillsDir(c);
  const bundled = bundledSkills();
  const rows = bundled.map(s => {
    const dest = path.join(dir, s.name, "SKILL.md");
    const has = fs.existsSync(dest);
    let state = "缺失";
    if (has) state = sha256File(dest) === sha256File(s.file) ? "已是最新" : "已存在（内容不同，可 install force）";
    return { skill: s.name, state };
  });
  const counts = rows.reduce((a, r) => { a[r.state] = (a[r.state] || 0) + 1; return a; }, {});
  return {
    plugin: "dsh-wenjian-team", version: VERSION, skillsDir: dir, total: rows.length, counts, rows,
    summary: [
      `文稿校验团队技能：${rows.length} 个内置技能｜目录 ${dir}`,
      ...rows.map(r => `- ${r.skill}：${r.state}`),
      "",
      "下一步：新会话中让主控加载 `wenjian-team-lead` 技能；主控会按 00 组建指令组队。",
    ].join("\n"),
  };
}

function uninstall(c) {
  const dir = resolveSkillsDir(c);
  const bundled = bundledSkills();
  const removed = [], kept = [];
  for (const s of bundled) {
    const dest = path.join(dir, s.name, "SKILL.md");
    if (!fs.existsSync(dest)) { kept.push(s.name + "（未安装）"); continue; }
    if (sha256File(dest) === sha256File(s.file)) {
      try {
        fs.rmSync(dest); removed.push(s.name);
        try { fs.rmdirSync(path.dirname(dest)); } catch { /* 目录里还有用户文件则保留 */ }
      } catch (e) { kept.push(s.name + "（删除失败：" + String(e.message || e) + "）"); }
    } else {
      kept.push(s.name + "（用户改过，保留）");
    }
  }
  try { fs.rmSync(path.join(dir, ".wenjian-team.json"), { force: true }); } catch {}
  return {
    plugin: "dsh-wenjian-team", removed, kept,
    summary: [`已移除 ${removed.length} 个技能；保留 ${kept.length} 个`, ...removed.map(x => `- 移除 ${x}`), ...kept.map(x => `- 保留 ${x}`)].join("\n"),
  };
}

function tool(name, description, parameters, execute) {
  return {
    name, description, parameters,
    output: {
      schema: { type: "object", additionalProperties: true },
      render(_args, value) {
        if (value && typeof value === "object" && typeof value.summary === "string") return textBlock(value.summary);
        return textBlock(typeof value === "string" ? value : JSON.stringify(value, null, 2));
      },
    },
    async execute(args) { return execute(args || {}); },
  };
}
const params = (properties = {}, required = []) => ({ type: "object", properties, required, additionalProperties: false });

export function apply(ctx, config) {
  const c = cfg(config);
  if (c.autoInstall) { try { deploy(c); } catch { /* 工具里可重试 */ } }
  ctx.tools.register(tool(
    "wenjian_team",
    "文稿校验团队技能包：status 查看 10 个技能安装状态，install 部署/更新（force 覆盖用户改动），uninstall 卸载。安装后在新会话加载 wenjian-team-lead 技能即可组队。只操作技能目录，不改稿件。",
    params({
      action: { type: "string", enum: ["status", "install", "uninstall"], description: "status 查看；install 部署/更新；uninstall 卸载" },
      force: { type: "boolean", description: "install 时覆盖已存在的同名技能（默认 false）" },
    }),
    (args) => {
      if (args.action === "install") {
        const r = deploy(c, { force: Boolean(args.force) });
        r.summary = [`技能部署完成：${r.dir}`, `- 新增 ${r.installed.length}｜更新 ${r.updated.length}｜跳过 ${r.skipped.length}｜失败 ${r.failed.length}`, ...r.failed.map(x => "- " + x)].join("\\n");
        return r;
      }
      if (args.action === "uninstall") return uninstall(c);
      return status(c);
    },
  ));
}
