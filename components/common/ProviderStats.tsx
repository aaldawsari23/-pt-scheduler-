import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getISODateString } from '../../utils/dateUtils';
import type { Provider } from '../../types';

interface ProviderStatsProps {
  currentDate: Date;
  provider: Provider;
}

const ProviderStats: React.FC<ProviderStatsProps> = ({ currentDate, provider }) => {
  const { appointments, extraCapacities, vacations } = useAppContext();
  
  const currentDateISO = getISODateString(currentDate);
  
  // Check if provider is on vacation
  const isOnVacation = vacations.some(v => {
    const vacStart = new Date(v.startDate);
    vacStart.setHours(0, 0, 0, 0);
    const vacEnd = new Date(v.endDate);
    vacEnd.setHours(23, 59, 59, 999);
    const current = new Date(currentDate);
    current.setHours(12,0,0,0);
    return current >= vacStart && current <= vacEnd && 
      (!v.providerId || v.providerId === provider.id);
  });
  
  if (isOnVacation) {
    const vacationInfo = vacations.find(v => (!v.providerId || v.providerId === provider.id) && currentDate >= new Date(v.startDate) && currentDate <= new Date(v.endDate));
    return (
      <div className="bg-slate-200/50 backdrop-blur-sm rounded-lg p-4 text-center border border-slate-300 h-full flex flex-col justify-center items-center">
        <span className="font-bold text-slate-700">{provider.name}</span>
        <span className="mt-2 text-sm text-slate-500 font-semibold">{vacationInfo?.description || 'في إجازة'}</span>
      </div>
    );
  }
  
  const extraCapacity = extraCapacities.find(
    ec => ec.providerId === provider.id && ec.date === currentDateISO
  )?.slots || 0;
  
  const totalCapacity = provider.dailyCapacity + extraCapacity;
  const bookedAppointments = appointments.filter(
    a => a.providerId === provider.id && getISODateString(new Date(a.start)) === currentDateISO
  ).length;
  
  const available = Math.max(0, totalCapacity - bookedAppointments);
  const percentage = totalCapacity > 0 ? (bookedAppointments / totalCapacity) * 100 : 0;
  
  const getColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 75) return 'bg-amber-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  return (
    <div className="bg-white/90 backdrop-blur rounded-lg p-3 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all transform hover:-translate-y-1">
      <div className="flex justify-between items-center mb-2">
        <span className="text-md font-bold text-slate-800">{provider.name}</span>
        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">{provider.specialty}</span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex flex-col items-center">
            <span className="font-bold text-blue-600 text-lg">{bookedAppointments}</span>
            <span className="text-xs text-slate-500">محجوز</span>
        </div>
        <div className="flex flex-col items-center">
            <span className="font-bold text-green-600 text-lg">{available}</span>
            <span className="text-xs text-slate-500">متاح</span>
        </div>
        <div className="flex flex-col items-center">
            <span className="font-bold text-slate-700 text-lg">{totalCapacity}</span>
            <span className="text-xs text-slate-500">الإجمالي</span>
        </div>
         {extraCapacity > 0 && (
          <div className="flex flex-col items-center" title="خانات إضافية">
             <span className="font-bold text-amber-600 text-lg">+{extraCapacity}</span>
             <span className="text-xs text-slate-500">إضافي</span>
          </div>
        )}
      </div>
      
      <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
};

export default ProviderStats;