"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  Plus,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { qualityInspectionsMock, defectRecordsMock } from "@/mock/quality";
import {
  INSPECTION_RESULT,
  INSPECTION_TYPE,
  getDictLabel,
  getDictColor,
} from "@/lib/dict";

function defectStatusVariant(status: string) {
  switch (status) {
    case "resolved": return "default" as const;
    case "handling": return "secondary" as const;
    case "open": return "destructive" as const;
    default: return "outline" as const;
  }
}

function defectStatusLabel(status: string) {
  switch (status) {
    case "resolved": return "已解决";
    case "handling": return "处理中";
    case "open": return "待处理";
    default: return status;
  }
}

export default function QualityPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");

  const filteredInspections = qualityInspectionsMock.filter((qi) => {
    const searchMatch = search
      ? qi.inspectionNo.toLowerCase().includes(search.toLowerCase()) ||
        qi.productName.includes(search)
      : true;
    const typeMatch = typeFilter === "all" ? true : qi.type === typeFilter;
    const resultMatch = resultFilter === "all" ? true : qi.result === resultFilter;
    return searchMatch && typeMatch && resultMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">质量管理</h1>
            <p className="text-sm text-muted-foreground">质检记录和不良品处理</p>
          </div>
          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            新建质检
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">总检次数</p>
              <p className="text-2xl font-bold mt-1">{qualityInspectionsMock.length}</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">合格次数</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600">
                {qualityInspectionsMock.filter((q) => q.result === "pass").length}
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">不合格次数</p>
              <p className="text-2xl font-bold mt-1 text-red-600">
                {qualityInspectionsMock.filter((q) => q.result === "fail").length}
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">待处理缺陷</p>
              <p className="text-2xl font-bold mt-1 text-amber-600">
                {defectRecordsMock.filter((d) => d.status !== "resolved").length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inspections">
          <TabsList>
            <TabsTrigger value="inspections">质检记录</TabsTrigger>
            <TabsTrigger value="defects">不良品记录</TabsTrigger>
          </TabsList>

          {/* Inspections Tab */}
          <TabsContent value="inspections" className="mt-4 space-y-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索质检单号、产品..."
                      className="pl-9"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="检验类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      {INSPECTION_TYPE.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={resultFilter} onValueChange={setResultFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="检验结果" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部结果</SelectItem>
                      {INSPECTION_RESULT.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => { setSearch(""); setTypeFilter("all"); setResultFilter("all"); }}
                  >
                    重置
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  质检记录
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    共 {filteredInspections.length} 条
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">质检单号</TableHead>
                      <TableHead>关联工单</TableHead>
                      <TableHead>产品</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>抽检/合格/不合格</TableHead>
                      <TableHead>结果</TableHead>
                      <TableHead>检验员</TableHead>
                      <TableHead>时间</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInspections.map((qi) => (
                      <TableRow key={qi.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">{qi.inspectionNo}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{qi.workOrderNo}</TableCell>
                        <TableCell>{qi.productName}</TableCell>
                        <TableCell className="text-sm">{getDictLabel(INSPECTION_TYPE, qi.type)}</TableCell>
                        <TableCell className="text-sm">
                          {qi.sampleQty} / <span className="text-emerald-600">{qi.passQty}</span> / <span className="text-red-600">{qi.failQty}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getDictColor(INSPECTION_RESULT, qi.result) as "default" | "secondary" | "destructive" | "outline"}>
                            {getDictLabel(INSPECTION_RESULT, qi.result)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{qi.inspector}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{qi.inspectedAt}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>查看详情</DropdownMenuItem>
                              <DropdownMenuItem>编辑</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    显示 1-{filteredInspections.length} 条，共 {filteredInspections.length} 条
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
          </TabsContent>

          {/* Defects Tab */}
          <TabsContent value="defects" className="mt-4 space-y-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  不良品记录
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    共 {defectRecordsMock.length} 条
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">缺陷编号</TableHead>
                      <TableHead>关联工单</TableHead>
                      <TableHead>产品</TableHead>
                      <TableHead>缺陷类型</TableHead>
                      <TableHead>数量</TableHead>
                      <TableHead>描述</TableHead>
                      <TableHead>处理人</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {defectRecordsMock.map((defect) => (
                      <TableRow key={defect.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">{defect.defectNo}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{defect.workOrderNo}</TableCell>
                        <TableCell>{defect.productName}</TableCell>
                        <TableCell className="text-sm">{defect.defectType}</TableCell>
                        <TableCell className="font-medium text-red-600">{defect.qty}</TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate">{defect.description}</TableCell>
                        <TableCell className="text-muted-foreground">{defect.handler}</TableCell>
                        <TableCell>
                          <Badge variant={defectStatusVariant(defect.status)}>
                            {defectStatusLabel(defect.status)}
                          </Badge>
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
