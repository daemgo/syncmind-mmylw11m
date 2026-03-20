export type WorkOrderStatus =
  | "pending"
  | "in_progress"
  | "paused"
  | "completed"
  | "closed";

export type WorkOrderPriority = "urgent" | "high" | "normal" | "low";

export interface WorkOrder {
  id: string;
  orderNo: string;
  productName: string;
  productCode: string;
  plannedQty: number;
  completedQty: number;
  defectQty: number;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  workshop: string;
  line: string;
  assignee: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  createdAt: string;
}
