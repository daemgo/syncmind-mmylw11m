---
name: requirements
description: 基于拜访记录、客户文件、沟通内容，整理并分析客户真实需求，输出结构化需求文档
metadata:
  short-description: 整理客户需求文档
  triggers:
    - "整理需求"
    - "需求分析"
    - "客户需求"
    - "需求文档"
    - "需求整理"
    - "提炼需求"
    - "回答问题"
    - "补充需求"
  examples:
    - "整理这个客户的需求"
    - "基于拜访记录分析需求"
    - "帮我整理客户需求文档"
    - "我来回答之前的问题"
    - "补充需求信息"
  dependencies:
    - profile       # 必须先有客户档案
    - humanizer-zh  # 输出人性化处理（必须）
---

基于拜访记录、客户文件、沟通内容，整理分析客户真实需求，输出 `docs/customer/requirements.json`。直接执行，不输出本文档内容。


这个 skill 用于基于拜访记录、客户提供的文件、沟通内容等一手信息，整理并分析客户的真实需求，输出结构化的需求文档 `docs/customer/requirements.json`。

#### 核心原则：减少幻觉，问答迭代

> **重要**：本 skill 采用"问答式迭代"模式，而非一次性生成完整需求。
>
> - **不猜测**：对于不确定的信息，不自行推断或补充
> - **列问题**：将不明确的点整理成问题清单，等待跟单人员回答
> - **非中断**：问题以清单形式输出，跟单人员可异步回答
> - **迭代完善**：跟单人员回答后，再补充完善需求文档

#### 定位

| Skill | 阶段 | 核心问题 | 主要用户 |
|-------|------|----------|----------|
| `/profile` | 拜访前 | 客户是谁？ | 销售 |
| `/sales-guide` | 拜访前 | 怎么打？ | 销售 |
| **`/requirements`** | **拜访后** | **客户要什么？** | **售前/方案团队** |
| `/solution`（未来） | 方案阶段 | 怎么解决？ | 方案团队 |

#### 功能

当用户完成客户拜访后，使用此 skill 来：

1. 读取 `docs/customer/profile.json`（客户档案）
2. 读取 `docs/customer/sales-guide.json`（销售作战数据，如果存在，其中包含跟进记录）
3. 接收用户提供的拜访信息、客户文件、沟通内容
4. 分析并提炼客户真实需求
5. 输出结果写入 `docs/customer/requirements.json`

#### 前置条件

- **必须**：`docs/customer/profile.json` 必须存在
- **推荐**：有实际的拜访记录或客户沟通内容
- **可选**：客户提供的需求文档、业务流程图、现有系统截图等

#### 数据源

### 输入来源

| 来源类型 | 说明 | 示例 |
|----------|------|------|
| **拜访记录** | 与客户的会议、电话、演示记录 | 会议纪要、拜访总结 |
| **客户文件** | 客户主动提供的文档 | 需求说明、业务流程图、招标文件 |
| **沟通记录** | 微信、邮件、钉钉等沟通内容 | 聊天记录截图、邮件内容 |
| **现有系统** | 客户现有系统的信息 | 系统截图、导出数据、接口文档 |
| **问卷/调研** | 结构化的需求调研 | 调研问卷、需求表格 |

#### RequirementsResponse 结构

