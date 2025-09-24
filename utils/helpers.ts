

import { type Settings } from '../types';
import { SLOT_DURATION_MINUTES } from '../constants';
import { toGregorianTimeString } from './dateUtils';


export const normalizeArabicDigits = (str: string): string => {
  if (!str) return '';
  const arabicDigits: { [key: string]: string } = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  };
  return str.replace(/[٠-٩]/g, (match) => arabicDigits[match]);
};

export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const transliterate = (text: string): string => {
    const map: {[key: string]: string} = {
        'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'a',
        'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
        'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh',
        'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
        'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z',
        'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
        'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
        'ه': 'h', 'ة': 'a', 'و': 'w', 'ؤ': 'u',
        'ي': 'y', 'ئ': 'e', 'ى': 'a',
        ' ': '_'
    };
    return text.toLowerCase().split('').map(char => map[char] || char).join('');
};

export const exportToJson = (data: unknown, filename: string) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${filename}.json`;
    link.click();
};

export const exportToCsv = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row => 
            headers.map(fieldName => 
                JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)
            ).join(',')
        )
    ];
    const csvString = csvRows.join('\r\n');
    const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const generateTimeSlots = (settings: Settings): string[] => {
    const slots: string[] = [];
    const { morningStartHour, morningEndHour, afternoonStartHour, afternoonEndHour } = settings;
    const slotIncrement = SLOT_DURATION_MINUTES / 60;

    // Morning slots
    for (let h = morningStartHour; h < morningEndHour; h += slotIncrement) {
        const hour = Math.floor(h);
        const minute = Math.round((h % 1) * 60);
        if (minute < 60) {
            const d = new Date();
            d.setHours(hour, minute, 0, 0);
            slots.push(toGregorianTimeString(d));
        }
    }

    // Afternoon slots
    for (let h = afternoonStartHour; h < afternoonEndHour; h += slotIncrement) {
        const hour = Math.floor(h);
        const minute = Math.round((h % 1) * 60);
         if (minute < 60) {
            const d = new Date();
            d.setHours(hour, minute, 0, 0);
            slots.push(toGregorianTimeString(d));
        }
    }
    return [...new Set(slots)]; // Remove duplicates in case of overlapping shifts
};
