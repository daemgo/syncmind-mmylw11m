"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Activity } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { EQUIPMENT_STATUS, getDictLabel, getDictColor } from "@/lib/dict";

export default function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const eq = equipmentMock.find((e) => e.id === id);

  if (!eq) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">设备不存在</p>
      </div>
    );
  }

  const records = maintenanceRecordsMock.filter((r) => r.equipmentId === id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center gap-3">
          <Link href="/equipment">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{eq.name}</h1>
              <Badge variant={getDictColor(EQUIPMENT_STATUS, eq.status) as "default" | "secondary" | "destructive" | "outline"}>
                {getDictLabel(EQUIPMENT_STATUS, eq.status)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{eq.code} · {eq.model}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Activity className="h-3.5 w-3.5" /> OEE
              </p>
              <p className="text-2xl font-bold mt-1">{eq.oee}%</p>
              {eq.oee > 0 && <Progress value={eq.oee} className="h-1.5 mt-2" />}
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">累计运行</p>
              <p className="text-2xl font-bold mt-1">{eq.runHours.toLocaleString()}h</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">上次维保</p>
              <p className="text-2xl font-bold mt-1 text-sm">{eq.lastMaintenance}</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">下次维保</p>
              <p className="text-2xl font-bold mt-1 text-sm">{eq.nextMaintenance}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">基本信息</TabsTrigger>
            <TabsTrigger value="maintenance">维保记录</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">设备信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <p className="text-sm text-muted-foreground">设备编码</p>
                    <p className="font-medium font-mono">{eq.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">设备名称</p>
                    <p className="font-medium">{eq.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">型号</p>
                    <p className="font-medium">{eq.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">车间 / 产线</p>
                    <p className="font-medium">{eq.workshop} · {eq.line}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">购入日期</p>
                    <p className="font-medium">{eq.purchaseDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">累计运行时长</p>
                    <p className="font-medium">{eq.runHours.toLocaleString()} 小时</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="mt-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">维保记录</CardTitle>
              </CardHeader>
              <CardContent>
                {records.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">暂无维保记录</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>类型</TableHead>
                        <TableHead>描述</TableHead>
                        <TableHead>操作人</TableHead>
                        <TableHead>时间</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">费用</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="text-sm">{r.type === "preventive" ? "计划保养" : "故障维修"}</TableCell>
                          <TableCell className="text-sm">{r.description}</TableCell>
                          <TableCell className="text-muted-foreground">{r.operator}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{r.startTime}</TableCell>
                          <TableCell>
                            <Badge variant={r.status === "completed" ? "default" : "secondary"}>
                              {r.status === "completed" ? "已完成" : "进行中"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">¥{r.cost.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
