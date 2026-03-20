# 北森 (Beisen) Core HR 元模型

## 概述

本目录沉淀了北森 iTalentX 一体化 HR SaaS 平台的 Core HR 核心模块元模型。

**数据来源**: 北森官网产品介绍 (beisen.com)  
**更新时间**: 2025-03-03

## 模块清单

| 模块 | 英文名 | 描述 |
|------|--------|------|
| 组织人事 | Organization & Employee | 组织架构、员工主数据、岗职位体系 |
| 假勤管理 | Time & Attendance | 考勤打卡、请假、加班、排班 |
| 薪酬福利 | Compensation & Benefits | 薪资核算、社保公积金、个税 |
| 员工服务 | Employee Service | 自助服务、AI问答、证明、激励 |
| 智慧分析 | Analytics | 报表、风险预警 |

## 实体清单

### 组织人事
- **Organization** - 组织架构
- **Employee** - 员工主数据
- **EmployeeJob** - 员工任职信息
- **Position** - 岗位体系

### 假勤管理
- **AttendanceRecord** - 考勤记录
- **LeaveRequest** - 请假申请
- **OvertimeRequest** - 加班申请
- **LeaveBalance** - 假期余额
- **Schedule** - 排班计划

### 薪酬福利
- **SalaryStructure** - 薪资结构
- **SalaryItem** - 薪资项目
- **EmployeeSalary** - 员工薪资
- **SocialInsuranceRecord** - 社保记录
- **PayrollRun** - 薪资核算批次

### 员工服务
- **EmployeeSelfService** - 员工自助服务
- **CertificateRequest** - 证明申请
- **EmployeeReward** - 员工激励

### 智慧分析
- **HRReport** - HR分析报表
- **RiskAlert** - 风险预警

## 使用场景

在 SyncMind 需求分析中，可引用以下字段：

```
员工入职场景 → Employee.personId, EmployeeJob.hireDate, EmployeeJob.employeeType
请假场景 → LeaveRequest.leaveType, LeaveRequest.duration, LeaveBalance.remainingDays
薪资核算场景 → EmployeeSalary.grossSalary, EmployeeSalary.netSalary, SocialInsuranceRecord
考勤异常预警 → RiskAlert.alertType, RiskAlert.severity
```

## 扩展

后续可补充：
- 招聘管理模块 (Recruitment)
- 绩效管理模块 (Performance)
- 学习管理模块 (Learning)
- 继任管理模块 (Succession)
