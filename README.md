# 异构图建模工作站（Vite + React）

基于 Vite + React + D3 的图谱建模工作站，提供实体/关系编辑、类型预设管理、单保司视角、导入导出等能力，界面使用 Tailwind CSS。

## 快速开始

- 安装依赖：pnpm install
- 启动开发：pnpm dev
- 生产构建：pnpm build
- 预览产物：pnpm preview

## 功能概览

- 节点新增、删除与拖拽布局
- 关系创建、编辑与删除
- 实体类型配置（名称/颜色/图标）
- 关系类型配置（颜色/线型/线宽）
- 单保司视角与可见性管理
- 数据导入导出（JSON）
- 单节点/单边个性化覆盖（图标、颜色、线型、线宽）

## 架构概览

- UI 组件化：侧栏、详情面板、类型配置弹窗
- D3 渲染逻辑抽成 Hook，UI 与渲染分离
- 全局状态收敛到 Context，避免层层传参
- 预设与导入导出逻辑下沉到独立模块

## 项目结构

- 入口：[src/main.jsx](src/main.jsx)
- 页面布局：[src/App.jsx](src/App.jsx)
- D3 渲染 Hook：[src/hooks/useGraphRenderer.js](src/hooks/useGraphRenderer.js)
- 可见性策略 Hook：[src/hooks/useVisibility.js](src/hooks/useVisibility.js)
- 可见性选择器：[src/selectors/visibilitySelectors.js](src/selectors/visibilitySelectors.js)
- 全局状态：[src/context/GraphContext.jsx](src/context/GraphContext.jsx)
- 预设配置：[src/config/graphPresets.js](src/config/graphPresets.js)
- 数据工具：[src/utils/graphData.js](src/utils/graphData.js)
- 图编辑动作：[src/actions/graphActions.js](src/actions/graphActions.js)
- 类型配置动作：[src/actions/typeActions.js](src/actions/typeActions.js)
- 组件目录：[src/components/](src/components/)
- 全局样式：[src/index.css](src/index.css)

## 数据格式

导入导出为 JSON，包含 nodes、links、linkTypes、nodeTypes：

- nodes: [{ id, label, type, icon?, color?, visibleTo? }]
- links: [{ id, source, target, type, color?, style?, weight? }]
- linkTypes: [{ name, color, style, weight }]
- nodeTypes: { [typeKey]: { label, color, icon, keywords?, prefix? } }
- commonColors: ["#RRGGBB", ...]

## Neo4j 导入/导出

- 导出文件为 JSON，结构：
	- nodes: [{ id, labels: [type], properties: { label, type, icon?, color?, visibleTo? } }]
	- relationships: [{ id, type, start, end, properties: { color?, style?, weight? } }]
- 导入时会自动补齐缺失的节点类型/关系类型配置（使用默认样式）。