```typescript
interface RequirementsResponse {
  requirements: CustomerRequirements
}

interface CustomerRequirements {
  // 基础信息
  customerId: string
  customerName: string
  generatedAt: string
  version: string
  analyst: string                    // 需求分析人
  status: string                     // 草稿/待确认/已确认
  
  // 跟单人员判断与输入
  salesInput: SalesInput
  
  // 待回答问题（核心：减少幻觉的关键）
  pendingQuestions: PendingQuestion[]
  
  // 需求来源
  sources: RequirementSources
  
  // 背景与现状
  background: BusinessBackground
  
  // 需求分析
  businessNeeds: BusinessNeed[]      // 业务需求
  functionalNeeds: FunctionalNeed[]  // 功能需求
  technicalNeeds: TechnicalNeed[]    // 技术需求
  dataNeed: DataNeed                 // 数据需求
  integrationNeeds: IntegrationNeed[] // 集成需求
  securityNeeds: SecurityNeed        // 安全需求
  
  // 非功能需求
  nonFunctionalNeeds: NonFunctionalNeeds
  
  // 用户与角色
  users: UserRole[]
  
  // 优先级与范围
  scope: ProjectScope
  
  // 约束条件
  constraints: Constraints
  
  // 成功标准
  successCriteria: SuccessCriteria
  
  // 风险与假设
  risksAndAssumptions: RisksAndAssumptions
  
  // 方案建议方向
  solutionDirection: SolutionDirection
  
  // 待确认事项
  openQuestions: OpenQuestion[]
}

// ============ 跟单人员判断与输入 ============

interface SalesInput {
  // 跟单人员信息
  salesPerson: string                // 跟单人员姓名
  lastUpdated: string                // 最后更新时间
  
  // 整体判断
  overallAssessment: {
    customerIntent: string           // 客户意向判断（强烈/一般/观望/不明确）
    projectUrgency: string           // 项目紧急程度（紧急/正常/不急/不明确）
    budgetSituation: string          // 预算情况（充足/紧张/未知）
    competitionStatus: string        // 竞争情况（无竞对/有竞对/激烈竞争/不明确）
    winProbability: string           // 赢单概率判断（高/中/低/不明确）
    keyObstacles: string[]           // 主要障碍
    confidenceLevel: string          // 对以上判断的信心（高/中/低）
  }
  
  // 关键人物判断
  keyPersons: KeyPersonAssessment[]
  
  // 客户真实诉求（跟单人员理解）
  realNeeds: {
    explicitNeeds: string[]          // 客户明确表达的需求
    implicitNeeds: string[]          // 客户暗示但未明说的需求
    suspectedNeeds: string[]         // 跟单人员推测的潜在需求
    needsNotMentioned: string[]      // 客户刻意回避或未提及的点
  }
  
  // 决策因素判断
  decisionFactors: {
    primaryFactor: string            // 最主要的决策因素
    secondaryFactors: string[]       // 次要决策因素
    dealBreakers: string[]           // 可能导致丢单的因素
  }
  
  // 跟单人员备注
  notes: string                      // 自由备注
  concerns: string[]                 // 跟单人员的担忧
  suggestions: string[]              // 跟单人员的建议
}

interface KeyPersonAssessment {
  name: string
  role: string
  attitude: string                   // 支持/中立/反对/不明确
  influence: string                  // 决策者/强影响/弱影响/无影响
  concerns: string[]                 // 该人关注的点
  relationship: string               // 与我方的关系（良好/一般/陌生/紧张）
  notes: string                      // 备注
}

// ============ 待回答问题（减少幻觉的核心机制） ============

interface PendingQuestion {
  id: string
  category: string                   // 业务/技术/预算/时间/决策/竞对/其他
  priority: string                   // 高/中/低（影响方案的程度）
  question: string                   // 问题内容
  context: string                    // 为什么需要知道这个
  impactIfUnknown: string            // 如果不知道会有什么影响
  suggestedSource: string            // 建议向谁确认（客户某人/内部某人）
  status: string                     // 待回答/已回答/已取消/不适用
  answer: string                     // 跟单人员的回答
  answeredBy: string                 // 回答人
  answeredAt: string                 // 回答时间
  followUpNeeded: boolean            // 是否需要进一步跟进
}

// ============ 需求来源 ============

interface RequirementSources {
  meetings: Meeting[]                // 会议/拜访记录
  documents: SourceDocument[]        // 客户提供的文件
  communications: Communication[]    // 沟通记录
  observations: string[]             // 现场观察
}

interface Meeting {
  id: string
  date: string
  type: string                       // 拜访/电话/视频/演示
  location: string
  duration: string
  attendees: Attendee[]
  agenda: string[]
  keyPoints: string[]                // 关键信息点
  actionItems: string[]
  attachments: string[]
}

interface Attendee {
  name: string
  role: string
  company: string                    // 客户/我方
  notes: string                      // 该人员的关注点或态度
}

interface SourceDocument {
  id: string
  name: string
  type: string                       // 需求文档/招标文件/流程图/系统截图/其他
  providedBy: string
  providedDate: string
  summary: string                    // 文档摘要
  keyRequirements: string[]          // 从文档提取的关键需求
}

interface Communication {
  id: string
  date: string
  channel: string                    // 微信/邮件/钉钉/电话
  participants: string[]
  summary: string
  keyPoints: string[]
}

// ============ 背景与现状 ============

interface BusinessBackground {
  // 业务背景
  businessContext: string            // 业务背景描述
  currentChallenges: string[]        // 当前面临的挑战
  triggerEvent: string               // 触发本次需求的事件
  
  // 现有系统
  currentSystems: CurrentSystem[]
  currentProcess: ProcessDescription
  
  // 痛点分析
  painPoints: PainPoint[]
  
  // 期望目标
  expectedOutcomes: string[]
}

interface CurrentSystem {
  name: string
  vendor: string
  version: string
  purpose: string
  users: string
  problems: string[]                 // 现有系统的问题
  dataVolume: string                 // 数据量级
  keepOrReplace: string              // 保留/替换/集成
}

interface ProcessDescription {
  overview: string                   // 业务流程概述
  steps: ProcessStep[]
  bottlenecks: string[]              // 流程瓶颈
  diagram: string                    // 流程图链接（如有）
}

interface ProcessStep {
  id: string
  name: string
  description: string
  owner: string                      // 负责角色
  systems: string[]                  // 涉及系统
  painPoints: string[]               // 该环节痛点
  duration: string                   // 耗时
}

interface PainPoint {
  id: string
  category: string                   // 效率/成本/质量/风险/体验
  description: string
  impact: string                     // 影响描述
  severity: string                   // 高/中/低
  frequency: string                  // 频繁/偶尔/罕见
  currentWorkaround: string          // 当前的应对方式
  desiredState: string               // 期望的状态
}

// ============ 业务需求 ============

interface BusinessNeed {
  id: string
  category: string                   // 需求类别
  title: string
  description: string
  businessValue: string              // 业务价值
  priority: string                   // 必须/重要/期望/可选
  requestedBy: string                // 需求提出人
  acceptanceCriteria: string[]       // 验收标准
  relatedPainPoints: string[]        // 关联的痛点ID
}

// ============ 功能需求 ============

interface FunctionalNeed {
  id: string
  module: string                     // 所属模块
  title: string
  description: string
  userStory: string                  // 用户故事格式
  actors: string[]                   // 涉及角色
  preconditions: string[]            // 前置条件
  mainFlow: string[]                 // 主要流程
  alternativeFlows: string[]         // 备选流程
  businessRules: string[]            // 业务规则
  priority: string                   // P0/P1/P2/P3
  complexity: string                 // 高/中/低
  relatedNeeds: string[]             // 关联的业务需求ID
}

// ============ 技术需求 ============

interface TechnicalNeed {
  id: string
  category: string                   // 架构/性能/兼容性/部署/运维
  title: string
  description: string
  requirement: string                // 具体要求
  reason: string                     // 原因
  priority: string
  constraints: string[]              // 技术约束
}

// ============ 数据需求 ============

interface DataNeed {
  // 数据迁移
  dataMigration: {
    required: boolean
    sourceSystem: string
    dataTypes: DataType[]
    volume: string
    cleansingRequired: boolean
    mappingRequired: boolean
  }
  
  // 数据管理
  dataManagement: {
    retentionPolicy: string          // 数据保留策略
    archivePolicy: string            // 归档策略
    backupRequirement: string        // 备份要求
  }
  
  // 报表与分析
  reportingNeeds: ReportNeed[]
  
  // 数据质量
  dataQuality: {
    requirements: string[]
    validationRules: string[]
  }
}

interface DataType {
  name: string
  description: string
  volume: string                     // 数据量
  format: string                     // 数据格式
  quality: string                    // 数据质量情况
}

interface ReportNeed {
  id: string
  name: string
  description: string
  frequency: string                  // 实时/日/周/月/按需
  users: string[]
  dimensions: string[]               // 分析维度
  metrics: string[]                  // 关键指标
  exportFormats: string[]            // 导出格式
}

// ============ 集成需求 ============

interface IntegrationNeed {
  id: string
  targetSystem: string               // 目标系统
  direction: string                  // 单向输入/单向输出/双向
  purpose: string                    // 集成目的
  dataElements: string[]             // 交换的数据元素
  frequency: string                  // 实时/定时/触发式
  protocol: string                   // API/文件/数据库/消息队列
  existingInterface: boolean         // 是否有现成接口
  owner: string                      // 接口负责人
  priority: string
}

// ============ 安全需求 ============

interface SecurityNeed {
  // 认证授权
  authentication: {
    method: string                   // 账号密码/SSO/LDAP/钉钉/企微
    mfa: boolean                     // 是否需要多因素认证
    ssoIntegration: string           // SSO集成要求
  }
  
  // 权限控制
  authorization: {
    model: string                    // RBAC/ABAC/ACL
    granularity: string              // 功能级/数据级/字段级
    requirements: string[]
  }
  
  // 数据安全
  dataSecurity: {
    encryption: string               // 传输加密/存储加密
    masking: string[]                // 需要脱敏的字段
    classification: string           // 数据分类分级要求
  }
  
  // 审计日志
  auditLog: {
    required: boolean
    scope: string[]                  // 登录/操作/数据变更
    retention: string                // 保留期限
  }
  
  // 合规要求
  compliance: string[]               // 等保/GDPR/行业规范
}

// ============ 非功能需求 ============

interface NonFunctionalNeeds {
  // 性能需求
  performance: {
    concurrentUsers: string          // 并发用户数
    responseTime: string             // 响应时间要求
    throughput: string               // 吞吐量
    dataVolume: string               // 数据量级
  }
  
  // 可用性需求
  availability: {
    uptime: string                   // 可用性要求 (如99.9%)
    maintenanceWindow: string        // 维护窗口
    disasterRecovery: string         // 容灾要求
    rpo: string                      // 恢复点目标
    rto: string                      // 恢复时间目标
  }
  
  // 可扩展性
  scalability: {
    userGrowth: string               // 用户增长预期
    dataGrowth: string               // 数据增长预期
    horizontalScaling: boolean       // 是否需要水平扩展
  }
  
  // 易用性
  usability: {
    targetUsers: string              // 目标用户特征
    trainingRequired: string         // 培训要求
    accessChannels: string[]         // 访问渠道（PC/移动/平板）
    languageSupport: string[]        // 语言支持
    accessibilityRequirements: string[] // 无障碍要求
  }
  
  // 运维需求
  operability: {
    monitoringRequirements: string[]
    loggingRequirements: string[]
    alertingRequirements: string[]
    supportModel: string             // 支持模式
  }
}

// ============ 用户与角色 ============

interface UserRole {
  id: string
  name: string                       // 角色名称
  description: string
  userCount: string                  // 用户数量
  frequency: string                  // 使用频率
  primaryTasks: string[]             // 主要任务
  permissions: string[]              // 权限范围
  specialNeeds: string[]             // 特殊需求
}

// ============ 项目范围 ============

interface ProjectScope {
  // 范围定义
  inScope: ScopeItem[]               // 范围内
  outOfScope: ScopeItem[]            // 范围外
  futureScope: ScopeItem[]           // 未来范围（后续阶段）
  
  // 分期规划
  phases: ProjectPhase[]
  
  // 优先级矩阵
  priorityMatrix: PriorityItem[]
}

interface ScopeItem {
  id: string
  description: string
  reason: string                     // 纳入/排除原因
}

interface ProjectPhase {
  id: string
  name: string                       // 阶段名称
  description: string
  duration: string                   // 预计周期
  deliverables: string[]             // 交付物
  requirements: string[]             // 包含的需求ID
  milestone: string                  // 里程碑
}

interface PriorityItem {
  requirementId: string
  title: string
  businessValue: string              // 高/中/低
  urgency: string                    // 高/中/低
  effort: string                     // 高/中/低
  priority: string                   // P0/P1/P2/P3
  phase: string                      // 建议阶段
  rationale: string                  // 优先级理由
}

// ============ 约束条件 ============

interface Constraints {
  // 预算约束
  budget: {
    total: string                    // 总预算
    breakdown: BudgetItem[]          // 预算分解
    paymentTerms: string             // 付款方式
    flexibility: string              // 弹性空间
  }
  
  // 时间约束
  timeline: {
    expectedStart: string            // 期望开始时间
    expectedGoLive: string           // 期望上线时间
    hardDeadline: string             // 硬性截止日期
    reason: string                   // 时间要求原因
    flexibility: string              // 弹性空间
  }
  
  // 资源约束
  resources: {
    clientTeam: ResourceItem[]       // 客户方资源
    availability: string             // 可投入程度
    constraints: string[]            // 资源限制
  }
  
  // 技术约束
  technical: {
    existingInfrastructure: string[] // 现有基础设施
    mandatoryTech: string[]          // 必须使用的技术
    prohibitedTech: string[]         // 禁止使用的技术
    networkConstraints: string[]     // 网络限制
    deploymentConstraints: string[]  // 部署限制
  }
  
  // 组织约束
  organizational: {
    approvalProcess: string          // 审批流程
    changeManagement: string         // 变更管理要求
    vendorPolicies: string[]         // 供应商政策
    complianceRequirements: string[] // 合规要求
  }
}

interface BudgetItem {
  category: string
  amount: string
  notes: string
}

interface ResourceItem {
  role: string
  name: string
  availability: string               // 可投入时间比例
  responsibilities: string[]
}

// ============ 成功标准 ============

interface SuccessCriteria {
  // 业务成功标准
  businessCriteria: Criterion[]
  
  // 技术成功标准
  technicalCriteria: Criterion[]
  
  // 用户成功标准
  userCriteria: Criterion[]
  
  // 项目成功标准
  projectCriteria: Criterion[]
  
  // ROI预期
  roiExpectation: {
    expectedBenefits: string[]
    paybackPeriod: string
    quantifiableMetrics: Metric[]
  }
}

interface Criterion {
  id: string
  description: string
  measurement: string                // 如何衡量
  target: string                     // 目标值
  baseline: string                   // 基线值（当前值）
  owner: string                      // 责任人
}

interface Metric {
  name: string
  currentValue: string
  targetValue: string
  improvement: string
}

// ============ 风险与假设 ============

interface RisksAndAssumptions {
  // 项目风险
  risks: Risk[]
  
  // 假设条件
  assumptions: Assumption[]
  
  // 依赖项
  dependencies: Dependency[]
}

interface Risk {
  id: string
  category: string                   // 技术/业务/资源/时间/外部
  description: string
  probability: string                // 高/中/低
  impact: string                     // 高/中/低
  mitigation: string                 // 缓解措施
  owner: string
}

interface Assumption {
  id: string
  description: string
  basis: string                      // 假设依据
  validationMethod: string           // 验证方式
  riskIfInvalid: string              // 如果假设不成立的风险
}

interface Dependency {
  id: string
  description: string
  type: string                       // 内部/外部
  owner: string
  dueDate: string
  status: string                     // 待确认/已确认/已解决
}

// ============ 方案建议方向 ============

interface SolutionDirection {
  // 整体建议
  overallApproach: string
  
  // 方案选型建议
  recommendedApproach: {
    type: string                     // 定制开发/SaaS/混合
    rationale: string
    alternatives: Alternative[]
  }
  
  // 技术方向建议
  technicalDirection: {
    architecture: string
    deployment: string               // 云/本地/混合
    techStack: string[]
  }
  
  // 实施策略建议
  implementationStrategy: {
    approach: string                 // 大爆炸/分阶段/试点
    pilotScope: string               // 试点范围（如适用）
    rolloutPlan: string
  }
  
  // 后续行动
  nextSteps: NextStep[]
}

interface Alternative {
  name: string
  pros: string[]
  cons: string[]
  estimatedCost: string
  estimatedDuration: string
}

interface NextStep {
  id: string
  action: string
  owner: string
  deadline: string
  deliverable: string
}

// ============ 待确认事项 ============

interface OpenQuestion {
  id: string
  category: string                   // 业务/技术/资源/预算/时间
  question: string
  context: string                    // 问题背景
  impact: string                     // 对方案的影响
  proposedAnswer: string             // 建议答案（如有）
  owner: string                      // 跟进人
  status: string                     // 待确认/已确认/已取消
  answer: string                     // 确认的答案（如已确认）
}
```

