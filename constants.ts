import { Appointment, AppointmentType, Specialty, type Provider, type Settings } from './types';

export const SLOT_DURATION_MINUTES = 15;

export const INITIAL_PROVIDERS: Provider[] = [
  { id: '1', name: 'أريز', specialty: Specialty.MSK, days: [0], dailyCapacity: 4, isNewPatientProvider: false, newPatientQuota: 0, slug: 'ariz' }, // Sunday
  { id: '2', name: 'عبدالكريم ال عجيم', specialty: Specialty.MSK, days: [1], dailyCapacity: 4, isNewPatientProvider: false, newPatientQuota: 0, slug: 'abdulkarim_al_ajim' }, // Monday
  { id: '3', name: 'محمد الناوي', specialty: Specialty.MSK, days: [2], dailyCapacity: 4, isNewPatientProvider: false, newPatientQuota: 0, slug: 'mohammed_alnavi' }, // Tuesday
  { id: '4', name: 'سعد القحطاني', specialty: Specialty.Neuro, days: [3], dailyCapacity: 4, isNewPatientProvider: false, newPatientQuota: 0, slug: 'saad_alqahtani' }, // Wednesday
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


const generateInitialAppointments = (): Appointment[] => {
    const appointmentsData: [string, string, string, string][] = [
        ['46-1', 'AARIZ', '2025-09-28', '08:15'], ['46-2', 'AARIZ', '2025-09-28', '10:00'], ['46-3', 'AARIZ', '2025-09-28', '13:00'], ['46-4', 'AARIZ', '2025-09-28', '14:00'],
        ['46-5', 'AARIZ', '2025-10-05', '08:15'], ['46-6', 'AARIZ', '2025-10-05', '10:00'], ['46-7', 'AARIZ', '2025-10-05', '13:00'], ['46-8', 'AARIZ', '2025-10-05', '14:00'],
        ['46-9', 'AARIZ', '2025-10-12', '08:15'], ['46-10', 'AARIZ', '2025-10-12', '10:00'], ['46-11', 'AARIZ', '2025-10-12', '13:00'], ['46-12', 'AARIZ', '2025-10-12', '14:00'],
        ['46-13', 'AARIZ', '2025-10-19', '08:15'], ['46-14', 'AARIZ', '2025-10-19', '10:00'], ['46-15', 'AARIZ', '2025-10-19', '13:00'], ['46-16', 'AARIZ', '2025-10-19', '14:00'],
        ['46-17', 'AARIZ', '2025-10-26', '08:15'],
        ['46-18', 'ALOJAM', '2025-09-29', '08:15'], ['46-19', 'ALOJAM', '2025-09-29', '10:00'], ['46-20', 'ALOJAM', '2025-09-29', '13:00'], ['46-21', 'ALOJAM', '2025-09-29', '14:00'],
        ['46-22', 'ALOJAM', '2025-10-06', '08:15'], ['46-23', 'ALOJAM', '2025-10-06', '10:00'], ['46-24', 'ALOJAM', '2025-10-06', '13:00'], ['46-25', 'ALOJAM', '2025-10-06', '14:00'],
        ['46-26', 'ALOJAM', '2025-10-13', '08:15'], ['46-27', 'ALOJAM', '2025-10-13', '10:00'], ['46-28', 'ALOJAM', '2025-10-13', '13:00'], ['46-29', 'ALOJAM', '2025-10-13', '14:00'],
        ['46-30', 'ALOJAM', '2025-10-20', '08:15'], ['46-31', 'ALOJAM', '2025-10-20', '10:00'], ['46-32', 'ALOJAM', '2025-10-20', '13:00'], ['46-33', 'ALOJAM', '2025-10-20', '14:00'],
        ['46-34', 'ALOJAM', '2025-10-27', '08:15'], ['46-35', 'ALOJAM', '2025-10-27', '10:00'],
        ['46-36', 'BANAWI', '2025-09-30', '08:15'], ['46-37', 'BANAWI', '2025-09-30', '10:00'], ['46-38', 'BANAWI', '2025-09-30', '13:00'], ['46-39', 'BANAWI', '2025-09-30', '14:00'],
        ['46-40', 'BANAWI', '2025-10-07', '08:15'], ['46-41', 'BANAWI', '2025-10-07', '10:00'], ['46-42', 'BANAWI', '2025-10-07', '13:00'], ['46-43', 'BANAWI', '2025-10-07', '14:00'],
        ['46-44', 'BANAWI', '2025-10-14', '08:15'], ['46-45', 'BANAWI', '2025-10-14', '10:00'], ['46-46', 'BANAWI', '2025-10-14', '13:00'], ['46-47', 'BANAWI', '2025-10-14', '14:00'],
        ['46-48', 'BANAWI', '2025-10-21', '08:15'], ['46-49', 'BANAWI', '2025-10-21', '10:00'], ['46-50', 'BANAWI', '2025-10-21', '13:00'], ['46-51', 'BANAWI', '2025-10-21', '14:00'],
        ['46-52', 'BANAWI', '2025-10-28', '08:15'], ['46-53', 'BANAWI', '2025-10-28', '10:00'],
        ['46-54', 'SAAD Q', '2025-10-01', '08:15'], ['46-55', 'SAAD Q', '2025-10-01', '10:00'], ['46-56', 'SAAD Q', '2025-10-01', '13:00'],
    ];

    const providerMap: {[key: string]: string} = {
        'AARIZ': '1', // أريز
        'ALOJAM': '2', // عبدالكريم ال عجيم
        'BANAWI': '3', // محمد الناوي
        'SAAD Q': '4' // سعد القحطاني
    };
    
    const now = new Date('2024-07-30T10:00:00Z').toISOString();

    return appointmentsData.map(([fileNo, therapist, date, time], index): Appointment => {
        // Create date as if we are in KSA (UTC+3) and get the correct UTC ISO string
        const start = new Date(`${date}T${time}:00+03:00`);
        const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60000);

        return {
            id: `seed-${index + 1}`,
            fileNo,
            providerId: providerMap[therapist],
            start: start.toISOString(),
            end: end.toISOString(),
            type: AppointmentType.Normal,
            createdAt: now
        };
    });
};

export const INITIAL_APPOINTMENTS: Appointment[] = generateInitialAppointments();


export const WORK_HOURS = {
  start: 8.25, // From 8:15 AM
  end: 15.5, // 3:30 PM
  morningEnd: 12,
};

// ---- Scheduler day window (Sun–Thu) ----
// 15-min slots from 08:00 to 15:30 inclusive
export const WORK_START = "08:00";
export const WORK_END = "15:30";
export const SLOT_MINUTES = 15;

export const DAYS_OPEN = [0,1,2,3,4]; // 0=Sun ... 6=Sat  (adjust if needed)
