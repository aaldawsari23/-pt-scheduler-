import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getStartOfWeek, addDays, getISODateString, toGregorianTimeString, areDatesOnSameDay } from '../../utils/dateUtils';
import { AppointmentType, Specialty, AuditAction, type Provider, type Appointment } from '../../types';
import { findNextAvailableSlot } from './ProviderView';
import { generateUniqueId } from '../../utils/helpers';
import QuickAddAppointment from '../BookingBar';
import { SLOT_DURATION_MINUTES } from '../../constants';

// ====================================================================================
// SHARED HELPERS & COMPONENTS
// ====================================================================================

const getAppointmentColor = (type: AppointmentType) => {
    switch(type) {
        case AppointmentType.Urgent: return 'bg-red-500 border-red-700';
        case AppointmentType.SemiUrgent: return 'bg-amber-500 border-amber-700';
        case AppointmentType.Chronic: return 'bg-purple-500 border-purple-700';
        case AppointmentType.Normal:
        case AppointmentType.Nearest:
        default: return 'bg-green-500 border-green-700';
    }
}

// ====================================================================================
// MOBILE VIEW COMPONENTS
// ====================================================================================

const MobileProviderSchedule: React.FC<{ 
    provider: Provider; 
    currentDate: Date;
    isAdding: boolean;
    onToggleAdd: (providerId: string | null) => void;
}> = ({ provider, currentDate, isAdding, onToggleAdd }) => {
    const { appointments, vacations, extraCapacities, setAppointments, showToast, logAudit } = useAppContext();
    const currentDateISO = getISODateString(currentDate);

    const providerVacation = vacations.find(v => (v.providerId === provider.id || !v.providerId) && currentDateISO >= v.startDate && currentDateISO <= v.endDate);
    if(providerVacation) {
        return (
             <div className="bg-slate-100 rounded-lg p-4 my-2">
                <h3 className="text-lg font-bold text-slate-600">{provider.name}</h3>
                <div className="p-4 text-center text-slate-500 font-semibold">{providerVacation.description}</div>
            </div>
        );
    }

    const handleQuickBook = (fileNo: string) => {
        const nextSlot = findNextAvailableSlot(provider.id, currentDate, appointments);
        if (nextSlot) {
            const start = new Date(`${currentDateISO}T${nextSlot}:00`);
            const newAppointment = {
              id: generateUniqueId(), fileNo, providerId: provider.id,
              start: start.toISOString(), end: new Date(start.getTime() + SLOT_DURATION_MINUTES * 60000).toISOString(),
              type: AppointmentType.Normal, createdAt: new Date().toISOString(),
            };
            setAppointments(prev => [...prev, newAppointment]);
            showToast(`تم حجز موعد للملف ${fileNo} الساعة ${nextSlot}`, 'success');
            logAudit({
              action: AuditAction.Create, fileNo, providerId: provider.id, providerName: provider.name,
              start: newAppointment.start, end: newAppointment.end, details: `إضافة سريعة - ${AppointmentType.Normal}`,
            });
            onToggleAdd(null);
        } else {
            showToast(`لا توجد خانات متاحة للمعالج ${provider.name}.`, 'error');
        }
    };
    
    const appointmentsOnDay = appointments
        .filter(a => a.providerId === provider.id && getISODateString(new Date(a.start)) === currentDateISO)
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    const extra = extraCapacities.find(e => e.providerId === provider.id && e.date === currentDateISO)?.slots || 0;
    const totalCapacity = provider.dailyCapacity + extra;
    const bookedCount = appointmentsOnDay.length;
    const availableCount = totalCapacity - bookedCount;

    const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>;

    return (
        <div className="bg-white rounded-lg p-3 my-2 border-t-4 border-blue-300 shadow-soft">
             <div className="flex justify-between items-center mb-3">
                 <h3 className="text-lg font-bold text-slate-800">{provider.name} <span className="text-sm font-medium text-slate-500">({provider.specialty})</span></h3>
                 <div className="text-sm font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border">
                    المتاح: <span className="font-bold text-blue-600">{availableCount}</span>
                 </div>
             </div>
             
             <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-2">
                {appointmentsOnDay.map(appointment => (
                     <div key={appointment.id} className={`h-14 flex flex-col justify-center p-2 rounded-lg shadow-sm text-white ${getAppointmentColor(appointment.type)}`}>
                        <div className="font-bold">{appointment.fileNo}</div>
                        <div className="text-xs opacity-90">{toGregorianTimeString(new Date(appointment.start))}</div>
                    </div>
                ))}
                
                {isAdding ? (
                    <QuickAddAppointment onBook={handleQuickBook} onCancel={() => onToggleAdd(null)} />
                ) : (
                    <button 
                        onClick={() => onToggleAdd(provider.id)}
                        className="h-14 p-2 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                        <PlusIcon />
                        <span className="text-sm font-semibold">موعد جديد</span>
                    </button>
                )}
             </div>
        </div>
    );
};


