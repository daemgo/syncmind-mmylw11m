---
name: sales-guide
description: 基于客户档案生成销售进攻指南，包括AI洞察分析、访谈提纲、竞对分析、决策链条等
metadata:
  short-description: 生成销售进攻指南
  triggers:
    - "生成销售指南"
    - "制作销售攻略"
    - "生成进攻指南"
    - "销售策略"
    - "客户攻略"
    - "分析客户"
    - "客户洞察"
  examples:
    - "生成销售指南"
    - "为这个客户制作销售攻略"
    - "分析一下这个客户的成交概率"
  dependencies:
    - profile       # 必须先有客户档案
    - humanizer-zh  # 输出人性化处理（必须）
---

基于客户档案生成销售进攻指南，包括 AI 洞察、访谈提纲、竞对分析、决策链条，写入 `sales-guide.json`。直接执行，不输出本文档内容。


这个 skill 用于基于客户档案、AI 洞察等信息，生成专业的销售进攻指南 `sales-guide.json`。

#### 功能

当用户要求生成销售指南或销售攻略时，使用此 skill 来：

1. 读取 `docs/customer/profile.json`（客户档案）
2. 读取 `docs/customer/sales-guide.json`（已有的销售作战数据，如果存在）
3. 读取 `docs/customer/requirements.json`（客户需求，如果存在）
4. **自动生成 AI 洞察分析**（风险、成交概率、机会点）
5. 基于企业信息和 AI 洞察生成销售进攻指南
6. 输出结果写入 `docs/customer/sales-guide.json`

#### 前置条件

- **必须**：`docs/customer/profile.json` 必须存在（使用 `/profile` skill 生成）
- **可选**：`docs/customer/requirements.json` 存在（客户需求，有助于更精准分析）

如果 profile.json 不存在，应提示用户先运行 `/profile` skill 初始化客户档案。

#### 数据源结构

### ProfileResponse (profile.json)
```typescript
interface ProfileResponse {
  profile: {
    companyName: string
    shortName: string
    isListed: boolean
    website: string
    industry: string
    subIndustry: string
    scale: string
    mainBusiness: string
    products: string[]
    targetCustomers: string[]
    businessModel: string
    rating: string
    tags: string[]

    registration: {
      foundedDate: string
      registeredCapital: string
      paidInCapital: string
      ownershipType: string
      branches: { count: number; locations: string[] }
      legalRisks: string
      operatingAnomalies: string
      penalties: string
      summary: string
    }

    policyAnalysis: {
      isSpecialized: boolean
      isDigitalTransformation: boolean
      isESG: boolean
      isHighTech: boolean
      policySupportLevel: string
      leverageStrategy: string
    }

    timing: {
      currentPhase: string
      evidence: string
      entryStrategy: string
    }

    creditRisk: {
      legalRisk: string
      operationalRisk: string
      creditRating: string
      warnings: string[]
      salesAdvice: string
    }

    organization: {
      type: string
      decisionChain: string
      keyPersons: string[]
      salesStrategy: string
    }

    strategy: {
      phase: string
      growthStage: string
      competitivePosition: string
      digitalMaturity: string
      analysisPath: string
      informationQuality: string
      expansionSignals: string[]
      contractionSignals: string[]
      riskSignals: string[]
    }

    techStack: {
      current: string[]
      inferred: string[]
      maturity: string
      direction: string
    }

    keyMetrics: { metric: string; value: string; source: string }[]

    metadata: {
      createdAt: string | null
      updatedAt: string | null
      createdBy: string
      version: string
      sources: string[]
      confidence: number
    }
  }
}
```

#### SalesGuideResponse 结构

