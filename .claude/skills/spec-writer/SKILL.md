---
name: spec-writer
description: 基于需求文档生成产品需求说明书(Spec)，供AI生成Demo代码和交付团队开发使用
metadata:
  short-description: 生成产品需求说明书
  triggers:
    - "生成spec"
    - "写需求说明书"
    - "生成需求说明书"
    - "出spec"
    - "产品需求说明书"
    - "PRD"
  examples:
    - "基于需求生成spec"
    - "帮我写产品需求说明书"
    - "生成PRD文档"
  dependencies:
    - requirements  # 必须先有需求文档
    - humanizer-zh  # 输出人性化处理（必须）
---

基于 `requirements.json` 生成产品需求说明书（Spec），供 AI 生成 Demo 代码和交付团队使用。直接执行，不输出本文档内容。


这个 skill 用于基于 `requirements.json` 生成结构化的产品需求说明书，供 AI 生成 Demo 代码和交付团队继续开发使用。

#### 核心定位

**Spec = 产品需求说明书，聚焦"做什么"，不关心"怎么做"**

| Spec 包含 | Spec 不包含 |
|-----------|-------------|
| 产品背景、目标、用户 | 技术架构设计 |
| 功能清单、模块划分 | 接口/API 设计 |
| 页面结构、交互流程 | 数据库设计 |
| 字段定义、业务规则 | 埋点方案 |
| 原型/线框描述 | 性能优化方案 |

---

#### 🔥 质量优先原则（核心）

### 高质量 Spec 的定义

**高质量 ≠ 内容多。内容多不解决真正问题 = 垃圾。**

| 维度 | 高质量表现 | 低质量表现（避免） |
|------|------------|-------------------|
| **贴合需求** | 每个功能都能追溯到用户痛点 | 凭空添加"可能有用"的功能 |
| **深度思考** | 解释"为什么这样设计" | 只列"做什么"，不说为什么 |
| **精炼不冗余** | 20 个字段解决问题 | 100 个字段显得专业 |
| **有取舍** | 明确说"不做什么"和原因 | 什么都想做，什么都做不好 |

### 质量检查清单

生成 Spec 前，必须回答以下问题：

**1. 贴合度检查**
- [ ] 每个模块能否追溯到 requirements 中的具体需求？
- [ ] 有没有"看起来合理但客户没提过"的功能？（删除它）
- [ ] 核心痛点是否被优先解决？

**2. 深度检查**
- [ ] 是否解释了"为什么这样划分模块"？
- [ ] 是否解释了"为什么这个字段是必填"？
- [ ] 关键设计决策是否有依据？

**3. 精炼度检查**
- [ ] 能否用更少的页面实现相同目标？
- [ ] 能否用更少的字段满足业务需求？
- [ ] 有没有"为了全面而全面"的内容？（删除它）

**4. 取舍检查**
- [ ] 是否明确了"不做什么"？
- [ ] 是否解释了取舍的原因？
- [ ] 是否优先满足 P0 需求，而不是平均用力？

### 反模式：内容多 = 思考懒惰

❌ **错误示范**：

```
用户管理模块包含：用户列表、用户详情、用户新增、用户编辑、用户删除、
用户导入、用户导出、用户审核、用户冻结、用户解冻、用户密码重置、
用户权限配置、用户角色分配、用户部门调整、用户操作日志...
```

这不是"全面"，这是**没有思考**。客户真的需要这 15 个功能吗？

✅ **正确示范**：

```
用户管理模块：
- 用户列表（核心）：支持按部门筛选，满足"快速找到某部门人员"的需求
- 用户新增/编辑：仅保留必要字段（姓名、手机、部门、角色）
- 用户冻结：客户明确提出"离职员工不删除，只冻结"

不做：
- 用户导入/导出：客户明确表示"人员不超过 50 人，手动维护即可"
- 操作日志：客户说"初期不需要，后续再考虑"
```

### 输出评分标准

生成 Spec 后，按以下标准自评（总分 50）：

| 维度 | 评估标准 | 得分 |
|------|----------|------|
| **需求贴合度** | 每个功能都能追溯到用户原话？ | /10 |
| **设计深度** | 有"为什么"而非只有"是什么"？ | /10 |
| **精炼程度** | 删除冗余后还能再删吗？ | /10 |
| **取舍清晰** | 明确说了"不做什么"？ | /10 |
| **可执行性** | 开发看了能直接动手？ | /10 |
| **总分** |  | **/50** |

