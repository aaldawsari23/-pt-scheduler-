import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { addDays, getISODateString } from '../../utils/dateUtils';
import { Specialty, type ViewType } from '../../types';
import { calculateAvailabilityForDay } from '../../utils/availability';

interface MonthViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  setView: (view: ViewType) => void;
  selectedSpecialty: Specialty;
  selectedProviderId: string | null;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, setCurrentDate, setView, selectedSpecialty, selectedProviderId }) => {
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
          
          const { bookedCount, availableSlots, totalCapacity, workingProviders } = calculateAvailabilityForDay(
            day,
            providers,
            appointments,
            vacations,
            extraCapacities,
            selectedProviderId,
            selectedSpecialty
          );
          
          const hasAppointments = bookedCount > 0;
          const hasCapacity = totalCapacity > 0;
          
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
              {isCurrentMonth && !isWeekend && (hasCapacity || hasAppointments) && (
                <div className="mt-auto text-center space-y-1">
                  <div className={`text-xs rounded px-1 py-0.5 ${availableSlots > 0 ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'}`}>
                      متاح: <span className="font-bold">{availableSlots}</span>
                  </div>
                  <div className="text-xs bg-red-100 text-red-800 rounded px-1 py-0.5">
                      محجوز: <span className="font-bold">{bookedCount}</span>
                  </div>
                </div>
              )}
              {isCurrentMonth && !isWeekend && !hasCapacity && !hasAppointments && workingProviders.length === 0 && (
                  <div className="mt-auto text-center">
                      <div className="text-xs bg-slate-100 text-slate-500 rounded px-1 py-0.5">مغلق</div>
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
