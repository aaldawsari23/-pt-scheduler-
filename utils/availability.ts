import {
  type Provider,
  type Appointment,
  type Vacation,
  type ExtraCapacity,
  Specialty,
} from '../types';
import { getISODateString } from './dateUtils';

export interface DayAvailability {
  bookedCount: number;
  availableSlots: number;
  totalCapacity: number;
  workingProviders: Provider[];
  isGlobalVacation: boolean;
  globalVacationDescription: string;
}

export const calculateAvailabilityForDay = (
  date: Date,
  providers: Provider[],
  appointments: Appointment[],
  vacations: Vacation[],
  extraCapacities: ExtraCapacity[],
  selectedProviderId: string | null,
  selectedSpecialty: Specialty
): DayAvailability => {
  const dayISO = getISODateString(date);
  const dayOfWeek = date.getDay();

  // Check for a global vacation first
  const globalVacation = vacations.find(v => !v.providerId && dayISO >= v.startDate && dayISO <= v.endDate);
  const isGlobalVacation = !!globalVacation;

  // 1. Filter providers based on the UI selections (a specific provider or a specialty).
  const filteredProviders = providers.filter(p => {
    if (selectedProviderId) return p.id === selectedProviderId;
    if (selectedSpecialty !== Specialty.All) return p.specialty === selectedSpecialty;
    return true; // If no specific provider/specialty, include all.
  });

  // 2. Determine which of the filtered providers are actually working on the given day.
  const workingProviders = filteredProviders.filter(p => {
    if (isGlobalVacation) return false;
    
    const isOnPersonalVacation = vacations.some(v => v.providerId === p.id && dayISO >= v.startDate && dayISO <= v.endDate);
    if (isOnPersonalVacation) return false;
    
    // Provider must be scheduled for this day of the week.
    return p.days.includes(dayOfWeek);
  });

  const workingProviderIds = new Set(workingProviders.map(p => p.id));

  // 3. Count booked appointments for ONLY the providers who are working today.
  const bookedCount = appointments.filter(a =>
    getISODateString(new Date(a.start)) === dayISO &&
    workingProviderIds.has(a.providerId)
  ).length;

  // 4. Calculate the total capacity for ONLY the providers who are working today.
  const totalCapacity = workingProviders.reduce((acc, p) => {
    const extra = extraCapacities.find(e => e.providerId === p.id && e.date === dayISO)?.slots || 0;
    return acc + p.dailyCapacity + extra;
  }, 0);

  // 5. Calculate the number of available slots.
  const availableSlots = Math.max(0, totalCapacity - bookedCount);

  return {
    bookedCount,
    availableSlots,
    totalCapacity,
    workingProviders,
    isGlobalVacation,
    globalVacationDescription: globalVacation?.description || 'إجازة',
  };
};
