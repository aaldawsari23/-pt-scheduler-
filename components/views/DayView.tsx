import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { WORK_HOURS, SLOT_DURATION_MINUTES } from '../../constants';
import { AppointmentType, AuditAction } from '../../types';
import type { Appointment, Provider, Specialty } from '../../types';
import { getISODateString, toGregorianDateString, toGregorianTimeString } from '../../utils/dateUtils';

const getAppointmentColor = (type: AppointmentType) => {
    switch(type) {
        case AppointmentType.Urgent: return 'border-red-500 bg-red-100/60 text-red-900';
        case AppointmentType.SemiUrgent: return 'border-amber-500 bg-amber-100/60 text-amber-900';
        case AppointmentType.Chronic: return 'border-indigo-500 bg-indigo-100/60 text-indigo-900';
        case AppointmentType.Normal:
        case AppointmentType.Nearest:
        default: return 'border-sky-500 bg-sky-100/60 text-sky-900';
    }
}

const AppointmentCard: React.FC<{ appointment: Appointment; provider: Provider }> = ({ appointment, provider }) => {
  const { askConfirmation, setAppointments, appointments, showToast, logAudit, settings } = useAppContext();
    
  const handleCancelClick = () => {
    askConfirmation( 'إلغاء الموعد', `هل تريد بالتأكيد إلغاء موعد المراجع صاحب الملف رقم ${appointment.fileNo}؟`, () => {
        setAppointments(appointments.filter(a => a.id !== appointment.id));
        showToast(`تم إلغاء الموعد للملف رقم ${appointment.fileNo}`, 'info');
        logAudit({
            action: AuditAction.Cancel,
            fileNo: appointment.fileNo,
            providerId: provider.id,
            providerName: provider.name,
            start: appointment.start,
            end: appointment.end,
            details: appointment.type
        });
      }
    );
  };

  const handlePrint = () => {
    const start = new Date(appointment.start);
    const logo = settings.customLogoB64 || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTEwMCAxMCBDMTUwLDEwIDE5MCw1MCAxOTAsMTAwIEMxOTAsMTUwIDE1MCwxOTAgMTAwLDE5MCBDNTAsMTkwIDEwLDE1MCAxMCwxMDAgQzEwLDUwIDUwLDEwIDEwMCwxMFoiIGZpbGw9IiMwMDcxYmYiLz4KICA8cGF0aCBkPSJNNzIgMTUwIEM3MiwxNTAgODIsMTMwIDEwMCwxMzAgQzExOCwxMzAgMTI4LDE1MCAxMjgsMTUwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBmaWxsPSJ0cmFuc3BhcmVudCIvPgogIDxwYXRoIGQ9Ik03MCA4MCBDNzAsODAgODAsMTAwIDEwMCwxMDAgQzEyMCwxMDAgMTMwLDgwIDEzMCw4MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KICA8cGF0aCBkPSJNNzAgMTIwIEM3MCwxMjAgODAsMTQwIDEwMCwxNDAgQzEyMCwxNDAgMTMwLDEyMCAxMzAsMTIwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBmaWxsPSJ0cmFuc3BhcmVudCIvPgogIDxwYXRoIGQ9Ik03MCAxMDAgQzcwLDEwMCA4MCwxMjAgMTAwLDEyMCBDMTIwLDEyMCAxMzAsMTAwIDEzMCwxMDAiIHN0cm9rZS1iYWNrZ3JvdW5kPSIjZmZmIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBmaWxsPSJ0cmFuc3BhcmVudCIvPgogIDxwYXRoIGQ9Ik03NSA2MCBDNzUsNjAgODUsODAgMTAwLDgwIEMxMTUsODAgMTI1LDYwIDEyNSw2MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPC9zdmc+';
    const printContent = `
        <html><head><title>تذكرة موعد</title>
        <style>body{font-family: system-ui, sans-serif; direction: rtl; margin: 20px;} .slip{border: 2px solid #ccc; padding: 16px; border-radius: 8px; max-width: 400px; margin: auto;} h1,h2,p{margin:0; padding: 0} .header{text-align: center; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;} .logo { max-height: 60px; margin-bottom: 10px;} .details p { margin-bottom: 8px; font-size: 16px;}</style>
        </head><body><div class="slip">
        <div class="header">
          <img src="${logo}" alt="logo" class="logo"/>
          <h2>مستشفى الملك عبدالله – بيشة</h2>
          <p>مركز التأهيل الطبي – قسم العلاج الطبيعي</p>
        </div>
        <div class="details">
          <p><strong>رقم الملف:</strong> ${appointment.fileNo}</p>
          <p><strong>المعالج:</strong> ${provider.name}</p>
          <p><strong>التاريخ:</strong> ${toGregorianDateString(start)}</p>
          <p><strong>الوقت:</strong> ${toGregorianTimeString(start)}</p>
          <p><strong>نوع الموعد:</strong> ${appointment.type}</p>
        </div>
        </div><script>window.onload = function() { window.print(); window.close(); }</script></body></html>`;
    const printWindow = window.open('', '_blank', 'width=500,height=500');
    if(printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    } else {
      showToast('يرجى السماح بال نوافذ المنبثقة لطباعة الموعد.', 'error');
    }
  };

  return (
    <div
        className={`group relative w-full h-full p-2 rounded-lg text-xs text-right cursor-pointer select-none transition-all duration-200 hover:shadow-lg hover:z-10 ${getAppointmentColor(appointment.type)}`}
        title={`ملف رقم: ${appointment.fileNo}\nالمعالج: ${provider.name}`}
    >
      <div className="flex justify-between items-center">
        <p className="font-bold text-sm">{appointment.fileNo}</p>
        <p className="text-slate-500 text-[10px] font-medium">{toGregorianTimeString(new Date(appointment.start))}</p>
      </div>
      <div className="absolute top-1 left-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={handlePrint} className="p-1.5 bg-white/60 backdrop-blur-sm rounded-md hover:bg-white text-slate-600 hover:text-blue-600" title="طباعة الموعد">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H5zm0 2h10v7h-2V7a1 1 0 00-1-1H6a1 1 0 00-1 1v2H5V4z m2 11a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
        </button>
        <button onClick={handleCancelClick} className="p-1.5 bg-white/60 backdrop-blur-sm rounded-md hover:bg-white text-slate-600 hover:text-red-600" title="إلغاء الموعد">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
};

// Fix: Define DayViewProps interface
interface DayViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedSpecialty: Specialty;
  createAppointment: (fileNo: string, provider: Provider, start: Date, end: Date, type: AppointmentType) => void;
  fileNo: string;
}

