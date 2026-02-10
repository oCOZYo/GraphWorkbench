# 异构图建模工作站 (GraphWorkbench)

基于 **Vite + React + D3** 构建的专业级异构图谱建模工作站。专为保险团伙欺诈分析、关联网络挖掘等场景设计，提供灵活的实体/关系编辑、类型预设管理、保司权限视角、以及标准化的数据导入导出能力。

## 🚀 快速开始

- **安装依赖**：`pnpm install`
- **启动开发服务器**：`pnpm dev`
- **生产构建**：`pnpm build`
- **预览产物**：`pnpm preview`

## ✨ 功能概览

- **画布操作**：支持节点的新增、删除、拖拽布局，实时计算力导向布局。
- **关系管理**：直观创建、编辑与删除实体间的关联关系。
- **类型配置管理**：
  - **实体类型 (Node Types)**：自定义名称、颜色、图标 (Emoji 字符)、自动识别关键字、ID 前缀。
  - **关系类型 (Link Types)**：自定义颜色、线型 (实线/虚线)、线宽。
- **权限管理与多保司视角**：
  - 核心逻辑基于 `INSURER` 类型的节点作为视角主体。
  - 节点具备 `visibleTo` 属性，仅当切换到对应保司或“显示全部”时可见。
- **样式覆盖 (Overrides)**：支持在单节点/单连线上直接设置 `color`、`icon` 或 `style` 来覆盖所属类型的默认配置。
- **数据兼容**：标准 JSON 导入导出，内置 Neo4j 格式映射器。

---

## 📊 数据交换协议详细说明 (JSON Schema)

为确保数据能被顺利导入并在 UI 中正确展示，请遵循以下核心格式：

### 1. 节点对象 (Nodes)
```json
{
  "id": "UNIQUE_ID",
  "label": "显示名称",
  "type": "TYPE_KEY",            // 需对应 nodeTypes 中的 Key
  "icon": "👤",                 // 可选，覆盖类型的默认 Emoji 图标
  "color": "#HEX_COLOR",        // 可选，覆盖类型的默认颜色
  "visibleTo": ["BS_PA", ...]   // 必填，包含可见该节点的 INSURER 节点 ID 列表
}
```

### 2. 连线对象 (Links)
```json
{
  "id": "L123",
  "source": "START_NODE_ID",
  "target": "END_NODE_ID",
  "type": "REL_NAME",           // 需对应 linkTypes 中的 name
  "style": "solid" | "dashed",  // 线型：实线或虚线
  "weight": 1.5,                // 线宽：推荐 1.0 - 5.0
  "color": "#HEX_COLOR"         // 可选，覆盖默认颜色
}
```

### 3. 类型配置 (Type Configs)
- **nodeTypes**: `Record<string, { label, color, icon, keywords: string[], prefix: string }>`
- **linkTypes**: `Array<{ name, color, style, weight }>`

---

## 🤖 LLM 数据生成助手 (Expert Prompt Template)

复制以下提示词给 LLM（如 Claude 3.5 Sonnet / GPT-4o），即可生成高质量的业务测试数据。

### 提示词模板

```markdown
# Role
你是一个保险欺诈网络分析专家。你需要生成一个符合 GraphWorkbench 规范的异构图谱 JSON 数据包。

# Task
基于提供的[业务场景描述]，构建一个复杂的关联网络模型：
[此处粘贴业务场景：例如“一个跨省的团伙，利用 5 个投保人在 3 家保司间通过虚假伤残证明骗保...”]

# Output Rules (CRITICAL)
1. **基础骨架**：输出必须是一个纯净的 JSON 对象，包含 nodes, links, nodeTypes, linkTypes, commonColors。
2. **节点配置 (nodeTypes)**：
   - 必须包含：AGENT (代理人), MEMBER (投保人), POLICY (保单), INVOICE (发票), INSURER (保险公司), HOSPITAL (医疗机构)。
   - **icon 字段必须使用具体的 Emoji 字符** (例如: 👤, 👨, 📄, 🧾, 🏢, 🏥)。
   - `prefix` 必须是短大写字母 (如 DL, TB)，`keywords` 包含 3-5 个业务关键词。
3. **节点定义 (nodes)**：
   - 必须包含至少两个 "type": "INSURER" 的节点（作为权限主体，ID 建议以 BS 开头）。
   - 每个普通节点的 `visibleTo` 数组必须根据业务逻辑包含上述保司 ID。如果全行业可见，则包含所有保司 ID；如果是保司内部私有，则只包含一个。
   - 禁止生成 x, y, fx, fy 坐标字段。
4. **关系定义 (links & linkTypes)**：
   - linkTypes 需定义：代理销售、承保、就诊、提交凭证、异常关联、资金流向等。
   - `style` 仅限 "solid" 或 "dashed"。
   - 欺诈嫌疑的高危关联请将 `weight` 设置为 3.0 以上，并使用红色系 `color` 覆盖。
5. **配色方案**：使用高质量的 HEX 颜色（如 #EF4444, #3B82F6 等）。

# 示例参考结构
{
  "nodeTypes": {
    "AGENT": { "label": "代理人", "color": "#ef4444", "icon": "👤", "prefix": "DL", "keywords": ["代理", "经纪"] }
  },
  "linkTypes": [
    { "name": "提交凭证", "color": "#f59e0b", "style": "solid", "weight": 1.5 }
  ],
  "nodes": [
    { "id": "BS_PA", "label": "平安保险", "type": "INSURER", "visibleTo": ["BS_PA"] },
    { "id": "DL_01", "label": "代理人 A", "type": "AGENT", "visibleTo": ["BS_PA", "BS_ZA"] }
  ],
  "links": [
    { "id": "L1", "source": "DL_01", "target": "BD_01", "type": "代理销售", "style": "solid", "weight": 1.5 }
  ],
  "commonColors": ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#94a3b8"]
}
```

---

## 🛠️ 数据修正与 Neo4j 支持

- **ID 自动补全**：若导入的连线缺失 ID，系统会自动生成唯一标识。
- **类型自动推断**：导入未定义类型的节点时，系统会自动在配置列表中创建默认样式。
- **Neo4j 映射**：支持导入标准的 Neo4j JSON 导出格式（映射 `labels` 到 `type`，`properties` 到节点属性）。
