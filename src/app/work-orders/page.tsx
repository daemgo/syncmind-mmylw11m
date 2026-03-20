"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

import { workOrdersMock } from "@/mock/work-orders";
import {
  WORK_ORDER_STATUS,
  WORK_ORDER_PRIORITY,
  WORKSHOPS,
  getDictLabel,
  getDictColor,
} from "@/lib/dict";

const statusTabs = ["全部", "待生产", "生产中", "已暂停", "已完成", "已关闭"];
const statusTabMap: Record<string, string | undefined> = {
  "全部": undefined,
  "待生产": "pending",
  "生产中": "in_progress",
  "已暂停": "paused",
  "已完成": "completed",
  "已关闭": "closed",
};

function priorityColor(priority: string) {
  switch (priority) {
    case "urgent": return "text-red-600 bg-red-50";
    case "high": return "text-amber-600 bg-amber-50";
    default: return "text-muted-foreground bg-muted";
  }
}

export default function WorkOrdersPage() {
  const [activeTab, setActiveTab] = useState("全部");
  const [search, setSearch] = useState("");
  const [workshopFilter, setWorkshopFilter] = useState("all");

  const filtered = workOrdersMock.filter((wo) => {
    const statusMatch = statusTabMap[activeTab]
      ? wo.status === statusTabMap[activeTab]
      : true;
    const searchMatch = search
      ? wo.orderNo.toLowerCase().includes(search.toLowerCase()) ||
        wo.productName.toLowerCase().includes(search.toLowerCase())
      : true;
    const workshopMatch =
      workshopFilter === "all" ? true : wo.workshop === workshopFilter;
    return statusMatch && searchMatch && workshopMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">生产工单</h1>
            <p className="text-sm text-muted-foreground">管理生产计划和工单执行进度</p>
          </div>
          <Link href="/work-orders/create">
            <Button>
              <Plus className="mr-1.5 h-4 w-4" />
              新建工单
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="text-sm">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Filters */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索工单号、产品名称..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={workshopFilter} onValueChange={setWorkshopFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="车间" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部车间</SelectItem>
                  {WORKSHOPS.map((ws) => (
                    <SelectItem key={ws} value={ws}>{ws}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => { setSearch(""); setWorkshopFilter("all"); setActiveTab("全部"); }}
              >
                重置
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              工单列表
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                共 {filtered.length} 条
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">工单号</TableHead>
                  <TableHead>产品</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead>车间/产线</TableHead>
                  <TableHead>计划数量</TableHead>
                  <TableHead className="w-[180px]">进度</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>计划日期</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                      没有匹配的工单
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((wo) => {
                    const progressPercent = wo.plannedQty > 0
                      ? Math.round((wo.completedQty / wo.plannedQty) * 100)
                      : 0;
                    return (
                      <TableRow key={wo.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-mono text-sm font-medium">
                          <Link href={`/work-orders/${wo.id}`} className="text-primary hover:underline">
                            {wo.orderNo}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{wo.productName}</div>
                            <div className="text-xs text-muted-foreground">{wo.productCode}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityColor(wo.priority)}`}>
                            {getDictLabel(WORK_ORDER_PRIORITY, wo.priority)}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {wo.workshop} · {wo.line}
                        </TableCell>
                        <TableCell className="font-medium">{wo.plannedQty}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progressPercent} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground w-10 text-right">{progressPercent}%</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {wo.completedQty}/{wo.plannedQty} · 不良 {wo.defectQty}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getDictColor(WORK_ORDER_STATUS, wo.status) as "default" | "secondary" | "destructive" | "outline"}>
                            {getDictLabel(WORK_ORDER_STATUS, wo.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {wo.plannedStart} ~ {wo.plannedEnd}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/work-orders/${wo.id}`}>查看详情</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>编辑</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">删除</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                显示 1-{filtered.length} 条，共 {filtered.length} 条
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