```typescript
interface SalesGuideResponse {
  salesGuide: SalesGuide
}

interface SalesGuide {
  // 基础信息
  customerId: string
  customerName: string
  generatedAt: string
  version: string
  
  // AI 洞察分析
  aiInsights: AIInsights
  
  // 时机判断
  timing: TimingAnalysis
  
  // 访谈提纲
  interviewGuide: InterviewGuide
  
  // 竞对分析
  competitorAnalysis: CompetitorAnalysis[]
  
  // 决策链条
  decisionChain: DecisionChain
  
  // 下一步行动
  nextActions: ActionItem[]
}

// AI 洞察分析
interface AIInsights {
  risks: RiskItem[]                    // 风险项列表
  probability: {                       // 成交概率分析
    value: number                      // 概率值 (0-100)
    level: string                      // 概率等级 (高/中/低)
    factors: ProbabilityFactor[]       // 影响因素
  }
  opportunities: OpportunityItem[]     // 机会点
}

interface RiskItem {
  type: string                         // 风险类型（预算/时间/竞争/信息/关系）
  description: string                  // 风险描述
  severity: string                     // 严重程度（高/中/低）
  mitigation: string                   // 缓解措施
}

interface ProbabilityFactor {
  type: string                         // 正面/负面
  description: string                  // 因素描述
}

interface OpportunityItem {
  title: string                        // 机会标题
  potentialValue: string               // 潜在价值（高/中/低）
  description: string                  // 机会描述
  action: string                       // 建议行动
}

// 时机分析
interface TimingAnalysis {
  timingStage: string              // 时机阶段（刚融资/扩张期/转型期/稳定期/危机期）
  analysisBasis: string[]          // 判断依据
  entryStrategy: string            // 切入策略
  urgency: string                  // 紧急程度（高/中/低）
}

// 访谈提纲
interface InterviewGuide {
  quickScreening: Question[]       // 快速筛选问题（3-5个）
  deepDive: Question[]             // 深度访谈问题（5-8个）
  customQuestions: Question[]      // 针对性问题（根据客户情况定制）
}

interface Question {
  id: string
  category: string                 // 类别（需求/预算/决策/竞对/时间等）
  question: string                 // 问题内容
  purpose: string                  // 问题目的
  followUp: string                 // 追问建议
}

// 竞对分析
interface CompetitorAnalysis {
  competitor: string               // 竞对名称
  position: string                 // 竞对定位
  strengths: string[]              // 竞对优势
  weaknesses: string[]             // 竞对弱点
  ourAdvantage: string             // 我方优势
  differentiation: string          // 差异化策略
}

// 决策链条
interface DecisionChain {
  decisionMakers: Person[]         // 决策者
  influencers: Person[]            // 影响者
  blockers: Person[]               // 阻碍者
  decisionProcess: string          // 决策流程描述
  approvalPath: string[]           // 审批路径
  timeline: string                 // 决策时间线
}

interface Person {
  role: string                     // 职位/角色
  name?: string                    // 姓名（如有）
  concerns: string[]               // 关注点
  motivations: string[]            // 动机
  approach: string                 // 接触策略
}

// 行动项
interface ActionItem {
  id: string
  action: string                   // 行动描述
  priority: string                 // 优先级（高/中/低）
  deadline: string                 // 截止时间
  owner: string                    // 责任人
  status: string                   // 状态（待开始/进行中/已完成）
}
```

#### 工作流程

当用户要求生成销售指南时，按以下步骤执行：

### Step 1: 读取数据源

1. **读取客户档案**（必须）：
   - 使用 `read_file` 读取 `docs/customer/profile.json`
   - 提取企业基本信息、行业、规模、时机、痛点、需求、预算等
   - **如果文件不存在**：提示用户先运行 `/profile` skill

2. **读取跟进记录**（可选）：
   - 使用 `read_file` 读取 `docs/customer/followups.json`
   - 提取沟通历史、客户反馈、已尝试的方法等
   - **如果文件不存在**：继续执行，使用默认策略

3. **读取追踪数据**（可选）：
   - 使用 `read_file` 读取 `docs/customer/tracking.json`
   - 提取信息覆盖度、已回答问题、信息缺口等
   - **如果文件不存在**：继续执行，不生成覆盖度相关分析

### Step 2: AI 洞察分析

基于读取的数据，自动生成 AI 洞察分析：

#### 风险分析 (risks)

识别潜在风险点并提供缓解措施：

| 风险类型 | 识别依据 | 缓解措施示例 |
|----------|----------|--------------|
| **预算风险** | 预算范围不明确、意向等级低（<40） | 提供分期方案、强调ROI |
| **时间风险** | 决策周期长、交付时间紧迫 | 分阶段实施、设定里程碑 |
| **竞争风险** | 行业竞争激烈、客户提及竞对 | 突出差异化、准备竞对资料 |
| **信息风险** | 追踪覆盖度低（<50%）、关键问题未回答 | 补充调研、针对性提问 |
| **关系风险** | 跟进频率低、关键联系人未建立 | 增加拜访、发展多线联系人 |