#### 工作流程

本 skill 支持两种工作模式：

### 模式一：首次生成（生成初稿 + 问题清单）

当用户首次要求整理需求时，生成需求初稿，并列出待回答问题。

### 模式二：迭代完善（回答问题 + 补充完善）

当用户回答问题后，根据回答补充完善需求文档。

---

#### 模式一：首次生成

### Step 1: 收集信息

1. **读取已有数据**：
   - 使用 `read_file` 读取 `docs/customer/profile.json`
   - 使用 `read_file` 读取 `docs/customer/followups.json`（如存在）
   - 使用 `read_file` 读取 `docs/customer/sales-guide.json`（如存在）

2. **接收用户输入**：
   - 询问用户提供拜访记录、会议纪要
   - 询问用户是否有客户提供的文档
   - 询问用户是否有沟通记录截图或内容

3. **信息整理**：
   - 将所有来源信息结构化记录到 `sources` 中
   - 提取每个来源的关键信息点

### Step 1.5: 跟单人员输入（重要！）

**在分析之前，先收集跟单人员的判断**：

向跟单人员询问以下内容（可选填，不强制）：

#### 整体判断
| 问题 | 选项 |
|------|------|
| 客户意向如何？ | 强烈 / 一般 / 观望 / 不明确 |
| 项目紧急程度？ | 紧急 / 正常 / 不急 / 不明确 |
| 预算情况？ | 充足 / 紧张 / 未知 |
| 有无竞争对手？ | 无竞对 / 有竞对 / 激烈竞争 / 不明确 |
| 你判断赢单概率？ | 高 / 中 / 低 / 不好说 |
| 主要障碍是什么？ | [自由填写] |

