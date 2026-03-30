# AI 勘察报告系统组件使用政策

本文档定义 `survey-reporting-app` 的前端组件来源与例外边界。

## 1. 默认组件来源

`survey-reporting-app` 的所有页面默认只能使用以下两套组件体系：

- `ant-design-vue`
- `ant-design-x-vue`

目标：

- 与样板间保持一致的组件语言
- 保持主题、交互反馈与视觉层级一致
- 避免多套 UI 库并存

## 2. 组件分工

### 2.1 `ant-design-vue`

用于标准业务后台页面：

- Layout
- Form
- Table
- Tabs
- Tree
- Steps
- Progress
- Result
- Drawer
- Modal
- Upload
- Alert
- Descriptions
- Tag
- Empty
- Skeleton
- Dropdown
- Tooltip

### 2.2 `ant-design-x-vue`

用于 AI 相关交互：

- `Welcome`
- `Prompts`
- `Sender`
- `Attachments`
- `Suggestion`
- `ThoughtChain`
- `Actions`
- `useXAgent`
- `useXChat`
- `XRequest`
- `XProvider`

原则：

- AI 能力展示优先使用 X 组件
- 标准 CRUD、表单、表格、筛选仍优先使用 Ant Design Vue

## 3. 本期页面到组件映射

### 项目列表页

- `a-input-search`
- `a-select`
- `a-table`
- `a-tag`
- `a-empty`
- `a-popconfirm`

### 项目创建/编辑页

- `a-form`
- `a-input`
- `a-select`
- `a-auto-complete`
- `a-alert`

### 数据管理页

- `a-steps`
- `a-menu` 或 `a-tabs`
- `a-upload-dragger`
- `a-table`
- `a-collapse`
- `a-alert`

### 模板选择页

- `a-card`
- `a-radio-group`
- `a-drawer`
- `a-tag`

### AI 生成页

- `a-steps`
- `a-progress`
- `a-alert`
- `ThoughtChain`
- `Actions`
- `Welcome`
- `Prompts`
- `Sender`

### 报告编辑页

- `a-tree`
- `a-tabs`
- `a-drawer`
- `a-form`
- `a-textarea`
- `Suggestion`
- `Actions`

### 校验结果页

- `a-list` 或 `a-table`
- `a-tag`
- `a-alert`
- `Actions`

### 审核归档页

- `a-descriptions`
- `a-form`
- `a-textarea`
- `a-result`

## 4. 例外项

以下能力不在上述组件库的原生能力范围内：

- 地图拾取
- 真正的类 Word 富文本编辑器

因此本期策略如下：

- 地图拾取先降级为地址描述 + 坐标字段 + 占位交互
- 报告编辑先使用结构化分段编辑，不引入独立富文本内核

如果后续必须接入第三方能力，要求：

- 先补文档说明
- 外围交互仍保持 Ant Design Vue / Ant Design X Vue 风格
- 不得污染 shell 和其他微应用
