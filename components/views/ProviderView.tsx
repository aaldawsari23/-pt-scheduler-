import { Appointment, Settings } from '../../types';
import { getISODateString } from '../../utils/dateUtils';
import { generateTimeSlots } from '../../utils/helpers';

export const findNextAvailableSlot = (providerId: string, date: Date, appointments: Appointment[], settings: Settings): string | null => {
    const dateISO = getISODateString(date);
    
    const allSlots = generateTimeSlots(settings);

    const bookedSlots = new Set(appointments
        .filter(a => a.providerId === providerId && getISODateString(new Date(a.start)) === dateISO)
        .map(a => new Date(a.start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })));
    
    const availableSlot = allSlots.find(slot => !bookedSlots.has(slot));

    return availableSlot || null;
}
