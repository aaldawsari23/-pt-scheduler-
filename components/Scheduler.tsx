import React, { useState, useCallback, useEffect } from 'react';
import { ViewType, AppointmentType, Specialty, Provider, AuditAction } from '../types';
import DayView from './views/DayView';
import WeekView from './views/WeekView';
import MonthView from './views/MonthView';
import { useAppContext } from '../context/AppContext';
import { generateUniqueId } from '../utils/helpers';
import { addDays, addWeeks, addMonths, getISODateString, toHijriDateString, toGregorianDateString, toGregorianTimeString } from '../utils/dateUtils';
import SettingsModal from './modals/SettingsModal';
import HepModal from './modals/HepModal';
import { ASEER_LOGO_URL, WORK_HOURS, SLOT_DURATION_MINUTES } from '../constants';
import BookingBar from './BookingBar';
import StatsBar from './common/StatsBar';
import LanguageToggle from './common/LanguageToggle';
import ManualBookingModal from './modals/ManualBookingModal';


const Header: React.FC<{ onSettingsClick: () => void; onHepClick: () => void; onManualBookingClick: () => void; logo: string }> = 
  ({ onSettingsClick, onHepClick, onManualBookingClick, logo }) => (
  <header className="bg-white shadow-sm p-4 flex justify-between items-center no-print">
    <div className="flex items-center gap-4">
      <img src={logo} alt="شعار تجمع عسير الصحي" className="h-14 w-14 object-contain" />
      <div>
        <h1 className="text-xl font-bold text-blue-800">مستشفى الملك عبدالله – بيشة</h1>
        <h2 className="text-md text-slate-600">مركز التأهيل الطبي – قسم العلاج الطبيعي</h2>
      </div>
    </div>
    <div className="flex gap-2 items-center">
       <LanguageToggle />
       <button onClick={onManualBookingClick} className="p-2 rounded-full hover:bg-slate-100 transition-all group" title="حجز موعد يدوي">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
           <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
         </svg>
       </button>
       <button onClick={onHepClick} className="p-2 rounded-full hover:bg-slate-100 transition-all group" title="مكتبة التمارين المنزلية">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 group-hover:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h3m-3 4h3m-3 4h3" /></svg>
      </button>
      <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-slate-100 transition-all group" title="الإعدادات">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      </button>
    </div>
  </header>
);

interface BookingParams {
  fileNo: string;
  bookingType: AppointmentType;
  specialty: Specialty;
  timeOfDay?: 'morning' | 'afternoon';
  providerId?: string | null;
}

