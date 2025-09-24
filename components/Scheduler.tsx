import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ViewType, Specialty, AppointmentType, AuditAction, type Provider } from '../types';
import DayView from './views/DayView';
import WeekView from './views/WeekView';
import MonthView from './views/MonthView';
import { useAppContext } from '../context/AppContext';
import { addDays, addWeeks, addMonths, getISODateString, toGregorianDateString, getStartOfWeek, toHijriDateString, toGregorianTimeString } from '../utils/dateUtils';
import SettingsModal from './modals/SettingsModal';
import HomeExercisesModal from './modals/HomeExercisesModal';
import { SLOT_DURATION_MINUTES } from '../constants';
import Modal from './common/Modal';
import { generateUniqueId } from '../utils/helpers';
import { findNextAvailableSlot } from './views/ProviderView';

// Helper function to get the initial date, avoiding weekends based on standard Friday/Saturday.
// This runs before component instantiation, so it cannot access context/settings.
const getInitialDate = (): Date => {
  let date = new Date();
  // If it's Friday (5), move to next Sunday (+2 days)
  if (date.getDay() === 5) {
    date = addDays(date, 2);
  } 
  // If it's Saturday (6), move to next Sunday (+1 day)
  else if (date.getDay() === 6) {
    date = addDays(date, 1);
  }
  return date;
};

const specialtyBadgeColors: { [key in Specialty]?: string } = {
    [Specialty.MSK]: 'badge-msk',
    [Specialty.Neuro]: 'badge-neuro',
    [Specialty.PT_Service]: 'badge-pt-service',
};

