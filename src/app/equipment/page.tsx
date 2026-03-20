"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Search,
  Activity,
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { equipmentMock, maintenanceRecordsMock } from "@/mock/equipment";
import {
  EQUIPMENT_STATUS,
  WORKSHOPS,
  getDictLabel,
  getDictColor,
} from "@/lib/dict";

function statusDot(status: string) {
  switch (status) {
    case "running": return "bg-emerald-500";
    case "idle": return "bg-blue-400";
    case "maintenance": return "bg-amber-500";
    case "fault": return "bg-red-500";
    case "offline": return "bg-gray-400";
    default: return "bg-gray-400";
  }
}

function maintenanceStatusVariant(status: string) {
  switch (status) {
    case "completed": return "default" as const;
    case "in_progress": return "secondary" as const;
    case "planned": return "outline" as const;
    default: return "outline" as const;
  }
}

function maintenanceStatusLabel(status: string) {
  switch (status) {
    case "completed": return "已完成";
    case "in_progress": return "进行中";
    case "planned": return "已计划";
    default: return status;
  }
}

function maintenanceTypeLabel(type: string) {
  switch (type) {
    case "preventive": return "计划保养";
    case "corrective": return "故障维修";
    case "emergency": return "紧急维修";
    default: return type;
  }
}

export default function EquipmentPage() {
  const [search, setSearch] = useState("");
  const [workshopFilter, setWorkshopFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = equipmentMock.filter((eq) => {
    const searchMatch = search
      ? eq.name.includes(search) || eq.code.toLowerCase().includes(search.toLowerCase())
      : true;
    const workshopMatch = workshopFilter === "all" ? true : eq.workshop === workshopFilter;
    const statusMatch = statusFilter === "all" ? true : eq.status === statusFilter;
    return searchMatch && workshopMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">设备管理</h1>
          <p className="text-sm text-muted-foreground">设备台账、运行状态和维保记录</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">设备列表</TabsTrigger>
            <TabsTrigger value="maintenance">维保记录</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4 space-y-4">
            {/* Filters */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索设备名称、编码..."
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      {EQUIPMENT_STATUS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => { setSearch(""); setWorkshopFilter("all"); setStatusFilter("all"); }}
                  >
                    重置
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((eq) => (
                <Card key={eq.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${statusDot(eq.status)}`} />
                          <h3 className="font-medium text-sm">{eq.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{eq.code} · {eq.model}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/equipment/${eq.id}`}>查看详情</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>发起维保</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">位置</span>
                        <span>{eq.workshop} · {eq.line}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">状态</span>
                        <Badge variant={getDictColor(EQUIPMENT_STATUS, eq.status) as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                          {getDictLabel(EQUIPMENT_STATUS, eq.status)}
                        </Badge>
                      </div>
                      {eq.oee > 0 && (
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Activity className="h-3 w-3" /> OEE
                            </span>
                            <span className="font-medium">{eq.oee}%</span>
                          </div>
                          <Progress value={eq.oee} className="h-1.5" />
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">下次维保</span>
                        <span>{eq.nextMaintenance}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="mt-4 space-y-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  维保记录
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    共 {maintenanceRecordsMock.length} 条
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>设备</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>描述</TableHead>
                      <TableHead>操作人</TableHead>
                      <TableHead>开始时间</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">费用</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceRecordsMock.map((record) => (
                      <TableRow key={record.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{record.equipmentName}</TableCell>
                        <TableCell className="text-sm">{maintenanceTypeLabel(record.type)}</TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate">{record.description}</TableCell>
                        <TableCell className="text-muted-foreground">{record.operator}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{record.startTime}</TableCell>
                        <TableCell>
                          <Badge variant={maintenanceStatusVariant(record.status)}>
                            {maintenanceStatusLabel(record.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ¥{record.cost.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