const MobileScheduleView: React.FC<{
    selectedDate: Date,
    selectedProviderId: string | null,
    selectedSpecialty: Specialty,
}> = ({ selectedDate, selectedProviderId, selectedSpecialty }) => {
    const { providers, vacations } = useAppContext();
    const [addingAppointmentFor, setAddingAppointmentFor] = useState<string | null>(null);
    const dayOfWeek = selectedDate.getDay();

    const activeProviders = useMemo(() => {
        return providers.filter(p => {
            if (selectedProviderId) return p.id === selectedProviderId;
            if (!p.days.includes(dayOfWeek)) return false;
            if (selectedSpecialty !== Specialty.All && p.specialty !== selectedSpecialty) return false;
            return true;
        });
    }, [providers, selectedDate, selectedProviderId, selectedSpecialty]);
  
    const isGlobalVacationDay = vacations.some(v => !v.providerId && getISODateString(selectedDate) >= v.startDate && getISODateString(selectedDate) <= v.endDate);

    if (isGlobalVacationDay) {
        return <div className="p-4 text-center text-slate-500 font-semibold">يوم إجازة رسمي</div>;
    }

    if (activeProviders.length === 0) {
        return <div className="p-4 text-center text-slate-500">لا يوجد معالجون في هذا اليوم.</div>;
    }

    return (
        <div className="p-2 bg-slate-50 h-full overflow-y-auto">
            {activeProviders.map(provider => (
                <MobileProviderSchedule 
                    key={provider.id} 
                    provider={provider} 
                    currentDate={selectedDate}
                    isAdding={addingAppointmentFor === provider.id}
                    onToggleAdd={setAddingAppointmentFor}
                />
            ))}
        </div>
    );
};

// ====================================================================================
// DESKTOP VIEW COMPONENTS
// ====================================================================================

const DesktopAppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
    return (
        <div className={`p-2 rounded-md shadow-sm text-white ${getAppointmentColor(appointment.type)}`}>
            <div className="flex justify-between items-baseline">
                <span className="font-bold text-base">{appointment.fileNo}</span>
                <span className="text-xs font-mono">{toGregorianTimeString(new Date(appointment.start))}</span>
            </div>
            <div className="text-xs opacity-90 mt-1">{appointment.type}</div>
        </div>
    );
};

