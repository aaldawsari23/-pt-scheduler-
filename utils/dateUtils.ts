
export const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay(); // Sunday - 0, Monday - 1
  const diff = d.getDate() - day; // Adjust to Sunday
  return new Date(d.setDate(diff));
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7);
};

export const addMonths = (date: Date, months: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

/**
 * Returns a date string in 'YYYY-MM-DD' format based on the user's LOCAL timezone.
 * This fixes timezone bugs where a local date could be converted to the previous day in UTC.
 */
export const getISODateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date to a Gregorian date string using the 'ar-SA' locale.
 * Forces the Gregorian calendar and Latin numerals to avoid environment-specific defaults.
 */
export const toGregorianDateString = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        calendar: 'gregory',
        numberingSystem: 'latn',
        ...options,
    };
    try {
        const formatter = new Intl.DateTimeFormat('ar-SA', defaultOptions);
        return formatter.format(date);
    } catch (e) {
        console.error("Gregorian date formatting with 'ar-SA' locale failed. Using manual fallback.", e);
        // Fallback to a robust, manual, universally-compatible format (YYYY-MM-DD)
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

/**
 * Formats a date to a Gregorian date-time string using the 'ar-SA' locale.
 * Forces the Gregorian calendar and Latin numerals to avoid environment-specific defaults.
 */
export const toGregorianDateTimeString = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        calendar: 'gregory',
        numberingSystem: 'latn',
        ...options
    };
    try {
        const formatter = new Intl.DateTimeFormat('ar-SA', defaultOptions);
        return formatter.format(date).replace('،', ''); // remove comma between date and time
    } catch (e) {
        console.error("Gregorian date-time formatting with 'ar-SA' locale failed. Using manual fallback.", e);
        // Fallback to a robust, manual, universally-compatible format (YYYY-MM-DD HH:mm)
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
}

/**
 * Formats a date to a Gregorian time string using the 'ar-SA' locale.
 * Forces Latin numerals for consistency.
 */
export const toGregorianTimeString = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        numberingSystem: 'latn',
        ...options,
    };
    try {
        const formatter = new Intl.DateTimeFormat('ar-SA', defaultOptions);
        return formatter.format(date);
    } catch (e) {
        console.error("Gregorian time formatting with ar-SA locale failed.", e);
        return new Intl.DateTimeFormat('en-GB', { // en-GB is a good fallback for 24hr HH:MM format
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    }
}


export const areDatesOnSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const toHijriDateString = (date: Date): string => {
  try {
    // Using `islamic-umalqura` is often preferred for Saudi Arabia.
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return formatter.format(date);
  } catch (error) {
    console.warn("Umm al-Qura calendar not supported, falling back.", error);
    try {
        const fallbackFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        return fallbackFormatter.format(date);
    } catch (fallbackError) {
        console.error("Hijri date formatting is not supported in this environment.", fallbackError);
        return "";
    }
  }
};