const Scheduler: React.FC = () => {
  const { providers, appointments, setAppointments, vacations, timeOffs, extraCapacities, settings, showToast, logAudit } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>(ViewType.Day);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>(Specialty.All);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [fileNo, setFileNo] = useState('');

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHepModalOpen, setIsHepModalOpen] = useState(false);
  const [isManualBookingModalOpen, setIsManualBookingModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = settings.language || 'ar';
    document.documentElement.dir = (settings.language === 'en') ? 'ltr' : 'rtl';
  }, [settings.language]);
  
  const logo = settings.customLogoB64 || ASEER_LOGO_URL;
  const hijriDateStr = toHijriDateString(currentDate);

  const handleSpecialtyChange = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setSelectedProviderId(null); // Deselect provider when specialty changes
  };

  const handleProviderSelect = (id: string | null) => {
    setSelectedProviderId(id);
    if (id) {
        setView(ViewType.Day);
    }
  };

  const createAppointment = useCallback((
    fileNoToBook: string,
    provider: Provider,
    start: Date,
    end: Date,
    type: AppointmentType
  ) => {
    const newAppointment = {
      id: generateUniqueId(),
      fileNo: fileNoToBook,
      providerId: provider.id,
      start: start.toISOString(),
      end: end.toISOString(),
      type,
      createdAt: new Date().toISOString(),
    };
    setAppointments([...appointments, newAppointment]);
    const hijriStr = toHijriDateString(start);
    showToast(
      `تم حجز موعد للملف ${fileNoToBook} يوم ${toGregorianDateString(start)} (${hijriStr}) الساعة ${toGregorianTimeString(start)} مع ${provider.name}`,
      'success'
    );
     logAudit({
      action: AuditAction.Create,
      fileNo: fileNoToBook,
      providerId: provider.id,
      providerName: provider.name,
      start: start.toISOString(),
      end: end.toISOString(),
      details: type,
    });
    setFileNo(''); // Clear file number after successful booking
  }, [appointments, setAppointments, showToast, logAudit]);

  const findAndBookSlot = useCallback(({ fileNo, bookingType, specialty, timeOfDay, providerId }: BookingParams) => {
    if (!fileNo.trim()) {
      showToast('الرجاء إدخال رقم الملف أولاً.', 'error');
      return;
    }
    if (settings.bookingLocked) {
        showToast('الحجز متوقف حاليًا. يرجى مراجعة الإدارة.', 'error');
        return;
    }

    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    // Apply advanced booking rules
    const daysAhead = bookingType === AppointmentType.Urgent ? settings.urgentDaysAhead :
                      bookingType === AppointmentType.SemiUrgent ? settings.semiUrgentDaysAhead :
                      bookingType === AppointmentType.Chronic ? settings.chronicWeeksAhead * 7 :
                      settings.normalDaysAhead;

    // Note: Follow-up logic was here, removed as per UI changes.
    // Settings for follow-ups remain for potential future use.
    
    if (settings.bookingLockDate && new Date(settings.bookingLockDate) >= startDate) {
      startDate = addDays(new Date(settings.bookingLockDate), 1);
    }

    const effectiveBookingType = bookingType === AppointmentType.Nearest ? AppointmentType.Normal : bookingType;
    const isUrgent = [AppointmentType.Urgent, AppointmentType.SemiUrgent].includes(effectiveBookingType);
    
    const searchStartHour = timeOfDay === 'afternoon' ? settings.afternoonStartHour : settings.morningStartHour;
    const searchEndHour = timeOfDay === 'morning' ? settings.morningEndHour : settings.afternoonEndHour;
    
    for (let i = 0; i < daysAhead; i++) {
        const searchDate = addDays(startDate, i);
        const dayOfWeek = searchDate.getDay();
        const searchDateISO = getISODateString(searchDate);

        // Skip weekends based on settings
        if (settings.blockFridays && dayOfWeek === 5) continue;
        if (settings.blockWeekends && dayOfWeek === 6) continue;

        let potentialProviders = providers.filter(p => p.days.includes(dayOfWeek));
        if (providerId) {
            potentialProviders = potentialProviders.filter(p => p.id === providerId);
        } else if (specialty !== Specialty.All) {
            potentialProviders = potentialProviders.filter(p => p.specialty === specialty);
        }
        
        if (potentialProviders.length === 0) continue;
        
        const appointmentsOnDay = appointments.filter(a => getISODateString(new Date(a.start)) === searchDateISO);
        
        let providersToCheck;
        if (settings.autoDistributeBookings && !providerId) {
            // Sort by load for auto-distribution
            providersToCheck = potentialProviders.map(p => ({
                provider: p,
                load: appointmentsOnDay.filter(a => a.providerId === p.id).length
            })).sort((a, b) => a.load - b.load).map(p => p.provider);
        } else {
            providersToCheck = potentialProviders;
        }
        
        for (const provider of providersToCheck) {
            const isOnVacation = vacations.some(v => {
                const vacStart = new Date(v.startDate); vacStart.setHours(0,0,0,0);
                const vacEnd = new Date(v.endDate); vacEnd.setHours(23,59,59,999);
                return searchDate >= vacStart && searchDate <= vacEnd && (!v.providerId || v.providerId === provider.id);
            });
            if (isOnVacation) continue;

            const extraCapacity = extraCapacities.find(ec => ec.providerId === provider.id && ec.date === searchDateISO)?.slots || 0;
            let capacity = provider.dailyCapacity + extraCapacity;
            
            const providerAppointmentsCount = appointmentsOnDay.filter(a => a.providerId === provider.id).length;
            const urgentReserveUsed = settings.urgentReserve && isUrgent && providerAppointmentsCount > 0 && appointmentsOnDay.some(a => a.providerId === provider.id && [AppointmentType.Urgent].includes(a.type));
            if (settings.urgentReserve && isUrgent && !urgentReserveUsed) capacity += 1;
            if (providerAppointmentsCount >= capacity) continue;

            if(provider.isNewPatientProvider && [AppointmentType.Normal, AppointmentType.Nearest, AppointmentType.Chronic].includes(effectiveBookingType)){
                const newPatientCount = appointmentsOnDay.filter(a => a.providerId === provider.id && [AppointmentType.Normal, AppointmentType.Nearest, AppointmentType.Chronic].includes(a.type)).length;
                if(newPatientCount >= provider.newPatientQuota) continue;
            }

            for (let hour = searchStartHour; hour < searchEndHour; hour += (SLOT_DURATION_MINUTES / 60)) {
                const slotStart = new Date(searchDate);
                slotStart.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
                
                const isTimeOff = timeOffs.some(to => {
                    if (to.providerId !== provider.id || to.date !== searchDateISO) return false;
                    const timeOffStart = new Date(`${to.date}T${to.startTime}:00`);
                    const timeOffEnd = new Date(`${to.date}T${to.endTime}:00`);
                    return slotStart >= timeOffStart && slotStart < timeOffEnd;
                });
                if (isTimeOff) continue;

                const isSlotTaken = appointmentsOnDay.some(a => a.providerId === provider.id && new Date(a.start).getTime() === slotStart.getTime());
                if (!isSlotTaken) {
                    const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MINUTES * 60000);
                    createAppointment(fileNo, provider, slotStart, slotEnd, effectiveBookingType);
                    return;
                }
            }
        }
    }
    showToast('لم يتم العثور على موعد متاح. يرجى المحاولة مرة أخرى أو مراجعة الإعدادات.', 'error');
  }, [providers, appointments, vacations, timeOffs, extraCapacities, settings, createAppointment, showToast, logAudit]);

  return (
    <div className="flex flex-col h-screen">
      <Header logo={logo} onSettingsClick={() => setIsSettingsModalOpen(true)} onHepClick={() => setIsHepModalOpen(true)} onManualBookingClick={() => setIsManualBookingModalOpen(true)} />

      <BookingBar 
        fileNo={fileNo}
        onFileNoChange={setFileNo}
        onBook={findAndBookSlot}
        onManualBookClick={() => setIsManualBookingModalOpen(true)}
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={handleSpecialtyChange}
        providers={providers}
        selectedProviderId={selectedProviderId}
        onProviderSelect={handleProviderSelect}
      />
      
      <StatsBar currentDate={currentDate} selectedProviderId={selectedProviderId} />

      <main className="flex-grow flex flex-col p-2 sm:p-4 overflow-hidden no-print">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 sm:gap-2">
               <button onClick={() => setCurrentDate(new Date())} 
                       className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold shadow-md hover:shadow-lg transition-all">
                 اليوم
               </button>
               <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button onClick={() => {
                  const newDate = view === ViewType.Day ? addDays(currentDate, -1) :
                                 view === ViewType.Week ? addWeeks(currentDate, -1) :
                                 addMonths(currentDate, -1);
                  setCurrentDate(newDate);
                }} className="p-2 rounded hover:bg-white transition-all" title={view === ViewType.Day ? 'اليوم السابق' : view === ViewType.Week ? 'الأسبوع السابق' : 'الشهر السابق'}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </button>
                <button onClick={() => {
                  const newDate = view === ViewType.Day ? addDays(currentDate, 1) :
                                 view === ViewType.Week ? addWeeks(currentDate, 1) :
                                 addMonths(currentDate, 1);
                  setCurrentDate(newDate);
                }} className="p-2 rounded hover:bg-white transition-all" title={view === ViewType.Day ? 'اليوم التالي' : view === ViewType.Week ? 'الأسبوع التالي' : 'الشهر التالي'}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                </button>
               </div>
            </div>
            <div className="text-lg sm:text-xl font-semibold text-slate-700 hidden sm:block text-center">
              <div>{toGregorianDateString(currentDate, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              {hijriDateStr && <div className="text-sm font-normal text-slate-500">{hijriDateStr}</div>}
            </div>
            {!selectedProviderId && (
              <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 p-1 rounded-lg shadow-inner">
                <button onClick={() => setView(ViewType.Day)} 
                        className={`px-4 py-1.5 text-sm rounded-md transition-all ${view === ViewType.Day ? 
                          'bg-white shadow-md text-blue-600 font-semibold transform scale-105' : 
                          'text-slate-600 hover:bg-white/70'}`}>
                  يوم
                </button>
                <button onClick={() => setView(ViewType.Week)} 
                        className={`px-4 py-1.5 text-sm rounded-md transition-all ${view === ViewType.Week ? 
                          'bg-white shadow-md text-blue-600 font-semibold transform scale-105' : 
                          'text-slate-600 hover:bg-white/70'}`}>
                  أسبوع
                </button>
                <button onClick={() => setView(ViewType.Month)} 
                        className={`px-4 py-1.5 text-sm rounded-md transition-all ${view === ViewType.Month ? 
                          'bg-white shadow-md text-blue-600 font-semibold transform scale-105' : 
                          'text-slate-600 hover:bg-white/70'}`}>
                  شهر
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-grow overflow-auto bg-white rounded-xl shadow-lg border border-slate-200 min-h-0">
            {view === ViewType.Day && <DayView currentDate={currentDate} selectedProviderId={selectedProviderId} fileNo={fileNo} createAppointment={createAppointment} selectedSpecialty={selectedSpecialty} />}
            {view === ViewType.Week && !selectedProviderId && <WeekView currentDate={currentDate} setCurrentDate={setCurrentDate} setView={setView} />}
            {view === ViewType.Month && !selectedProviderId && <MonthView currentDate={currentDate} setCurrentDate={setCurrentDate} setView={setView} />}
        </div>
      </main>
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
      <HepModal isOpen={isHepModalOpen} onClose={() => setIsHepModalOpen(false)} />
      <ManualBookingModal isOpen={isManualBookingModalOpen} onClose={() => setIsManualBookingModalOpen(false)} />
    </div>
  );
};

export default Scheduler;