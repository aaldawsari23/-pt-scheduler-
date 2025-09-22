import { Specialty, type Provider, type Settings } from './types';

export const INITIAL_PROVIDERS: Provider[] = [
  { id: '1', name: 'عريز', specialty: Specialty.MSK, days: [0], dailyCapacity: 4, isNewPatientProvider: false, newPatientQuota: 0, slug: 'ariz' }, // Sunday
  { id: '2', name: 'عجيم', specialty: Specialty.MSK, days: [1], dailyCapacity: 4, isNewPatientProvider: false, newPatientQuota: 0, slug: 'ajim' }, // Monday
  { id: '3', name: 'بناوي', specialty: Specialty.MSK, days: [2], dailyCapacity: 4, isNewPatientProvider: false, newPatientQuota: 0, slug: 'banawee' }, // Tuesday
  { id: '4', name: 'سعد', specialty: Specialty.Neuro, days: [3], dailyCapacity: 4, isNewPatientProvider: false, newPatientQuota: 0, slug: 'saad' }, // Wednesday
  { id: '5', name: 'محمد يوسف', specialty: Specialty.PT_Service, days: [0, 1, 2, 3], dailyCapacity: 2, isNewPatientProvider: true, newPatientQuota: 2, slug: 'mohamed_youssef' },
  { id: '6', name: 'خالد العماري', specialty: Specialty.PT_Service, days: [0, 1, 2, 3], dailyCapacity: 1, isNewPatientProvider: true, newPatientQuota: 1, slug: 'khaled_alamari' },
];

export const INITIAL_SETTINGS: Settings = {
  pin: null, // No PIN initially
  urgentReserve: true,
  emergencySlotCode: null,
  followUp3wWeeks: 3,
  followUp1mMonths: 1,
  urgentDaysAhead: 1,
  semiUrgentDaysAhead: 3,
  normalDaysAhead: 30,
  chronicWeeksAhead: 8,
  blockWeekends: true, // For Saturday
  blockFridays: true,  // For Friday
  morningStartHour: 8,
  morningEndHour: 12,
  afternoonStartHour: 12,
  afternoonEndHour: 15.5,
};

export const WORK_HOURS = {
  start: 8.25, // From 8:15 AM
  end: 15.5, // 3:30 PM
  morningEnd: 12,
};

export const SLOT_DURATION_MINUTES = 15;

export const ASEER_LOGO_URL = "/logo.png";