#### 关键人物判断
| 问题 | 内容 |
|------|------|
| 谁是关键决策人？ | [姓名/职位] |
| 他的态度如何？ | 支持 / 中立 / 反对 / 不明确 |
| 他最关心什么？ | [自由填写] |
| 你们关系如何？ | 良好 / 一般 / 陌生 |

#### 真实诉求理解
| 问题 | 内容 |
|------|------|
| 客户明确说了要什么？ | [自由填写] |
| 客户暗示但没明说的？ | [自由填写] |
| 你觉得他还需要什么？ | [自由填写] |
| 客户刻意回避的点？ | [自由填写] |

#### 决策因素
| 问题 | 内容 |
|------|------|
| 客户最看重什么？ | 价格 / 功能 / 服务 / 品牌 / 关系 / 其他 |
| 什么情况会导致丢单？ | [自由填写] |

#### 其他
| 问题 | 内容 |
|------|------|
| 你有什么担忧？ | [自由填写] |
| 你有什么建议？ | [自由填写] |
| 其他备注 | [自由填写] |

**注意**：
- 以上问题跟单人员可以选择性回答
- 不知道的可以填"不明确"或留空
- 这些输入会记录到 `salesInput` 字段中

### Step 2: 背景与现状分析

1. **业务背景梳理**：
   - 客户所处行业和业务特点
   - 触发本次需求的事件或原因
   - 当前面临的主要挑战

2. **现有系统调研**：
   - 现有使用的系统有哪些
   - 各系统的问题和不足
   - 哪些需要保留、替换、集成

3. **业务流程梳理**：
   - 核心业务流程是什么
   - 流程中的瓶颈和痛点在哪里
   - 理想的流程应该是什么样

4. **痛点深度分析**：
   - 从效率、成本、质量、风险、体验等维度分析
   - 评估每个痛点的严重程度和频率
   - 了解当前的应对方式和期望状态

### Step 3: 需求分析

#### 业务需求提炼

从以下维度提炼业务需求：

| 维度 | 提问方向 |
|------|----------|
| **效率提升** | 哪些工作最耗时？期望节省多少时间？ |
| **成本降低** | 哪些成本最高？期望降低多少？ |
| **质量提升** | 质量问题有哪些？期望达到什么标准？ |
| **风险控制** | 存在什么风险？如何防控？ |
| **体验改善** | 用户体验问题？期望什么体验？ |
| **管理可视** | 需要看到什么数据？做什么决策？ |
| **协同协作** | 谁需要协同？协同什么？ |
| **合规满足** | 有什么合规要求？如何满足？ |

#### 功能需求细化

将业务需求拆解为功能需求：
- 使用用户故事格式描述
- 明确涉及的角色和场景
- 定义主要流程和备选流程
- 提取业务规则

#### 技术需求识别

识别技术层面的需求：
- 架构要求（分布式、微服务、单体）
- 性能要求（并发、响应时间、数据量）
- 兼容性要求（浏览器、设备、系统）
- 部署要求（云、本地、混合）
- 运维要求（监控、备份、灾备）

#### 数据需求分析

分析数据相关需求：
- 数据迁移：迁移什么数据？从哪里迁移？
- 报表分析：需要什么报表？什么维度？
- 数据质量：有什么质量要求？
- 数据安全：如何保护数据？

#### 集成需求识别

识别系统集成需求：
- 需要对接哪些系统？
- 数据如何交换？
- 实时还是批量？
- 谁负责接口？

#### 安全需求明确

明确安全相关需求：
- 认证方式（SSO、LDAP、钉钉等）
- 权限模型（RBAC、数据权限）
- 数据安全（加密、脱敏）
- 审计日志
- 合规要求

### Step 4: 用户角色分析

识别并分析所有用户角色：

| 分析维度 | 内容 |
|----------|------|
| **角色识别** | 有哪些角色使用系统？ |
| **用户数量** | 每个角色有多少用户？ |
| **使用频率** | 使用频率是怎样的？ |
| **主要任务** | 主要完成什么任务？ |
| **权限范围** | 需要什么权限？ |
| **特殊需求** | 有什么特殊需求？ |

### Step 5: 范围与优先级

1. **范围界定**：
   - 哪些在本期范围内
   - 哪些明确排除
   - 哪些放到后续阶段

2. **分期规划**：
   - 建议分几期实施
   - 每期包含哪些内容
   - 每期的里程碑是什么

3. **优先级排序**：
   - 使用 MoSCoW 法则或价值-复杂度矩阵
   - 综合考虑业务价值、紧急程度、实施难度
   - 给出每个需求的优先级建议

### Step 6: 约束条件识别

识别各类约束条件：

| 约束类型 | 需要明确的内容 |
|----------|----------------|
| **预算** | 总预算、预算分解、付款方式、弹性空间 |
| **时间** | 期望开始时间、上线时间、硬性截止日期 |
| **资源** | 客户方投入的人员、时间、配合程度 |
| **技术** | 必须使用/禁止使用的技术、网络限制、部署限制 |
| **组织** | 审批流程、变更管理、供应商政策 |

### Step 7: 成功标准定义

定义项目成功的标准：

| 维度 | 标准示例 |
|------|----------|
| **业务成功** | 报告生成时间从2小时缩短到10分钟 |
| **技术成功** | 系统响应时间<3秒，可用性>99.9% |
| **用户成功** | 用户满意度>85%，培训通过率>95% |
| **项目成功** | 按时上线、预算偏差<10% |

### Step 8: 风险与假设

1. **识别风险**：
   - 技术风险、业务风险、资源风险、时间风险、外部风险
   - 评估概率和影响
   - 制定缓解措施

2. **记录假设**：
   - 需求分析中的假设条件
   - 假设的依据
   - 如何验证假设
   - 假设不成立的风险

3. **梳理依赖**：
   - 内部依赖和外部依赖
   - 依赖的负责人和时间
   - 依赖的状态

### Step 9: 方案方向建议

基于需求分析，给出初步的方案方向建议：

1. **整体方案建议**：
   - 定制开发 vs SaaS vs 混合
   - 云部署 vs 本地部署 vs 混合
   - 推荐的技术方向

2. **实施策略建议**：
   - 大爆炸 vs 分阶段 vs 试点
   - 建议的试点范围
   - 推广计划

3. **后续行动**：
   - 下一步需要做什么
   - 谁负责
   - 什么时间完成

### Step 10: 待确认事项

整理需要进一步确认的事项：
- 业务上的未明确点
- 技术上的未确认点
- 资源、预算、时间上的未确认点
- 每个问题的影响和建议答案

### Step 11: 生成问题清单（核心！）

**在生成需求文档之前，必须识别并列出所有不确定的点**。

#### 问题识别原则

| 情况 | 处理方式 |
|------|----------|
| 客户明确说了 | 直接记录，标注来源 |
| 客户提供的文件中有 | 提取记录，标注来源 |
| 跟单人员判断的 | 记录到 `salesInput`，标注为"跟单人员判断" |
| 可以从公开信息推断 | 记录，标注为"推断，待验证" |
| **不知道、不确定** | **不猜测，列入问题清单** |

#### 问题分类

| 类别 | 典型问题 |
|------|----------|
| **业务类** | 业务流程细节、业务规则、业务量级 |
| **技术类** | 技术架构、接口协议、部署环境 |
| **预算类** | 预算范围、付款方式、预算来源 |
| **时间类** | 期望上线时间、硬性截止日期、时间原因 |
| **决策类** | 决策人、决策流程、审批周期 |
| **竞对类** | 竞争对手、客户倾向、对比情况 |
| **资源类** | 客户方投入、配合程度、项目经理 |
| **其他** | 其他不确定的点 |

