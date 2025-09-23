export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

export enum ViewType {
  Day = 'day',
  Week = 'week',
  Month = 'month',
}

export enum AppointmentType {
  Normal = 'اعتيادي',
  SemiUrgent = 'شبه عاجل',
  Urgent = 'عاجل',
  Chronic = 'مزمن',
  Nearest = 'أقرب موعد',
}

export enum Specialty {
  All = 'الكل',
  MSK = 'MSK',
  Neuro = 'Neuro',
  PT_Service = 'PT-Service',
}

export interface Provider {
  id: string;
  name: string;
  specialty: Specialty;
  days: number[]; // 0 for Sunday, 1 for Monday, etc.
  dailyCapacity: number;
  isNewPatientProvider: boolean;
  newPatientQuota: number; // Max new patients per day
  slug: string; // Latin slug for exports
}

export interface Appointment {
  id: string;
  fileNo: string;
  providerId: string;
  start: string; // ISO string
  end: string; // ISO string
  type: AppointmentType;
  createdAt: string; // ISO string
}

export interface Vacation {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  providerId?: string | null; // null or undefined for global
  description: string;
}

export interface TimeOff {
  id: string;
  providerId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  description: string;
}

export interface ExtraCapacity {
  id: string;
  providerId: string;
  date: string; // YYYY-MM-DD
  slots: number;
}

export interface Settings {
  pin: string | null; // A simple hash
  urgentReserve: boolean; // Toggle for 1 urgent slot per provider
  emergencySlotCode: string | null;
  followUp3wWeeks: number;
  followUp1mMonths: number;
  // Advanced booking rules
  urgentDaysAhead: number;
  semiUrgentDaysAhead: number;
  normalDaysAhead: number;
  chronicWeeksAhead: number;
  blockWeekends: boolean; // For Saturday (day 6)
  blockFridays: boolean; // For Friday (day 5)
  morningStartHour: number;
  morningEndHour: number;
  afternoonStartHour: number;
  afternoonEndHour: number;
}

export interface SlotLock {
  [slotId: string]: string; // key: `${providerId}_${isoDateString}`, value: code
}

// === Audit Log (سجل العمليات) ===
export enum AuditAction {
  Create = 'create',
  Cancel = 'cancel',
  SettingsChange = 'settings_change',
}

export interface AuditEntry {
  id: string;
  action: AuditAction;
  timestamp: string; // ISO
  fileNo: string;
  providerId?: string;
  providerName?: string;
  start?: string; // ISO
  end?: string; // ISO
  details?: string; // نص إضافي (نوع الموعد مثلاً)
}

// === Emergency Log (سجل الطوارئ) ===
export interface EmergencyLogEntry {
  id: string;
  timestamp: string; // ISO
  fileNo: string;
  providerId: string;
  providerName: string;
  appointmentStart: string; // ISO
}