#### 成交概率分析 (probability)

综合评估成交概率（0-100）：

| 概率等级 | 分值范围 | 判断条件 |
|----------|----------|----------|
| **高** | 80-100 | 需求明确且匹配度高 + 预算充足（意向>70）+ 跟进积极 + 覆盖度>80% |
| **中** | 50-79 | 需求基本明确 + 预算中等（意向40-70）+ 跟进正常 + 覆盖度50-80% |
| **低** | 0-49 | 需求不明确 + 预算不足（意向<40）+ 跟进不积极 + 覆盖度<50% |

影响因素分析：
- **正面因素**：需求明确、预算充足、意向高、跟进积极、决策周期合理
- **负面因素**：决策周期长、竞争激烈、信息不足、关键人未接触

#### 机会点识别 (opportunities)

| 机会来源 | 识别方法 | 示例 |
|----------|----------|------|
| **痛点机会** | 从 painPoints 提取未解决痛点 | 报告效率低 → LIMS自动化机会 |
| **扩展机会** | 从行业特点识别增值服务 | 检测机构 → 设备管理、人员培训 |
| **时机机会** | 从企业阶段识别切入点 | 刚融资 → 数字化转型预算充足 |
| **跟进机会** | 从沟通记录识别深度合作点 | 客户提及新业务线 → 新需求机会 |

### Step 3: 时机判断

基于 profile 中的 `strategy.phase` 和 `tracking.status` 进行时机判断：

| 时机类型 | 判断依据 | 紧急程度 | 切入策略 |
|----------|----------|----------|----------|
| **刚融资/刚上市** | profile 显示近期融资/上市 | 高 | 追热点，预算充足，快速切入 |
| **扩张期** | 大量招聘、新业务线 | 高 | 需要管理工具，强调效率 |
| **转型期** | 裁员/业务调整 | 中 | 降本增效，强调ROI |
| **稳定期** | 业务无明显变化 | 低 | 强调长期价值、稳定可靠 |
| **危机期** | 大量负面/司法风险 | 避免进入 | 避免进入，或谨慎观望 |

### Step 4: 访谈提纲设计

#### 快速筛选问题（3-5个）

用于初次接触或早期沟通，快速判断：
1. 业务现状（规模、样品量、流程）
2. 痛点确认（最困扰的问题）
3. 预算意向（是否有预算、预算范围）
4. 决策信息（谁决策、决策周期）
5. 竞对情况（是否用过其他系统）

#### 深度访谈问题（5-8个）

用于中期沟通，深入挖掘需求：
1. 业务流程细节（每个环节如何操作）
2. 效率问题（哪里最浪费时间）
3. 质量要求（有哪些合规要求）
4. 集成需求（需要对接哪些系统）
5. 扩展需求（未来1-2年计划）
6. 技术偏好（自研还是采购、云端还是本地）
7. 风险担忧（最担心的问题）
8. 成功标准（如何判断项目成功）

#### 针对性问题

基于客户特征定制的问题：
- **扩张期企业**：新业务如何支持、员工如何培训
- **转型期企业**：降本需求、ROI验证
- **技术导向企业**：技术架构、API能力
- **成本导向企业**：价格细节、分期付款

### Step 5: 竞对分析

#### 竞对类型

| 竞对类型 | 分析重点 |
|----------|----------|
| **传统大厂**（如赛默飞、岛津） | 优势：品牌/成熟；弱点：贵/复杂/定制难 |
| **国内厂商**（如北京三维、上海英格尔） | 优势：本土化；弱点：老旧/体验差 |
| **Excel+简单工具** | 优势：零成本；弱点：分散/效率低/不安全 |
| **自研系统** | 优势：完全定制；弱点：维护成本高/不专业 |

#### 差异化策略

基于我方优势设计差异化：
- **价格优势**：强调性价比
- **易用优势**：强调快速上手
- **本土优势**：强调服务响应
- **技术优势**：强调现代化架构
- **灵活优势**：强调快速迭代

### Step 6: 决策链条分析

基于 profile 中的 `decision.makers`、`decision.influencers` 和 `organization` 信息：