#### 问题优先级

| 优先级 | 定义 | 示例 |
|--------|------|------|
| **高** | 不知道会严重影响方案 | 预算范围、上线时间、核心功能 |
| **中** | 会影响方案细节 | 用户数量、报表需求、接口数量 |
| **低** | 可以后续再确认 | 培训方式、文档格式 |

#### 问题格式

每个问题需包含：
```
- 问题：[具体问题]
- 背景：[为什么需要知道这个]
- 影响：[不知道会有什么影响]
- 建议确认人：[客户的谁/内部的谁]
```

### Step 12: 生成需求文档（初稿）

使用 `write` 工具生成 `docs/customer/requirements.json`：
- 使用 UTF-8 编码
- JSON 格式，缩进 2 个空格
- `status` 设为 "草稿"
- 已知信息正常填写
- 不确定的信息填写 "待确认" 或留空
- `pendingQuestions` 填写所有待回答问题

### Step 13: 输出问题清单

**生成文档后，必须以清晰格式输出问题清单，方便跟单人员异步回答**：

```markdown
#### 📋 待回答问题清单

您好！需求初稿已生成，以下问题需要您帮忙确认。
您可以随时回答，不用一次性回答完。回答后告诉我"我来回答问题"即可。

### 🔴 高优先级（影响方案核心）

1. **[问题1]**
   - 背景：xxx
   - 影响：如果不知道，xxx
   - 建议确认：xxx

2. **[问题2]**
   ...

### 🟡 中优先级（影响方案细节）

3. **[问题3]**
   ...

### 🟢 低优先级（可后续确认）

4. **[问题4]**
   ...

---
💡 回答方式：
- 直接在这里回复，格式如：问题1的答案是xxx
- 或者说"我来回答问题"，我会逐个询问
- 不知道的可以回答"不清楚"或"需要再问客户"
```

---

#### 模式二：迭代完善

当跟单人员回答问题后，触发迭代完善流程。

### 触发方式

用户说以下内容时进入模式二：
- "我来回答问题"
- "回答问题"
- "补充需求信息"
- "问题1的答案是xxx"
- 直接提供答案

### Step 1: 读取现有需求文档

读取 `docs/customer/requirements.json`，获取：
- 当前需求内容
- 待回答问题列表（`pendingQuestions`）

### Step 2: 处理用户回答

1. **匹配问题**：根据用户回答匹配对应问题
2. **更新问题状态**：
   - 设置 `status` 为 "已回答"
   - 记录 `answer`、`answeredBy`、`answeredAt`
3. **判断是否需要追问**：
   - 如果回答不完整，设置 `followUpNeeded: true`
   - 如果回答引发新问题，添加到问题清单

### Step 3: 根据回答补充需求

根据用户的回答，更新需求文档中对应的字段：

| 问题类别 | 更新字段 |
|----------|----------|
| 预算相关 | `constraints.budget` |
| 时间相关 | `constraints.timeline` |
| 技术相关 | `technicalNeeds`、`integrationNeeds` |
| 功能相关 | `businessNeeds`、`functionalNeeds` |
| 决策相关 | `constraints.organizational` |
| 用户相关 | `users` |

### Step 4: 检查完成度

计算需求完成度：

```
完成度 = 已回答问题数 / 总问题数 × 100%
```

| 完成度 | 状态 | 建议 |
|--------|------|------|
| < 50% | 草稿 | 继续收集信息 |
| 50%-80% | 待确认 | 可以开始方案初步设计 |
| > 80% | 基本完成 | 可以正式出方案 |

### Step 5: 更新需求文档

1. 更新 `requirements.json` 中的对应字段
2. 更新 `version`（如 1.0.0 → 1.0.1）
3. 更新 `status`（根据完成度）
4. 更新 `pendingQuestions`（标记已回答的问题）

### Step 6: 反馈给用户

输出更新摘要和剩余问题：

```markdown
#### ✅ 已更新

已根据您的回答更新了以下内容：
- [更新内容1]
- [更新内容2]

#### 📊 当前状态

- 需求完成度：XX%
- 待回答问题：X 个
- 文档状态：草稿/待确认/基本完成

#### 📋 剩余问题

[如有剩余问题，列出]

---
💡 您可以继续回答剩余问题，或者说"生成方案"进入下一步
```

#### 需求分类参考

### 按需求层次

| 层次 | 说明 | 示例 |
|------|------|------|
| **战略需求** | 支撑企业战略目标 | 数字化转型、降本增效 |
| **业务需求** | 解决业务问题 | 提升报告效率、降低库存成本 |
| **用户需求** | 满足用户工作需要 | 一键生成报告、移动端审批 |
| **功能需求** | 具体的系统功能 | 报告模板管理、自动计算 |
| **非功能需求** | 系统质量属性 | 响应时间<3秒、可用性>99.9% |

### 按 MoSCoW 优先级

| 优先级 | 说明 | 处理方式 |
|--------|------|----------|
| **Must have** | 必须有，没有就无法上线 | 第一阶段必须实现 |
| **Should have** | 应该有，重要但非必须 | 第一阶段尽量实现 |
| **Could have** | 可以有，锦上添花 | 视时间和预算决定 |
| **Won't have** | 不会有，明确排除 | 本期不做 |

### 按需求来源

| 来源 | 权重 | 说明 |
|------|------|------|
| **明确提出** | 高 | 客户明确提出的需求 |
| **文档提取** | 高 | 从客户文档中提取的需求 |
| **观察推断** | 中 | 从现场观察推断的需求 |
| **行业经验** | 中 | 基于行业经验补充的需求 |
| **技术建议** | 低 | 技术角度建议的需求 |

#### 输出示例

