import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { addDays, getISODateString } from '../../utils/dateUtils';
import type { ViewType } from '../../types';

interface MonthViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  setView: (view: ViewType) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, setCurrentDate, setView }) => {
  const { appointments, providers, extraCapacities, vacations } = useAppContext();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDate = addDays(firstDayOfMonth, -firstDayOfMonth.getDay());
  
  const daysInGrid = [];
  let currentDay = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    daysInGrid.push(new Date(currentDay));
    currentDay = addDays(currentDay, 1);
  }
  
  const weekDayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  return (
    <div className="flex flex-col h-full" data-view="month-view">
      <div className="grid grid-cols-7 border-b border-slate-200 sticky top-0 bg-white z-10 flex-shrink-0">
        {weekDayNames.map((day, index) => (
          <div key={day} className={`text-center font-semibold p-3 text-slate-600 border-e border-slate-200 last:border-e-0 ${index >= 5 ? 'bg-slate-100' : 'bg-slate-50'}`}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6 flex-grow">
        {daysInGrid.map((day, index) => {
          const isCurrentMonth = day.getMonth() === month;
          const isToday = new Date().toDateString() === day.toDateString();
          const dayISO = getISODateString(day);

          const dayOfWeek = day.getDay();
          const activeProviders = providers.filter(p => p.days.includes(dayOfWeek));
          const totalCapacity = activeProviders.reduce((acc, p) => {
            const extra = extraCapacities.find(e => e.providerId === p.id && e.date === dayISO)?.slots || 0;
            const isOnVacation = vacations.some(v => (v.providerId === p.id || !v.providerId) && dayISO >= v.startDate && dayISO <= v.endDate);
            return isOnVacation ? acc : acc + p.dailyCapacity + extra;
          }, 0);

          const appointmentsOnDay = appointments.filter(a => getISODateString(new Date(a.start)) === dayISO);
          const appCount = appointmentsOnDay.length;
          const availableSlots = Math.max(0, totalCapacity - appCount);

          const isWeekend = day.getDay() === 5 || day.getDay() === 6;
          
          return (
            <div
              key={index}
              className={`border-e border-b border-slate-200 p-2 flex flex-col relative transition-all duration-200 text-sm
                ${isWeekend 
                  ? 'bg-slate-50' 
                  : `cursor-pointer group ${isCurrentMonth ? 'bg-white hover:bg-blue-50' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`
                }`
              }
              onClick={() => { if (!isWeekend) { setCurrentDate(day); setView('day' as ViewType.Day); } }}
            >
              <span className={`self-start font-bold mb-1
                              ${isToday ? 'bg-blue-600 text-white rounded-full h-7 w-7 flex items-center justify-center shadow-lg' : ''}`}>
                {day.getDate()}
              </span>
              {isCurrentMonth && !isWeekend && totalCapacity > 0 && (
                <div className="mt-auto text-center space-y-1">
                  <div className="text-xs bg-green-100 text-green-800 rounded px-1 py-0.5">متاح: <span className="font-bold">{availableSlots}</span></div>
                  <div className="text-xs bg-red-100 text-red-800 rounded px-1 py-0.5">محجوز: <span className="font-bold">{appCount}</span></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