**标准**：
- 45-50 分：优秀，可交付
- 35-44 分：良好，需小改
- < 35 分：重做，内容太水

#### 输出物用途

| 消费者 | 用途 |
|--------|------|
| **AI (init-app)** | 基于 Spec 生成纯前端 Demo（Mock 数据，无后端） |
| **交付团队** | 理解产品需求，在 Demo 基础上继续开发 |

#### 工作流程位置

```
/requirements（客户需求）
      ↓
/spec-writer（本 skill：生成 Spec）
      ↓
   docs/spec/spec.json + spec.md
      ↓
/init-app（基于 Spec 生成 Demo）
      ↓
   可运行前端代码（Mock 数据）
      ↓
   交付团队继续开发
```

#### 前置条件

- **必须**：`docs/customer/requirements.json` 存在且 status 不为 "草稿"
- **推荐**：requirements 中的 pendingQuestions 已基本回答完成（完成度 > 50%）

#### 输出文件

```
docs/spec/
├── spec.json           # 结构化数据（AI 消费）
├── spec.md             # 可读文档（人工阅读/审核）
└── .spec-mapping.yaml  # 模块→代码映射（增量更新用）
```

---

#### Spec 标准格式

### spec.json 完整结构

```typescript
interface SpecDocument {
  // ===== 元信息 =====
  meta: {
    version: string;           // spec 版本号，如 "1.0.0"
    name: string;              // 产品名称
    description: string;       // 一句话描述
    createdAt: string;         // 创建时间
    updatedAt: string;         // 更新时间
    status: "draft" | "review" | "approved";
    sourceRequirements: string; // 来源需求文档版本
  };

  // ===== 第一部分：产品概述 =====
  overview: {
    background: string;        // 项目背景（简洁版）
    goals: string[];           // 产品目标（3-5条）
    targetUsers: {
      role: string;            // 角色名称
      description: string;     // 角色描述
      needs: string[];         // 核心诉求
    }[];
    scope: {
      included: string[];      // 范围内
      excluded: string[];      // 范围外（明确不做的）
    };
  };

  // ===== 第二部分：信息架构 =====
  architecture: {
    sitemap: SitemapNode[];    // 站点地图/导航结构
  };

  // ===== 第三部分：模块定义 =====
  modules: ModuleSpec[];

  // ===== 第四部分：全局规则 =====
  globalRules: {
    roles: RoleSpec[];         // 角色权限定义
    dictionary: DictItem[];    // 数据字典（下拉选项等）
    statusFlows: StatusFlow[]; // 状态流转定义
  };
}

// ==================== 站点地图 ====================

interface SitemapNode {
  id: string;                  // 唯一标识
  name: string;                // 显示名称
  route: string;               // 路由路径
  icon?: string;               // 图标名称（如 "users", "file-text"）
  children?: SitemapNode[];    // 子节点
}

// ==================== 模块定义 ====================

interface ModuleSpec {
  id: string;                  // 模块ID，如 "user-management"
  name: string;                // 模块名称，如 "用户管理"
  description: string;         // 模块描述
  locked: boolean;             // 是否锁定（人工定制后锁定，AI 跳过）
  lockedReason?: string;       // 锁定原因
  pages: PageSpec[];           // 模块下的页面
}

// ==================== 页面定义 ====================

interface PageSpec {
  id: string;                  // 页面ID
  name: string;                // 页面名称
  route: string;               // 路由路径
  description: string;         // 页面描述
  locked: boolean;             // 是否锁定
  lockedReason?: string;
  layout: PageLayout;          // 页面布局类型
  sections: SectionSpec[];     // 页面区块
}

type PageLayout = 
  | "list"                     // 列表页：表格 + 筛选 + 操作
  | "detail"                   // 详情页：信息展示
  | "form"                     // 表单页：数据录入
  | "dashboard"                // 仪表盘：多卡片/图表
  | "steps"                    // 步骤页：分步操作
  | "custom";                  // 自定义布局

// ==================== 区块定义 ====================

interface SectionSpec {
  id: string;
  name: string;                // 区块名称（如"基础信息"、"操作记录"）
  type: SectionType;           // 区块类型
  description: string;         // 区块描述
  fields?: FieldSpec[];        // 字段列表（表单/表格类）
  columns?: ColumnSpec[];      // 表格列定义（table 类型专用）
  actions?: ActionSpec[];      // 操作按钮
  rules?: RuleSpec[];          // 业务规则
  config?: SectionConfig;      // 区块配置
}

type SectionType = 
  | "table"                    // 数据表格
  | "form"                     // 表单
  | "card"                     // 信息卡片
  | "cards"                    // 卡片列表
  | "chart"                    // 图表
  | "tabs"                     // 标签页
  | "steps"                    // 步骤条
  | "timeline"                 // 时间线
  | "description"              // 描述列表
  | "statistic"                // 统计数值
  | "custom";                  // 自定义

interface SectionConfig {
  // 表格配置
  pagination?: boolean;        // 是否分页
  pageSize?: number;           // 每页条数
  selectable?: boolean;        // 是否可选择
  sortable?: boolean;          // 是否可排序
  
  // 表单配置
  layout?: "vertical" | "horizontal" | "inline";
  columns?: number;            // 几列布局
  
  // 图表配置
  chartType?: "bar" | "line" | "pie" | "area";
  
  // 通用配置
  collapsible?: boolean;       // 是否可折叠
  defaultCollapsed?: boolean;  // 默认折叠
}

// ==================== 字段定义 ====================

interface FieldSpec {
  id: string;
  name: string;                // 字段标签（显示名）
  fieldKey: string;            // 字段 key（代码用）
  type: FieldType;             // 字段类型
  required: boolean;           // 是否必填
  placeholder?: string;        // 占位提示
  defaultValue?: any;          // 默认值
  options?: OptionItem[];      // 选项（select/radio/checkbox 类型）
  optionSource?: string;       // 选项来源（引用数据字典 ID）
  validation?: ValidationRule[]; // 校验规则
  visible?: VisibilityRule;    // 显示条件
  editable?: EditableRule;     // 可编辑条件
  helpText?: string;           // 帮助文本
  width?: string;              // 宽度（表格列宽）
}

type FieldType = 
  | "text"                     // 单行文本
  | "textarea"                 // 多行文本
  | "number"                   // 数字
  | "money"                    // 金额
  | "percent"                  // 百分比
  | "date"                     // 日期
  | "datetime"                 // 日期时间
  | "daterange"                // 日期范围
  | "time"                     // 时间
  | "select"                   // 下拉单选
  | "multiselect"              // 下拉多选
  | "radio"                    // 单选按钮
  | "checkbox"                 // 复选框
  | "switch"                   // 开关
  | "upload"                   // 文件上传
  | "image"                    // 图片上传
  | "richtext"                 // 富文本
  | "cascader"                 // 级联选择
  | "treeselect"               // 树形选择
  | "user"                     // 用户选择器
  | "department"               // 部门选择器
  | "address"                  // 地址选择
  | "phone"                    // 手机号
  | "email"                    // 邮箱
  | "idcard"                   // 身份证
  | "url"                      // 网址
  | "color"                    // 颜色选择
  | "rate"                     // 评分
  | "slider"                   // 滑块
  | "custom";                  // 自定义

interface OptionItem {
  label: string;               // 显示文本
  value: string;               // 值
  color?: string;              // 标签颜色
  disabled?: boolean;          // 是否禁用
}

interface ValidationRule {
  type: "required" | "length" | "pattern" | "range" | "custom";
  rule: string;                // 规则描述或正则
  message: string;             // 错误提示
  min?: number;                // 最小值/长度
  max?: number;                // 最大值/长度
}

interface VisibilityRule {
  condition: string;           // 条件表达式，如 "status === 'active'"
  description: string;         // 条件说明
}

interface EditableRule {
  condition: string;           // 条件表达式
  description: string;         // 条件说明
}

// ==================== 表格列定义 ====================

interface ColumnSpec {
  id: string;
  name: string;                // 列标题
  fieldKey: string;            // 数据字段
  type: ColumnType;            // 列类型
  width?: string;              // 列宽
  fixed?: "left" | "right";    // 固定列
  sortable?: boolean;          // 可排序
  filterable?: boolean;        // 可筛选
  align?: "left" | "center" | "right";
  render?: ColumnRender;       // 特殊渲染
}

type ColumnType = 
  | "text"                     // 普通文本
  | "number"                   // 数字
  | "money"                    // 金额
  | "date"                     // 日期
  | "datetime"                 // 日期时间
  | "tag"                      // 标签
  | "status"                   // 状态
  | "avatar"                   // 头像
  | "image"                    // 图片
  | "link"                     // 链接
  | "progress"                 // 进度条
  | "action";                  // 操作列

interface ColumnRender {
  type: "tag" | "status" | "link" | "progress" | "custom";
  config?: {
    colorMap?: Record<string, string>;  // 状态颜色映射
    linkPattern?: string;               // 链接模式
  };
}

// ==================== 操作定义 ====================

interface ActionSpec {
  id: string;
  name: string;                // 按钮文字
  type: "primary" | "default" | "danger" | "link" | "icon";
  icon?: string;               // 图标
  position: ActionPosition;    // 位置
  confirm?: ConfirmConfig;     // 确认配置
  behavior: ActionBehavior;    // 行为
  permission?: string;         // 权限标识
  visible?: VisibilityRule;    // 显示条件
  disabled?: EditableRule;     // 禁用条件
}

type ActionPosition = 
  | "toolbar"                  // 页面/表格工具栏
  | "toolbar-left"             // 工具栏左侧
  | "toolbar-right"            // 工具栏右侧
  | "row"                      // 表格行操作
  | "row-more"                 // 表格行更多操作
  | "form-footer"              // 表单底部
  | "card-header"              // 卡片头部
  | "card-footer";             // 卡片底部

interface ConfirmConfig {
  title: string;               // 确认标题
  content: string;             // 确认内容
  type: "info" | "warning" | "danger";
}

interface ActionBehavior {
  type: "navigate" | "modal" | "drawer" | "action" | "download" | "print";
  target?: string;             // 目标（路由/弹窗内容ID）
  params?: Record<string, string>; // 参数
  description: string;         // 行为描述
  successMessage?: string;     // 成功提示
}

// ==================== 业务规则 ====================

interface RuleSpec {
  id: string;
  name: string;                // 规则名称
  description: string;         // 规则描述
  trigger: RuleTrigger;        // 触发时机
  condition: string;           // 条件表达式
  action: RuleAction;          // 执行动作
}

type RuleTrigger = 
  | "onLoad"                   // 页面加载时
  | "onChange"                 // 字段变化时
  | "onSubmit"                 // 提交时
  | "onAction";                // 操作时

interface RuleAction {
  type: "validate" | "calculate" | "setField" | "setVisible" | "setEditable" | "message";
  config: Record<string, any>;
}

// ==================== 角色权限 ====================

interface RoleSpec {
  id: string;
  name: string;
  description: string;
  permissions: PermissionItem[];
}

interface PermissionItem {
  module: string;              // 模块ID
  actions: string[];           // 允许的操作：view/create/edit/delete/export/...
  dataScope?: string;          // 数据范围：all/department/self
}

// ==================== 数据字典 ====================

interface DictItem {
  id: string;                  // 字典ID，供字段引用
  name: string;                // 字典名称
  category: string;            // 字典分类
  items: {
    label: string;
    value: string;
    color?: string;            // 标签/状态颜色
    icon?: string;             // 图标
    disabled?: boolean;
  }[];
}

// ==================== 状态流转 ====================

interface StatusFlow {
  id: string;
  entity: string;              // 实体名称（如"订单"、"审批单"）
  description: string;         // 流程描述
  statuses: {
    id: string;
    name: string;
    color: string;             // 状态颜色
    description: string;
  }[];
  transitions: {
    from: string;              // 起始状态
    to: string;                // 目标状态
    action: string;            // 触发动作
    actor?: string;            // 执行角色
    condition?: string;        // 前置条件
  }[];
}
```

