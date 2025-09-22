
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

// lightweight time helpers used by BookingBar and others
export type SlotGenOpts = { start: string; end: string; stepMinutes?: number };

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function fromMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${pad(h)}:${pad(m)}`;
}

export function formatSlot(hhmm: string): string {
  // 24h "13:30" -> "1:30 PM"
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = ((h + 11) % 12) + 1;
  return `${hour12}:${pad(m)} ${suffix}`;
}

export function generateTimeSlots({ start, end, stepMinutes = 15 }: SlotGenOpts): string[] {
  const out: string[] = [];
  let t = toMinutes(start);
  const stop = toMinutes(end);
  while (t <= stop) {
    out.push(fromMinutes(t));
    t += stepMinutes;
  }
  return out;
}