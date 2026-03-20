export type EquipmentStatus =
  | "running"
  | "idle"
  | "maintenance"
  | "fault"
  | "offline";

export interface Equipment {
  id: string;
  code: string;
  name: string;
  model: string;
  workshop: string;
  line: string;
  status: EquipmentStatus;
  oee: number;
  runHours: number;
  lastMaintenance: string;
  nextMaintenance: string;
  purchaseDate: string;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: "preventive" | "corrective" | "emergency";
  description: string;
  operator: string;
  startTime: string;
  endTime?: string;
  status: "planned" | "in_progress" | "completed";
  cost: number;
}