---

#### spec.md 文档模板

```markdown
> **版本**：{version} | **状态**：{status} | **更新时间**：{updatedAt}
> 
> **来源需求**：requirements.json v{sourceVersion}

---

#### 文档说明

本文档是产品需求说明书（Spec），用于：
1. 指导 AI 生成前端 Demo 代码
2. 供交付团队理解产品需求

**注意**：本文档只描述"做什么"，不涉及技术实现细节。

---

#### 一、产品概述

### 1.1 项目背景

{background}

### 1.2 产品目标

{goals - 列表形式}

### 1.3 目标用户

| 角色 | 描述 | 核心诉求 |
|------|------|----------|
| {role} | {description} | {needs} |

### 1.4 范围定义

**本期包含：**
{included - 列表}

**本期不含：**
{excluded - 列表}

---

#### 二、信息架构

### 2.1 站点地图

```
{sitemap - 树形结构}
```

### 2.2 导航结构

| 一级菜单 | 二级菜单 | 路由 | 说明 |
|----------|----------|------|------|
| {level1} | {level2} | {route} | {description} |

---

#### 三、功能模块

### 3.1 {模块名称}

> {模块描述}

#### 3.1.1 {页面名称}

**基本信息**
- **路由**：`{route}`
- **布局**：{layout}
- **描述**：{description}

**页面区块**

##### 区块1：{区块名称}

**类型**：{type}

**字段列表**：

| 字段 | 类型 | 必填 | 说明 | 校验规则 |
|------|------|------|------|----------|
| {name} | {type} | {required} | {description} | {validation} |

**操作按钮**：

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| {name} | {type} | {position} | {behavior} |

**业务规则**：
- {rule1}
- {rule2}

---

#### 四、全局规则

### 4.1 角色权限

| 角色 | 描述 | 模块权限 |
|------|------|----------|
| {role} | {description} | {permissions} |

### 4.2 数据字典

#### 4.2.1 {字典名称}

| 值 | 显示 | 颜色 |
|----|------|------|
| {value} | {label} | {color} |

### 4.3 状态流转

#### 4.3.1 {实体名称}状态流转

```
{status-flow-diagram}
```

| 当前状态 | 操作 | 目标状态 | 条件 |
|----------|------|----------|------|
| {from} | {action} | {to} | {condition} |

---

#### 附录

### A. 变更记录

| 版本 | 日期 | 变更内容 | 变更人 |
|------|------|----------|--------|
| {version} | {date} | {changes} | {author} |

### B. 术语表

| 术语 | 说明 |
|------|------|
| {term} | {definition} |
```

