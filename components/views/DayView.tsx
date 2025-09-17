import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { WORK_HOURS, SLOT_DURATION_MINUTES } from '../../constants';
// FIX: 'Specialty' is an enum used as a value, so it must be imported directly, not as a type.
import { AppointmentType, AuditAction, Specialty } from '../../types';
import type { Appointment, Provider } from '../../types';
import { getISODateString, toGregorianDateString, toGregorianTimeString } from '../../utils/dateUtils';

const getAppointmentColor = (type: AppointmentType) => {
    switch(type) {
        case AppointmentType.Urgent: return 'bg-red-100/80 border-r-4 border-red-500 text-red-900';
        case AppointmentType.SemiUrgent: return 'bg-amber-100/80 border-r-4 border-amber-500 text-amber-900';
        case AppointmentType.Chronic: return 'bg-purple-100/80 border-r-4 border-purple-500 text-purple-900';
        case AppointmentType.Normal:
        case AppointmentType.Nearest:
        default: return 'bg-sky-100/80 border-r-4 border-sky-500 text-sky-900';
    }
}

const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
  const { askConfirmation, setAppointments, appointments, showToast, logAudit } = useAppContext();
    
  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    askConfirmation( 'إلغاء الموعد', `هل تريد بالتأكيد إلغاء موعد المراجع صاحب الملف رقم ${appointment.fileNo}؟`, () => {
        setAppointments(prev => prev.filter(a => a.id !== appointment.id));
        showToast(`تم إلغاء الموعد للملف رقم ${appointment.fileNo}`, 'info');
        logAudit({
            action: AuditAction.Cancel,
            fileNo: appointment.fileNo,
            start: appointment.start,
            end: appointment.end,
            details: `إلغاء موعد ${appointment.type}`
        });
      }
    );
  };

  return (
    <div className={`w-full h-full p-2 rounded-lg text-xs text-right cursor-pointer select-none transition-all duration-200 hover:shadow-lg hover:z-10 ${getAppointmentColor(appointment.type)} animate-slideIn`}>
      <div className="flex justify-between items-start">
        <p className="font-bold text-sm">{appointment.fileNo}</p>
        <button onClick={handleCancelClick} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-600 transition-opacity" title="إلغاء الموعد">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
};

const DoctorCard: React.FC<{ provider: Provider, currentDate: Date, fileNo: string, createAppointment: Function }> = ({ provider, currentDate, fileNo, createAppointment }) => {
    const { appointments, timeOffs, vacations, showToast } = useAppContext();
    const currentDateISO = getISODateString(currentDate);

    const providerVacation = vacations.find(v => (v.providerId === provider.id || !v.providerId) && currentDateISO >= v.startDate && currentDateISO <= v.endDate);
    if(providerVacation) {
        return (
            <div className="doctor-card bg-slate-100/50 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                <div className="doctor-header p-4 border-b border-slate-200 bg-slate-200/50">
                    <h3 className="text-lg font-bold text-slate-500">{provider.name}</h3>
                </div>
                <div className="p-8 text-center text-slate-500 font-semibold">{providerVacation.description}</div>
            </div>
        );
    }
    
    const timeSlots = Array.from({length: (WORK_HOURS.end - WORK_HOURS.start) * 60 / SLOT_DURATION_MINUTES}, (_, i) => {
        const d = new Date(currentDate);
        d.setHours(WORK_HOURS.start, 0, 0, 0);
        d.setMinutes(i * SLOT_DURATION_MINUTES);
        return d;
    });

    const morningSlots = timeSlots.filter(t => t.getHours() < WORK_HOURS.morningEnd);
    const afternoonSlots = timeSlots.filter(t => t.getHours() >= WORK_HOURS.morningEnd);

    const handleManualBook = (slot: Date) => {
        if (!provider) return;
        if (!fileNo.trim()) {
            showToast('الرجاء إدخال رقم الملف في الشريط العلوي أولاً', 'error');
            return;
        }
        const slotEnd = new Date(slot.getTime() + SLOT_DURATION_MINUTES * 60000);
        createAppointment(fileNo, provider, slot, slotEnd, AppointmentType.Normal);
    };
    
    const renderSession = (title: string, icon: JSX.Element, slots: Date[]) => (
        <div className="session mb-4 last:mb-0">
            <div className="session-header flex items-center gap-2 mb-3 px-1">
                {icon}
                <h4 className="font-bold text-slate-600">{title}</h4>
            </div>
            <div className="slots-grid grid grid-cols-4 gap-1">
                {slots.map(slot => {
                    const appointment = appointments.find(a => a.providerId === provider.id && new Date(a.start).getTime() === slot.getTime());
                    const timeOff = timeOffs.find(to => to.providerId === provider.id && to.date === currentDateISO && slot.toTimeString().substring(0,5) >= to.startTime && slot.toTimeString().substring(0,5) < to.endTime);

                    return (
                        <div key={slot.toISOString()} className="h-12 relative group">
                            <div className="absolute top-0 right-0 -mt-2 mr-1 text-[10px] text-slate-400 z-10 hidden group-hover:block">{toGregorianTimeString(slot)}</div>
                            {appointment ? <AppointmentCard appointment={appointment} />
                             : timeOff ? <div className="h-full w-full rounded-md bg-slate-200 text-slate-500 text-xs text-center flex items-center justify-center p-1 select-none" title={timeOff.description}>{timeOff.description}</div>
                             : <div className="h-full w-full rounded-md hover:bg-green-100 transition-colors cursor-pointer border border-dashed border-slate-200 hover:border-green-400" onClick={() => handleManualBook(slot)}>
                                    <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
                                    </div>
                               </div>
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="doctor-card bg-white rounded-xl overflow-hidden shadow-soft border border-slate-200">
            <div className="doctor-header p-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">{provider.name} <span className="text-sm font-medium text-slate-500">({provider.specialty})</span></h3>
            </div>
            <div className="sessions-container p-3">
                {renderSession('الفترة الصباحية', <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-.707 7.072l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>, morningSlots)}
                {renderSession('الفترة المسائية', <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>, afternoonSlots)}
            </div>
        </div>
    );
};


interface DayViewProps {
  currentDate: Date;
  selectedSpecialty: Specialty;
  selectedProviderId: string | null;
  fileNo: string;
  createAppointment: (fileNo: string, provider: Provider, start: Date, end: Date, type: AppointmentType) => void;
}

const DayView: React.FC<DayViewProps> = ({ currentDate, selectedSpecialty, selectedProviderId, fileNo, createAppointment }) => {
  const { providers, vacations } = useAppContext();
  
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
    <div className="p-4 bg-slate-50 h-full overflow-y-auto space-y-4">
        {activeProviders.map(provider => (
            <DoctorCard 
                key={provider.id} 
                provider={provider} 
                currentDate={currentDate} 
                fileNo={fileNo} 
                createAppointment={createAppointment}
            />
        ))}
    </div>
  );
};

export default DayView;