```json
{
  "requirements": {
    "customerId": "cust-001",
    "customerName": "华测检测技术股份有限公司",
    "generatedAt": "2025-01-26T10:30:00Z",
    "version": "1.0.0",
    "analyst": "张三",
    "status": "草稿",
    
    "salesInput": {
      "salesPerson": "李四",
      "lastUpdated": "2025-01-26T09:00:00Z",
      "overallAssessment": {
        "customerIntent": "强烈",
        "projectUrgency": "紧急",
        "budgetSituation": "充足",
        "competitionStatus": "有竞对",
        "winProbability": "中",
        "keyObstacles": ["竞对价格低", "决策人尚未见到"],
        "confidenceLevel": "中"
      },
      "keyPersons": [
        {
          "name": "李总",
          "role": "技术总监",
          "attitude": "支持",
          "influence": "强影响",
          "concerns": ["技术架构", "数据安全"],
          "relationship": "良好",
          "notes": "技术出身，注重方案专业性"
        },
        {
          "name": "张总",
          "role": "总经理",
          "attitude": "不明确",
          "influence": "决策者",
          "concerns": ["不清楚"],
          "relationship": "陌生",
          "notes": "还没见到，需要安排拜访"
        }
      ],
      "realNeeds": {
        "explicitNeeds": [
          "报告自动生成，减少人工填写",
          "多分支机构数据同步",
          "满足CNAS认可要求"
        ],
        "implicitNeeds": [
          "希望通过数字化提升公司形象",
          "担心系统太复杂员工学不会"
        ],
        "suspectedNeeds": [
          "可能后续还需要设备管理模块"
        ],
        "needsNotMentioned": [
          "没提预算具体数字",
          "没说为什么突然要上系统"
        ]
      },
      "decisionFactors": {
        "primaryFactor": "功能",
        "secondaryFactors": ["服务", "价格"],
        "dealBreakers": ["不能按时上线", "数据迁移出问题"]
      },
      "notes": "客户新分公司7月开业是硬节点，这是突然要上系统的原因",
      "concerns": ["总经理还没见到，不确定他的态度"],
      "suggestions": ["尽快安排总经理拜访", "准备竞对对比材料"]
    },
    
    "pendingQuestions": [
      {
        "id": "pq1",
        "category": "预算",
        "priority": "高",
        "question": "预算具体范围是多少？",
        "context": "客户没有明确说预算数字，跟单人员判断'充足'但没有具体金额",
        "impactIfUnknown": "无法确定方案档次，可能报价超出预算或方案过于保守",
        "suggestedSource": "技术总监李总或财务",
        "status": "待回答",
        "answer": "",
        "answeredBy": "",
        "answeredAt": "",
        "followUpNeeded": false
      },
      {
        "id": "pq2",
        "category": "决策",
        "priority": "高",
        "question": "总经理张总对这个项目的态度是什么？",
        "context": "张总是最终决策人，但跟单人员还没见到",
        "impactIfUnknown": "可能方案方向不符合老板期望，影响成单",
        "suggestedSource": "需要安排拜访张总",
        "status": "待回答",
        "answer": "",
        "answeredBy": "",
        "answeredAt": "",
        "followUpNeeded": false
      },
      {
        "id": "pq3",
        "category": "竞对",
        "priority": "高",
        "question": "竞争对手是谁？报价多少？客户倾向如何？",
        "context": "跟单人员说'有竞对'，但不知道具体是谁",
        "impactIfUnknown": "无法制定针对性的竞争策略",
        "suggestedSource": "客户方或行业渠道",
        "status": "待回答",
        "answer": "",
        "answeredBy": "",
        "answeredAt": "",
        "followUpNeeded": false
      },
      {
        "id": "pq4",
        "category": "技术",
        "priority": "中",
        "question": "需要对接的检测设备具体型号和接口协议是什么？",
        "context": "客户提到需要设备数据采集，但没提供设备清单",
        "impactIfUnknown": "无法评估设备对接工作量和可行性",
        "suggestedSource": "技术总监李总",
        "status": "待回答",
        "answer": "",
        "answeredBy": "",
        "answeredAt": "",
        "followUpNeeded": false
      },
      {
        "id": "pq5",
        "category": "业务",
        "priority": "中",
        "question": "报告模板有多少种？格式差异大吗？",
        "context": "报告自动生成是核心需求，但不知道模板复杂度",
        "impactIfUnknown": "无法准确评估报告模块工作量",
        "suggestedSource": "实验室主任王经理",
        "status": "待回答",
        "answer": "",
        "answeredBy": "",
        "answeredAt": "",
        "followUpNeeded": false
      },
      {
        "id": "pq6",
        "category": "时间",
        "priority": "中",
        "question": "如果不能6月底上线，客户能接受吗？有没有备选方案？",
        "context": "7月新分公司开业是硬节点，但如果真的来不及呢",
        "impactIfUnknown": "项目风险评估不准确",
        "suggestedSource": "客户方项目经理",
        "status": "待回答",
        "answer": "",
        "answeredBy": "",
        "answeredAt": "",
        "followUpNeeded": false
      }
    ],
    
    "sources": {
      "meetings": [
        {
          "id": "m1",
          "date": "2025-01-20",
          "type": "拜访",
          "location": "客户总部会议室",
          "duration": "2小时",
          "attendees": [
            {
              "name": "李总",
              "role": "技术总监",
              "company": "客户",
              "notes": "决策关键人，关注技术架构和数据安全"
            },
            {
              "name": "王经理",
              "role": "实验室主任",
              "company": "客户",
              "notes": "实际使用者，对报告效率痛点最深"
            }
          ],
          "agenda": ["需求沟通", "现有系统演示", "痛点讨论"],
          "keyPoints": [
            "报告制作是核心痛点，平均每份2小时",
            "现有Excel+Word模式无法支撑业务增长",
            "需要支持多分支机构数据协同",
            "对数据安全要求高，倾向本地部署"
          ],
          "actionItems": ["提供详细方案", "安排产品演示"],
          "attachments": ["会议纪要.docx"]
        }
      ],
      "documents": [
        {
          "id": "d1",
          "name": "华测检测LIMS需求说明.docx",
          "type": "需求文档",
          "providedBy": "王经理",
          "providedDate": "2025-01-20",
          "summary": "客户内部整理的LIMS系统需求，包含样品管理、检测流程、报告出具等需求",
          "keyRequirements": [
            "样品全生命周期管理",
            "检测流程电子化",
            "报告自动生成",
            "设备数据采集"
          ]
        }
      ],
      "communications": [],
      "observations": [
        "现有流程大量依赖纸质表单",
        "检测员同时操作多个Excel文件",
        "报告格式不统一，人工检查耗时"
      ]
    },
    
    "background": {
      "businessContext": "华测检测是第三方检测机构，年检测样品量超过10万件，随着业务快速增长，现有的Excel+Word模式已无法支撑业务发展",
      "currentChallenges": [
        "报告制作效率低，平均每份2小时",
        "样品流转依赖纸质单据，容易丢失",
        "多分支机构数据不互通",
        "质量追溯困难，难以满足CNAS要求"
      ],
      "triggerEvent": "近期扩张开设3个新分公司，急需统一的信息化系统支撑",
      
      "currentSystems": [
        {
          "name": "Excel样品登记表",
          "vendor": "自建",
          "version": "-",
          "purpose": "样品登记和进度跟踪",
          "users": "全体检测员",
          "problems": ["数据分散", "无法协同", "版本混乱"],
          "dataVolume": "每月约1万条记录",
          "keepOrReplace": "替换"
        },
        {
          "name": "Word报告模板",
          "vendor": "自建",
          "version": "-",
          "purpose": "检测报告出具",
          "users": "报告编制人员",
          "problems": ["纯手工填写", "格式不统一", "效率低"],
          "dataVolume": "每月约5000份报告",
          "keepOrReplace": "替换"
        }
      ],
      
      "currentProcess": {
        "overview": "样品接收→登记→分配→检测→复核→报告编制→审核→发放",
        "steps": [
          {
            "id": "p1",
            "name": "样品接收",
            "description": "接收客户送检样品，核对数量和状态",
            "owner": "样品员",
            "systems": ["纸质单据"],
            "painPoints": ["手写登记", "容易遗漏"],
            "duration": "10分钟/批次"
          },
          {
            "id": "p2",
            "name": "报告编制",
            "description": "根据检测结果编制检测报告",
            "owner": "报告员",
            "systems": ["Word"],
            "painPoints": ["手工输入数据", "格式调整耗时", "容易出错"],
            "duration": "2小时/份"
          }
        ],
        "bottlenecks": ["报告编制环节是最大瓶颈", "纸质流转导致信息滞后"],
        "diagram": ""
      },
      
      "painPoints": [
        {
          "id": "pain1",
          "category": "效率",
          "description": "报告制作耗时长",
          "impact": "每份报告需要2小时，严重制约产能",
          "severity": "高",
          "frequency": "频繁",
          "currentWorkaround": "加班加人",
          "desiredState": "报告自动生成，10分钟内完成"
        },
        {
          "id": "pain2",
          "category": "质量",
          "description": "报告错误率高",
          "impact": "手工填写导致5%的报告需要返工",
          "severity": "高",
          "frequency": "频繁",
          "currentWorkaround": "增加审核环节",
          "desiredState": "数据自动填充，减少人为错误"
        }
      ],
      
      "expectedOutcomes": [
        "报告制作效率提升80%以上",
        "实现多分支数据实时同步",
        "满足CNAS认可要求",
        "支撑未来3年业务增长"
      ]
    },
    
    "businessNeeds": [
      {
        "id": "bn1",
        "category": "效率提升",
        "title": "报告自动生成",
        "description": "系统根据检测数据自动生成检测报告，减少人工填写",
        "businessValue": "报告产能提升3倍，人力成本降低50%",
        "priority": "必须",
        "requestedBy": "王经理",
        "acceptanceCriteria": [
          "报告生成时间<10分钟",
          "支持多种报告模板",
          "数据自动填充准确率>99%"
        ],
        "relatedPainPoints": ["pain1", "pain2"]
      },
      {
        "id": "bn2",
        "category": "管理可视",
        "title": "多分支数据协同",
        "description": "总部与分公司数据实时同步，统一管理",
        "businessValue": "消除信息孤岛，提升管理效率",
        "priority": "必须",
        "requestedBy": "李总",
        "acceptanceCriteria": [
          "数据同步延迟<5分钟",
          "支持分级权限管理",
          "总部可查看所有分支数据"
        ],
        "relatedPainPoints": []
      }
    ],
    
    "functionalNeeds": [
      {
        "id": "fn1",
        "module": "报告管理",
        "title": "报告模板管理",
        "description": "支持多种检测报告模板的配置和管理",
        "userStory": "作为报告管理员，我希望能够配置报告模板，以便生成不同类型的检测报告",
        "actors": ["报告管理员"],
        "preconditions": ["已登录系统", "拥有模板管理权限"],
        "mainFlow": [
          "1. 进入模板管理",
          "2. 创建/编辑模板",
          "3. 配置数据字段映射",
          "4. 预览模板效果",
          "5. 保存并发布"
        ],
        "alternativeFlows": ["导入现有Word模板"],
        "businessRules": [
          "模板需要审核后才能使用",
          "已使用的模板不能删除只能停用"
        ],
        "priority": "P0",
        "complexity": "中",
        "relatedNeeds": ["bn1"]
      }
    ],
    
    "technicalNeeds": [
      {
        "id": "tn1",
        "category": "部署",
        "title": "本地化部署",
        "description": "系统需要部署在客户本地服务器",
        "requirement": "支持私有化部署，数据存储在客户本地",
        "reason": "客户对数据安全要求高，检测数据不能外传",
        "priority": "必须",
        "constraints": ["需要支持客户现有的虚拟化环境"]
      }
    ],
    
    "dataNeed": {
      "dataMigration": {
        "required": true,
        "sourceSystem": "Excel样品登记表",
        "dataTypes": [
          {
            "name": "样品基础数据",
            "description": "样品编号、名称、委托单位等",
            "volume": "约10万条",
            "format": "Excel",
            "quality": "格式不统一，需要清洗"
          }
        ],
        "volume": "约10万条历史数据",
        "cleansingRequired": true,
        "mappingRequired": true
      },
      "dataManagement": {
        "retentionPolicy": "检测数据保留10年",
        "archivePolicy": "3年以上数据归档",
        "backupRequirement": "每日备份，保留30天"
      },
      "reportingNeeds": [
        {
          "id": "r1",
          "name": "产能统计报表",
          "description": "统计各分支机构的检测量、报告产出量",
          "frequency": "日/周/月",
          "users": ["管理层"],
          "dimensions": ["时间", "分支机构", "检测类型"],
          "metrics": ["检测量", "报告量", "效率"],
          "exportFormats": ["Excel", "PDF"]
        }
      ],
      "dataQuality": {
        "requirements": ["数据完整性", "数据准确性"],
        "validationRules": ["必填字段校验", "数据格式校验"]
      }
    },
    
    "integrationNeeds": [
      {
        "id": "in1",
        "targetSystem": "检测设备",
        "direction": "单向输入",
        "purpose": "自动采集设备检测数据",
        "dataElements": ["检测结果", "检测时间", "设备编号"],
        "frequency": "实时",
        "protocol": "API/串口",
        "existingInterface": false,
        "owner": "设备厂商",
        "priority": "重要"
      }
    ],
    
    "securityNeeds": {
      "authentication": {
        "method": "账号密码",
        "mfa": false,
        "ssoIntegration": "暂不需要"
      },
      "authorization": {
        "model": "RBAC",
        "granularity": "数据级",
        "requirements": ["按分支机构隔离数据", "按角色控制功能权限"]
      },
      "dataSecurity": {
        "encryption": "传输加密(HTTPS)",
        "masking": ["客户联系方式"],
        "classification": "内部数据"
      },
      "auditLog": {
        "required": true,
        "scope": ["登录", "关键操作", "数据变更"],
        "retention": "3年"
      },
      "compliance": ["CNAS认可要求"]
    },
    
    "nonFunctionalNeeds": {
      "performance": {
        "concurrentUsers": "100人同时在线",
        "responseTime": "普通操作<3秒，报告生成<30秒",
        "throughput": "每日处理1000份报告",
        "dataVolume": "3年数据约500万条"
      },
      "availability": {
        "uptime": "99.5%",
        "maintenanceWindow": "周日凌晨2-6点",
        "disasterRecovery": "同城灾备",
        "rpo": "1小时",
        "rto": "4小时"
      },
      "scalability": {
        "userGrowth": "未来3年用户翻倍",
        "dataGrowth": "每年新增200万条",
        "horizontalScaling": false
      },
      "usability": {
        "targetUsers": "检测员，计算机水平一般",
        "trainingRequired": "1天培训",
        "accessChannels": ["PC浏览器"],
        "languageSupport": ["中文"],
        "accessibilityRequirements": []
      },
      "operability": {
        "monitoringRequirements": ["服务可用性", "性能指标"],
        "loggingRequirements": ["操作日志", "错误日志"],
        "alertingRequirements": ["服务故障告警"],
        "supportModel": "5×8远程支持"
      }
    },
    
    "users": [
      {
        "id": "u1",
        "name": "检测员",
        "description": "执行检测任务的一线人员",
        "userCount": "50人",
        "frequency": "每天8小时",
        "primaryTasks": ["样品登记", "检测录入", "数据查询"],
        "permissions": ["本人数据"],
        "specialNeeds": ["操作简单", "支持批量操作"]
      },
      {
        "id": "u2",
        "name": "报告编制员",
        "description": "负责编制和审核检测报告",
        "userCount": "10人",
        "frequency": "每天8小时",
        "primaryTasks": ["报告生成", "报告审核", "报告发放"],
        "permissions": ["报告管理权限"],
        "specialNeeds": ["报告生成效率", "批量打印"]
      }
    ],
    
    "scope": {
      "inScope": [
        {
          "id": "s1",
          "description": "样品全生命周期管理",
          "reason": "核心业务需求"
        },
        {
          "id": "s2",
          "description": "检测报告自动生成",
          "reason": "核心痛点"
        }
      ],
      "outOfScope": [
        {
          "id": "os1",
          "description": "财务管理模块",
          "reason": "客户已有财务系统"
        }
      ],
      "futureScope": [
        {
          "id": "fs1",
          "description": "客户门户",
          "reason": "二期考虑"
        }
      ],
      "phases": [
        {
          "id": "phase1",
          "name": "一期：核心功能",
          "description": "实现样品管理和报告生成核心功能",
          "duration": "3个月",
          "deliverables": ["样品管理模块", "报告管理模块", "基础报表"],
          "requirements": ["bn1", "bn2", "fn1"],
          "milestone": "核心功能上线"
        }
      ],
      "priorityMatrix": [
        {
          "requirementId": "bn1",
          "title": "报告自动生成",
          "businessValue": "高",
          "urgency": "高",
          "effort": "中",
          "priority": "P0",
          "phase": "一期",
          "rationale": "核心痛点，业务价值高"
        }
      ]
    },
    
    "constraints": {
      "budget": {
        "total": "50万以内",
        "breakdown": [
          {"category": "软件", "amount": "30万", "notes": ""},
          {"category": "实施", "amount": "15万", "notes": ""},
          {"category": "硬件", "amount": "5万", "notes": "服务器"}
        ],
        "paymentTerms": "3-3-3-1",
        "flexibility": "可上浮10%"
      },
      "timeline": {
        "expectedStart": "2025年2月",
        "expectedGoLive": "2025年5月",
        "hardDeadline": "2025年6月底前必须上线",
        "reason": "新分公司7月开业，必须使用新系统",
        "flexibility": "可接受分阶段上线"
      },
      "resources": {
        "clientTeam": [
          {
            "role": "项目经理",
            "name": "王经理",
            "availability": "50%",
            "responsibilities": ["需求确认", "验收测试"]
          }
        ],
        "availability": "核心用户可配合UAT测试",
        "constraints": ["4-5月是业务旺季，用户时间有限"]
      },
      "technical": {
        "existingInfrastructure": ["VMware虚拟化", "Windows Server"],
        "mandatoryTech": [],
        "prohibitedTech": [],
        "networkConstraints": ["内网部署", "不能访问外网"],
        "deploymentConstraints": ["客户提供服务器"]
      },
      "organizational": {
        "approvalProcess": "技术总监审批后可启动",
        "changeManagement": "变更需书面确认",
        "vendorPolicies": [],
        "complianceRequirements": ["CNAS认可"]
      }
    },
    
    "successCriteria": {
      "businessCriteria": [
        {
          "id": "bc1",
          "description": "报告制作效率提升",
          "measurement": "报告平均制作时间",
          "target": "<10分钟",
          "baseline": "2小时",
          "owner": "王经理"
        }
      ],
      "technicalCriteria": [
        {
          "id": "tc1",
          "description": "系统可用性",
          "measurement": "月度可用率",
          "target": ">99.5%",
          "baseline": "-",
          "owner": "IT部"
        }
      ],
      "userCriteria": [
        {
          "id": "uc1",
          "description": "用户满意度",
          "measurement": "用户满意度调查",
          "target": ">85%",
          "baseline": "-",
          "owner": "王经理"
        }
      ],
      "projectCriteria": [
        {
          "id": "pc1",
          "description": "按时上线",
          "measurement": "上线时间",
          "target": "2025年5月底前",
          "baseline": "-",
          "owner": "项目经理"
        }
      ],
      "roiExpectation": {
        "expectedBenefits": [
          "报告人力成本降低50%",
          "报告产能提升3倍",
          "质量返工率降低80%"
        ],
        "paybackPeriod": "6个月",
        "quantifiableMetrics": [
          {
            "name": "人力成本节省",
            "currentValue": "10人×1万/月=10万/月",
            "targetValue": "5人×1万/月=5万/月",
            "improvement": "节省5万/月"
          }
        ]
      }
    },
    
    "risksAndAssumptions": {
      "risks": [
        {
          "id": "risk1",
          "category": "资源",
          "description": "业务旺季用户配合度低",
          "probability": "高",
          "impact": "中",
          "mitigation": "提前完成UAT，错峰安排培训",
          "owner": "项目经理"
        }
      ],
      "assumptions": [
        {
          "id": "a1",
          "description": "客户能提供符合要求的服务器",
          "basis": "客户IT确认",
          "validationMethod": "部署前验证",
          "riskIfInvalid": "可能导致部署延期"
        }
      ],
      "dependencies": [
        {
          "id": "dep1",
          "description": "设备厂商提供数据接口",
          "type": "外部",
          "owner": "设备厂商",
          "dueDate": "2025年3月",
          "status": "待确认"
        }
      ]
    },
    
    "solutionDirection": {
      "overallApproach": "基于成熟LIMS产品进行定制化实施",
      "recommendedApproach": {
        "type": "产品+定制",
        "rationale": "客户需求与标准LIMS高度匹配，产品化方案成熟度高、风险低",
        "alternatives": [
          {
            "name": "纯定制开发",
            "pros": ["完全贴合需求"],
            "cons": ["周期长", "成本高", "风险大"],
            "estimatedCost": "100万+",
            "estimatedDuration": "8个月+"
          }
        ]
      },
      "technicalDirection": {
        "architecture": "B/S架构，支持多分支部署",
        "deployment": "本地部署",
        "techStack": ["Java", "MySQL", "Vue"]
      },
      "implementationStrategy": {
        "approach": "分阶段",
        "pilotScope": "总部先行试点",
        "rolloutPlan": "总部上线稳定后推广至分公司"
      },
      "nextSteps": [
        {
          "id": "ns1",
          "action": "提交正式方案和报价",
          "owner": "售前",
          "deadline": "本周五",
          "deliverable": "解决方案文档"
        },
        {
          "id": "ns2",
          "action": "确认设备接口对接方案",
          "owner": "技术",
          "deadline": "下周三",
          "deliverable": "接口对接方案"
        }
      ]
    },
    
    "openQuestions": [
      {
        "id": "q1",
        "category": "技术",
        "question": "检测设备具体型号和接口协议是什么？",
        "context": "需要确认设备数据采集的技术方案",
        "impact": "影响设备对接模块的设计和工作量",
        "proposedAnswer": "建议客户提供设备清单和接口文档",
        "owner": "王经理",
        "status": "待确认",
        "answer": ""
      },
      {
        "id": "q2",
        "category": "业务",
        "question": "报告模板有多少种？格式差异大吗？",
        "context": "需要评估模板配置工作量",
        "impact": "影响报告模块的设计复杂度",
        "proposedAnswer": "-",
        "owner": "王经理",
        "status": "待确认",
        "answer": ""
      }
    ]
  }
}
```

