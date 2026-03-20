export type MaterialType = "raw" | "semi" | "finished" | "auxiliary";

export type TransactionType = "in" | "out" | "transfer" | "adjust";

export interface Material {
  id: string;
  code: string;
  name: string;
  spec: string;
  unit: string;
  type: MaterialType;
  warehouse: string;
  location: string;
  currentQty: number;
  safetyStock: number;
  lastUpdated: string;
}

export interface MaterialTransaction {
  id: string;
  transactionNo: string;
  materialCode: string;
  materialName: string;
  type: TransactionType;
  qty: number;
  warehouse: string;
  relatedOrder?: string;
  operator: string;
  createdAt: string;
  remark?: string;
}