---

#### .spec-mapping.yaml 格式

```yaml
version: "1.0.0"
specHash: "a3f8c2d1"            # spec.json 的 hash
generatedAt: "2026-01-27T10:30:00Z"

mappings:
  - moduleId: user-management
    moduleName: 用户管理
    locked: false
    files:
      - path: src/app/users/page.tsx
        type: page
        pageId: user-list
        
      - path: src/app/users/[id]/page.tsx
        type: page
        pageId: user-detail
        
      - path: src/components/users/user-table.tsx
        type: component
        sectionId: user-list-table
        
      - path: src/components/users/user-form.tsx
        type: component
        sectionId: user-form
        locked: true
        lockedReason: "添加了自定义校验逻辑"
        lockedAt: "2026-01-27T14:30:00Z"
        lockedBy: "张三"
        
      - path: src/mock/users.ts
        type: mock
        
  - moduleId: approval-flow
    moduleName: 审批流程
    locked: true
    lockedReason: "交付团队已自定义审批逻辑"
    lockedAt: "2026-01-25T10:00:00Z"
    lockedBy: "李四"
    files:
      - path: src/app/approval/page.tsx
        type: page
```

---

#### 工作流程

### Step 1: 读取并理解需求（不是抄）

```
1. 读取 docs/customer/requirements.json
2. 提炼核心问题：客户到底要解决什么痛点？
3. 识别 P0 需求：哪些是"没有就不能用"的？
4. 理解约束：预算、时间、技术限制是什么？
```