#### 错误处理

### 数据源缺失处理

| 场景 | 处理方式 |
|------|----------|
| `profile.json` 不存在 | 提示用户先运行 `/profile` skill |
| 无拜访记录或沟通内容 | 提示用户提供相关信息，无法凭空生成需求 |
| 客户文件无法解析 | 提示用户提供文件摘要或关键内容 |

### 信息不完整处理

| 场景 | 处理方式 |
|------|----------|
| 预算信息未知 | 标注"待确认"，列入待确认事项 |
| 时间要求未知 | 标注"待确认"，列入待确认事项 |
| 技术需求不明确 | 基于行业经验推断，标注"假设待验证" |

#### 注意事项

- **来源追溯**：每个需求都应能追溯到具体来源（会议、文档、沟通）
- **客观记录**：区分客户明确提出的需求和我方推断的需求
- **优先级协商**：优先级建议需与客户确认
- **避免过度承诺**：需求分析阶段不做方案承诺
- **迭代更新**：随着沟通深入，需求文档应持续更新
- **版本管理**：重大变更应更新版本号

#### 与其他 Skill 的关系

| Skill | 关系 |
|-------|------|
| `/profile` | 输入：客户基本信息 |
| `/sales-guide` | 输入：销售策略参考；拜访时的访谈提纲 |
| `/solution`（未来） | 输出：作为方案设计的核心输入 |