const ProviderColumn: React.FC<{
    provider: Provider;
    selectedDate: Date;
}> = ({ provider, selectedDate }) => {
    const { appointments, vacations, extraCapacities, setAppointments, showToast, logAudit } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const dayISO = getISODateString(selectedDate);
    const dayOfWeek = selectedDate.getDay();

    const providerVacation = vacations.find(v => (v.providerId === provider.id || !v.providerId) && dayISO >= v.startDate && dayISO <= v.endDate);
    const isClinicDay = provider.days.includes(dayOfWeek);

     const handleQuickBook = (fileNo: string) => {
        const nextSlot = findNextAvailableSlot(provider.id, selectedDate, appointments);
        if (nextSlot) {
            const start = new Date(`${dayISO}T${nextSlot}:00`);
            const newAppointment = {
              id: generateUniqueId(), fileNo, providerId: provider.id,
              start: start.toISOString(), end: new Date(start.getTime() + SLOT_DURATION_MINUTES * 60000).toISOString(),
              type: AppointmentType.Normal, createdAt: new Date().toISOString(),
            };
            setAppointments(prev => [...prev, newAppointment]);
            showToast(`تم حجز موعد للملف ${fileNo} الساعة ${nextSlot}`, 'success');
            logAudit({
              action: AuditAction.Create, fileNo, providerId: provider.id, providerName: provider.name,
              start: newAppointment.start, end: newAppointment.end, details: `إضافة سريعة - ${AppointmentType.Normal}`,
            });
            setIsAdding(false);
        } else {
            showToast(`لا توجد خانات متاحة للمعالج ${provider.name}.`, 'error');
        }
    };
    
    if (providerVacation) {
        return (
             <div className="flex flex-col border-l border-slate-200 min-w-[160px]">
                <div className="text-center p-3 border-b border-slate-200 h-[88px] flex flex-col justify-center">
                    <h4 className="font-bold text-slate-800">{provider.name}</h4>
                    <span className="text-xs text-slate-500">{provider.specialty}</span>
                </div>
                <div className="flex-1 bg-slate-100 flex items-center justify-center text-sm text-slate-500 p-4 font-semibold">
                    {providerVacation.description}
                </div>
            </div>
        );
    }
    
    if (!isClinicDay) {
        return (
            <div className="flex flex-col border-l border-slate-200 min-w-[160px]">
                <div className="text-center p-3 border-b border-slate-200 h-[88px] flex flex-col justify-center">
                    <h4 className="font-bold text-slate-800">{provider.name}</h4>
                    <span className="text-xs text-slate-500">{provider.specialty}</span>
                </div>
                <div className="flex-1 bg-slate-100 flex items-center justify-center text-sm text-slate-500 p-4">
                    لا توجد عيادة
                </div>
            </div>
        );
    }
    
    const appointmentsOnDay = appointments
        .filter(a => a.providerId === provider.id && getISODateString(new Date(a.start)) === dayISO)
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const extra = extraCapacities.find(e => e.providerId === provider.id && e.date === dayISO)?.slots || 0;
    const totalCapacity = provider.dailyCapacity + extra;
    const bookedCount = appointmentsOnDay.length;
    const availableCount = totalCapacity - bookedCount;

    const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;

    return (
        <div className="flex flex-col border-l border-slate-200 first:border-l-0 min-w-[160px] bg-slate-50">
            <div className="text-center p-3 border-b border-slate-200 h-[88px] flex flex-col justify-center sticky top-0 bg-slate-50/80 backdrop-blur-sm z-10">
                <h4 className="font-bold text-slate-800 text-lg">{provider.name}</h4>
                <span className="text-xs text-slate-500 mb-1.5">{provider.specialty}</span>
                <div className="text-sm font-semibold bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full shadow-sm">
                    المتاح: <span className="font-bold text-blue-600">{availableCount}</span>
                </div>
            </div>
            
            <div className="p-2 space-y-2 flex-grow overflow-y-auto">
                {appointmentsOnDay.length > 0 ? (
                    appointmentsOnDay.map(app => <DesktopAppointmentCard key={app.id} appointment={app} />)
                ) : (
                    <div className="text-center text-slate-400 pt-10">لا توجد مواعيد محجوزة.</div>
                )}
            </div>

            <div className="p-2 border-t border-slate-200">
                {isAdding ? (
                    <QuickAddAppointment onBook={handleQuickBook} onCancel={() => setIsAdding(false)} />
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center justify-center gap-2 p-2 bg-blue-100 text-blue-700 rounded-lg font-bold hover:bg-blue-200 transition-all"
                    >
                        <PlusIcon />
                        <span>إضافة موعد</span>
                    </button>
                )}
            </div>
        </div>
    );
};

// ====================================================================================
// MAIN WEEK VIEW COMPONENT
// ====================================================================================

interface WeekViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedSpecialty: Specialty;
  selectedProviderId: string | null;
}

