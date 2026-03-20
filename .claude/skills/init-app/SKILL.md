---
name: init-app
description: 在现有 syncMind 项目中基于 Spec 文档生成可运行的前端 Demo 代码。项目基础设施已就绪，基础技术栈（Next.js 16、TypeScript、Tailwind CSS v4、shadcn/ui）
metadata:
  short-description: 基于 Spec 生成 Demo 代码
  triggers:
    - "生成demo"
    - "生成代码"
    - "init-app"
    - "初始化应用"
    - "生成应用"
  examples:
    - "基于 spec 生成 demo"
    - "生成前端代码"
    - "初始化应用代码"
  dependencies:
    - spec-writer  # 推荐先有 Spec 文档
---

基于 `docs/spec/spec.json` 在现有项目中生成可运行的前端 Demo 代码。直接执行，不输出本文档内容。


这个 skill 用于在**现有 syncMind 项目**中基于 Spec 文档生成可运行的前端 Demo 代码。

#### 核心定位

**生成纯前端 Mock Demo**：
- 基于 `docs/spec/spec.json` 生成完整的前端界面
- 使用 Mock 数据，无需后端
- 代码可直接运行，交付团队可在此基础上继续开发

#### 重要约束

- **在现有项目中初始化**：项目基础设施已经准备好，在现有项目基础上添加功能
- **基础技术栈固定**：使用项目已有的基础技术栈（Next.js 16、React、TypeScript、Tailwind CSS v4、shadcn/ui），**不接受改变基础技术栈**
- **纯前端 Demo**：生成的是 Mock 数据的前端演示，不包含真实后端

#### 工作流程位置

```
/requirements（客户需求）
      ↓
/spec-writer（生成 Spec）
      ↓
   docs/spec/spec.json
      ↓
/init-app（本 skill：生成 Demo）
      ↓
   可运行前端代码
      ↓
   交付团队继续开发
```

#### 前置条件

- **推荐**：`docs/spec/spec.json` 存在
- **可选**：如果没有 spec，可基于 `docs/plan/` 下的方案文档或用户描述生成

#### 数据来源优先级

1. **首选**：`docs/spec/spec.json` - 结构化 Spec 文档
2. **备选**：`docs/plan/*.md` - 方案文档
3. **兜底**：用户口头描述

---

#### 工作流程

### Step 1: 读取 Spec

```
1. 检查 docs/spec/spec.json 是否存在
2. 如果存在，读取并解析
3. 如果不存在，检查 docs/plan/ 下是否有方案文档
4. 如果都没有，提示用户先运行 /spec-writer 或提供需求描述
```

### Step 1.5: 学习设计样本（必须在生成代码之前执行）

在生成任何代码之前，**必须先读取以下设计样本文件**：

1. `src/_examples/dashboard.tsx` — Dashboard 样板：统计卡片（图标+趋势）、recharts 图表（折线/柱状/饼图 + ChartContainer）、数据表格、时间线
2. `src/_examples/list-page.tsx` — 列表页样板：Tabs 状态切换、筛选栏（搜索+下拉+重置）、完整数据表格（Badge 状态、操作列 DropdownMenu）、分页
3. `src/app/globals.css` — 可用的颜色 token 和 chart 颜色变量

**强制要求**：
- 生成的代码必须**匹配**这些样本文件的设计质量和模式
- 必须使用 shadcn/ui 组件 + 语义化颜色 token，不要用硬编码颜色
- 图表必须使用 `recharts` + `ChartContainer` + `ChartTooltip`，使用 `var(--color-chart-1)` 等变量配色，不要用 div 占位
- 统计卡片必须有图标（带彩色背景圆角框）+ 趋势箭头 + 环比数据
- 所有 Card 组件要有 `hover:shadow-md transition-shadow`
- 页面顶部要有带 `backdrop-blur` 的 sticky 标题栏
- 表格要有操作列（DropdownMenu）和 Badge 状态色

### Step 2: 分析 Spec 结构

从 spec.json 中提取：

| Spec 内容 | 代码映射 |
|-----------|----------|
| `architecture.sitemap` | 路由结构、导航菜单 |
| `modules[].pages[]` | 页面组件 |
| `modules[].pages[].sections[]` | 页面区块组件 |
| `modules[].pages[].sections[].fields[]` | 表单/表格字段 |
| `modules[].pages[].sections[].actions[]` | 操作按钮 |
| `globalRules.roles` | 权限配置（Mock） |
| `globalRules.dictionary` | 数据字典/下拉选项 |
| `globalRules.statusFlows` | 状态流转 |

### Step 2.5: 页面完整性补全（强制规则）

