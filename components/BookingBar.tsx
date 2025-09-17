import React, { useMemo } from 'react';
import { AppointmentType, Specialty, Provider } from '../types';
import { normalizeArabicDigits } from '../utils/helpers';

interface BookingParams {
  fileNo: string;
  bookingType: AppointmentType;
  specialty: Specialty;
  timeOfDay?: 'morning' | 'afternoon';
  providerId?: string | null;
}

interface BookingBarProps {
    onBook: (params: BookingParams) => void;
    selectedSpecialty: Specialty;
    onSpecialtyChange: (specialty: Specialty) => void;
    fileNo: string;
    onFileNoChange: (value: string) => void;
    providers: Provider[];
    selectedProviderId: string | null;
    onProviderSelect: (id: string | null) => void;
}

const BookingBar: React.FC<BookingBarProps> = ({ 
    onBook, 
    selectedSpecialty, 
    onSpecialtyChange,
    fileNo,
    onFileNoChange,
    providers,
    selectedProviderId,
    onProviderSelect
}) => {
    
    const handleFileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFileNoChange(normalizeArabicDigits(e.target.value));
    };

    const handleBooking = (type: AppointmentType, timeOfDay?: 'morning' | 'afternoon') => {
        onBook({ fileNo, bookingType: type, specialty: selectedSpecialty, timeOfDay, providerId: selectedProviderId });
    };
    
    const bookingTypes = [
        AppointmentType.Nearest,
        AppointmentType.Chronic,
        AppointmentType.Normal,
        AppointmentType.SemiUrgent,
        AppointmentType.Urgent,
    ];
    const specialtyTypes = useMemo(() => Object.values(Specialty).filter(s => s !== Specialty.All), []);

    const filteredProviders = useMemo(() => {
        if (selectedSpecialty === Specialty.All) return providers;
        return providers.filter(p => p.specialty === selectedSpecialty);
    }, [providers, selectedSpecialty]);

    return (
        <div className="p-4 bg-white shadow-md border-b border-slate-200 no-print space-y-4">
            {/* Top Row: File No & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
                <div className="relative w-full md:w-56">
                     <label htmlFor="fileNoInput" className="absolute -top-2.5 right-3 px-1 bg-white text-xs font-medium text-slate-500">رقم الملف</label>
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute start-3 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                    <input
                        id="fileNoInput"
                        type="text"
                        placeholder="أدخل رقم الملف..."
                        value={fileNo}
                        onChange={handleFileNoChange}
                        className="p-3 ps-11 border-2 border-slate-300 rounded-lg w-full bg-slate-50 text-center font-bold text-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                    />
                </div>
                
                <div className="flex-grow flex items-center gap-2 border-2 border-slate-200 rounded-lg p-2 bg-slate-50">
                    <span className="font-semibold text-slate-600 pl-2">التخصص:</span>
                    {specialtyTypes.map(spec => (
                        <button 
                            key={spec}
                            onClick={() => onSpecialtyChange(spec === selectedSpecialty ? Specialty.All : spec)}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${selectedSpecialty === spec ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 bg-white hover:bg-slate-200'}`}
                        >
                            {spec}
                        </button>
                    ))}
                </div>
            </div>
            {/* Second Row: Provider and Actions */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-grow-[3] flex items-center gap-2 border-2 border-slate-200 rounded-lg p-2 bg-slate-50 flex-wrap">
                    <span className="font-semibold text-slate-600 pl-2">المعالج:</span>
                     <button 
                        onClick={() => onProviderSelect(null)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${!selectedProviderId ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
                    >
                        الكل (توزيع)
                    </button>
                    {filteredProviders.map(provider => (
                        <button 
                            key={provider.id}
                            onClick={() => onProviderSelect(provider.id)}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${selectedProviderId === provider.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
                        >
                            {provider.name}
                        </button>
                    ))}
                </div>
                <div className="flex-grow-[2] flex items-center gap-2 border-2 border-slate-200 rounded-lg p-2 bg-slate-50 flex-wrap justify-center">
                    {bookingTypes.map(type => (
                        <button key={type} onClick={() => handleBooking(type)} className={typeStyles[type].classes}> {typeStyles[type].icon} <span>{type}</span> </button>
                    ))}
                    <div className="border-l border-slate-300 h-8 mx-2"></div>
                    <button onClick={() => handleBooking(AppointmentType.Normal, 'morning')} className="p-2.5 rounded-lg bg-white hover:bg-amber-100 border border-slate-300" title="حجز في الفترة الصباحية">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-.707 7.072l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
                    </button>
                    <button onClick={() => handleBooking(AppointmentType.Normal, 'afternoon')} className="p-2.5 rounded-lg bg-white hover:bg-indigo-100 border border-slate-300" title="حجز في الفترة المسائية">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

const iconProps = { className: "h-4 w-4", fill:"currentColor", viewBox:"0 0 20 20"};
const baseButtonClasses = "flex-grow sm:flex-grow-0 px-3 py-2 text-sm font-semibold text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 hover:-translate-y-px flex items-center justify-center gap-1.5 transition-transform";

const typeStyles: Record<AppointmentType, {classes: string, icon: JSX.Element}> = {
    [AppointmentType.Normal]: { classes: `${baseButtonClasses} bg-sky-600 hover:bg-sky-700 focus:ring-sky-500`, icon: <svg {...iconProps}><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg> },
    [AppointmentType.SemiUrgent]: { classes: `${baseButtonClasses} bg-sky-600 hover:bg-sky-700 focus:ring-sky-500`, icon: <svg {...iconProps}><path fillRule="evenodd" d="M8.257 3.099c.636-1.214 2.37-1.214 3.006 0l4.312 8.216c.63 1.202-.27 2.685-1.503 2.685H5.448c-1.233 0-2.133-1.483-1.503-2.685l4.312-8.216zM9 11a1 1 0 112 0v1a1 1 0 11-2 0v-1zm1-4a1 1 0 00-1 1v2a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg> },
    [AppointmentType.Urgent]: { classes: `${baseButtonClasses} bg-sky-600 hover:bg-sky-700 focus:ring-sky-500`, icon: <svg {...iconProps}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 102 0V5zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg> },
    [AppointmentType.Chronic]: { classes: `${baseButtonClasses} bg-sky-600 hover:bg-sky-700 focus:ring-sky-500`, icon: <svg {...iconProps}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg> },
    [AppointmentType.Nearest]: { classes: `${baseButtonClasses} bg-blue-700 hover:bg-blue-800 focus:ring-blue-600`, icon: <svg {...iconProps}><path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" /><path fillRule="evenodd" d="M10.5 5.5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3h-3a1 1 0 110-2h3v-3a1 1 0 011-1z" clipRule="evenodd" /></svg> },
};

export default BookingBar;