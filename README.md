# Huijie's Space · 好奇小镇

李慧洁的个人空间，支持中英文浏览、互动小镇、驾驶探索与科技文章。

在线展示：[Huijie's Space](https://tonghuyen3234y-del.github.io/hj/) · [中文主页](https://tonghuyen3234y-del.github.io/hj/home/) · [English](https://tonghuyen3234y-del.github.io/hj/en/home/)

源码仓库：[hj](https://github.com/tonghuyen3234y-del/hj)

## 本地打开

需要 Node.js 18 或更新版本。没有需要安装的 npm 依赖。

```sh
git clone https://github.com/tonghuyen3234y-del/hj.git huijie-space
cd huijie-space
npm run dev
```

打开 <http://127.0.0.1:4173/>。

- 中文主页：<http://127.0.0.1:4173/home/>
- 开车探索：<http://127.0.0.1:4173/drive/>
- English：<http://127.0.0.1:4173/en/>

在终端按 `Ctrl+C` 停止预览。修改源文件后，重新运行 `npm run build` 并刷新浏览器即可看到更新。`npm run dev` 启动时也会自动构建。

## 这版包含

- 车票票根撕开与入口记忆、互动网点标题、自动盖章、纸张网格、明信片式联系区域。
- 中英文完整页面：入口、主页、关于、项目、经历、文章、联系、驾驶。
- 主页小镇：个性化昼夜图片、六栋建筑轮廓热区、高亮与地址联动；按北京时间 06:00 / 18:30 自动切换，也可手动选择。
- 吸顶导航、阅读进度、栏目位置随语言切换保留、滚动文字条、卡片入场与公众号封面倾斜。
- 驾驶：WASD / 方向键移动、Shift 加速、空格刹车、E 查看、R 重置、N 昼夜、V 全景；地图自动导航及自动导览。
- 手机端适配；驾驶页随窄屏或减少动态效果偏好切换为六个直接入口，清理实时场景。
- 驾驶信息使用非模态侧边纸卡，支持 Esc、焦点恢复、文章跳转与卡内复制。
- 公众号名称复制；不显示未提供的邮箱、社交地址和统计数字。
- 经历保留空白结构；项目只显示占位文案；四篇已确认的微信文章提供全文跳转与链接复制，不编写摘要或封面。
- 3D 模型与程序都存储在本地，无远程 CDN、数据统计或账号服务。

## 更新内容

`content.js` 是个人资料与双语内容配置。`projects`、`experiences`、`links` 当前为空；`articles` 已录入四篇真实微信文章，按用户提供顺序对应标题和链接。

项目和经历条目支持 `title`、`description`（中文/英文对象），可选 `url`、`period`。文章条目支持 `title`、`platform`、`url`（标题及平台为中英文对象）。有真实内容后填入相应数组，会出现在现有容器中。

```js
{
  title: { zh: '真实标题', en: 'Actual title' },
  description: { zh: '真实介绍', en: 'Actual description' },
  // url: 填入真实、可公开的网址；不填则不显示跳转按钮。
}
```

`links` 是未来联系方式的数据预留位，当前不渲染；补充联系方式时再接入展示组件。

## 文件

- `app.js`：页面结构、路由、复制、车票和驾驶侧卡。
- `motion.js`：互动网点标题、入场、印章、滚动与阅读进度。
- `town.js`：首页小镇热区、昼夜边界、地址联动。
- `scene.js`：驾驶场景的 HJ. 个性化招牌。
- `content.js`：个人资料、中英文文案、文章数据与预留数组。
- `styles.css`：复古印刷风格与响应式布局。
- `vendor/`：本地小镇引擎和布局。
- `assets/models/`：个人化后的四个 GLB 模型。
- `assets/town/`：同一批模型离线渲染的昼夜图及投影热区数据。
- `scripts/`：构建、预览、检查和模型文字处理脚本。
- `dist/`：`npm run build` 生成的静态网站。

运行 `npm run check` 检查语法、双语配置、文章标题/链接配对、昼夜边界、场景图片/热区、空栏目约束、资源完整性与 16 个静态路由。

## GitHub Pages

`.github/workflows/pages.yml` 在向 `main` 推送后自动检查、构建并发布 `dist/`。仓库 Pages 使用 GitHub Actions 发布，具体配置与日常更新见 [GitHub 发布说明](docs/GitHub发布.md)。

交互状态测试见 `qa/verify-interactions.mjs`，需另装 Happy DOM 测试工具；它模拟 DOM 与引擎事件，不替代浏览器视觉或 WebGL 验收。详见 [验收记录](qa/验收记录.md)。

首页场景图由 `scripts/render-town.py` 使用 Blender 4.5 离线生成；运行时不需要 Blender。重绘时执行：`blender --background --python scripts/render-town.py`（需要 Node.js 与 macOS 宋体字体）。

## 参考来源

视觉与交互参考 <https://demo.zexuan604.com/>。小镇 GLB 资源、布局和驾驶引擎由参考站公开浏览器资源在本地适配；模型中的原站招牌文字已移除，驾驶页在运行时生成 HJ. 个性化招牌，首页使用相同模型与个人招牌的离线渲染图。网页结构、个人资料、双语内容与纸张组件在本项目中组织实现。

引擎内保留 Three.js 上游的版权及 MIT 标记。详细来源见 `THIRD_PARTY.md`。
