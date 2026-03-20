"use client";

import {
  ArrowDown,
  ArrowUp,
  ClipboardList,
  Cog,
  ShieldCheck,
  Package,
  AlertTriangle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Stats ──────────────────────────────────────────────────

const stats = [
  {
    title: "进行中工单",
    value: "3",
    change: "+1",
    trend: "up" as const,
    icon: ClipboardList,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "设备运行率",
    value: "62.5%",
    change: "+4.2%",
    trend: "up" as const,
    icon: Cog,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "质检合格率",
    value: "93.8%",
    change: "-1.2%",
    trend: "down" as const,
    icon: ShieldCheck,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    title: "库存预警",
    value: "1",
    change: "+1",
    trend: "down" as const,
    icon: Package,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

// ─── Charts Data ────────────────────────────────────────────

const productionTrend = [
  { date: "3/14", output: 186, defect: 3 },
  { date: "3/15", output: 215, defect: 5 },
  { date: "3/16", output: 198, defect: 2 },
  { date: "3/17", output: 242, defect: 4 },
  { date: "3/18", output: 178, defect: 6 },
  { date: "3/19", output: 231, defect: 3 },
  { date: "3/20", output: 205, defect: 2 },
];

const equipmentDistribution = [
  { name: "运行中", value: 4, fill: "oklch(0.55 0.19 260)" },
  { name: "空闲", value: 1, fill: "oklch(0.7 0.14 230)" },
  { name: "维护中", value: 1, fill: "oklch(0.65 0.18 280)" },
  { name: "故障", value: 1, fill: "oklch(0.5 0.12 240)" },
  { name: "离线", value: 1, fill: "oklch(0.6 0.15 200)" },
];

const workshopOutput = [
  { workshop: "一车间", output: 812, target: 900 },
  { workshop: "二车间", output: 624, target: 700 },
  { workshop: "三车间", output: 456, target: 500 },
];

// ─── Chart Config ───────────────────────────────────────────

const trendChartConfig: ChartConfig = {
  output: { label: "产出", color: "var(--color-chart-1)" },
  defect: { label: "不良品", color: "var(--color-chart-5)" },
};

const equipmentChartConfig: ChartConfig = {
  value: { label: "数量" },
};

const workshopChartConfig: ChartConfig = {
  output: { label: "实际产出", color: "var(--color-chart-1)" },
  target: { label: "目标产出", color: "var(--color-chart-4)" },
};

// ─── Recent work orders ─────────────────────────────────────

const recentOrders = [
  { no: "WO20260305002", product: "液压阀体 B", status: "生产中", progress: "62%", workshop: "二车间" },
  { no: "WO20260315006", product: "精密齿轮组件 A", status: "生产中", progress: "52%", workshop: "一车间" },
  { no: "WO20260316008", product: "液压阀体 B", status: "生产中", progress: "22%", workshop: "二车间" },
  { no: "WO20260308004", product: "轴承座 D", status: "已暂停", progress: "52%", workshop: "三车间" },
  { no: "WO20260310003", product: "电机转子 C", status: "待生产", progress: "0%", workshop: "一车间" },
];

function orderStatusVariant(status: string) {
  switch (status) {
    case "生产中": return "secondary" as const;
    case "已暂停": return "destructive" as const;
    case "待生产": return "outline" as const;
    default: return "outline" as const;
  }
}

// ─── Alerts ─────────────────────────────────────────────────

const alerts = [
  { time: "08:30", text: "液压冲压机 PRS-001 报故障，液压系统泄漏", type: "error" as const },
  { time: "09:15", text: "6061铝合金板库存低于安全水位（85/100）", type: "warning" as const },
  { time: "10:00", text: "轴承座 D 工单质检不合格率35%，已暂停生产", type: "error" as const },
  { time: "14:00", text: "精密磨床 GRD-001 开始计划维保", type: "info" as const },
  { time: "17:00", text: "精密齿轮组件 A 工单完成入库 120 套", type: "success" as const },
];

// ─── Component ──────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">工作台</h1>
          <p className="text-sm text-muted-foreground">生产运营数据概览 · 2026年3月20日</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className={`${stat.bg} ${stat.color} rounded-lg p-2`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {stat.trend === "up" ? (
                    <ArrowUp className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={stat.trend === "up" ? "text-emerald-600" : "text-red-500"}>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">较昨日</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Production Trend */}
          <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">近7日产出趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={trendChartConfig} className="h-[280px] w-full">
                <ComposedChart data={productionTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                  <YAxis className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="defect" fill="var(--color-chart-5)" radius={[4, 4, 0, 0]} opacity={0.4} />
                  <Line
                    type="monotone"
                    dataKey="output"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "var(--color-chart-1)" }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Equipment Distribution */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">设备状态分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={equipmentChartConfig} className="h-[220px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={equipmentDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    strokeWidth={2}
                    stroke="var(--color-background)"
                  >
                    {equipmentDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {equipmentDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="ml-auto font-medium">{item.value}台</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 - Workshop output */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">车间产出对比（本周）</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={workshopChartConfig} className="h-[200px] w-full">
              <BarChart data={workshopOutput} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                <YAxis type="category" dataKey="workshop" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} width={60} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="output" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} barSize={20} />
                <Bar dataKey="target" fill="var(--color-chart-4)" radius={[0, 4, 4, 0]} barSize={20} opacity={0.3} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Table + Alerts */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Recent Work Orders */}
          <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">当前工单</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>工单号</TableHead>
                    <TableHead>产品</TableHead>
                    <TableHead>车间</TableHead>
                    <TableHead>进度</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.no} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{order.no}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell className="text-muted-foreground">{order.workshop}</TableCell>
                      <TableCell className="font-medium">{order.progress}</TableCell>
                      <TableCell>
                        <Badge variant={orderStatusVariant(order.status)}>{order.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Alerts Timeline */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                今日动态
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`h-2 w-2 rounded-full mt-1.5 ${
                          alert.type === "error"
                            ? "bg-red-500"
                            : alert.type === "warning"
                              ? "bg-amber-500"
                              : alert.type === "success"
                                ? "bg-emerald-500"
                                : "bg-blue-500"
                        }`}
                      />
                      {i < alerts.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm leading-snug">{alert.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
