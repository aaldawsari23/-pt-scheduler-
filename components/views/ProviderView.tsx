import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { WORK_HOURS, SLOT_DURATION_MINUTES } from '../../constants';
import { AppointmentType, AuditAction } from '../../types';
import type { Provider, Appointment } from '../../types';
import { addDays, getISODateString, toHijriDateString, toGregorianDateString, toGregorianTimeString } from '../../utils/dateUtils';

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

const AppointmentCard: React.FC<{ appointment: Appointment; provider: Provider; }> = ({ appointment, provider }) => {
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
        title={`ملف رقم: ${appointment.fileNo}\n(اضغط للإلغاء)`}
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


interface ProviderViewProps {
  providerId: string;
  fileNo: string;
  createAppointment: (fileNo: string, provider: Provider, start: Date, end: Date, type: AppointmentType) => void;
}

const ProviderView: React.FC<ProviderViewProps> = ({ providerId, fileNo, createAppointment }) => {
    const { providers, appointments, vacations, timeOffs, showToast } = useAppContext();
    const provider = providers.find(p => p.id === providerId);

    const upcomingClinicDays = React.useMemo(() => {
        if (!provider || provider.days.length === 0) return [];
        const days = [];
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        while (days.length < 8) { // Get next 8 clinic days
            if (provider.days.includes(currentDate.getDay())) {
                const dayOfWeek = currentDate.getDay();
                if(dayOfWeek !== 5 && dayOfWeek !== 6) { // Exclude Friday and Saturday
                    days.push(new Date(currentDate));
                }
            }
            currentDate = addDays(currentDate, 1);
        }
        return days;
    }, [provider]);
    
    const timeSlots = React.useMemo(() => {
        const slots = [];
        for (let hour = WORK_HOURS.start; hour < WORK_HOURS.end; hour += (SLOT_DURATION_MINUTES / 60)) {
            const d = new Date();
            d.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
            slots.push(d);
        }
        return slots;
    }, []);

    const handleManualBook = (slot: Date) => {
        if (!provider) return;
        if (!fileNo.trim()) {
            showToast('الرجاء إدخال رقم الملف في الشريط العلوي أولاً', 'error');
            return;
        }
        const slotEnd = new Date(slot.getTime() + SLOT_DURATION_MINUTES * 60000);
        createAppointment(fileNo, provider, slot, slotEnd, AppointmentType.Normal);
    };

    if (!provider) {
        return <div className="p-8 text-center text-slate-500">الرجاء اختيار معالج لعرض جدوله.</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 sticky top-0 z-20">
                <h3 className="text-xl font-bold text-slate-800">جدول المعالج: {provider.name}</h3>
                <p className="text-slate-500 text-sm">يعرض 8 أيام العيادة القادمة. انقر على خانة فارغة للحجز مباشرة.</p>
            </div>
            <div className="flex-grow overflow-auto">
                <div className="grid grid-flow-col auto-cols-fr min-w-max">
                    <div className="w-20 text-center border-e-2 border-slate-100">
                        <div className="h-20 sticky top-0 bg-slate-50 z-10 flex items-center justify-center font-semibold text-slate-600 border-b border-slate-200">الوقت</div>
                        {timeSlots.map(time => ( <div key={time.toISOString()} className="h-14 flex items-center justify-center text-sm text-slate-500 border-b border-slate-100">{toGregorianTimeString(time)}</div> ))}
                    </div>

                    {upcomingClinicDays.map(day => {
                        const dayISO = getISODateString(day);
                        const providerVacation = vacations.find(v => (v.providerId === provider.id || !v.providerId) && dayISO >= v.startDate && dayISO <= v.endDate);

                        return (
                            <div key={dayISO} className="border-e border-slate-100 w-48 relative">
                                <div className="h-20 sticky top-0 bg-slate-50 z-10 flex flex-col items-center justify-center border-b border-slate-200 p-1 text-center">
                                    <span className="text-sm font-semibold text-blue-700">{toGregorianDateString(day, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                    <span className="text-xs text-teal-600 font-medium mt-1">{toHijriDateString(day)}</span>
                                </div>
                                {providerVacation && <div className="absolute inset-0 bg-slate-200/50 backdrop-blur-sm z-20 flex items-center justify-center text-slate-500 font-bold text-lg -rotate-15 select-none">{providerVacation.description}</div>}
                                
                                {timeSlots.map(time => {
                                    const slotTime = new Date(day);
                                    slotTime.setHours(time.getHours(), time.getMinutes(), 0, 0);

                                    const appointment = appointments.find(a => a.providerId === provider.id && new Date(a.start).getTime() === slotTime.getTime());
                                    
                                    const timeOff = timeOffs.find(to => {
                                        if(to.providerId !== provider.id || to.date !== dayISO) return false;
                                        const timeOffStart = new Date(`${to.date}T${to.startTime}:00`);
                                        const timeOffEnd = new Date(`${to.date}T${to.endTime}:00`);
                                        return slotTime.getTime() >= timeOffStart.getTime() && slotTime.getTime() < timeOffEnd.getTime();
                                    });

                                    return (
                                        <div key={slotTime.toISOString()} className="h-14 border-b border-slate-100 p-1">
                                            {appointment ? (<AppointmentCard appointment={appointment} provider={provider} />) 
                                            : timeOff ? (<div className="h-full w-full rounded-md bg-slate-200/70 text-slate-500 text-xs text-center flex items-center justify-center p-1 select-none" title={timeOff.description}>{timeOff.description}</div>)
                                            : providerVacation ? <div className="h-full w-full"></div>
                                            : (<div className="h-full w-full rounded-md hover:bg-green-50 transition-colors cursor-pointer group" onClick={() => handleManualBook(slotTime)}>
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
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProviderView;