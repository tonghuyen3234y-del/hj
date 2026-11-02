# GitHub Pages 发布

发布源码以 `huijie-space` 目录为准；相邻的 `github-pages`、`personal-home` 是此前版本，不参与这次发布。

源码仓库：[tonghuyen3234y-del/tonghuyen3234y-del.github.io](https://github.com/tonghuyen3234y-del/tonghuyen3234y-del.github.io)。
网站网址：<https://tonghuyen3234y-del.github.io/>。
发布状态：[GitHub Actions](https://github.com/tonghuyen3234y-del/tonghuyen3234y-del.github.io/actions)。

## 自动发布

`.github/workflows/pages.yml` 在推送 `main` 分支或手动运行时执行：

1. 使用 Node.js 22 运行 `npm run check`，检查内容和资源并生成 16 个静态页面。
2. 上传 `dist/` 作为 GitHub Pages artifact。
3. 部署到 `github-pages` 环境。

仓库的 Settings → Pages → Build and deployment → Source 已配置为 **GitHub Actions**。保持这个设置；从分支根目录直接发布会漏掉构建后的子页面。

网站所有图片、模型和引擎均在仓库内；CI 直接使用已生成的昼夜图片，无需安装 Blender。网站运行无需后端、环境变量或 API Key。

## 日常更新

在此目录修改 `content.js` 等源文件后：

```sh
npm run check
git add .
git commit -m "Update Huijie's Space"
git push origin main
```

等待仓库 Actions 中的 **Publish Huijie's Space** 完成，再刷新网站。构建产物 `dist/`、本地凭据和历史验收截图不上传；GitHub Actions 从源码重新构建。

## 展示入口

- 首页：<https://tonghuyen3234y-del.github.io/>
- 中文主页：<https://tonghuyen3234y-del.github.io/home/>
- 文章：<https://tonghuyen3234y-del.github.io/home/#writing>
- 驾驶：<https://tonghuyen3234y-del.github.io/drive/>
- English：<https://tonghuyen3234y-del.github.io/en/home/>

如果一次更新部署失败，可以在 Actions 查看失败步骤；已经成功发布的上一版仍保留。