**关键动作**：写下"客户最核心的 3 个痛点"，后续所有设计都要围绕它。

### Step 2: 做减法，不是加法

在设计之前，先思考：

| 问题 | 必须回答 |
|------|----------|
| 哪些功能**必须有**？ | P0 需求，不做就没法用 |
| 哪些功能**可以没有**？ | P1/P2 需求，晚点做也行 |
| 哪些功能**根本不需要**？ | 客户没提过，我们也别加 |

**原则**：宁可做 3 个功能做到 90 分，也不要做 10 个功能每个 60 分。

### Step 3: 设计核心模块（带理由）

对每个模块，必须说明**为什么要有这个模块**：

```markdown
### 样品管理模块

**为什么需要**：
客户痛点是"样品太多找不到"，需要一个统一的地方管理样品。

**核心功能**：
- 样品列表：按编号/状态快速筛选（解决"找不到"的问题）
- 样品详情：查看完整信息（减少纸质档案查询）

**不做**：
- 样品批量导入：客户每天只有 5-10 个样品，手动录入可接受
- 样品条码打印：客户已有条码打印机和软件，不需要重复建设
```

### Step 4: 精简字段（只留必要的）

**错误做法**：把能想到的字段都列上

**正确做法**：每个字段都问"删了会怎样"