const Scheduler: React.FC = () => {
  const { providers, settings, appointments, setAppointments, vacations, extraCapacities, showToast, logAudit, logEmergency } = useAppContext();
  const [currentDate, setCurrentDate] = useState(getInitialDate());
  const [view, setView] = useState<ViewType>(ViewType.Week);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>(Specialty.All);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'booked'>('all');

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isHepModalOpen, setIsHepModalOpen] = useState(false);
  
  // State for the new FAB Quick Book feature
  const [fabFileNo, setFabFileNo] = useState('');
  const [fabSpecialty, setFabSpecialty] = useState<Specialty>(Specialty.All);
  
  useEffect(() => {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  }, []);
  
  const handleProviderSelect = (id: string | null) => {
    setSelectedProviderId(id);
    setIsProviderModalOpen(false); // Close modal on selection
  }
  
  const handleSpecialtySelect = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setSelectedProviderId(null);
    setIsProviderModalOpen(false); // Close modal on selection
  }

  const findNearestAppointment = useCallback((type: AppointmentType, specialty: Specialty) => {
    let searchDaysLimit = 30;
    switch(type) {
      case AppointmentType.Urgent: searchDaysLimit = settings.urgentDaysAhead; break;
      case AppointmentType.SemiUrgent: searchDaysLimit = settings.semiUrgentDaysAhead; break;
      case AppointmentType.Normal: searchDaysLimit = settings.normalDaysAhead; break;
      case AppointmentType.Chronic: searchDaysLimit = settings.chronicWeeksAhead * 7; break;
    }

    const today = new Date();
    for (let i = 0; i < searchDaysLimit; i++) {
        const date = addDays(today, i);
        const dateISO = getISODateString(date);
        const dayOfWeek = date.getDay();

        if ((settings.blockFridays && dayOfWeek === 5) || (settings.blockWeekends && dayOfWeek === 6)) continue;

        const isGlobalVacation = vacations.some(v => !v.providerId && dateISO >= v.startDate && dateISO <= v.endDate);
        if (isGlobalVacation) continue;

        let eligibleProviders = providers.filter(p => 
            (p.specialty === specialty || specialty === Specialty.All) &&
            p.days.includes(dayOfWeek) &&
            !vacations.some(v => v.providerId === p.id && dateISO >= v.startDate && dateISO <= v.endDate)
        );

        if (eligibleProviders.length === 0) continue;

        const providerAvailability = eligibleProviders.map(p => {
            const bookedCount = appointments.filter(a => a.providerId === p.id && getISODateString(new Date(a.start)) === dateISO).length;
            const extra = extraCapacities.find(e => e.providerId === p.id && e.date === dateISO)?.slots || 0;
            const capacity = p.dailyCapacity + extra;
            const availableSlotsCount = capacity - bookedCount;
            return { provider: p, availableSlotsCount };
        }).filter(pa => pa.availableSlotsCount > 0);

        if (providerAvailability.length === 0) continue;

        const targetProvider = providerAvailability[0].provider;

        const nextSlotTime = findNextAvailableSlot(targetProvider.id, date, appointments, settings);
        if (nextSlotTime) {
            return { provider: targetProvider, date, time: nextSlotTime };
        }
    }
    return null;
  }, [providers, appointments, settings, vacations, extraCapacities]);

  const handleFabBook = (type: AppointmentType) => {
    if (!fabFileNo.trim()) {
      showToast('يرجى إدخال رقم الملف أولاً', 'error');
      return;
    }

    // Urgent bookings have special over-capacity logic
    if (type === AppointmentType.Urgent) {
      if(fabSpecialty === Specialty.All) {
        showToast('يرجى اختيار تخصص للحالة العاجلة', 'error');
        return;
      }

      let foundSlot = false;
      // Search next 3 days
      for (let i = 0; i < 3; i++) {
          const date = addDays(new Date(), i);
          const dateISO = getISODateString(date);
          const dayOfWeek = date.getDay();

          if ((settings.blockFridays && dayOfWeek === 5) || (settings.blockWeekends && dayOfWeek === 6)) continue;

          const isGlobalVacation = vacations.some(v => !v.providerId && dateISO >= v.startDate && dateISO <= v.endDate);
          if (isGlobalVacation) continue;

          const specialtyProviders = providers.filter(p => 
              p.specialty === fabSpecialty &&
              p.days.includes(dayOfWeek) &&
              !vacations.some(v => v.providerId === p.id && dateISO >= v.startDate && dateISO <= v.endDate)
          );

          if (specialtyProviders.length > 0) {
              const provider = specialtyProviders[0]; // Take the first available provider
              const providerAppointments = appointments
                  .filter(a => a.providerId === provider.id && getISODateString(new Date(a.start)) === dateISO)
                  .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

              let nextStartTime: Date;
              if (providerAppointments.length > 0) {
                  const lastAppointment = providerAppointments[providerAppointments.length - 1];
                  nextStartTime = new Date(new Date(lastAppointment.end).getTime()); // Start right after the last one ends
              } else {
                  // Book at the end of the afternoon shift if the clinic is empty
                  const endHour = Math.floor(settings.afternoonEndHour);
                  const endMinutes = (settings.afternoonEndHour % 1) * 60;
                  nextStartTime = new Date(date.setHours(endHour, endMinutes, 0, 0));
              }
              
              const newAppointment = {
                  id: generateUniqueId(),
                  fileNo: fabFileNo,
                  providerId: provider.id,
                  start: nextStartTime.toISOString(),
                  end: new Date(nextStartTime.getTime() + SLOT_DURATION_MINUTES * 60000).toISOString(),
                  type: AppointmentType.Urgent,
                  createdAt: new Date().toISOString(),
              };

              setAppointments(prev => [...prev, newAppointment]);
              logEmergency({
                fileNo: fabFileNo,
                providerId: provider.id,
                providerName: provider.name,
                appointmentStart: newAppointment.start,
              });
              showToast(`تم حجز موعد عاجل (فوق السعة) للملف ${fabFileNo} مع ${provider.name}`, 'success');

              setFabFileNo('');
              setFabSpecialty(Specialty.All);
              setIsFabOpen(false);
              foundSlot = true;
              break; // Exit loop
          }
      }

      if (!foundSlot) {
          showToast(`لم يتم العثور على عيادة متاحة لحجز الموعد العاجل خلال 3 أيام`, 'error');
      }
      return; // End execution for urgent type
    }

    // Standard booking for other types
    const result = findNearestAppointment(type, fabSpecialty);

    if (result) {
      const { provider, date, time } = result;
      const start = new Date(`${getISODateString(date)}T${time}:00`);
      const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60000);
      
      const newAppointment = {
        id: generateUniqueId(),
        fileNo: fabFileNo,
        providerId: provider.id,
        start: start.toISOString(),
        end: end.toISOString(),
        type: type,
        createdAt: new Date().toISOString(),
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      showToast(`تم حجز موعد للملف ${fabFileNo} مع ${provider.name} يوم ${toGregorianDateString(start)}`, 'success');
      
      logAudit({
        action: AuditAction.Create,
        fileNo: fabFileNo,
        providerId: provider.id,
        providerName: provider.name,
        start: start.toISOString(),
        end: end.toISOString(),
        details: `حجز سريع - ${type}`,
      });

      // Reset FAB state
      setFabFileNo('');
      setFabSpecialty(Specialty.All);
      setIsFabOpen(false);
    } else {
      showToast(`لم يتم العثور على موعد متاح للتخصص المطلوب (${type})`, 'error');
    }
  };
  
  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      const specialtyMatch = selectedSpecialty === Specialty.All || p.specialty === selectedSpecialty;
      return specialtyMatch;
    });
  }, [providers, selectedSpecialty]);
  
  const navigateDate = useCallback((direction: number) => {
    let newDate;
    if (view === ViewType.Day) {
      newDate = new Date(currentDate);
      let safetyCounter = 0; // To prevent infinite loops if all days are blocked
      do {
        newDate = addDays(newDate, direction);
        safetyCounter++;
        if (safetyCounter > 7) {
          console.error("All days of the week seem to be blocked by settings.");
          // Fallback to simple date change to avoid browser freezing
          newDate = addDays(new Date(currentDate), direction);
          break;
        }
      } while ((settings.blockFridays && newDate.getDay() === 5) || (settings.blockWeekends && newDate.getDay() === 6));
    } else {
      newDate = view === ViewType.Week ? addWeeks(currentDate, direction) : addMonths(currentDate, direction);
    }
    setCurrentDate(newDate);
  }, [view, currentDate, settings.blockFridays, settings.blockWeekends]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Do not navigate if a modal is open or if an input element is focused
        if (isSettingsModalOpen || isProviderModalOpen || isHepModalOpen || isFabOpen) return;
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;

        if (e.key === 'ArrowRight') {
            navigateDate(1);
        } else if (e.key === 'ArrowLeft') {
            navigateDate(-1);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigateDate, isSettingsModalOpen, isProviderModalOpen, isHepModalOpen, isFabOpen]);

  const handleGoToToday = () => {
    let today = new Date();
    if (view === ViewType.Day) {
      // If today is a blocked day, advance to the next available working day
      if ((settings.blockFridays && today.getDay() === 5) || (settings.blockWeekends && today.getDay() === 6)) {
        let nextDay = new Date(today);
        let safetyCounter = 0;
        do {
          nextDay = addDays(nextDay, 1);
          safetyCounter++;
          if (safetyCounter > 7) break; // Safety break
        } while ((settings.blockFridays && nextDay.getDay() === 5) || (settings.blockWeekends && nextDay.getDay() === 6));
        setCurrentDate(nextDay);
        return;
      }
    }
    setCurrentDate(today);
  };

  const dateRangeString = useMemo(() => {
    if (view === ViewType.Month) {
      return toGregorianDateString(currentDate, { month: 'long', year: 'numeric' });
    }
    if (view === ViewType.Day) {
      return toGregorianDateString(currentDate, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
    // Week view
    const start = getStartOfWeek(currentDate);
    const end = addDays(start, 4); // Sun to Thu
    return `${toGregorianDateString(start, { day: 'numeric', month: 'long' })} - ${toGregorianDateString(end, { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }, [currentDate, view]);

  const fabActions = [
    { label: 'عاجل', type: AppointmentType.Urgent, handler: handleFabBook, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>, style: 'bg-red-500 hover:bg-red-600' },
    { label: 'شبه عاجل', type: AppointmentType.SemiUrgent, handler: handleFabBook, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5zM10 10a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10.75a.75.75 0 00-.75-.75h-.01zM9.25 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" /></svg>, style: 'bg-amber-500 hover:bg-amber-600' },
    { label: 'اعتيادي', type: AppointmentType.Normal, handler: handleFabBook, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>, style: 'bg-green-500 hover:bg-green-600' },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-200 font-sans text-slate-800">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-2 shadow-xl no-print flex-shrink-0">
          <div className="flex items-center justify-center gap-2 mb-1">
              <img src="/logo.png" alt="شعار مركز التأهيل" className="h-10 w-10 object-contain rounded-lg shadow-lg bg-white/10 p-1" />
              <div className='text-center'>
                <h1 className="text-base sm:text-lg font-black tracking-wide text-white">مستشفى الملك عبدالله - بيشه</h1>
                <h2 className="text-xs sm:text-sm font-bold text-blue-100 mt-0.5">العلاج الطبيعي - الفرز</h2>
              </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <button onClick={() => setIsSettingsModalOpen(true)} className="p-1.5 rounded-full hover:bg-white/20 transition-all shadow-md" title="الإعدادات">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.50 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <button type="button" onClick={() => setIsHepModalOpen(true)} className="inline-flex items-center px-2 py-1.5 rounded-lg border border-white/30 bg-white/15 hover:bg-white/25 text-xs font-bold shadow-md transition-all">التمارين المنزلية</button>
            </div>
            
             <button 
                onClick={() => setIsProviderModalOpen(true)}
                className="md:hidden flex items-center gap-1.5 px-2 py-1.5 bg-white/20 rounded-lg hover:bg-white/30 font-bold transition-all text-xs shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1.447.894l-2-1A1 1 0 018 16v-3.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
                <span>تصفية</span>
            </button>
          </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* --- Providers Sidebar (Right) --- */}
        <aside className="w-44 bg-slate-50 border-l border-slate-300 p-2 flex-col no-print hidden md:flex shadow-lg">
          <div className='flex flex-col items-start gap-1.5 mb-2'>
            <h3 className="text-sm font-extrabold text-slate-800 px-1">العيادات</h3>
            <div className="flex flex-col gap-1 w-full">
                {(Object.values(Specialty)).map(key => (
                    <button key={key} onClick={() => handleSpecialtySelect(key)}
                        className={`w-full px-2 py-1.5 text-xs rounded-lg transition-all text-center font-semibold shadow-md ${selectedSpecialty === key ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:shadow-lg'}`}>
                        {key}
                    </button>
                ))}
            </div>
          </div>

          <div className='flex flex-col items-start gap-1.5 mb-4'>
            <h3 className="text-sm font-extrabold text-slate-800 px-1">حالة الحجز</h3>
            <div className="flex bg-slate-200 p-1 rounded-lg w-full text-center">
              <button onClick={() => setAvailabilityFilter('all')} className={`flex-1 text-[11px] px-1 py-1.5 rounded-md transition-all font-semibold ${availabilityFilter === 'all' ? 'bg-white shadow-sm' : 'text-slate-600 hover:bg-slate-300/50'}`}>الكل</button>
              <button onClick={() => setAvailabilityFilter('available')} className={`flex-1 text-[11px] px-1 py-1.5 rounded-md transition-all font-semibold ${availabilityFilter === 'available' ? 'bg-white shadow-sm' : 'text-slate-600 hover:bg-slate-300/50'}`}>متاح</button>
              <button onClick={() => setAvailabilityFilter('booked')} className={`flex-1 text-[11px] px-1 py-1.5 rounded-md transition-all font-semibold ${availabilityFilter === 'booked' ? 'bg-white shadow-sm' : 'text-slate-600 hover:bg-slate-300/50'}`}>محجوز</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1">
            {filteredProviders.length > 0 ? filteredProviders.map(provider => (
              <div key={provider.id} onClick={() => handleProviderSelect(provider.id === selectedProviderId ? null : provider.id)}
                  className={`p-2 rounded-lg cursor-pointer transition-all border ${selectedProviderId === provider.id ? 'bg-blue-50 border-blue-300 shadow-md' : 'bg-white border-slate-200 hover:bg-slate-50 hover:shadow-sm'}`}>
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="font-bold text-xs leading-tight break-words">{provider.name}</span>
                    <span className={`badge ${specialtyBadgeColors[provider.specialty]}`}>{provider.specialty}</span>
                  </div>
              </div>  
            )) : <div className="text-center p-2 text-slate-500 text-xs">لا يوجد معالجون.</div>}
          </div>
        </aside>

        {/* --- Main Content Area (Left) --- */}
        <main className="flex-1 flex flex-col bg-slate-200 p-1 overflow-hidden">
             <div className="flex-grow flex flex-col bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="flex-shrink-0 border-b border-slate-200 p-1.5 flex flex-wrap justify-between items-center gap-2">
                    <div className="flex bg-slate-100 p-1 rounded-lg shadow-inner">
                        {(Object.values(ViewType)).map(key => (
                        <button key={key} onClick={() => setView(key)} className={`px-3 py-1.5 text-xs rounded-md transition-all font-bold ${view === key ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white hover:shadow-md'}`}>
                            { {day: 'يومي', week: 'أسبوعي', month: 'شهري'}[key] }
                        </button>
                        ))}
                    </div>
                     <div className='flex items-center gap-2 sm:gap-3'>
                       <button onClick={() => navigateDate(-1)} className="p-2 rounded-lg hover:bg-slate-100 transition-all" aria-label="Previous Day / Week">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                       </button>
                       <div className="text-center min-w-[150px] sm:min-w-[220px]">
                           <span className="font-extrabold text-slate-800 text-sm sm:text-base block">{dateRangeString}</span>
                           <span className="text-xs text-slate-500 font-normal block">{toHijriDateString(currentDate)}</span>
                       </div>
                       <button onClick={() => navigateDate(1)} className="p-2 rounded-lg hover:bg-slate-100 transition-all" aria-label="Next Day / Week">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                       </button>
                     </div>
                     <button onClick={handleGoToToday} className="px-3 sm:px-4 py-1.5 text-xs bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-bold transition-all shadow-sm">اليوم</button>
                </div>
                 <div className="flex-grow overflow-auto">
                    {view === ViewType.Day && <DayView currentDate={currentDate} selectedProviderId={selectedProviderId} selectedSpecialty={selectedSpecialty} availabilityFilter={availabilityFilter} navigateDate={navigateDate} />}
                    {view === ViewType.Week && <WeekView currentDate={currentDate} selectedProviderId={selectedProviderId} selectedSpecialty={selectedSpecialty} availabilityFilter={availabilityFilter} />}
                    {view === ViewType.Month && <MonthView currentDate={currentDate} setCurrentDate={setCurrentDate} setView={setView} selectedProviderId={selectedProviderId} selectedSpecialty={selectedSpecialty} />}
                </div>
            </div>
        </main>
      </div>

      {/* --- Floating Action Button & Menu --- */}
      {/* FAB Menu */}
      <div
        id="fab-menu"
        className={`fixed bottom-24 left-4 z-30 transition-all duration-300 ease-in-out ${isFabOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-hidden={!isFabOpen}
      >
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-2xl w-72 space-y-3 border border-slate-200">
          <h4 className="font-bold text-slate-800 text-center">حجز سريع</h4>
          <input type="text" value={fabFileNo} onChange={e => setFabFileNo(e.target.value)} placeholder="رقم الملف" className="w-full text-center p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1 text-center">اختر التخصص</div>
            <div className="grid grid-cols-4 gap-1">
              {Object.values(Specialty).map(s => (
                <button key={s} onClick={() => setFabSpecialty(s)} className={`px-1 py-1 text-xs rounded-md ${fabSpecialty === s ? 'bg-blue-600 text-white' : 'bg-slate-200 hover:bg-slate-300'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {fabActions.map(action => (
              <button key={action.label} onClick={() => action.handler(action.type)} className={`flex flex-col items-center justify-center gap-1 text-white p-2 rounded-lg shadow-md text-[10px] font-semibold transition-transform transform hover:scale-105 ${action.style}`}>
                 {action.icon}
                 <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* FAB Button */}
      <button 
        onClick={() => setIsFabOpen(!isFabOpen)} 
        className={`fixed bottom-4 left-4 z-40 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 active:scale-100 ${isFabOpen ? 'rotate-45' : ''}`}
        aria-label={isFabOpen ? "إغلاق قائمة الحجز السريع" : "فتح قائمة الحجز السريع"}
        aria-expanded={isFabOpen}
        aria-controls="fab-menu"
      >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
      </button>

      <Modal isOpen={isProviderModalOpen} onClose={() => setIsProviderModalOpen(false)} title="تصفية العرض">
        <div className='flex flex-col items-start gap-2 mb-3'>
          <h3 className="text-lg font-bold text-slate-800 px-1">العيادات</h3>
          <div className="grid grid-cols-2 gap-2 w-full">
              {(Object.values(Specialty)).map(key => (
                  <button key={key} onClick={() => handleSpecialtySelect(key)}
                      className={`w-full px-2 py-3 text-sm rounded-lg transition-colors text-center ${selectedSpecialty === key ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                      {key}
                  </button>
              ))}
          </div>
        </div>
        
        <div className='flex flex-col items-start gap-2 mb-4'>
            <h3 className="text-lg font-bold text-slate-800 px-1">حالة الحجز</h3>
            <div className="grid grid-cols-3 gap-2 w-full text-center">
              <button onClick={() => setAvailabilityFilter('all')} className={`w-full px-2 py-3 text-sm rounded-lg transition-colors ${availabilityFilter === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>الكل</button>
              <button onClick={() => setAvailabilityFilter('available')} className={`w-full px-2 py-3 text-sm rounded-lg transition-colors ${availabilityFilter === 'available' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>متاح</button>
              <button onClick={() => setAvailabilityFilter('booked')} className={`w-full px-2 py-3 text-sm rounded-lg transition-colors ${availabilityFilter === 'booked' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>محجوز</button>
            </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-800 px-1 mt-4">المعالجون</h3>
          {filteredProviders.length > 0 ? filteredProviders.map(provider => (
            <div key={provider.id} onClick={() => handleProviderSelect(provider.id === selectedProviderId ? null : provider.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all border-2 flex items-center justify-between ${selectedProviderId === provider.id ? 'bg-blue-100 border-blue-400 shadow-md' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}>
                <div className="flex flex-col items-start">
                  <span className="font-bold text-md">{provider.name}</span>
                  <span className={`badge ${specialtyBadgeColors[provider.specialty]}`}>{provider.specialty}</span>
                </div>
                {selectedProviderId === provider.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                )}
            </div>  
          )) : <div className="text-center p-4 text-slate-500">لا يوجد معالجون.</div>}
        </div>
      </Modal>

      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
      <HomeExercisesModal open={isHepModalOpen} onClose={() => setIsHepModalOpen(false)} />
    </div>
  );
};

export default Scheduler;