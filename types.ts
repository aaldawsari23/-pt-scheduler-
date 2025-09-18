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
  id:string;
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
  bookingLocked: boolean;
  bookingLockDate: string | null; // YYYY-MM-DD
  urgentReserve: boolean; // Toggle for 1 urgent slot per provider
  emergencySlotCode: string | null;
  followUp3wWeeks: number;
  followUp1mMonths: number;
  customLogoB64: string | null; // To store user-uploaded logo
  language: 'ar' | 'en';
  // Advanced booking rules
  urgentDaysAhead: number;
  semiUrgentDaysAhead: number;
  normalDaysAhead: number;
  chronicWeeksAhead: number;
  blockWeekends: boolean;
  blockFridays: boolean;
  morningStartHour: number;
  morningEndHour: number;
  afternoonStartHour: number;
  afternoonEndHour: number;
  autoDistributeBookings: boolean;
  hideOutsideMonthDays: boolean;
}

export interface SlotLock {
  [slotId: string]: string; // key: `${providerId}_${isoDateString}`, value: code
}

export interface HepExercise {
  name: string;
  description: string[];
  image: string; // Base64 encoded SVG/PNG - stored in localStorage
}

export interface HepContent {
  id: string;
  navTitle: string;
  title: string;
  tipsTitle: string;
  tips: string[];
  exercises: HepExercise[];
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
  timestamp: string;         // ISO
  fileNo: string;
  providerId?: string;
  providerName?: string;
  start?: string;            // ISO
  end?: string;              // ISO
  details?: string;          // نص إضافي (نوع الموعد مثلاً)
}

export interface ManualBookingDefaults {
  providerId?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm
  type?: AppointmentType;
}