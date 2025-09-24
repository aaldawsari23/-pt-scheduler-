import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { AppointmentType, Specialty, AuditAction, type Provider, type Appointment } from '../../types';
import { getISODateString, toGregorianTimeString, toGregorianDateTimeString } from '../../utils/dateUtils';
import { generateUniqueId, normalizeArabicDigits, generateTimeSlots } from '../../utils/helpers';
import { SLOT_DURATION_MINUTES } from '../../constants';
import { calculateAvailabilityForDay } from '../../utils/availability';

const specialtyBadgeColors: { [key in Specialty]?: string } = {
    [Specialty.MSK]: 'badge-msk',
    [Specialty.Neuro]: 'badge-neuro',
    [Specialty.PT_Service]: 'badge-pt-service',
};

const getAppointmentColor = (type: AppointmentType) => {
    switch(type) {
        case AppointmentType.Urgent: return 'bg-red-500 border-red-700 hover:bg-red-600';
        case AppointmentType.SemiUrgent: return 'bg-amber-500 border-amber-700 hover:bg-amber-600';
        case AppointmentType.Chronic: return 'bg-purple-500 border-purple-700 hover:bg-purple-600';
        case AppointmentType.Normal:
        case AppointmentType.Nearest:
        default: return 'bg-green-500 border-green-700 hover:bg-green-600';
    }
}