const DayView: React.FC<DayViewProps> = ({ currentDate, setCurrentDate, selectedSpecialty, createAppointment, fileNo }) => {
  const { providers, appointments, vacations, timeOffs, showToast } = useAppContext();
  
  const timeSlots = [];
  for (let hour = WORK_HOURS.start; hour < WORK_HOURS.end; hour += (SLOT_DURATION_MINUTES / 60)) {
    const d = new Date(currentDate);
    d.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
    timeSlots.push(d);
  }

  const dayOfWeek = currentDate.getDay();
  const currentDateISO = getISODateString(currentDate);
  
  let activeProviders = providers.filter(p => p.days.includes(dayOfWeek));
  if (selectedSpecialty !== 'الكل') {
    activeProviders = activeProviders.filter(p => p.specialty === selectedSpecialty);
  }

  const isGlobalVacationDay = vacations.some(v => {
      if(v.providerId) return false;
      const vacStart = new Date(v.startDate); vacStart.setHours(0,0,0,0);
      const vacEnd = new Date(v.endDate); vacEnd.setHours(23,59,59,999);
      const current = new Date(currentDate); current.setHours(12,0,0,0);
      return current >= vacStart && current <= vacEnd;
  });

  const handleManualBook = (provider: Provider, slot: Date) => {
    if (!fileNo.trim()) {
        showToast('الرجاء إدخال رقم الملف في الشريط العلوي أولاً', 'error');
        return;
    }
    const slotEnd = new Date(slot.getTime() + SLOT_DURATION_MINUTES * 60000);
    createAppointment(fileNo, provider, slot, slotEnd, AppointmentType.Normal);
  };
    
  const renderEmptyState = (message: string, icon: JSX.Element) => (
      <div className="flex flex-col items-center justify-center col-span-full h-full p-10 text-slate-400 bg-dots">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-full">
            {icon}
          </div>
          <p className="mt-4 text-xl font-semibold bg-white/80 backdrop-blur-sm px-4 py-1 rounded-lg">{message}</p>
          <style>{`.bg-dots { background-image: radial-gradient(circle, #e2e8f0 1px, transparent 1px); background-size: 1rem 1rem; }`}</style>
      </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-auto">
        <div className="grid grid-flow-col auto-cols-fr min-w-max">
            {/* Time Column */}
            <div className="w-20 text-center border-e-2 border-slate-100">
                <div className="h-12 sticky top-0 bg-white z-10 flex items-center justify-center font-semibold text-slate-600 border-b border-slate-200">الوقت</div>
                {timeSlots.map(time => ( <div key={time.toISOString()} className="h-14 flex items-center justify-center text-sm text-slate-500 border-b border-slate-100">{toGregorianTimeString(time)}</div> ))}
            </div>

            {/* Provider Columns */}
            {isGlobalVacationDay ? (
                renderEmptyState('يوم إجازة رسمي', <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>)
            ) : activeProviders.length === 0 ? (
                renderEmptyState(selectedSpecialty === 'الكل' ? 'لا يوجد معالجون في هذا اليوم' : 'لا يوجد معالجون في هذا التخصص اليوم', <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>)
            ) : (
                activeProviders.map(provider => {
                    const providerVacation = vacations.find(v => v.providerId === provider.id && currentDateISO >= v.startDate && currentDateISO <= v.endDate);
                    
                    return (
                        <div key={provider.id} className="border-e border-slate-100 w-48 relative">
                            <div className="h-12 sticky top-0 bg-white z-10 flex items-center justify-center font-semibold text-slate-700 border-b border-slate-200 p-1 text-center">{provider.name}</div>
                            {providerVacation && <div className="absolute inset-0 bg-slate-200/50 backdrop-blur-sm z-20 flex items-center justify-center text-slate-500 font-bold text-lg -rotate-15 select-none">{providerVacation.description}</div>}
                            {timeSlots.map(time => {
                                const appointment = appointments.find(a => a.providerId === provider.id && new Date(a.start).getTime() === time.getTime());
                                const timeOff = timeOffs.find(to => {
                                    if(to.providerId !== provider.id || to.date !== currentDateISO) return false;
                                    const timeOffStart = new Date(`${to.date}T${to.startTime}:00`);
                                    const timeOffEnd = new Date(`${to.date}T${to.endTime}:00`);
                                    return time.getTime() >= timeOffStart.getTime() && time.getTime() < timeOffEnd.getTime();
                                });

                                return (
                                    <div key={time.toISOString()} className="h-14 border-b border-slate-100 p-1">
                                        {appointment ? (<AppointmentCard appointment={appointment} provider={provider} />) 
                                        : timeOff ? (<div className="h-full w-full rounded-md bg-slate-200/70 text-slate-500 text-xs text-center flex items-center justify-center p-1 select-none" title={timeOff.description}>{timeOff.description}</div>)
                                        : providerVacation ? <div className="h-full w-full"></div>
                                        : (<div className="h-full w-full rounded-md hover:bg-green-50 transition-colors cursor-pointer group" onClick={() => handleManualBook(provider, time)}>
                                                <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
                                                </div>
                                           </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })
            )}
        </div>
      </div>
    </div>
  );
};

export default DayView;
