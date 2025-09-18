import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getISODateString, toHijriDateString, toGregorianDateString } from '../../utils/dateUtils';
import LanguageToggle from './LanguageToggle';

interface StatsBarProps {
  currentDate: Date;
  onNewAppointment: () => void;
}

const StatsBar: React.FC<StatsBarProps> = ({ currentDate, onNewAppointment }) => {
    const { appointments, providers, extraCapacities, vacations } = useAppContext();

    const dayISO = getISODateString(currentDate);
    const dayOfWeek = currentDate.getDay();

    const appointmentsOnDay = appointments.filter(a => getISODateString(new Date(a.start)) === dayISO);
    const appCount = appointmentsOnDay.length;

    const totalCapacity = providers.reduce((acc, p) => {
        if (!p.days.includes(dayOfWeek)) return acc;
        const extra = extraCapacities.find(e => e.providerId === p.id && e.date === dayISO)?.slots || 0;
        const isOnVacation = vacations.some(v => (v.providerId === p.id || !v.providerId) && dayISO >= v.startDate && dayISO <= v.endDate);
        return isOnVacation ? acc : acc + p.dailyCapacity + extra;
    }, 0);

    const utilization = totalCapacity > 0 ? Math.round((appCount / totalCapacity) * 100) : 0;

    return (
        <aside className="w-64 bg-slate-50 border-l border-slate-200 p-4 flex flex-col no-print space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-bold text-slate-800">{toGregorianDateString(currentDate, { weekday: 'long' })}</h3>
                <p className="text-sm text-slate-500">{toGregorianDateString(currentDate)}</p>
                <p className="text-sm text-slate-500">{toHijriDateString(currentDate)}</p>
            </div>

            <div className="flex-grow space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-soft border border-slate-200">
                    <h4 className="font-bold text-slate-700 text-center mb-3">إحصائيات اليوم</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">إجمالي المواعيد</span>
                            <span className="font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{appCount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">الطاقة الاستيعابية</span>
                            <span className="font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{totalCapacity}</span>
                        </div>
                        <div>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="text-slate-600">نسبة الإشغال</span>
                                <span className="font-bold text-slate-700">{utilization}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div className="bg-gradient-to-r from-sky-400 to-blue-600 h-2.5 rounded-full" style={{ width: `${utilization}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto space-y-4">
                <button 
                    onClick={onNewAppointment} 
                    className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
                    إضافة موعد
                </button>
                <div className="flex justify-center">
                    <LanguageToggle />
                </div>
            </div>
        </aside>
    );
};

export default StatsBar;
