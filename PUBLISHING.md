# 发布说明（给非技术用户）

> 这个目录已经是一个可安装的 DSH 插件包，本地已实测：安装成功、10 个技能部署成功、`wenjian_team` 工具可用。
> 要发到 DSH 社区，只差一个**公开 GitHub 仓库**（社区市场用 GitHub 链接收录）。

## 零、先解决 GitHub 网络

双击 `插件发布/启动GitHub注册（专用浏览器）.bat`（详见 `GitHub网络访问说明.md`）。
如果打不开，手机开热点再试；仍不行告诉我。

## 一、先注册/登录 GitHub

打开 https://github.com/signup 注册（免费）；已有账号直接登录。

## 二、建仓库并上传本目录

1. 登录后点右上角 **+ → New repository**；
2. Repository name 填：**`dsh-wenjian-team`**（你的用户名是 `sarsgy-wenjian`，仓库最终地址应为 `https://github.com/sarsgy-wenjian/dsh-wenjian-team`）；选 **Public**；不要勾选 “Add a README file”；点 **Create repository**；
3. 在新仓库页面点 **uploading an existing file**；
4. 把本目录（`dsh-wenjian-team` 文件夹）里的**全部内容**拖进上传框（不要只拖文件夹，要拖里面的文件/子文件夹）；
5. Commit message 填 `dsh-wenjian-team 1.0.0`，点 **Commit changes**；
6. 在仓库首页点 **About 右侧的齿轮 → Topics**，加 `dsh-plugin`，保存。

> 不想装任何软件：直接用网页上传即可。装 GitHub Desktop 也可以，效果一样。

## 三、等 1 天（硬门槛）

社区列表要求仓库创建满 1 天才能收录；上传后第二天再提交。

## 四、提交到社区（二选一或都做）

### A. awesome-dsh-plugin（主列表，最推荐）

1. 打开 https://github.com/awesome-dsh-plugin/awesome-dsh-plugin
2. 点 **Fork**；在你的 fork 里进入 `data/plugins/`，**Add file → Create new file**；
3. 文件名填：`<你的GitHub用户名>__dsh-wenjian-team.yml`（注意两个下划线）；
4. 内容用本目录的 `market/awesome-entry.yml`，把里面 `sarsgy-wenjian` 换成你的用户名；
5. Commit，然后回到原仓库点 **Pull requests → New pull request**，标题写 `Add dsh-wenjian-team`，正文用 `market/PR-body.md`。

### B. dshopen 开放市场

1. 打开 https://github.com/polang233/dsh-plugin-index/issues/new?template=plugin-add.yml
2. 按模板填仓库地址、描述、许可证；说明“已本地实测，可从 GitHub 源码安装”。

## 五、可选：发 npm

发 npm 能提升市场展示与下载量，但**不是必须**（社区列表支持直接从 GitHub 安装）。需要 Node/npm 环境；不懂可以先跳过，等社区反馈后再补。

## 六、注意

- 许可证已按 MIT 放在 `LICENSE`；如果以后想换，改这一个文件并同步 README。
- 仓库里**不要**上传 `node_modules`、`.git`、个人路径或任何小说稿件；本目录已清理。
- 描述不要写“自动组队/自动改稿”——实际不自动，描述必须与代码一致，否则审核会打回。
