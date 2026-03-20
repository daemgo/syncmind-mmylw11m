"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  AlertTriangle,
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

import { materialsMock, materialTransactionsMock } from "@/mock/materials";
import {
  MATERIAL_TYPE,
  TRANSACTION_TYPE,
  WAREHOUSES,
  getDictLabel,
  getDictColor,
} from "@/lib/dict";

export default function MaterialsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [warehouseFilter, setWarehouseFilter] = useState("all");

  const filteredMaterials = materialsMock.filter((m) => {
    const searchMatch = search
      ? m.name.includes(search) || m.code.toLowerCase().includes(search.toLowerCase())
      : true;
    const typeMatch = typeFilter === "all" ? true : m.type === typeFilter;
    const whMatch = warehouseFilter === "all" ? true : m.warehouse === warehouseFilter;
    return searchMatch && typeMatch && whMatch;
  });

  const lowStockCount = materialsMock.filter(
    (m) => m.currentQty <= m.safetyStock
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">物料管理</h1>
          <p className="text-sm text-muted-foreground">库存查询、出入库记录</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">物料总数</p>
              <p className="text-2xl font-bold mt-1">{materialsMock.length}</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">原材料</p>
              <p className="text-2xl font-bold mt-1">
                {materialsMock.filter((m) => m.type === "raw").length}
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">成品</p>
              <p className="text-2xl font-bold mt-1">
                {materialsMock.filter((m) => m.type === "finished").length}
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                库存预警
              </p>
              <p className="text-2xl font-bold mt-1 text-amber-600">{lowStockCount}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory">
          <TabsList>
            <TabsTrigger value="inventory">库存查询</TabsTrigger>
            <TabsTrigger value="transactions">出入库记录</TabsTrigger>
          </TabsList>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="mt-4 space-y-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索物料名称、编码..."
                      className="pl-9"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="物料类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      {MATERIAL_TYPE.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="仓库" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部仓库</SelectItem>
                      {WAREHOUSES.map((wh) => (
                        <SelectItem key={wh} value={wh}>{wh}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => { setSearch(""); setTypeFilter("all"); setWarehouseFilter("all"); }}
                  >
                    重置
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  库存列表
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    共 {filteredMaterials.length} 条
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[130px]">物料编码</TableHead>
                      <TableHead>名称</TableHead>
                      <TableHead>规格</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>仓库/库位</TableHead>
                      <TableHead className="text-right">当前库存</TableHead>
                      <TableHead className="text-right">安全库存</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map((m) => {
                      const isLow = m.currentQty <= m.safetyStock;
                      return (
                        <TableRow key={m.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">{m.code}</TableCell>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{m.spec}</TableCell>
                          <TableCell className="text-sm">{getDictLabel(MATERIAL_TYPE, m.type)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {m.warehouse} · {m.location}
                          </TableCell>
                          <TableCell className={`text-right font-medium ${isLow ? "text-red-600" : ""}`}>
                            {m.currentQty} {m.unit}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {m.safetyStock} {m.unit}
                          </TableCell>
                          <TableCell>
                            {isLow ? (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                低库存
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">正常</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>查看详情</DropdownMenuItem>
                                <DropdownMenuItem>入库</DropdownMenuItem>
                                <DropdownMenuItem>出库</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    显示 1-{filteredMaterials.length} 条，共 {filteredMaterials.length} 条
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

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-4 space-y-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  出入库记录
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    共 {materialTransactionsMock.length} 条
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">单据号</TableHead>
                      <TableHead>物料编码</TableHead>
                      <TableHead>物料名称</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead className="text-right">数量</TableHead>
                      <TableHead>仓库</TableHead>
                      <TableHead>关联工单</TableHead>
                      <TableHead>操作人</TableHead>
                      <TableHead>时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materialTransactionsMock.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">{tx.transactionNo}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{tx.materialCode}</TableCell>
                        <TableCell>{tx.materialName}</TableCell>
                        <TableCell>
                          <Badge variant={getDictColor(TRANSACTION_TYPE, tx.type) as "default" | "secondary" | "destructive" | "outline"}>
                            {getDictLabel(TRANSACTION_TYPE, tx.type)}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${tx.type === "out" ? "text-red-600" : "text-emerald-600"}`}>
                          {tx.type === "out" ? "-" : "+"}{tx.qty}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{tx.warehouse}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {tx.relatedOrder || "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{tx.operator}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{tx.createdAt}</TableCell>
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