**首页/仪表盘（必须生成）**：
- 必须生成 `src/app/page.tsx` 作为系统首页（覆盖默认引导页）
- 首页必须是该系统的 Dashboard/仪表盘，参考 `src/_examples/dashboard.tsx` 的设计
- 包含：核心指标统计卡片 + 至少一个 recharts 图表 + 最近数据表格

即使 Spec 中没有明确定义，每个数据模块**必须自动生成以下完整页面集**：

| 页面 | 路由 | 必须包含的内容 |
|------|------|---------------|
| **列表页** | `/[module]` | 顶部筛选栏（状态下拉、关键词搜索、日期范围）+ 数据表格 + 分页 + 新建按钮 |
| **详情页** | `/[module]/[id]` | 顶部信息摘要卡片 + Tab 切换（基本信息、关联数据、操作记录）+ 编辑/删除按钮 |
| **新建/编辑页** | `/[module]/create` | 完整表单（所有字段）+ 提交/取消按钮 + 表单验证提示 |

**筛选栏标准配置**：
- 每个列表页必须有筛选区域，至少包含：
  - 关键词搜索（Input + 搜索图标）
  - 状态筛选（Select 下拉，选项来自 `globalRules.dictionary` 或自动推断）
  - 如果有日期字段，加日期范围筛选
  - 重置按钮
- 筛选区域使用 `flex flex-wrap gap-3` 布局，在表格上方

**详情页标准配置**：
- 顶部：面包屑导航 + 返回按钮
- 信息展示用 `description` 布局（`grid grid-cols-2` 的 key-value 对）
- 关联数据用 Tab 切换展示
- 状态字段用 Badge 显示，带对应颜色

**表格标准配置**：
- 表头可点击排序（至少对日期、数字列）
- 每行有操作列（查看详情、编辑、删除）
- "查看详情"链接到 `/[module]/[id]` 详情页
- 空状态显示友好提示（图标 + 文案 + 新建按钮）

### Step 3: 生成代码结构

```
src/
├── app/
│   ├── layout.tsx              # 布局（含导航）
│   ├── page.tsx                # 首页/仪表盘
│   └── [module]/               # 模块路由
│       ├── page.tsx            # 列表页
│       ├── [id]/
│       │   └── page.tsx        # 详情页
│       └── create/
│           └── page.tsx        # 新增页
│
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx         # 侧边导航
│   │   ├── header.tsx          # 顶部栏
│   │   └── breadcrumb.tsx      # 面包屑
│   │
│   └── [module]/               # 模块组件
│       ├── [module]-table.tsx  # 表格组件
│       ├── [module]-form.tsx   # 表单组件
│       ├── [module]-filter.tsx # 筛选组件
│       └── [module]-detail.tsx # 详情组件
│
├── mock/
│   ├── index.ts                # Mock 数据入口
│   └── [module].ts             # 模块 Mock 数据
│
├── types/
│   └── [module].ts             # 类型定义
│
└── lib/
    ├── dict.ts                 # 数据字典
    └── utils.ts                # 工具函数
```

### Step 4: 生成导航菜单

基于 `architecture.sitemap` 生成侧边导航：

```typescript
// src/components/layout/sidebar.tsx
// 从 spec.sitemap 生成菜单配置
const menuItems = [
  {
    id: "sample",
    name: "样品管理",
    icon: "Flask",
    route: "/samples",
    children: [
      { id: "sample-list", name: "样品列表", route: "/samples" },
      { id: "sample-receive", name: "样品接收", route: "/samples/receive" }
    ]
  },
  // ...
];
```

### Step 5: 生成页面组件

根据 `page.layout` 生成对应布局：

**列表页 (layout: "list")**：
```typescript
// src/app/[module]/page.tsx
export default function ModuleListPage() {
  return (
    <div className="space-y-4">
      {/* 筛选区 - 基于 section.type === "form" */}
      <ModuleFilter />
      
      {/* 数据表格 - 基于 section.type === "table" */}
      <ModuleTable />
    </div>
  );
}
```

**表单页 (layout: "form")**：
```typescript
// src/app/[module]/create/page.tsx
export default function ModuleCreatePage() {
  return (
    <div className="space-y-4">
      <ModuleForm mode="create" />
    </div>
  );
}
```

**详情页 (layout: "detail")**：
```typescript
// src/app/[module]/[id]/page.tsx
export default function ModuleDetailPage() {
  return (
    <div className="space-y-4">
      <ModuleDetail />
    </div>
  );
}
```

### Step 6: 生成区块组件

根据 `section.type` 生成对应组件：

**表格组件 (type: "table")**：

