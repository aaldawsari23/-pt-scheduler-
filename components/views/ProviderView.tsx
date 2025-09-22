import { Appointment } from '../../types';
import { WORK_HOURS, SLOT_DURATION_MINUTES } from '../../constants';
import { getISODateString, toGregorianTimeString } from '../../utils/dateUtils';

export const findNextAvailableSlot = (providerId: string, date: Date, appointments: Appointment[]): string | null => {
    const dateISO = getISODateString(date);
    
    const allSlots: string[] = [];
    for (let hour = WORK_HOURS.start; hour < WORK_HOURS.end; hour += SLOT_DURATION_MINUTES / 60) {
        const d = new Date();
        d.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
        allSlots.push(toGregorianTimeString(d));
    }

    const bookedSlots = appointments
        .filter(a => a.providerId === providerId && getISODateString(new Date(a.start)) === dateISO)
        .map(a => toGregorianTimeString(new Date(a.start)));
    
    const availableSlot = allSlots.find(slot => !bookedSlots.includes(slot));

    return availableSlot || null;
}