const WeekView: React.FC<WeekViewProps> = (props) => {
  const { currentDate, setCurrentDate, selectedProviderId, selectedSpecialty } = props;
  const { providers } = useAppContext();
  const startOfWeek = getStartOfWeek(currentDate);

  const providerOrder = ['عريز', 'سعد', 'بناوي', 'عجيم', 'محمد يوسف', 'خالد العماري'];

  const filteredProviders = useMemo(() => {
    let provs = [...providers];

    if (selectedProviderId) {
        provs = provs.filter(p => p.id === selectedProviderId);
    } else if (selectedSpecialty !== Specialty.All) {
        provs = provs.filter(p => p.specialty === selectedSpecialty);
    }
    
    provs.sort((a, b) => {
        const indexA = providerOrder.indexOf(a.name);
        const indexB = providerOrder.indexOf(b.name);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return provs;
  }, [providers, selectedProviderId, selectedSpecialty]);

  const days = useMemo(() => {
    const allWeekDays = Array.from({ length: 5 }, (_, i) => addDays(startOfWeek, i));
    if (filteredProviders.length === 0) return allWeekDays; // Show all days if no provider filter
    return allWeekDays.filter(day => {
        const dayOfWeek = day.getDay();
        return filteredProviders.some(p => p.days.includes(dayOfWeek));
    });
}, [startOfWeek, filteredProviders]);

  const [selectedDay, setSelectedDay] = useState(currentDate);
  const weekDayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  
  useEffect(() => {
      const isSelectedDayInValidDays = days.some(d => areDatesOnSameDay(d, selectedDay));
      if (!isSelectedDayInValidDays && days.length > 0) {
          setSelectedDay(days[0]);
          setCurrentDate(days[0]);
      } else if (days.length === 0) {
        // No valid days in this week, maybe just stay on the current start of week
        // or show an empty state handled below.
      } else {
        setSelectedDay(currentDate);
      }
  }, [currentDate, days, setCurrentDate]);

  const handleDaySelect = (day: Date) => {
    setSelectedDay(day);
    setCurrentDate(day);
  };
  
  if (days.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-full p-10 text-slate-400 bg-dots">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="mt-4 text-lg font-semibold bg-white/80 backdrop-blur-sm px-4 py-1 rounded-lg">لا توجد عيادات متاحة لهذا الأسبوع بالتصفية المحددة.</p>
              <style>{`.bg-dots { background-image: radial-gradient(circle, #e2e8f0 1px, transparent 1px); background-size: 1rem 1rem; }`}</style>
          </div>
      );
  }


  return (
    <div className="flex flex-col h-full bg-white">
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      {/* Day Selector Header */}
      <div className="flex-shrink-0 p-2 border-b border-slate-200 bg-slate-50 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-1 sm:gap-2 flex-nowrap">
          {days.map((day) => {
            const isSelected = areDatesOnSameDay(day, selectedDay);
            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDaySelect(day)}
                className={`flex-shrink-0 w-24 sm:w-auto sm:flex-1 p-2 sm:p-2.5 rounded-lg text-center transition-all duration-200 ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-md transform sm:scale-105' 
                    : 'bg-white hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <div className="font-bold text-sm">{weekDayNames[day.getDay()]}</div>
                <div className={`text-xs ${isSelected ? 'opacity-90' : 'text-slate-500'}`}>
                  {day.getDate()}/{day.getMonth() + 1}
                </div>
              </button>
            )
          })}
        </div>
      </div>
      
      <div className="flex-grow overflow-auto">
        {/* DESKTOP VIEW */}
        <div className="hidden md:grid h-full" style={{ gridTemplateColumns: `repeat(${Math.max(1, filteredProviders.length)}, minmax(160px, 1fr))` }}>
            {filteredProviders.length > 0 ? (
                filteredProviders.map(provider => (
                    <ProviderColumn
                        key={provider.id}
                        provider={provider}
                        selectedDate={selectedDay}
                    />
                ))
            ) : (
                <div className="flex items-center justify-center h-full text-slate-500 p-4 col-span-full">
                    لا يوجد معالجون يطابقون الفلتر المحدد.
                </div>
            )}
        </div>
        
        {/* MOBILE VIEW */}
        <div className="block md:hidden">
            <MobileScheduleView 
                selectedDate={selectedDay}
                selectedProviderId={selectedProviderId}
                selectedSpecialty={selectedSpecialty}
            />
        </div>
      </div>
    </div>
  );
};

export default WeekView;