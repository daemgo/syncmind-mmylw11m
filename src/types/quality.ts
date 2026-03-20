export type InspectionResult = "pass" | "fail" | "pending";

export type InspectionType = "incoming" | "process" | "final";

export interface QualityInspection {
  id: string;
  inspectionNo: string;
  workOrderNo: string;
  productName: string;
  type: InspectionType;
  sampleQty: number;
  passQty: number;
  failQty: number;
  result: InspectionResult;
  inspector: string;
  inspectedAt: string;
  defectTypes?: string[];
  remark?: string;
}

export interface DefectRecord {
  id: string;
  defectNo: string;
  workOrderNo: string;
  productName: string;
  defectType: string;
  qty: number;
  description: string;
  handler: string;
  status: "open" | "handling" | "resolved";
  createdAt: string;
}