```typescript
// src/components/[module]/[module]-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 基于 section.columns 生成列配置
const columns = [
  { key: "sampleNo", label: "样品编号", type: "link" },
  { key: "sampleName", label: "样品名称", type: "text" },
  { key: "status", label: "状态", type: "status" },
  // ...
];

// 基于 section.actions 生成操作按钮
const rowActions = [
  { key: "view", label: "查看", type: "link" },
  { key: "edit", label: "编辑", type: "link" },
  { key: "delete", label: "删除", type: "danger", confirm: true },
];
```

**表单组件 (type: "form")**：

```typescript
// src/components/[module]/[module]-form.tsx
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// 基于 section.fields 生成表单字段
const fields = [
  { key: "sampleNo", label: "样品编号", type: "text", required: true },
  { key: "status", label: "状态", type: "select", options: "dict-sample-status" },
  // ...
];
```

### Step 7: 生成 Mock 数据

基于 Spec 中的字段和数据字典生成合理的 Mock 数据：

```typescript
// src/mock/samples.ts
export const samplesMock = [
  {
    id: "1",
    sampleNo: "SP202601270001",
    sampleName: "水质样品A",
    client: "华测检测",
    status: "pending",
    receiveTime: "2026-01-27 10:00:00",
  },
  // ...生成 10-20 条合理的 Mock 数据
];

// 基于 globalRules.dictionary 生成选项
export const sampleStatusOptions = [
  { label: "待检", value: "pending", color: "gray" },
  { label: "检测中", value: "testing", color: "blue" },
  { label: "已完成", value: "completed", color: "green" },
];
```

### Step 8: 生成类型定义

```typescript
// src/types/sample.ts
export interface Sample {
  id: string;
  sampleNo: string;
  sampleName: string;
  client: string;
  status: SampleStatus;
  receiveTime: string;
}

export type SampleStatus = "pending" | "testing" | "completed" | "abnormal";
```

### Step 9: 更新映射文件

生成/更新 `.spec-mapping.yaml`：

```yaml
version: "1.0.0"
specHash: "a3f8c2d1"
generatedAt: "2026-01-27T10:30:00Z"

mappings:
  - moduleId: sample-management
    moduleName: 样品管理
    locked: false
    files:
      - path: src/app/samples/page.tsx
        type: page
        pageId: sample-list
        
      - path: src/components/samples/sample-table.tsx
        type: component
        sectionId: sample-table
        
      - path: src/mock/samples.ts
        type: mock
```

### Step 10: 文件写入顺序（强制规则）

为确保 Next.js HMR 增量编译正常工作，**必须按以下顺序写入文件**：

```
1. types/         — 类型定义（无依赖）
2. lib/dict.ts    — 数据字典
3. mock/          — Mock 数据（依赖 types）
4. components/    — 组件（依赖 types + mock）
5. app/layout.tsx — 布局（含导航菜单）
6. app/page.tsx   — 首页/仪表盘
7. app/[module]/  — 各模块页面（依赖 components）
```

**每写完一个模块的组件+页面，确保它可独立编译**，再写下一个模块。
这样客户在对话过程中可以看到页面逐个出现，而不是等所有文件写完才能看到。

**禁止**：先写页面再写它依赖的组件，这会导致编译报错和白屏。

### Step 11: 验证与运行

```
1. 确保代码无语法错误
2. 运行 pnpm dev 验证
3. 检查页面是否正常渲染
```

---

#### 组件映射规则

### Section Type → shadcn/ui 组件

| Section Type | 主要组件 | 说明 |
|--------------|----------|------|
| `table` | `Table`, `DataTable` | 数据表格 |
| `form` | `Form`, `Input`, `Select` | 表单 |
| `card` | `Card` | 信息卡片 |
| `cards` | `Card` (列表) | 卡片列表 |
| `chart` | `recharts`（BarChart / LineChart / PieChart）+ shadcn `ChartContainer` | 图表，使用项目已安装的 recharts，配合 CSS 变量颜色 |
| `tabs` | `Tabs` | 标签页 |
| `steps` | `div` + `Badge` + 连接线 | 步骤条，用 flex 布局 + Badge 标记当前步骤 |
| `timeline` | `div` + 左侧竖线 + 圆点 | 时间线，用 `border-l-2 border-muted` + 相对定位圆点 |
| `description` | `dl` + `grid grid-cols-2` | 描述列表，标签用 `text-muted-foreground`，值用 `font-medium` |
| `statistic` | `Card` + 大号数字 + 趋势标识 | 统计卡片，数字用 `text-3xl font-bold`，趋势用绿色/红色箭头 |

### Field Type → 表单组件