| 字段 | 必要性 | 理由 |
|------|--------|------|
| 样品编号 | ✅ 必须 | 唯一标识，查询依据 |
| 样品名称 | ✅ 必须 | 业务辨识 |
| 备注 | ⚠️ 可选 | 客户说"有时候要备注" |
| 创建人 | ❌ 删除 | 系统自动记录，不需要展示 |
| 修改时间 | ❌ 删除 | 客户说"不关心修改记录" |

### Step 5: 质量自检

生成前强制检查：

```markdown
#### 自检清单

### 贴合度（0-10 分）：___
- [ ] 每个模块都能对应到 requirements 中的需求
- [ ] 没有"我觉得应该有"的功能

### 深度（0-10 分）：___  
- [ ] 每个模块都说明了"为什么需要"
- [ ] 关键字段都说明了"为什么必填"

### 精炼度（0-10 分）：___
- [ ] 字段数量 < 需求中提到的业务字段 × 1.2
- [ ] 没有"为了全面而全面"的内容

### 取舍（0-10 分）：___
- [ ] 明确列出了"不做什么"
- [ ] 不做的理由是基于客户需求，不是我们的判断

**总分：___ / 40**（< 32 分请重新思考）
```

### Step 6: 生成输出文件

1. **生成 spec.json**：
   - 结构化数据
   - UTF-8 编码
   - 2 空格缩进

2. **生成 spec.md**：
   - 可读文档
   - 按模板格式生成

3. **生成 .spec-mapping.yaml**：
   - 初始化映射关系
   - 所有模块 `locked: false`

### Step 7: 输出摘要

```markdown
#### Spec 生成完成

**产品名称**：{name}
**版本**：{version}
**状态**：{status}

### 模块概览

| 模块 | 页面数 | 字段数 | 操作数 |
|------|--------|--------|--------|
| {module} | {pages} | {fields} | {actions} |

### 生成文件

- `docs/spec/spec.json` - 结构化数据（AI 消费）
- `docs/spec/spec.md` - 可读文档（人工阅读）
- `docs/spec/.spec-mapping.yaml` - 映射文件（增量更新）

### 下一步

运行 `/init-app` 基于 Spec 生成 Demo 代码。
```

---

#### 增量更新机制

### 触发条件

当用户说"更新 spec"或 requirements 有变更时。

### 更新流程

1. **读取当前 Spec 和 Mapping**
2. **对比 Requirements 变更**：
   - 识别新增/修改/删除的需求
   - 映射到模块/页面
3. **检查锁定状态**：
   - 已锁定的模块/页面跳过
   - 未锁定的正常更新
4. **生成变更报告**
5. **更新文件**

### 锁定机制

**锁定级别**：

| 级别 | 说明 | 效果 |
|------|------|------|
| 模块锁定 | 整个模块锁定 | 模块下所有页面跳过 |
| 页面锁定 | 单个页面锁定 | 只跳过该页面 |
| 文件锁定 | 单个代码文件锁定 | 只跳过该文件 |

**锁定操作**：

在 spec.json 中设置：
```json
{
  "modules": [{
    "id": "approval-flow",
    "locked": true,
    "lockedReason": "交付团队已自定义"
  }]
}
```

或在 .spec-mapping.yaml 中设置文件级锁定。

### 变更报告格式

```markdown
#### Spec 更新报告

**更新时间**：{datetime}
**版本**：{oldVersion} → {newVersion}

### 变更摘要

| 类型 | 数量 |
|------|------|
| 新增模块 | {count} |
| 修改模块 | {count} |
| 跳过（锁定） | {count} |

### 详细变更

#### 新增
- {module}: {description}

#### 修改
- {module}: {changes}

#### 跳过（已锁定）
- {module}: {reason}

### 注意事项
- {notes}
```