| 角色 | 关注点 | 接触策略 |
|------|--------|----------|
| **决策者**（创始人/CEO/CTO） | ROI、战略价值、风险 | 强调战略价值、长期收益 |
| **影响者**（技术负责人/实验室主任） | 功能、易用性、集成 | 强调功能完善、操作便捷 |
| **执行者**（操作人员） | 学习成本、工作效率 | 强调易上手、提升效率 |
| **阻碍者**（财务/采购） | 成本、合规性 | 强调节省成本、符合规范 |

### Step 7: 下一步行动

基于当前销售阶段生成行动项：

| 阶段 | 典型行动 |
|------|----------|
| **初步接触** | 首次拜访、需求调研、方案预约 |
| **方案展示** | 方案演示、POC测试、问题收集 |
| **谈判阶段** | 价格谈判、合同准备 |
| **收尾阶段** | 合同签订、实施启动、项目规划 |

### Step 8: 生成销售指南文件

使用 `write` 工具生成 `docs/customer/sales-guide.json`：
- 使用 UTF-8 编码
- JSON 格式，缩进 2 个空格
- 确保所有字段完整且格式正确
- 如果文件已存在，询问用户是否覆盖

#### 错误处理

### 数据源缺失处理

| 场景 | 处理方式 |
|------|----------|
| `profile.json` 不存在 | **停止执行**，提示用户先运行 `/profile` skill 初始化客户档案 |
| `followups.json` 不存在 | 继续执行，使用默认策略模板，AI洞察基于profile生成 |
| `tracking.json` 不存在 | 继续执行，跳过覆盖度相关分析 |
| 文件格式错误 | 报告错误位置，提示用户修复或重新生成 |

### 数据不完整处理

| 场景 | 处理方式 |
|------|----------|
| profile 缺少行业信息 | 使用 "通用" 行业模板 |
| profile 缺少痛点信息 | 基于行业特征推断常见痛点 |
| profile 缺少联系人 | 使用通用决策链模板 |
| profile 缺少预算信息 | 成交概率评估为中等，标注"预算待确认" |
| tracking 覆盖度为空 | 跳过覆盖度因素，基于其他数据评估概率 |

### 生成失败处理

- 如果生成过程中出错，保留已生成的部分内容
- 输出明确的错误信息和建议修复方案
- 不要覆盖已存在的有效文件

#### 完整输出示例

以下是一个完整的 `sales-guide.json` 输出示例：

