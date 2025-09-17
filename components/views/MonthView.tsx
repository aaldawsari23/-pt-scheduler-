
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { addDays, toHijriDateString } from '../../utils/dateUtils';
import type { ViewType } from '../../types';

interface MonthViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  setView: (view: ViewType) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, setCurrentDate, setView }) => {
  const { appointments } = useAppContext();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  // Adjust start date to be Sunday of the first week
  const startDate = addDays(firstDayOfMonth, -firstDayOfMonth.getDay());
  
  const daysInGrid = [];
  let currentDay = new Date(startDate);

  // Ensure grid covers up to 6 weeks for a consistent layout
  for (let i = 0; i < 42; i++) {
    daysInGrid.push(new Date(currentDay));
    currentDay = addDays(currentDay, 1);
  }
  
  const weekDayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b border-slate-200 sticky top-0 bg-white z-10">
        {weekDayNames.map((day, index) => (
          <div key={day} className={`text-center font-semibold p-2 text-slate-600 border-e border-slate-200 last:border-e-0 ${index >= 5 ? 'bg-slate-200' : 'bg-slate-50'}`}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6 flex-grow">
        {daysInGrid.map((day, index) => {
          const isCurrentMonth = day.getMonth() === month;
          const isToday = new Date().toDateString() === day.toDateString();
          const appointmentsOnDay = appointments.filter(a => new Date(a.start).toDateString() === day.toDateString());
          const appCount = appointmentsOnDay.length;
          const isWeekend = day.getDay() === 5 || day.getDay() === 6;
          const hijriDateStr = toHijriDateString(day);

          let bgClass = '';
          if (isCurrentMonth && appCount > 0) {
              if (appCount <= 5) bgClass = 'bg-sky-50';
              else if (appCount <= 10) bgClass = 'bg-sky-100';
              else bgClass = 'bg-sky-200';
          }
          
          return (
            <div
              key={index}
              className={`border-e border-b border-slate-200 p-2 flex flex-col relative ${
                isWeekend 
                  ? 'bg-slate-100/70' 
                  : `cursor-pointer group ${isCurrentMonth ? `${bgClass} hover:bg-blue-100` : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`
              }`}
              onClick={() => { if (!isWeekend) { setCurrentDate(day); setView('day' as ViewType.Day); } }}
            >
              {isCurrentMonth && !isWeekend && hijriDateStr && <span className="absolute top-1 left-1 text-[10px] text-slate-400 group-hover:text-slate-500">{hijriDateStr.split(' ')[0]}</span>}
              <span className={`self-end font-bold text-sm mb-1 ${isToday ? 'bg-blue-600 text-white rounded-full h-7 w-7 flex items-center justify-center' : ''}`}>
                {day.getDate()}
              </span>
              {appCount > 0 && isCurrentMonth && !isWeekend && (
                <div className="mt-auto bg-blue-200 text-blue-800 text-center rounded text-xs p-1 font-semibold group-hover:bg-white">
                  {appCount} {appCount === 1 ? 'موعد' : appCount === 2 ? 'موعدان' : appCount <= 10 ? 'مواعيد' : 'موعدًا'}
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