---

#### 设计原则

### 1. 解决问题，不是填模板

**错误**：看到"用户管理"就写上增删改查
**正确**：客户说"要能冻结离职员工"，那就只做冻结功能

### 2. 每个设计都要有理由

**错误**：
```
- 用户名：text，必填
- 手机号：phone，必填
- 邮箱：email，选填
```

**正确**：
```
- 用户名：text，必填（客户要求用真名，方便识别）
- 手机号：phone，必填（用于登录验证，客户明确要求）
- 邮箱：不需要（客户说"我们内部不用邮件"）
```

### 3. 敢于说"不做"

每个模块都要有"不做清单"，并说明原因：

```markdown
**用户管理 - 不做清单**：
- 用户导入/导出：客户人数少于 50，手动维护即可
- 操作日志：客户明确说初期不需要
- 组织架构树：客户只有 2 级部门，下拉框足够
```

### 4. 质量 > 数量

| 情况 | 选择 |
|------|------|
| 20 个字段 vs 10 个字段 | 选 10 个，如果能满足需求 |
| 5 个页面 vs 3 个页面 | 选 3 个，如果能解决问题 |
| 详细描述 vs 简洁描述 | 选简洁，如果不影响理解 |

### 5. 追问"真的需要吗？"

对每个功能、每个字段、每个按钮都追问：

- 客户明确提过吗？→ 没有就不做
- 删掉会影响核心流程吗？→ 不影响就删
- 是"必须有"还是"最好有"？→ "最好有"的先不做

---

#### 输出示例

详细示例请参考实际生成的 `docs/spec/spec.json` 文件。

以下是简化示例：

