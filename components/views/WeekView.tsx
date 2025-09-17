
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getStartOfWeek, addDays, toHijriDateString, toGregorianTimeString } from '../../utils/dateUtils';
import type { ViewType } from '../../types';

interface WeekViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  setView: (view: ViewType) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, setCurrentDate, setView }) => {
  const { appointments } = useAppContext();
  const startOfWeek = getStartOfWeek(currentDate);

  const days = Array.from({ length: 5 }, (_, i) => addDays(startOfWeek, i));
  const weekDayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

  return (
    <div className="grid grid-cols-5 h-full">
      {days.map((day, index) => {
        const appointmentsOnDay = appointments.filter(a => new Date(a.start).toDateString() === day.toDateString());
        const isToday = new Date().toDateString() === day.toDateString();
        const hijriDateStr = toHijriDateString(day);
        
        return (
          <div 
            key={index} 
            className={`border-e border-b border-slate-200 flex flex-col cursor-pointer hover:bg-slate-50`}
            onClick={() => { setCurrentDate(day); setView('day' as ViewType.Day); }}
          >
            <div className={`p-2 border-b border-slate-200 ${isToday ? 'bg-sky-100' : 'bg-white'}`}>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-600">{weekDayNames[day.getDay()]}</span>
                <span className={`text-xl font-bold ${isToday ? 'text-sky-600' : 'text-slate-800'}`}>{day.getDate()}</span>
              </div>
              {hijriDateStr && <div className="text-xs text-slate-500 mt-1 text-end">{hijriDateStr.split(' ').slice(0, 2).join(' ')}</div>}
            </div>
            <div className="p-2 space-y-1.5 flex-grow overflow-y-auto">
              {appointmentsOnDay.length > 0 ? (
                appointmentsOnDay.slice(0, 7).map(app => (
                  <div key={app.id} className="flex items-center gap-1.5 text-xs truncate" title={`ملف رقم: ${app.fileNo}`}>
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                    <span className="text-slate-800 font-medium">{app.fileNo}</span>
                    <span className="text-slate-500 ms-auto">{toGregorianTimeString(new Date(app.start))}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 text-sm pt-4 select-none">فارغ</div>
              )}
               {appointmentsOnDay.length > 7 && <div className="text-center text-xs text-slate-500 mt-1 font-semibold">+{appointmentsOnDay.length - 7} المزيد</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekView;