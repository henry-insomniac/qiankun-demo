# AI 勘察报告智能生成系统微应用蓝图

本文档定义 `survey-reporting-app` 在当前 qiankun 平台中的职责、页面边界与集成方式。

## 1. 定位

`survey-reporting-app` 是一个标准路由型 qiankun 微应用。

它负责：

- 勘察项目管理
- 多源数据录入与导入
- 模板选择
- AI 生成任务控制
- 报告预览与结构化编辑
- 合规校验
- 审核与归档

它不负责：

- 顶部导航
- 平台主侧边菜单
- 登录页
- 全局主题策略
- 跨应用登录实现

## 2. 路由边界

shell 只负责分配业务前缀：

```text
/survey-reporting/*
```

微应用内部路由建议如下：

```text
/projects
/projects/new
/projects/:id/settings
/projects/:id/data
/projects/:id/template
/projects/:id/generate
/projects/:id/report
/projects/:id/compliance
/projects/:id/audit
```

规则：

- 微应用内部只处理 `routeBase` 以下的路由
- 跨应用跳转必须通过 shell `navigation`

## 3. 页面结构

业务设计稿中的“顶部导航栏 / 左侧菜单栏”在当前平台里要做一次归位：

- 平台级顶部导航和一级侧栏由 shell 提供
- `survey-reporting-app` 只渲染内容区
- 微应用内部允许存在：
  - 页面级操作栏
  - 步骤条
  - 项目内二级导航
  - 右侧辅助面板

## 4. 状态模型

### 4.1 项目状态

建议统一为：

- `draft`
- `data_ready`
- `generating`
- `generated`
- `checking`
- `audit_pending`
- `audit_rejected`
- `archived`

### 4.2 生成任务状态

建议统一为：

- `queued`
- `running`
- `failed`
- `partial_success`
- `completed`
- `cancelled`

### 4.3 校验问题等级

建议统一为：

- `error`
- `warning`
- `notice`

## 5. 交互原则

- 长任务一律围绕 `taskId` 设计
- 自动保存只对草稿和编辑态生效
- 高风险操作必须二次确认
- 忽略校验项必须留痕
- 审核与归档必须受权限和状态双重限制

## 6. 第一阶段范围

第一阶段实现的目标不是“完整业务闭环上线”，而是完成一个可挂载、可导航、可演示页面状态的真实微应用。

第一阶段包含：

- 完整页面路由
- 核心页面骨架
- 组件体系落地
- 模拟数据驱动的交互流程
- shell 接入

第一阶段不包含：

- 真正的后端任务调度
- 真正的 Word 富文本编辑内核
- 地图 SDK 接入
- 真实文件解析链路
- 真实审核流集成

## 7. 第二阶段建议

在第一阶段页面骨架稳定后，再引入：

- 真实接口层
- 生成任务轮询 / 推送
- 文档版本对比
- 审计日志
- E2E 回归用例
