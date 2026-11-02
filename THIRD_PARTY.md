# 本地复刻资源来源

本项目按用户提供的参考站进行复刻，当前用于本地预览和验收。

## 参考站

- 网站：https://demo.zexuan604.com/
- 驾驶入口：https://demo.zexuan604.com/drive/
- 原公开引擎：`/_astro/DriveExperience.txuZlHug.js`
- 原公开布局：`/_astro/worldLayout.BDoyyXG7.js`
- 原公开模型：`/drive/models/town-base.glb`、`town-buildings.glb`、`town-props.glb`、`drive-car.glb`

本地改动：资源路径本地化、发现记录独立存储、原站招牌字形移除、生成 HJ. 个性化招牌、双语节点及个人资料弹窗、主页昼夜静物离线渲染、建筑投影交互层，以及非模态驾驶侧卡。

## Three.js

`vendor/town-engine.js` 包含参考站构建时打包的 Three.js，原文件顶部版权标记已保留：

Copyright 2010–2026 Three.js Authors. SPDX-License-Identifier: MIT.

Three.js 上游：https://github.com/mrdoob/three.js

参考站的场景、模型、驾驶实现属于其各自作者；本项目不声明这些素材为李慧洁的原创作品。