| Field Type | 组件 | 说明 |
|------------|------|------|
| `text` | `Input` | 单行文本 |
| `textarea` | `Textarea` | 多行文本 |
| `number` | `Input type="number"` | 数字 |
| `money` | `Input` + 前缀 ¥ | 金额 |
| `date` | `DatePicker` | 日期 |
| `datetime` | `DateTimePicker` | 日期时间 |
| `daterange` | `DateRangePicker` | 日期范围 |
| `select` | `Select` | 下拉单选 |
| `multiselect` | `MultiSelect` | 下拉多选 |
| `radio` | `RadioGroup` | 单选按钮 |
| `checkbox` | `Checkbox` | 复选框 |
| `switch` | `Switch` | 开关 |
| `upload` | `Upload` (占位) | 文件上传 |
| `richtext` | `Textarea` (简化) | 富文本 |

### Column Type → 表格列渲染

| Column Type | 渲染方式 |
|-------------|----------|
| `text` | 直接显示 |
| `number` | 数字格式化 |
| `money` | 金额格式化 (¥1,234.56) |
| `date` | 日期格式化 |
| `datetime` | 日期时间格式化 |
| `tag` | `Badge` 组件 |
| `status` | `Badge` + 颜色 |
| `link` | `Link` 组件 |
| `action` | 操作按钮组 |

---

#### 增量更新机制

### 检测变更

当再次运行 `/init-app` 时：

1. 读取 `.spec-mapping.yaml`
2. 对比 spec.json 的 hash
3. 识别变更的模块/页面

### 锁定检查

```
对每个变更的模块/页面：
  if (mapping.locked === true) {
    跳过，输出提示
  } else {
    重新生成
  }
```

### 更新报告

```markdown
#### Demo 更新报告

**更新时间**：2026-01-27 15:30:00
**Spec 版本**：1.0.0 → 2.0.0

### 变更摘要

| 操作 | 文件数 |
|------|--------|
| 新增 | 5 |
| 更新 | 3 |
| 跳过（锁定） | 2 |

### 详细变更

#### 新增文件
- src/app/reports/page.tsx
- src/components/reports/report-table.tsx
- ...

#### 更新文件
- src/app/samples/page.tsx（新增筛选字段）
- ...

#### 跳过（已锁定）
- src/components/samples/sample-form.tsx
  原因：添加了自定义校验逻辑

### 注意事项
- 已锁定的文件未更新，如需更新请先解锁
```

---

#### 代码规范

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 路由 | kebab-case | `/samples`, `/sample-receive` |
| 组件文件 | kebab-case | `sample-table.tsx` |
| 组件名 | PascalCase | `SampleTable` |
| 函数 | camelCase | `getSampleList` |
| 常量 | UPPER_SNAKE_CASE | `SAMPLE_STATUS` |
| 类型 | PascalCase | `Sample`, `SampleStatus` |

### 文件组织

- 每个模块一个目录
- 相关组件放在一起
- Mock 数据集中管理
- 类型定义集中管理

### 代码风格

- 使用 TypeScript 严格模式
- 使用函数组件 + Hooks
- 使用 Tailwind CSS 样式
- 遵循 shadcn/ui 使用规范

---

#### 示例

### 基于 Spec 生成

用户说"基于 spec 生成 demo"：

1. 读取 `docs/spec/spec.json`
2. 生成导航菜单
3. 生成各模块页面
4. 生成组件
5. 生成 Mock 数据
6. 更新映射文件

### 基于方案生成（无 Spec）

用户说"基于 CRM 系统方案生成一个 demo"：

1. 读取 `docs/plan/crm-system.md`
2. 提取功能需求
3. 自动设计简化的页面结构
4. 生成代码

### 直接生成（无文档）

用户说"创建一个电商平台的 demo"：

1. 分析需求
2. 设计基础页面结构
3. 生成核心功能
4. 提示用户后续可通过 Spec 细化

---

#### 注意事项

1. **Spec 优先**：如果有 spec.json，严格按照 Spec 生成
2. **Mock 数据合理**：生成的 Mock 数据要符合业务场景
3. **代码可运行**：生成的代码要能直接运行，无语法错误
4. **遵循规范**：遵循项目现有的代码规范和风格
5. **锁定尊重**：已锁定的模块/文件不要覆盖
6. **映射维护**：每次生成都要更新 `.spec-mapping.yaml`

---

#### 错误处理

| 场景 | 处理 |
|------|------|
| spec.json 不存在 | 检查 docs/plan/，或提示用户先运行 /spec-writer |
| spec.json 格式错误 | 报错并提示具体位置 |
| 模块已锁定 | 跳过并在报告中说明 |
| shadcn 组件未安装 | 自动运行 `npx shadcn@latest add [component]` |

---

#### 与其他 Skill 的关系

| Skill | 关系 |
|-------|------|
| `/spec-writer` | 上游，提供 Spec 文档 |
| `/requirements` | 上上游，提供需求数据 |
| `/plan-writer` | 并行，提供方案文档（备选数据源） |
