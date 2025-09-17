import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getISODateString } from '../../utils/dateUtils';
import type { Provider } from '../../types';

interface StatsBarProps {
  currentDate: Date;
  selectedProviderId: string | null;
}

const StatsBar: React.FC<StatsBarProps> = ({ currentDate, selectedProviderId }) => {
  const { appointments, providers, vacations, timeOffs, extraCapacities } = useAppContext();
  
  const currentDateISO = getISODateString(currentDate);
  const dayOfWeek = currentDate.getDay();
  
  // Calculate stats
  const activeProviders = providers.filter(p => {
    if (selectedProviderId && p.id !== selectedProviderId) return false;
    if (!p.days.includes(dayOfWeek)) return false;
    if (dayOfWeek === 5 || dayOfWeek === 6) return false; // Friday/Saturday
    
    const isOnVacation = vacations.some(v => {
      const vacStart = new Date(v.startDate);
      vacStart.setHours(0, 0, 0, 0);
      const vacEnd = new Date(v.endDate);
      vacEnd.setHours(23, 59, 59, 999);
      const current = new Date(currentDate); // create a copy
      current.setHours(12,0,0,0); // normalize time to avoid timezone issues near midnight
      return current >= vacStart && current <= vacEnd && 
        (!v.providerId || v.providerId === p.id);
    });
    
    return !isOnVacation;
  });
  
  const todayAppointments = appointments.filter(
    a => {
        if (getISODateString(new Date(a.start)) !== currentDateISO) return false;
        if (selectedProviderId && a.providerId !== selectedProviderId) return false;
        return true;
    }
  );
  
  const totalCapacity = activeProviders.reduce((sum, p) => {
    const extra = extraCapacities.find(
      ec => ec.providerId === p.id && ec.date === currentDateISO
    )?.slots || 0;
    return sum + p.dailyCapacity + extra;
  }, 0);
  
  const bookedSlots = todayAppointments.length;
  const availableSlots = Math.max(0, totalCapacity - bookedSlots);
  const occupancyRate = totalCapacity > 0 ? (bookedSlots / totalCapacity) * 100 : 0;
  
  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'text-red-600 bg-red-50';
    if (rate >= 70) return 'text-amber-600 bg-amber-50';
    if (rate >= 50) return 'text-blue-600 bg-blue-50';
    return 'text-green-600 bg-green-50';
  };
  
  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 no-print">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            <span className="text-sm font-semibold text-slate-600">
              معالجون نشطون: <span className="text-lg text-slate-800 font-bold">{activeProviders.length}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-slate-600">
              محجوز: <span className="text-lg text-sky-600 font-bold">{bookedSlots}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-slate-600">
              متاح: <span className="text-lg text-green-600 font-bold">{availableSlots}</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-full ${getOccupancyColor(occupancyRate)}`}>
            <span className="text-sm font-bold">
              {occupancyRate.toFixed(0)}% ممتلئ
            </span>
          </div>
          
          <div className="relative w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${
                occupancyRate >= 90 ? 'bg-red-500' :
                occupancyRate >= 70 ? 'bg-amber-500' :
                occupancyRate >= 50 ? 'bg-blue-500' : 'bg-green-500'
              }`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