```json
{
  "meta": {
    "version": "1.0.0",
    "name": "LIMS 实验室管理系统",
    "description": "检测实验室信息管理系统",
    "createdAt": "2026-01-27T10:00:00Z",
    "updatedAt": "2026-01-27T10:00:00Z",
    "status": "draft",
    "sourceRequirements": "1.0.0"
  },
  "overview": {
    "background": "华测检测是第三方检测机构，年检测样品量超过10万件，需要统一的信息化系统支撑业务发展",
    "goals": [
      "报告制作效率提升80%",
      "实现多分支数据实时同步",
      "满足CNAS认可要求"
    ],
    "targetUsers": [
      {
        "role": "检测员",
        "description": "执行检测任务的一线人员",
        "needs": ["快速录入", "批量操作", "进度查询"]
      },
      {
        "role": "报告编制员",
        "description": "负责编制检测报告",
        "needs": ["自动生成报告", "模板管理", "批量打印"]
      }
    ],
    "scope": {
      "included": ["样品管理", "检测管理", "报告管理", "基础报表"],
      "excluded": ["财务管理", "客户门户", "移动端"]
    }
  },
  "architecture": {
    "sitemap": [
      {
        "id": "sample",
        "name": "样品管理",
        "route": "/samples",
        "icon": "flask",
        "children": [
          {"id": "sample-list", "name": "样品列表", "route": "/samples"},
          {"id": "sample-receive", "name": "样品接收", "route": "/samples/receive"}
        ]
      },
      {
        "id": "report",
        "name": "报告管理",
        "route": "/reports",
        "icon": "file-text",
        "children": [
          {"id": "report-list", "name": "报告列表", "route": "/reports"},
          {"id": "report-template", "name": "模板管理", "route": "/reports/templates"}
        ]
      }
    ]
  },
  "modules": [
    {
      "id": "sample-management",
      "name": "样品管理",
      "description": "样品全生命周期管理，包括接收、登记、分配、流转等",
      "locked": false,
      "pages": [
        {
          "id": "sample-list",
          "name": "样品列表",
          "route": "/samples",
          "description": "查看和管理所有样品",
          "locked": false,
          "layout": "list",
          "sections": [
            {
              "id": "sample-filter",
              "name": "筛选条件",
              "type": "form",
              "description": "样品筛选",
              "fields": [
                {
                  "id": "f1",
                  "name": "样品编号",
                  "fieldKey": "sampleNo",
                  "type": "text",
                  "required": false,
                  "placeholder": "请输入样品编号"
                },
                {
                  "id": "f2",
                  "name": "状态",
                  "fieldKey": "status",
                  "type": "select",
                  "required": false,
                  "optionSource": "dict-sample-status"
                }
              ],
              "config": {
                "layout": "inline",
                "columns": 4
              }
            },
            {
              "id": "sample-table",
              "name": "样品表格",
              "type": "table",
              "description": "样品数据列表",
              "columns": [
                {"id": "c1", "name": "样品编号", "fieldKey": "sampleNo", "type": "link", "width": "150px"},
                {"id": "c2", "name": "样品名称", "fieldKey": "sampleName", "type": "text"},
                {"id": "c3", "name": "委托单位", "fieldKey": "client", "type": "text"},
                {"id": "c4", "name": "状态", "fieldKey": "status", "type": "status"},
                {"id": "c5", "name": "接收时间", "fieldKey": "receiveTime", "type": "datetime"},
                {"id": "c6", "name": "操作", "fieldKey": "action", "type": "action", "width": "150px", "fixed": "right"}
              ],
              "actions": [
                {
                  "id": "a1",
                  "name": "新增样品",
                  "type": "primary",
                  "position": "toolbar-left",
                  "behavior": {"type": "navigate", "target": "/samples/create", "description": "跳转到样品新增页"}
                },
                {
                  "id": "a2",
                  "name": "查看",
                  "type": "link",
                  "position": "row",
                  "behavior": {"type": "navigate", "target": "/samples/{id}", "description": "查看样品详情"}
                },
                {
                  "id": "a3",
                  "name": "删除",
                  "type": "link",
                  "position": "row",
                  "confirm": {"title": "确认删除", "content": "确定要删除该样品吗？", "type": "danger"},
                  "behavior": {"type": "action", "description": "删除样品", "successMessage": "删除成功"}
                }
              ],
              "config": {
                "pagination": true,
                "pageSize": 20,
                "selectable": true
              }
            }
          ]
        }
      ]
    }
  ],
  "globalRules": {
    "roles": [
      {
        "id": "admin",
        "name": "管理员",
        "description": "系统管理员，拥有全部权限",
        "permissions": [
          {"module": "*", "actions": ["*"], "dataScope": "all"}
        ]
      },
      {
        "id": "tester",
        "name": "检测员",
        "description": "执行检测任务",
        "permissions": [
          {"module": "sample-management", "actions": ["view", "edit"], "dataScope": "self"}
        ]
      }
    ],
    "dictionary": [
      {
        "id": "dict-sample-status",
        "name": "样品状态",
        "category": "sample",
        "items": [
          {"label": "待检", "value": "pending", "color": "gray"},
          {"label": "检测中", "value": "testing", "color": "blue"},
          {"label": "已完成", "value": "completed", "color": "green"},
          {"label": "异常", "value": "abnormal", "color": "red"}
        ]
      }
    ],
    "statusFlows": [
      {
        "id": "sample-flow",
        "entity": "样品",
        "description": "样品状态流转",
        "statuses": [
          {"id": "pending", "name": "待检", "color": "gray", "description": "等待检测"},
          {"id": "testing", "name": "检测中", "color": "blue", "description": "正在检测"},
          {"id": "completed", "name": "已完成", "color": "green", "description": "检测完成"}
        ],
        "transitions": [
          {"from": "pending", "to": "testing", "action": "开始检测", "actor": "检测员"},
          {"from": "testing", "to": "completed", "action": "提交结果", "actor": "检测员"}
        ]
      }
    ]
  }
}
```

---

#### 错误处理

| 场景 | 处理 |
|------|------|
| requirements.json 不存在 | 提示先运行 `/requirements` |
| requirements 状态为草稿 | 提示先完善需求（回答问题） |
| pendingQuestions 完成度 < 50% | 警告并询问是否继续 |
| 模块已锁定但需求有变更 | 跳过并在报告中说明 |

---

#### 与其他 Skill 的关系

| Skill | 关系 |
|-------|------|
| `/requirements` | 上游，提供需求数据 |
| `/init-app` | 下游，消费 Spec 生成代码 |
| `/plan-writer` | 并行，解决方案文档 |