```json
{
  "salesGuide": {
    "customerId": "cust-001",
    "customerName": "华测检测技术股份有限公司",
    "generatedAt": "2025-01-22T10:30:00Z",
    "version": "1.0.0",
    
    "aiInsights": {
      "risks": [
        {
          "type": "竞争风险",
          "description": "客户曾提及赛默飞LIMS，可能正在对比评估",
          "severity": "中",
          "mitigation": "准备竞对分析资料，强调性价比和本地化服务优势"
        },
        {
          "type": "信息风险",
          "description": "决策流程和审批路径尚未明确",
          "severity": "中",
          "mitigation": "下次拜访时重点了解决策链条"
        }
      ],
      "probability": {
        "value": 72,
        "level": "中",
        "factors": [
          {
            "type": "正面",
            "description": "需求明确，报告自动化是核心痛点"
          },
          {
            "type": "正面",
            "description": "刚完成B轮融资，预算充足"
          },
          {
            "type": "正面",
            "description": "已有2次有效沟通，关系建立良好"
          },
          {
            "type": "负面",
            "description": "决策链条尚未完全明确"
          },
          {
            "type": "负面",
            "description": "存在竞对对比情况"
          }
        ]
      },
      "opportunities": [
        {
          "title": "多分支协同需求",
          "potentialValue": "高",
          "description": "客户新开3个区域分公司，有跨分支数据协同需求",
          "action": "演示多分支管理功能，准备分支协同案例"
        },
        {
          "title": "设备管理增值",
          "potentialValue": "中",
          "description": "检测机构通常有设备管理需求，可作为增值模块",
          "action": "在方案中加入设备管理模块介绍"
        }
      ]
    },
    
    "timing": {
      "timingStage": "扩张期",
      "analysisBasis": [
        "近期完成B轮融资5000万",
        "招聘信息显示大量招聘检测工程师",
        "新开设3个区域分公司"
      ],
      "entryStrategy": "强调系统支持多分支、规模化管理能力",
      "urgency": "高"
    },
    
    "interviewGuide": {
      "quickScreening": [
        {
          "id": "q1",
          "category": "需求",
          "question": "目前报告制作的流程是怎样的？",
          "purpose": "了解现状和痛点程度",
          "followUp": "每份报告大概需要多长时间？"
        },
        {
          "id": "q2",
          "category": "预算",
          "question": "今年有数字化方面的预算规划吗？",
          "purpose": "判断预算意向",
          "followUp": "大概在什么范围？"
        },
        {
          "id": "q3",
          "category": "决策",
          "question": "这类采购一般谁来决策？",
          "purpose": "识别决策链",
          "followUp": "需要经过哪些审批流程？"
        }
      ],
      "deepDive": [
        {
          "id": "d1",
          "category": "流程",
          "question": "从样品接收到报告出具，整个流程是怎样的？",
          "purpose": "深入理解业务流程",
          "followUp": "哪个环节最耗时？"
        },
        {
          "id": "d2",
          "category": "集成",
          "question": "现有系统有哪些？需要对接吗？",
          "purpose": "了解集成需求",
          "followUp": "接口协议是什么？"
        }
      ],
      "customQuestions": [
        {
          "id": "cq1",
          "category": "扩张",
          "question": "新开的分公司在IT系统上有什么规划？",
          "purpose": "挖掘扩张带来的新需求",
          "followUp": "希望总部和分部数据打通吗？"
        }
      ]
    },
    
    "competitorAnalysis": [
      {
        "competitor": "赛默飞 LIMS",
        "position": "国际大厂高端产品",
        "strengths": ["品牌知名度高", "功能全面"],
        "weaknesses": ["价格昂贵", "本地化服务弱", "定制困难"],
        "ourAdvantage": "价格仅为其1/3，本地化服务响应快",
        "differentiation": "强调性价比和服务响应速度"
      },
      {
        "competitor": "Excel+Word",
        "position": "现有简单工具",
        "strengths": ["零成本", "已有使用习惯"],
        "weaknesses": ["效率低", "数据分散", "不安全", "无法协同"],
        "ourAdvantage": "效率提升3倍，数据集中管理",
        "differentiation": "强调效率和管理价值"
      }
    ],
    
    "decisionChain": {
      "decisionMakers": [
        {
          "role": "总经理",
          "name": "张三",
          "concerns": ["ROI", "战略价值", "风险控制"],
          "motivations": ["提升公司效率", "支撑业务扩张"],
          "approach": "强调战略价值和行业地位提升"
        }
      ],
      "influencers": [
        {
          "role": "技术总监",
          "concerns": ["技术架构", "集成能力", "维护成本"],
          "motivations": ["技术先进性", "减少维护工作"],
          "approach": "强调现代化架构和开放API"
        },
        {
          "role": "实验室主任",
          "concerns": ["操作便捷", "报告效率", "CNAS合规"],
          "motivations": ["减少加班", "提升团队效率"],
          "approach": "强调易用性和效率提升"
        }
      ],
      "blockers": [],
      "decisionProcess": "技术评估 → 商务谈判 → 总经理审批",
      "approvalPath": ["技术总监", "财务总监", "总经理"],
      "timeline": "预计2-3个月"
    },
    
    "nextActions": [
      {
        "id": "a1",
        "action": "发送产品介绍资料和案例",
        "priority": "高",
        "deadline": "今天",
        "owner": "销售",
        "status": "待开始"
      },
      {
        "id": "a2",
        "action": "预约产品演示",
        "priority": "高",
        "deadline": "本周内",
        "owner": "销售",
        "status": "待开始"
      },
      {
        "id": "a3",
        "action": "准备针对性方案",
        "priority": "中",
        "deadline": "演示前",
        "owner": "售前",
        "status": "待开始"
      }
    ]
  }
}
```

#### 注意事项

- **数据依赖**：
  - 必须基于 profile.json 生成
  - 有跟进记录时应考虑沟通历史

- **个性化**：
  - 问题应基于痛点设计
  - 策略应考虑时机因素

- **可操作性**：
  - 问题要开放、不封闭
  - 行动要具体、可执行

- **文件处理**：
  - 如果 sales-guide.json 已存在，询问是否覆盖
  - 确保生成的 JSON 格式正确
  - 所有中文字段使用中文