const EditingSlot: React.FC<{ time: string; onSave: (fileNo: string) => void; onCancel: () => void; }> = ({ time, onSave, onCancel }) => {
    const [fileNo, setFileNo] = useState('');
    const handleSave = () => { if (fileNo.trim()) onSave(fileNo.trim()); };

    return (
        <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-400 shadow-lg animate-bounceIn col-span-full">
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


const ProviderSchedule: React.FC<{ provider: Provider; currentDate: Date; onAppointmentSelect: (appointment: Appointment) => void; }> = ({ provider, currentDate, onAppointmentSelect }) => {
    const { appointments, vacations, extraCapacities, setAppointments, showToast, logAudit, settings } = useAppContext();
    const currentDateISO = getISODateString(currentDate);

    const [isBooking, setIsBooking] = useState(false);
    const [editingSlot, setEditingSlot] = useState<string | null>(null);

    const providerVacation = vacations.find(v => (v.providerId === provider.id || !v.providerId) && currentDateISO >= v.startDate && currentDateISO <= v.endDate);
    if(providerVacation) {
        return (
             <div className="bg-slate-100 rounded-lg p-4 my-2 shadow-sm">
                <h3 className="text-lg font-bold text-slate-600">{provider.name}</h3>
                <div className="p-4 text-center text-slate-500 font-semibold">{providerVacation.description}</div>
            </div>
        );
    }

    const appointmentsOnDay = useMemo(() => appointments
        .filter(a => a.providerId === provider.id && getISODateString(new Date(a.start)) === currentDateISO)
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()), [appointments, provider.id, currentDateISO]);
    
    const timeSlots = useMemo(() => generateTimeSlots(settings), [settings]);
    const bookedSlots = useMemo(() => new Set(appointmentsOnDay.map(a => toGregorianTimeString(new Date(a.start)))), [appointmentsOnDay]);
    
    const handleCreateAppointment = (fileNo: string) => {
        if (!editingSlot) return;

        const start = new Date(`${currentDateISO}T${editingSlot}:00`);
        const newAppointment: Appointment = {
            id: generateUniqueId(),
            fileNo,
            providerId: provider.id,
            start: start.toISOString(),
            end: new Date(start.getTime() + SLOT_DURATION_MINUTES * 60000).toISOString(),
            type: AppointmentType.Normal,
            createdAt: new Date().toISOString(),
        };
        
        setAppointments(prev => [...prev, newAppointment]);
        showToast(`تم حجز موعد للملف ${fileNo} الساعة ${editingSlot}`, 'success');
        
        logAudit({
            action: AuditAction.Create,
            fileNo,
            providerId: provider.id,
            providerName: provider.name,
            start: newAppointment.start,
            end: newAppointment.end,
            details: `إضافة من العرض اليومي`,
        });

        setEditingSlot(null);
        setIsBooking(false);
    };

    const extra = extraCapacities.find(e => e.providerId === provider.id && e.date === currentDateISO)?.slots || 0;
    const totalCapacity = provider.dailyCapacity + extra;
    const bookedCount = appointmentsOnDay.length;
    const availableCount = totalCapacity - bookedCount;

    const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>;

    return (
        <div className="bg-white rounded-lg p-4 my-2 border-t-4 border-blue-300 shadow-soft">
             <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-800">{provider.name}</h3>
                    <span className={`badge ${specialtyBadgeColors[provider.specialty]}`}>{provider.specialty}</span>
                </div>
                 <div className="text-sm font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                     المتاح: <span className="font-bold text-blue-600">{availableCount}</span>
                 </div>
             </div>
             
             <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3 min-h-[5rem]">
                {!isBooking && appointmentsOnDay.map(appointment => (
                    <button 
                        key={appointment.id} 
                        onClick={() => onAppointmentSelect(appointment)}
                        className={`h-16 flex flex-col justify-center text-start p-3 rounded-lg shadow-md text-white transition-all ${getAppointmentColor(appointment.type)}`}
                    >
                        <div className="font-bold text-lg">{appointment.fileNo}</div>
                        <div className="text-xs opacity-90">{toGregorianTimeString(new Date(appointment.start))} - {appointment.type}</div>
                    </button>
                ))}
                
                {isBooking ? (
                    editingSlot ? (
                        <EditingSlot
                            time={editingSlot}
                            onSave={handleCreateAppointment}
                            onCancel={() => setEditingSlot(null)}
                        />
                    ) : (
                        <div className="col-span-full max-h-64 overflow-y-auto p-1 bg-slate-50/50 rounded-lg border">
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-2">
                                {timeSlots
                                    .filter(time => !bookedSlots.has(time))
                                    .map(time => (
                                        <AvailableSlotGridItem
                                            key={time}
                                            time={time}
                                            onClick={() => setEditingSlot(time)}
                                        />
                                    ))}
                            </div>
                        </div>
                    )
                ) : (
                    <button 
                        onClick={() => setIsBooking(true)}
                        className="h-16 p-2 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all flex flex-col items-center justify-center"
                        aria-label={`Add appointment for ${provider.name}`}
                    >
                        <PlusIcon />
                        <span className="text-sm font-semibold mt-1">إضافة موعد</span>
                    </button>
                )}
             </div>
             {isBooking && (
                <div className="mt-4">
                    <button onClick={() => { setIsBooking(false); setEditingSlot(null); }} className="w-full p-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-all text-sm">إلغاء الإضافة</button>
                </div>
             )}
        </div>
    );
};


interface DayViewProps {
  currentDate: Date;
  selectedSpecialty: Specialty;
  selectedProviderId: string | null;
  availabilityFilter: 'all' | 'available' | 'booked';
  navigateDate: (direction: number) => void;
}

const DayView: React.FC<DayViewProps> = ({ currentDate, selectedSpecialty, selectedProviderId, availabilityFilter, navigateDate }) => {
  const { providers, vacations, appointments, extraCapacities, askConfirmation, setAppointments, logAudit, showToast } = useAppContext();
  const [dragInfo, setDragInfo] = useState({ isDragging: false, startX: 0, dx: 0 });
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;
    const { id, fileNo, providerId, start } = selectedAppointment;
    const provider = providers.find(p => p.id === providerId);
    askConfirmation(
        'تأكيد الإلغاء',
        `هل أنت متأكد من إلغاء موعد المريض رقم ${fileNo}؟`,
        () => {
            setAppointments(prev => prev.filter(app => app.id !== id));
            logAudit({ action: AuditAction.Cancel, fileNo, providerId, providerName: provider?.name, start, details: 'إلغاء من العرض اليومي' });
            setSelectedAppointment(null);
            showToast('تم إلغاء الموعد بنجاح', 'success');
        }
    );
  };
  
  const { workingProviders, isGlobalVacation, globalVacationDescription } = useMemo(() => calculateAvailabilityForDay(
    currentDate,
    providers,
    appointments,
    vacations,
    extraCapacities,
    selectedProviderId,
    selectedSpecialty
  ), [currentDate, providers, appointments, vacations, extraCapacities, selectedProviderId, selectedSpecialty]);
  
  const activeProviders = useMemo(() => {
    if (availabilityFilter === 'all') {
      return workingProviders;
    }
    return workingProviders.filter(p => {
      const dayISO = getISODateString(currentDate);
      const extra = extraCapacities.find(e => e.providerId === p.id && e.date === dayISO)?.slots || 0;
      const totalCapacity = p.dailyCapacity + extra;
      if (totalCapacity === 0) {
          // If capacity is 0, it can't be available or booked.
          return false;
      }
      const bookedCount = appointments.filter(a => a.providerId === p.id && getISODateString(new Date(a.start)) === dayISO).length;
      const hasAvailableSlots = totalCapacity > bookedCount;

      if (availabilityFilter === 'available') return hasAvailableSlots;
      if (availabilityFilter === 'booked') return !hasAvailableSlots;
      return true;
    });
  }, [workingProviders, availabilityFilter, currentDate, appointments, extraCapacities]);
    
  const handleDragEnd = () => {
    if (!dragInfo.isDragging) return;
    if (Math.abs(dragInfo.dx) > 50) { 
      navigateDate(dragInfo.dx > 0 ? -1 : 1);
    }
    setDragInfo({ isDragging: false, startX: 0, dx: 0 });
  };
  
  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest('button')) return;
    e.preventDefault();
    setDragInfo({ isDragging: true, startX: e.pageX, dx: 0 });
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragInfo.isDragging) return;
    const dx = e.pageX - dragInfo.startX;
    setDragInfo(prev => ({ ...prev, dx }));
  };
  const handleMouseUpOrLeave = () => {
    if (dragInfo.isDragging) handleDragEnd();
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest('button')) return;
    setDragInfo({ isDragging: true, startX: e.touches[0].pageX, dx: 0 });
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dragInfo.isDragging) return;
    const dx = e.touches[0].pageX - dragInfo.startX;
    setDragInfo(prev => ({ ...prev, dx }));
  };
  
  const renderEmptyState = (message: string, icon: React.ReactNode) => (
      <div className="flex flex-col items-center justify-center h-full p-10 text-slate-400 bg-dots">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-full">{icon}</div>
          <p className="mt-4 text-lg sm:text-xl font-semibold bg-white/80 backdrop-blur-sm px-4 py-1 rounded-lg">{message}</p>
          <style>{`.bg-dots { background-image: radial-gradient(circle, #e2e8f0 1px, transparent 1px); background-size: 1rem 1rem; }`}</style>
      </div>
  );

  const renderContent = () => {
    if (isGlobalVacation) {
      return renderEmptyState(globalVacationDescription, <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>);
    }

    if (activeProviders.length === 0) {
      const isFiltered = selectedProviderId || selectedSpecialty !== Specialty.All || availabilityFilter !== 'all';
      const message = isFiltered 
        ? 'لا يوجد معالجون يطابقون معايير التصفية'
        : 'لا يوجد معالجون في هذا اليوم';
      return renderEmptyState(message, <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>);
    }

    return activeProviders.map(provider => (
      <ProviderSchedule 
          key={provider.id} 
          provider={provider} 
          currentDate={currentDate}
          onAppointmentSelect={setSelectedAppointment}
      />
    ));
  };

  return (
    <div className="bg-slate-50 h-full overflow-hidden">
        {selectedAppointment && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setSelectedAppointment(null)}>
                <div className="bg-white rounded-lg shadow-xl p-6 w-80 animate-bounceIn text-center" onClick={e => e.stopPropagation()}>
                    <h3 className="text-xl font-bold mb-2 text-slate-800">تفاصيل الموعد</h3>
                    <div className="space-y-2 text-slate-600 mb-4">
                      <p>رقم الملف: <span className="font-bold text-lg text-slate-900">{selectedAppointment.fileNo}</span></p>
                      <p>الوقت: <span className="font-mono">{toGregorianDateTimeString(new Date(selectedAppointment.start))}</span></p>
                      <p>نوع الموعد: <span className="font-semibold">{selectedAppointment.type}</span></p>
                    </div>
                    <button onClick={handleCancelAppointment} className="w-full mt-4 p-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">إلغاء الموعد</button>
                </div>
            </div>
        )}
        <div
            className={`p-2 h-full overflow-y-auto select-none ${dragInfo.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
                transform: `translateX(${dragInfo.dx}px)`,
                transition: dragInfo.isDragging ? 'none' : 'transform 0.3s ease-out',
                willChange: 'transform',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleDragEnd}
            onTouchCancel={handleDragEnd}
        >
          {renderContent()}
        </div>
    </div>
  );
};

export default DayView;
