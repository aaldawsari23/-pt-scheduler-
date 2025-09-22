import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Modal from '../common/Modal';
import { Specialty, type Provider, type Vacation, type TimeOff, type ExtraCapacity, type AuditEntry } from '../../types';
import { generateUniqueId, exportToJson, exportToCsv, transliterate } from '../../utils/helpers';
import { getISODateString, toGregorianDateTimeString, toGregorianTimeString } from '../../utils/dateUtils';
import { ASEER_LOGO_URL } from '../../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    providers, setProviders,
    settings, setSettings,
    vacations, setVacations,
    timeOffs, setTimeOffs,
    extraCapacities, setExtraCapacities,
    appointments,
    showToast,
    askConfirmation,
    auditLog,
  } = useAppContext();

  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Local state for editing
  const [localProviders, setLocalProviders] = useState<Provider[]>([]);
  const [localVacations, setLocalVacations] = useState<Vacation[]>([]);
  const [localTimeOffs, setLocalTimeOffs] = useState<TimeOff[]>([]);
  const [localExtraCapacities, setLocalExtraCapacities] = useState<ExtraCapacity[]>([]);

  // Form state for new entries
  const [newVacation, setNewVacation] = useState({ providerId: '', description: '', startDate: getISODateString(new Date()), endDate: getISODateString(new Date()) });
  const [newTimeOff, setNewTimeOff] = useState({ providerId: '', description: '', date: getISODateString(new Date()), startTime: '08:00', endTime: '09:00' });
  const [newExtraCapacity, setNewExtraCapacity] = useState({ providerId: '', date: getISODateString(new Date()), slots: 1 });

  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(!settings.pin);
      // Create deep copies for safe editing
      setLocalProviders(JSON.parse(JSON.stringify(providers)));
      setLocalVacations(JSON.parse(JSON.stringify(vacations)));
      setLocalTimeOffs(JSON.parse(JSON.stringify(timeOffs)));
      setLocalExtraCapacities(JSON.parse(JSON.stringify(extraCapacities)));
    }
  }, [isOpen, settings.pin, providers, vacations, timeOffs, extraCapacities]);
  
  const handlePinSubmit = () => {
    if (settings.pin) {
      if (btoa(pin) === settings.pin) {
        setIsAuthenticated(true);
        showToast('تم تسجيل الدخول بنجاح', 'success');
      } else {
        showToast('رمز الدخول غير صحيح', 'error');
      }
    } else {
        if(pin.length < 4) {
            showToast('يجب أن يكون رمز الدخول 4 أرقام على الأقل', 'error');
            return;
        }
        setSettings({ ...settings, pin: btoa(pin) });
        setIsAuthenticated(true);
        showToast('تم تعيين رمز الدخول بنجاح', 'success');
    }
    setPin('');
  };

  const handleSaveChanges = () => {
    setProviders(localProviders);
    setVacations(localVacations);
    setTimeOffs(localTimeOffs);
    setExtraCapacities(localExtraCapacities);
    // Settings are saved directly via onChange, no need to save here unless bundled
    showToast('تم حفظ التغييرات بنجاح', 'success');
    onClose();
  };

  // --- Provider Management ---
  const handleProviderChange = <K extends keyof Provider>(id: string, field: K, value: Provider[K]) => {
     setLocalProviders(prev => prev.map(p => p.id === id ? { ...p, [field]: value, slug: field === 'name' ? transliterate(value as string) : p.slug } : p));
  };
  const addProvider = () => setLocalProviders(prev => [...prev, { id: generateUniqueId(), name: 'معالج جديد', specialty: Specialty.MSK, days: [], dailyCapacity: 4, isNewPatientProvider: false, newPatientQuota: 0, slug: 'new_provider' }]);
  const removeProvider = (id: string) => askConfirmation('حذف المعالج', 'هل أنت متأكد؟', () => setLocalProviders(p => p.filter(pr => pr.id !== id)));

  // --- Schedule Control Management ---
  const addVacation = () => {
    if (!newVacation.description || !newVacation.startDate || !newVacation.endDate) {
      showToast('يرجى ملء جميع حقول الإجازة', 'error');
      return;
    }
    setLocalVacations(prev => [...prev, { ...newVacation, id: generateUniqueId(), providerId: newVacation.providerId || null }]);
  };
  const addTimeOff = () => {
    if (!newTimeOff.providerId || !newTimeOff.description) {
      showToast('يرجى اختيار المعالج وتعبئة الوصف', 'error');
      return;
    }
    setLocalTimeOffs(prev => [...prev, { ...newTimeOff, id: generateUniqueId() }]);
  };
  const addExtraCapacity = () => {
    if (!newExtraCapacity.providerId || newExtraCapacity.slots < 1) {
      showToast('يرجى اختيار المعالج وتحديد عدد الخانات', 'error');
      return;
    }
    setLocalExtraCapacities(prev => [...prev, { ...newExtraCapacity, id: generateUniqueId() }]);
  };

  const handleExport = (format: 'csv') => {
      const dataToExport = appointments.map(app => {
          const provider = providers.find(p => p.id === app.providerId);
          const startDate = new Date(app.start);
          const createdAtDate = new Date(app.createdAt);
          return { 
              id: app.id, 
              fileNo: app.fileNo, 
              providerName: provider?.name || 'N/A', 
              providerSlug: provider?.slug || 'n-a', 
              specialty: provider?.specialty || 'N/A', 
              startDate: getISODateString(startDate),
              startTime: toGregorianTimeString(startDate),
              type: app.type, 
              createdAt: toGregorianDateTimeString(createdAtDate) 
          };
      });
      exportToCsv(dataToExport, 'appointments');
      showToast(`تم بدء تصدير الملف ${format.toUpperCase()}`, 'success');
  };

  const renderAuth = () => (
    <div className="flex flex-col items-center gap-4 p-8">
        <h4 className="text-lg font-bold">{settings.pin ? 'الرجاء إدخال رمز الدخول' : 'الرجاء تعيين رمز دخول جديد'}</h4>
        <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handlePinSubmit()} className="text-center p-2 border rounded-md w-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" autoFocus />
        <button onClick={handlePinSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">{settings.pin ? 'دخول' : 'تعيين'}</button>
    </div>
  );
  
  const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
  const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;

  const renderSettings = () => (
    <div className="space-y-6">
        {/* --- General Settings Card --- */}
        <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="text-lg font-semibold mb-4 text-slate-700">الإعدادات العامة</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-slate-600">تفعيل خانة احتياطية للحالات الطارئة</span><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={settings.urgentReserve} onChange={(e) => setSettings({...settings, urgentReserve: e.target.checked})} className="sr-only peer" /><div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></label></div>
               
              {/* Advanced Booking Rules */}
              <div className="pt-4 border-t border-slate-200">
                <h5 className="font-medium text-slate-700 mb-3">قواعد الحجز المتقدمة</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-slate-600">حجز عاجل (عدد الأيام)</label>
                    <input type="number" value={settings.urgentDaysAhead} 
                           onChange={(e) => setSettings({...settings, urgentDaysAhead: parseInt(e.target.value) || 1})} 
                           className="w-full p-2 border rounded-md mt-1" min="1" max="30" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">شبه عاجل (عدد الأيام)</label>
                    <input type="number" value={settings.semiUrgentDaysAhead} 
                           onChange={(e) => setSettings({...settings, semiUrgentDaysAhead: parseInt(e.target.value) || 3})} 
                           className="w-full p-2 border rounded-md mt-1" min="1" max="60" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">اعتيادي (عدد الأيام)</label>
                    <input type="number" value={settings.normalDaysAhead} 
                           onChange={(e) => setSettings({...settings, normalDaysAhead: parseInt(e.target.value) || 30})} 
                           className="w-full p-2 border rounded-md mt-1" min="1" max="365" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">مزمن (عدد الأسابيع)</label>
                    <input type="number" value={settings.chronicWeeksAhead} 
                           onChange={(e) => setSettings({...settings, chronicWeeksAhead: parseInt(e.target.value) || 8})} 
                           className="w-full p-2 border rounded-md mt-1" min="1" max="52" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-sm text-slate-600">وقت بداية الصباح</label>
                    <input type="number" value={settings.morningStartHour} 
                           onChange={(e) => setSettings({...settings, morningStartHour: parseFloat(e.target.value) || 8})} 
                           className="w-full p-2 border rounded-md mt-1" min="6" max="12" step="0.5" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">وقت نهاية الصباح</label>
                    <input type="number" value={settings.morningEndHour} 
                           onChange={(e) => setSettings({...settings, morningEndHour: parseFloat(e.target.value) || 12})} 
                           className="w-full p-2 border rounded-md mt-1" min="10" max="14" step="0.5" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">وقت بداية المساء</label>
                    <input type="number" value={settings.afternoonStartHour} 
                           onChange={(e) => setSettings({...settings, afternoonStartHour: parseFloat(e.target.value) || 12})} 
                           className="w-full p-2 border rounded-md mt-1" min="12" max="16" step="0.5" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-606">وقت نهاية المساء</label>
                    <input type="number" value={settings.afternoonEndHour} 
                           onChange={(e) => setSettings({...settings, afternoonEndHour: parseFloat(e.target.value) || 15.5})} 
                           className="w-full p-2 border rounded-md mt-1" min="14" max="20" step="0.5" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-slate-600">حجب أيام الجمعة</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.blockFridays} 
                           onChange={(e) => setSettings({...settings, blockFridays: e.target.checked})} 
                           className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
{/* FIX: Added missing closing divs for the "General Settings" card to correct the JSX structure. */}
            </div>
        </div>
              

      {/* --- Providers Card --- */}
      <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex justify-between items-center mb-4"><h4 className="text-lg font-semibold text-slate-700">المعالجون</h4><button onClick={addProvider} className="bg-green-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-600 flex items-center gap-1.5"><PlusIcon /><span>إضافة معالج</span></button></div>
        <div className="space-y-4 max-h-72 overflow-y-auto p-1">
          {localProviders.map(p => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start"><input type="text" value={p.name} onChange={e => handleProviderChange(p.id, 'name', e.target.value)} className="p-2 border border-slate-300 rounded-md font-semibold text-slate-800 focus:ring-blue-500 focus:border-blue-500" /><button onClick={() => removeProvider(p.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full"><TrashIcon /></button></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="text-sm text-slate-500">التخصص</label><select value={p.specialty} onChange={e => handleProviderChange(p.id, 'specialty', e.target.value as Specialty)} className="p-2 border border-slate-300 rounded-md w-full mt-1 bg-white focus:ring-blue-500 focus:border-blue-500">{Object.values(Specialty).filter(s => s !== Specialty.All).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className="text-sm text-slate-500">الطاقة الاستيعابية</label><input type="number" value={p.dailyCapacity} onChange={e => handleProviderChange(p.id, 'dailyCapacity', parseInt(e.target.value) || 0)} className="p-2 border border-slate-300 rounded-md w-full mt-1 focus:ring-blue-500 focus:border-blue-500" /></div>
                <div><label className="text-sm text-slate-500">أيام العيادات</label><div className="flex items-center gap-2 mt-2">{['ح', 'ن', 'ث', 'ر', 'خ'].map((day, index) => (<button key={index} onClick={() => { const newDays = p.days.includes(index) ? p.days.filter(d => d !== index) : [...p.days, index]; handleProviderChange(p.id, 'days', newDays); }} className={`w-8 h-8 rounded-full text-sm font-bold ${p.days.includes(index) ? 'bg-blue-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>{day}</button>))}</div></div>
              </div>
              <div className="flex items-center gap-4 pt-2 border-t">
                <label className="text-sm text-slate-500">خانات إضافية مؤقتة</label>
                {extraCapacities.filter(ec => ec.providerId === p.id).map(ec => (
                  <div key={ec.id} className="flex items-center gap-2 bg-amber-50 px-2 py-1 rounded">
                    <span className="text-xs">{ec.date}</span>
                    <span className="text-xs font-bold text-amber-600">+{ec.slots}</span>
                    <button onClick={() => setLocalExtraCapacities(prev => prev.filter(e => e.id !== ec.id))} 
                            className="text-red-500 hover:text-red-700">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Scheduling Control Card --- */}
      <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-6">
        <h4 className="text-lg font-semibold text-slate-700">إدارة الجداول والقدرة الاستيعابية</h4>
        {/* Add Vacation */}
        <div>
          <h5 className="font-semibold text-slate-600 mb-2">إضافة إجازة (يوم كامل)</h5>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 bg-white border rounded-lg">
              <select value={newVacation.providerId} onChange={e => setNewVacation(v => ({...v, providerId: e.target.value}))} className="p-2 border rounded-md sm:col-span-1"><option value="">الكل</option>{localProviders.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
              <input type="text" placeholder="الوصف (مثال: عيد الفطر)" value={newVacation.description} onChange={e => setNewVacation(v => ({...v, description: e.target.value}))} className="p-2 border rounded-md sm:col-span-1"/>
              <input type="date" value={newVacation.startDate} onChange={e => setNewVacation(v => ({...v, startDate: e.target.value}))} className="p-2 border rounded-md sm:col-span-1"/>
              <input type="date" value={newVacation.endDate} onChange={e => setNewVacation(v => ({...v, endDate: e.target.value}))} className="p-2 border rounded-md sm:col-span-1"/>
              <button onClick={addVacation} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 text-sm sm:col-span-1">إضافة</button>
          </div>
        </div>
        {/* Add Time Off */}
         <div>
          <h5 className="font-semibold text-slate-600 mb-2">إضافة استئذان (ساعات محددة)</h5>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 p-3 bg-white border rounded-lg">
              <select value={newTimeOff.providerId} onChange={e => setNewTimeOff(v => ({...v, providerId: e.target.value}))} className="p-2 border rounded-md sm:col-span-1"><option value="">اختر معالج</option>{localProviders.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
              <input type="text" placeholder="الوصف (مثال: اجتماع)" value={newTimeOff.description} onChange={e => setNewTimeOff(v => ({...v, description: e.target.value}))} className="p-2 border rounded-md sm:col-span-2"/>
              <input type="date" value={newTimeOff.date} onChange={e => setNewTimeOff(v => ({...v, date: e.target.value}))} className="p-2 border rounded-md sm:col-span-1"/>
              <div className="flex gap-1 items-center sm:col-span-1"><input type="time" value={newTimeOff.startTime} onChange={e => setNewTimeOff(v => ({...v, startTime: e.target.value}))} className="p-2 border rounded-md w-full"/><span className="text-xs">إلى</span><input type="time" value={newTimeOff.endTime} onChange={e => setNewTimeOff(v => ({...v, endTime: e.target.value}))} className="p-2 border rounded-md w-full"/></div>
              <button onClick={addTimeOff} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 text-sm sm:col-span-1">إضافة</button>
          </div>
        </div>
        {/* Add Extra Capacity */}
        <div>
          <h5 className="font-semibold text-slate-600 mb-2">إضافة طاقة استيعابية إضافية</h5>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 bg-white border rounded-lg">
              <select value={newExtraCapacity.providerId} onChange={e => setNewExtraCapacity(v => ({...v, providerId: e.target.value}))} className="p-2 border rounded-md"><option value="">اختر معالج</option>{localProviders.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
              <input type="date" value={newExtraCapacity.date} onChange={e => setNewExtraCapacity(v => ({...v, date: e.target.value}))} className="p-2 border rounded-md"/>
              <input type="number" placeholder="عدد الخانات الإضافية" min="1" value={newExtraCapacity.slots} onChange={e => setNewExtraCapacity(v => ({...v, slots: parseInt(e.target.value) || 1}))} className="p-2 border rounded-md"/>
              <button onClick={addExtraCapacity} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 text-sm">إضافة</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-48 overflow-y-auto">
          {/* List views can be added here for vacations, timeoffs, extracapacity if needed */}
        </div>
      </div>

      {/* --- Audit Log (سجل العمليات) --- */}
      <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-slate-700">سجلّ العمليات</h4>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 rounded-lg border text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => exportToCsv(
                auditLog.map((a: AuditEntry) => ({
                  id: a.id, action: a.action, timestamp: a.timestamp, fileNo: a.fileNo,
                  providerId: a.providerId ?? '', providerName: a.providerName ?? '',
                  start: a.start ?? '', end: a.end ?? '', details: a.details ?? '',
                })), `audit-log-${new Date().toISOString().split('T')[0]}.csv`
              )}
            >تصدير CSV</button>
          </div>
        </div>
        <div className="max-h-64 overflow-auto border border-slate-200 rounded-md bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-start font-semibold text-slate-600">الوقت</th>
                <th className="px-3 py-2 text-start font-semibold text-slate-600">العملية</th>
                <th className="px-3 py-2 text-start font-semibold text-slate-600">رقم الملف</th>
                <th className="px-3 py-2 text-start font-semibold text-slate-600">المعالج</th>
                <th className="px-3 py-2 text-start font-semibold text-slate-600">الوقت</th>
                <th className="px-3 py-2 text-start font-semibold text-slate-600">تفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLog.length === 0 ? (
                <tr><td className="px-3 py-4 text-center text-slate-500" colSpan={6}>لا يوجد سجلات بعد.</td></tr>
              ) : auditLog.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{toGregorianDateTimeString(new Date(a.timestamp), { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}</td>
                  <td className="px-3 py-2 font-medium">{a.action === 'create' ? <span className="text-green-600">حجز</span> : <span className="text-red-600">إلغاء</span>}</td>
                  <td className="px-3 py-2 text-slate-800 font-bold">{a.fileNo}</td>
                  <td className="px-3 py-2 text-slate-600">{a.providerName ?? '-'}</td>
                  <td className="px-3 py-2 text-slate-500">{a.start ? toGregorianTimeString(new Date(a.start)) : '-'}</td>
                  <td className="px-3 py-2 text-slate-600">{a.details ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Data & Sync Card --- */}
       <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="text-lg font-semibold mb-4 text-slate-700">البيانات والمزامنة</h4>
            <div className="flex flex-wrap gap-4"><button onClick={() => handleExport('csv')} className="bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800">تصدير CSV</button></div>
        </div>

      <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-200"><button onClick={onClose} className="bg-slate-200 text-slate-800 px-6 py-2 rounded-md hover:bg-slate-300">إلغاء</button><button onClick={handleSaveChanges} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">حفظ التغييرات</button></div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="الإعدادات">
      {isAuthenticated ? renderSettings() : renderAuth()}
    </Modal>
  );
};

export default SettingsModal;