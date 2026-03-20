// MES system data dictionaries

export const WORK_ORDER_STATUS = [
  { label: "待生产", value: "pending", color: "outline" },
  { label: "生产中", value: "in_progress", color: "secondary" },
  { label: "已暂停", value: "paused", color: "destructive" },
  { label: "已完成", value: "completed", color: "default" },
  { label: "已关闭", value: "closed", color: "outline" },
] as const;

export const WORK_ORDER_PRIORITY = [
  { label: "紧急", value: "urgent", color: "destructive" },
  { label: "高", value: "high", color: "secondary" },
  { label: "普通", value: "normal", color: "outline" },
  { label: "低", value: "low", color: "outline" },
] as const;

export const EQUIPMENT_STATUS = [
  { label: "运行中", value: "running", color: "default" },
  { label: "空闲", value: "idle", color: "secondary" },
  { label: "维护中", value: "maintenance", color: "outline" },
  { label: "故障", value: "fault", color: "destructive" },
  { label: "离线", value: "offline", color: "outline" },
] as const;

export const INSPECTION_RESULT = [
  { label: "合格", value: "pass", color: "default" },
  { label: "不合格", value: "fail", color: "destructive" },
  { label: "待检", value: "pending", color: "outline" },
] as const;

export const INSPECTION_TYPE = [
  { label: "来料检", value: "incoming" },
  { label: "过程检", value: "process" },
  { label: "终检", value: "final" },
] as const;

export const MATERIAL_TYPE = [
  { label: "原材料", value: "raw" },
  { label: "半成品", value: "semi" },
  { label: "成品", value: "finished" },
  { label: "辅料", value: "auxiliary" },
] as const;

export const TRANSACTION_TYPE = [
  { label: "入库", value: "in", color: "default" },
  { label: "出库", value: "out", color: "secondary" },
  { label: "调拨", value: "transfer", color: "outline" },
  { label: "调整", value: "adjust", color: "outline" },
] as const;

export const WORKSHOPS = [
  "一车间",
  "二车间",
  "三车间",
] as const;

export const PRODUCTION_LINES = [
  "A线",
  "B线",
  "C线",
  "D线",
] as const;

export const WAREHOUSES = [
  "原料库",
  "半成品库",
  "成品库",
] as const;

export function getDictLabel(
  dict: readonly { label: string; value: string }[],
  value: string
): string {
  return dict.find((d) => d.value === value)?.label ?? value;
}

export function getDictColor(
  dict: readonly { label: string; value: string; color?: string }[],
  value: string
): string {
  return (dict.find((d) => d.value === value) as { color?: string } | undefined)?.color ?? "outline";
}
