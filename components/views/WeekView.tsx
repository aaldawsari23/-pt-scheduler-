import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { addDays, getISODateString, toGregorianTimeString, toHijriDateString, toGregorianDateString } from '../../utils/dateUtils';
import { Specialty, type Provider, type Appointment, AppointmentType, AuditAction, type Settings } from '../../types';
import { generateUniqueId, normalizeArabicDigits } from '../../utils/helpers';
import { SLOT_DURATION_MINUTES } from '../../constants';


// ====================================================================================
//  HELPER FUNCTIONS & SHARED COMPONENTS
// ====================================================================================

const getAppointmentColor = (type: AppointmentType) => {
    switch(type) {
        case AppointmentType.Urgent: return { bg: 'bg-red-500', border: 'border-red-700', text: 'text-white' };
        case AppointmentType.SemiUrgent: return { bg: 'bg-amber-500', border: 'border-amber-700', text: 'text-white' };
        case AppointmentType.Chronic: return { bg: 'bg-purple-500', border: 'border-purple-700', text: 'text-white' };
        default: return { bg: 'bg-green-500', border: 'border-green-700', text: 'text-white' };
    }
}

const generateTimeSlots = (settings: Settings): string[] => {
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

// ====================================================================================
//  INTERNAL UI COMPONENTS
// ====================================================================================

const AppointmentCard: React.FC<{ appointment: Appointment; onClick: () => void }> = ({ appointment, onClick }) => {
    const colors = getAppointmentColor(appointment.type);
    return (
        <div onClick={onClick} className={`p-2 rounded-lg shadow-sm ${colors.bg} ${colors.border} ${colors.text} cursor-pointer hover:opacity-90 transition-opacity`}>
            <div className="flex justify-between items-baseline">
                <span className="font-bold text-base">{appointment.fileNo}</span>
                <span className="text-xs font-mono">{toGregorianTimeString(new Date(appointment.start))}</span>
            </div>
            <div className="text-xs opacity-90 mt-1 truncate">{appointment.type}</div>
        </div>
    );
};

const EditingSlot: React.FC<{ time: string; onSave: (fileNo: string) => void; onCancel: () => void; }> = ({ time, onSave, onCancel }) => {
    const [fileNo, setFileNo] = useState('');
    const handleSave = () => { if (fileNo.trim()) onSave(fileNo.trim()); };

    return (
        <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-400 shadow-lg animate-fadeIn col-span-2">
            <div className="text-center font-bold text-blue-800 mb-2 font-mono">{time}</div>
            <input
                type="text"
                value={fileNo}
                onChange={(e) => setFileNo(normalizeArabicDigits(e.target.value))}
                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                placeholder="رقم الملف..."
                className="w-full px-2 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 text-center"
                autoFocus
            />
            <div className="flex gap-2 mt-2">
                <button onClick={handleSave} className="flex-1 bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-blue-700">تأكيد</button>
                <button onClick={onCancel} className="flex-1 bg-slate-200 text-slate-700 text-sm px-3 py-1.5 rounded-md hover:bg-slate-300">إلغاء</button>
            </div>
        </div>
    );
};

const AvailableSlotGridItem: React.FC<{ time: string; onClick: () => void }> = ({ time, onClick }) => (
    <button onClick={onClick} className="w-full text-center p-2 rounded-md bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700 border border-transparent hover:border-blue-300 transition-all font-mono text-xs">
        {time}
    </button>
);


const ProviderColumn: React.FC<{
    provider: Provider;
    day: Date;
    timeSlots: string[];
    bookingState: { providerId: string; dayISO: string } | null;
    setBookingState: (state: { providerId: string; dayISO: string } | null) => void;
    editingSlot: { time: string; dayISO: string; providerId: string } | null;
    setEditingSlot: (state: { time: string; dayISO: string; providerId: string } | null) => void;
    setSelectedAppointment: (appointment: Appointment | null) => void;
}> = (props) => {
    const { provider, day, timeSlots, bookingState, setBookingState, editingSlot, setEditingSlot, setSelectedAppointment } = props;
    const { appointments, vacations, extraCapacities, setAppointments, showToast, logAudit } = useAppContext();

    const dayISO = getISODateString(day);
    
    const appointmentsOnDay = useMemo(() => appointments
        .filter(a => a.providerId === provider.id && getISODateString(new Date(a.start)) === dayISO)
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()), [appointments, provider.id, dayISO]);
    
    const bookedSlots = useMemo(() => new Set(appointmentsOnDay.map(a => toGregorianTimeString(new Date(a.start)))), [appointmentsOnDay]);

    const providerVacation = vacations.find(v => (v.providerId === provider.id || !v.providerId) && dayISO >= v.startDate && dayISO <= v.endDate);

    if (providerVacation) {
        return <div className="flex flex-col border-r last:border-r-0 border-slate-200"><div className="p-3 border-b text-center"><h4 className="font-bold text-slate-500">{provider.name}</h4></div><div className="flex-1 bg-slate-100 p-4 text-center text-sm text-slate-500">{providerVacation.description}</div></div>;
    }

    const handleCreateAppointment = (fileNo: string) => {
        if (!editingSlot) return;
        const start = new Date(`${editingSlot.dayISO}T${editingSlot.time}:00`);
        const newAppointment: Appointment = {
          id: generateUniqueId(), fileNo, providerId: provider.id,
          start: start.toISOString(), end: new Date(start.getTime() + SLOT_DURATION_MINUTES * 60000).toISOString(),
          type: AppointmentType.Normal, createdAt: new Date().toISOString(),
        };
        setAppointments(prev => [...prev, newAppointment]);
        showToast(`تم حجز موعد للملف ${fileNo} الساعة ${editingSlot.time}`, 'success');
        logAudit({ action: AuditAction.Create, fileNo, providerId: provider.id, providerName: provider.name, start: newAppointment.start, end: newAppointment.end, details: `حجز أسبوعي` });
        setEditingSlot(null);
    };

    const extra = extraCapacities.find(e => e.providerId === provider.id && e.date === dayISO)?.slots || 0;
    const totalCapacity = provider.dailyCapacity + extra;
    const availableCount = totalCapacity - appointmentsOnDay.length;
    const isBookingActive = bookingState?.providerId === provider.id && bookingState?.dayISO === dayISO;

    return (
        <div className="flex flex-col border-r last:border-r-0 border-slate-200 h-full">
            <div className="p-3 border-b text-center sticky top-0 bg-white/80 backdrop-blur-sm z-10">
                <h4 className="font-bold text-slate-800">{provider.name}</h4>
                <span className="text-xs text-slate-600 font-medium bg-slate-200 px-2 py-0.5 rounded-full inline-block mb-1.5">{provider.specialty}</span>
                <span className="text-sm font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">المتاح: <span className="font-bold text-blue-600">{availableCount}</span></span>
            </div>

            <div className="flex-grow overflow-y-auto p-2">
                {isBookingActive ? (
                     <>
                        {editingSlot?.providerId === provider.id && editingSlot?.dayISO === dayISO ? (
                            <div className="space-y-1.5">
                                <EditingSlot
                                    key={`${editingSlot.time}-edit`}
                                    time={editingSlot.time}
                                    onSave={handleCreateAppointment}
                                    onCancel={() => setEditingSlot(null)}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-1.5">
                                {timeSlots
                                    .filter(time => !bookedSlots.has(time))
                                    .map(time => (
                                        <AvailableSlotGridItem
                                            key={time}
                                            time={time}
                                            onClick={() => setEditingSlot({ providerId: provider.id, dayISO, time })}
                                        />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                     <div className="space-y-1.5">
                        {appointmentsOnDay.length > 0 ? (
                            appointmentsOnDay.map(appointment => (
                                <AppointmentCard key={appointment.id} appointment={appointment} onClick={() => setSelectedAppointment(appointment)} />
                            ))
                        ) : (
                            <div className="text-center text-slate-400 pt-10">لا توجد مواعيد.</div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-2 border-t bg-white sticky bottom-0">
                {isBookingActive ? (
                    <button onClick={() => { setBookingState(null); setEditingSlot(null); }} className="w-full p-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-all text-sm">إلغاء الإضافة</button>
                ) : (
                    <button onClick={() => setBookingState({ providerId: provider.id, dayISO })} className="w-full p-2 bg-blue-100 text-blue-700 rounded-lg font-bold hover:bg-blue-200 transition-all text-sm">إضافة موعد</button>
                )}
            </div>
        </div>
    );
};


// ====================================================================================
//  MAIN WEEK VIEW COMPONENT
// ====================================================================================
interface WeekViewProps {
  currentDate: Date;
  selectedSpecialty: Specialty;
  selectedProviderId: string | null;
}
const WeekView: React.FC<WeekViewProps> = ({ currentDate, selectedProviderId, selectedSpecialty }) => {
    const { providers, settings, setAppointments, askConfirmation, logAudit } = useAppContext();
    const [bookingState, setBookingState] = useState<{ providerId: string; dayISO: string } | null>(null);
    const [editingSlot, setEditingSlot] = useState<{ time: string; dayISO: string; providerId: string } | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const timeSlots = useMemo(() => generateTimeSlots(settings), [settings]);

    const displayDays = useMemo(() => {
        const days: Date[] = [];
        let dateIterator = new Date(currentDate);
        dateIterator.setHours(0, 0, 0, 0);

        if (selectedProviderId) {
            const provider = providers.find(p => p.id === selectedProviderId);
            if (!provider || provider.days.length === 0) return [];
            while (days.length < 20) { // Get next 20 working days
                if (provider.days.includes(dateIterator.getDay())) {
                    days.push(new Date(dateIterator));
                }
                dateIterator = addDays(dateIterator, 1);
            }
        } else {
            for (let i = 0; i < 30; i++) { // Show next 30 days
                days.push(addDays(currentDate, i));
            }
        }
        return days;
    }, [currentDate, selectedProviderId, providers]);

    const handleCancelAppointment = () => {
        if (!selectedAppointment) return;
        const { id, fileNo, providerId, start } = selectedAppointment;
        const provider = providers.find(p => p.id === providerId);
        askConfirmation(
            'تأكيد الإلغاء',
            `هل أنت متأكد من إلغاء موعد المريض رقم ${fileNo}؟`,
            () => {
                setAppointments(prev => prev.filter(app => app.id !== id));
                logAudit({ action: AuditAction.Cancel, fileNo, providerId, providerName: provider?.name, start, details: 'إلغاء من العرض الأسبوعي' });
                setSelectedAppointment(null);
            }
        );
    };

    return (
        <div className="flex h-full overflow-x-auto bg-slate-100 p-2 space-x-2 rtl:space-x-reverse scroll-smooth">
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setSelectedAppointment(null)}>
                    <div className="bg-white rounded-lg shadow-xl p-6 w-80 animate-bounceIn" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold">تفاصيل الموعد</h3>
                        <p>رقم الملف: <span className="font-bold">{selectedAppointment.fileNo}</span></p>
                        <p>الوقت: <span className="font-mono">{toGregorianTimeString(new Date(selectedAppointment.start))}</span></p>
                        <button onClick={handleCancelAppointment} className="w-full mt-4 p-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700">إلغاء الموعد</button>
                    </div>
                </div>
            )}
            
            {displayDays.map(day => {
                const dayOfWeek = day.getDay();
                const dayISO = getISODateString(day);
                
                let providersForDay = providers.filter(p => p.days.includes(dayOfWeek));
                if (selectedProviderId) providersForDay = providersForDay.filter(p => p.id === selectedProviderId);
                else if (selectedSpecialty !== Specialty.All) providersForDay = providersForDay.filter(p => p.specialty === selectedSpecialty);

                if (providersForDay.length === 0 && (selectedProviderId || selectedSpecialty !== Specialty.All)) return null;

                return (
                    <div key={dayISO} className="flex-shrink-0 flex flex-col bg-white rounded-lg shadow-soft overflow-hidden border border-slate-200" style={{ width: `${Math.max(1, providersForDay.length) * 11}rem`, maxWidth: '80vw' }}>
                        <div className="p-3 border-b bg-slate-50 text-center sticky top-0 z-20">
                            <h3 className="font-bold text-slate-800">{['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][dayOfWeek]}</h3>
                            <p className="text-sm text-slate-500">{toGregorianDateString(day, { day: 'numeric', month: 'short' })}</p>
                            <p className="text-xs text-slate-400 font-normal">{toHijriDateString(day)}</p>
                        </div>
                        <div className={`flex-grow grid overflow-hidden`} style={{ gridTemplateColumns: `repeat(${Math.max(1, providersForDay.length)}, 1fr)` }}>
                           {providersForDay.length > 0 ? (
                                providersForDay.map(provider => (
                                    <ProviderColumn
                                        key={provider.id}
                                        provider={provider}
                                        day={day}
                                        timeSlots={timeSlots}
                                        bookingState={bookingState}
                                        setBookingState={setBookingState}
                                        editingSlot={editingSlot}
                                        setEditingSlot={setEditingSlot}
                                        setSelectedAppointment={setSelectedAppointment}
                                    />
                                ))
                            ) : (
                                <div className="flex items-center justify-center p-4 text-slate-400">لا توجد عيادات.</div>
                            )}
                        </div>
                    </div>
                );
            })}

             {displayDays.length === 0 && (
                <div className="flex items-center justify-center w-full h-full text-slate-500">
                    <p>لا توجد أيام عمل مجدولة للمعالج المحدد.</p>
                </div>
            )}
        </div>
    );
};

export default WeekView;