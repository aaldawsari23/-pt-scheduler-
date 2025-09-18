import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { AppointmentType, Specialty, AuditAction, type Provider } from '../../types';
import { getISODateString, toGregorianTimeString } from '../../utils/dateUtils';
import QuickAddAppointment from '../BookingBar';
import { findNextAvailableSlot } from './ProviderView';
import { generateUniqueId } from '../../utils/helpers';
import { SLOT_DURATION_MINUTES } from '../../constants';

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

const ProviderSchedule: React.FC<{ 
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
             <div className="bg-slate-100 rounded-lg p-4 my-2 shadow-sm">
                <h3 className="text-lg font-bold text-slate-600">{provider.name}</h3>
                <div className="p-4 text-center text-slate-500 font-semibold">{providerVacation.description}</div>
            </div>
        );
    }
    
    const handleQuickBook = (fileNo: string) => {
        const nextSlot = findNextAvailableSlot(provider.id, currentDate, appointments);
        if (nextSlot) {
            const start = new Date(`${currentDateISO}T${nextSlot}:00`);
            const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60000);
            
            const newAppointment = {
              id: generateUniqueId(),
              fileNo,
              providerId: provider.id,
              start: start.toISOString(),
              end: end.toISOString(),
              type: AppointmentType.Normal,
              createdAt: new Date().toISOString(),
            };
            
            setAppointments(prev => [...prev, newAppointment]);
            showToast(`تم حجز موعد للملف ${fileNo} الساعة ${nextSlot}`, 'success');
            
            logAudit({
              action: AuditAction.Create,
              fileNo,
              providerId: provider.id,
              providerName: provider.name,
              start: start.toISOString(),
              end: end.toISOString(),
              details: `إضافة سريعة - ${AppointmentType.Normal}`,
            });

            onToggleAdd(null); // Close the input form
        } else {
            showToast(`لا توجد خانات متاحة للمعالج ${provider.name} في هذا اليوم.`, 'error');
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
        <div className="bg-white rounded-lg p-4 my-2 border-t-4 border-blue-300 shadow-soft">
             <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-slate-800">{provider.name} <span className="text-base font-medium text-slate-500">({provider.specialty})</span></h3>
                 <div className="text-sm font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                     المتاح: <span className="font-bold text-blue-600">{availableCount}</span>
                 </div>
             </div>
             
             <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3 min-h-[5rem]">
                {appointmentsOnDay.map(appointment => (
                    <div key={appointment.id} className={`h-16 flex flex-col justify-center p-3 rounded-lg shadow-md text-white ${getAppointmentColor(appointment.type)}`}>
                        <div className="font-bold text-lg">{appointment.fileNo}</div>
                        <div className="text-xs opacity-90">{toGregorianTimeString(new Date(appointment.start))} - {appointment.type}</div>
                    </div>
                ))}
                
                {isAdding ? (
                    <QuickAddAppointment onBook={handleQuickBook} onCancel={() => onToggleAdd(null)} />
                ) : (
                    <button 
                        onClick={() => onToggleAdd(provider.id)}
                        className="h-16 p-2 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all flex flex-col items-center justify-center"
                        aria-label={`Add appointment for ${provider.name}`}
                    >
                        <PlusIcon />
                        <span className="text-sm font-semibold mt-1">إضافة موعد</span>
                    </button>
                )}
             </div>
        </div>
    );
};


interface DayViewProps {
  currentDate: Date;
  selectedSpecialty: Specialty;
  selectedProviderId: string | null;
}

const DayView: React.FC<DayViewProps> = ({ currentDate, selectedSpecialty, selectedProviderId }) => {
  const { providers, vacations } = useAppContext();
  const [addingAppointmentFor, setAddingAppointmentFor] = useState<string | null>(null);
  
  const dayOfWeek = currentDate.getDay();
  
  let activeProviders = providers.filter(p => {
      if (selectedProviderId) return p.id === selectedProviderId;
      if (!p.days.includes(dayOfWeek)) return false;
      if (selectedSpecialty !== Specialty.All && p.specialty !== selectedSpecialty) return false;
      return true;
  });
  
  const isGlobalVacationDay = vacations.some(v => !v.providerId && getISODateString(currentDate) >= v.startDate && getISODateString(currentDate) <= v.endDate);
    
  const renderEmptyState = (message: string, icon: JSX.Element) => (
      <div className="flex flex-col items-center justify-center h-full p-10 text-slate-400 bg-dots">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-full">{icon}</div>
          <p className="mt-4 text-lg sm:text-xl font-semibold bg-white/80 backdrop-blur-sm px-4 py-1 rounded-lg">{message}</p>
          <style>{`.bg-dots { background-image: radial-gradient(circle, #e2e8f0 1px, transparent 1px); background-size: 1rem 1rem; }`}</style>
      </div>
  );

  if (isGlobalVacationDay) {
    return renderEmptyState('يوم إجازة رسمي', <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>);
  }

  if (activeProviders.length === 0) {
    return renderEmptyState(selectedProviderId ? 'المعالج ليس لديه عيادة في هذا اليوم' : 'لا يوجد معالجون في هذا اليوم', <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>);
  }

  return (
    <div className="p-2 bg-slate-50 h-full overflow-y-auto">
        {activeProviders.map(provider => (
            <ProviderSchedule 
                key={provider.id} 
                provider={provider} 
                currentDate={currentDate}
                isAdding={addingAppointmentFor === provider.id}
                onToggleAdd={setAddingAppointmentFor}
            />
        ))}
    </div>
  );
};

export default DayView;