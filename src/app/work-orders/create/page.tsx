"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  WORK_ORDER_PRIORITY,
  WORKSHOPS,
  PRODUCTION_LINES,
} from "@/lib/dict";

export default function CreateWorkOrderPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center gap-3">
          <Link href="/work-orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">新建工单</h1>
            <p className="text-sm text-muted-foreground">创建新的生产工单</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-3xl">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">工单信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">产品名称 *</Label>
                <Input id="productName" placeholder="输入产品名称" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productCode">产品编码 *</Label>
                <Input id="productCode" placeholder="输入产品编码" />
              </div>
            </div>

            {/* Quantity & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plannedQty">计划数量 *</Label>
                <Input id="plannedQty" type="number" placeholder="输入计划数量" />
              </div>
              <div className="space-y-2">
                <Label>优先级 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_ORDER_PRIORITY.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Workshop & Line */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>车间 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择车间" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORKSHOPS.map((ws) => (
                      <SelectItem key={ws} value={ws}>{ws}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>产线 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择产线" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCTION_LINES.map((line) => (
                      <SelectItem key={line} value={line}>{line}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignee */}
            <div className="space-y-2">
              <Label htmlFor="assignee">负责人</Label>
              <Input id="assignee" placeholder="输入负责人姓名" />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plannedStart">计划开始日期 *</Label>
                <Input id="plannedStart" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plannedEnd">计划结束日期 *</Label>
                <Input id="plannedEnd" type="date" />
              </div>
            </div>

            {/* Remark */}
            <div className="space-y-2">
              <Label htmlFor="remark">备注</Label>
              <Textarea id="remark" placeholder="输入备注信息（可选）" rows={3} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button>提交</Button>
              <Link href="/work-orders">
                <Button variant="outline">取消</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
