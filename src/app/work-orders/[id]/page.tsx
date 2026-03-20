"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { workOrdersMock } from "@/mock/work-orders";
import {
  WORK_ORDER_STATUS,
  WORK_ORDER_PRIORITY,
  getDictLabel,
  getDictColor,
} from "@/lib/dict";

export default function WorkOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const wo = workOrdersMock.find((w) => w.id === id);

  if (!wo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">工单不存在</p>
      </div>
    );
  }

  const progressPercent =
    wo.plannedQty > 0
      ? Math.round((wo.completedQty / wo.plannedQty) * 100)
      : 0;
  const yieldRate =
    wo.completedQty > 0
      ? ((wo.completedQty - wo.defectQty) / wo.completedQty * 100).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/work-orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">{wo.orderNo}</h1>
                <Badge variant={getDictColor(WORK_ORDER_STATUS, wo.status) as "default" | "secondary" | "destructive" | "outline"}>
                  {getDictLabel(WORK_ORDER_STATUS, wo.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{wo.productName} · {wo.productCode}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              编辑
            </Button>
            <Button variant="outline" size="sm" className="text-destructive">
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              删除
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">计划数量</p>
              <p className="text-2xl font-bold mt-1">{wo.plannedQty}</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">完成数量</p>
              <p className="text-2xl font-bold mt-1">{wo.completedQty}</p>
              <div className="mt-2 flex items-center gap-2">
                <Progress value={progressPercent} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground">{progressPercent}%</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">不良数量</p>
              <p className="text-2xl font-bold mt-1 text-red-600">{wo.defectQty}</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">良品率</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600">{yieldRate}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">基本信息</TabsTrigger>
            <TabsTrigger value="progress">生产记录</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">工单信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <p className="text-sm text-muted-foreground">工单号</p>
                    <p className="font-medium font-mono">{wo.orderNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">产品</p>
                    <p className="font-medium">{wo.productName} ({wo.productCode})</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">优先级</p>
                    <p className="font-medium">{getDictLabel(WORK_ORDER_PRIORITY, wo.priority)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">车间 / 产线</p>
                    <p className="font-medium">{wo.workshop} · {wo.line}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">负责人</p>
                    <p className="font-medium">{wo.assignee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">创建时间</p>
                    <p className="font-medium">{wo.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">计划开始</p>
                    <p className="font-medium">{wo.plannedStart}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">计划结束</p>
                    <p className="font-medium">{wo.plannedEnd}</p>
                  </div>
                  {wo.actualStart && (
                    <div>
                      <p className="text-sm text-muted-foreground">实际开始</p>
                      <p className="font-medium">{wo.actualStart}</p>
                    </div>
                  )}
                  {wo.actualEnd && (
                    <div>
                      <p className="text-sm text-muted-foreground">实际结束</p>
                      <p className="font-medium">{wo.actualEnd}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="mt-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">生产记录</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wo.actualStart ? (
                    <>
                      <div className="flex gap-3">
                        <div className="relative flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full mt-1.5 bg-emerald-500" />
                          <div className="w-px flex-1 bg-border mt-1" />
                        </div>
                        <div className="pb-4">
                          <p className="text-sm font-medium">开始生产</p>
                          <p className="text-xs text-muted-foreground">{wo.actualStart}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="relative flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full mt-1.5 bg-blue-500" />
                          {wo.actualEnd && <div className="w-px flex-1 bg-border mt-1" />}
                        </div>
                        <div className="pb-4">
                          <p className="text-sm font-medium">
                            已完成 {wo.completedQty}/{wo.plannedQty}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            不良品 {wo.defectQty} 件
                          </p>
                        </div>
                      </div>
                      {wo.actualEnd && (
                        <div className="flex gap-3">
                          <div className="relative flex flex-col items-center">
                            <div className="h-2 w-2 rounded-full mt-1.5 bg-emerald-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">生产完成</p>
                            <p className="text-xs text-muted-foreground">{wo.actualEnd}</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">暂无生产记录</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
