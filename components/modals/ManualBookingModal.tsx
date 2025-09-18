import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useAppContext } from '../../context/AppContext';
import { WORK_HOURS, SLOT_DURATION_MINUTES } from '../../constants';
import { AppointmentType, AuditAction, type Provider, type ManualBookingDefaults } from '../../types';
import { getISODateString, toGregorianTimeString, toHijriDateString, toGregorianDateString } from '../../utils/dateUtils';
import { generateUniqueId, normalizeArabicDigits } from '../../utils/helpers';

interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaults?: ManualBookingDefaults | null;
}

const ManualBookingModal: React.FC<ManualBookingModalProps> = ({ isOpen, onClose, defaults }) => {
  const { providers, appointments, setAppointments, showToast, logAudit } = useAppContext();
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [selectedDate, setSelectedDate] = useState(getISODateString(new Date()));
  const [selectedTime, setSelectedTime] = useState('');
  const [fileNo, setFileNo] = useState('');
  const [appointmentType, setAppointmentType] = useState(AppointmentType.Normal);
  
  const timeSlots = React.useMemo(() => {
    const slots = [];
    for (let hour = WORK_HOURS.start; hour < WORK_HOURS.end; hour += (SLOT_DURATION_MINUTES / 60)) {
        const d = new Date();
        d.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
        slots.push(toGregorianTimeString(d));
    }
    return slots;
  }, []);

  const availableTimeSlots = React.useMemo(() => {
    if (!selectedProviderId || !selectedDate) return timeSlots;
    const bookedTimes = appointments
      .filter(a => a.providerId === selectedProviderId && getISODateString(new Date(a.start)) === selectedDate)
      .map(a => toGregorianTimeString(new Date(a.start)));
    
    // If a default time is provided (editing/booking a specific slot), ensure it's not in the booked list
    // unless it is the one being edited. But here we just show what's available.
    // The defaults?.time is mostly for pre-selection, not for showing an already booked slot as available.
    return timeSlots.filter(slot => !bookedTimes.includes(slot));
  }, [selectedProviderId, selectedDate, appointments, timeSlots]);


  useEffect(() => {
    if (isOpen) {
        // Reset form state when modal opens, using defaults if available
        setFileNo('');
        setSelectedProviderId(defaults?.providerId || '');
        setSelectedDate(defaults?.date || getISODateString(new Date()));
        setSelectedTime(defaults?.time || '');
        setAppointmentType(defaults?.type || AppointmentType.Normal);
    }
  }, [isOpen, defaults]);
  
  const handleBook = () => {
    if (!selectedProviderId || !selectedDate || !selectedTime || !fileNo.trim()) {
      showToast('يرجى ملء جميع الحقول', 'error');
      return;
    }
    
    const provider = providers.find(p => p.id === selectedProviderId);
    if (!provider) return;
    
    const start = new Date(`${selectedDate}T${selectedTime}:00`);
    const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60000);
    
    const newAppointment = {
      id: generateUniqueId(),
      fileNo,
      providerId: selectedProviderId,
      start: start.toISOString(),
      end: end.toISOString(),
      type: appointmentType,
      createdAt: new Date().toISOString(),
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    const hijriStr = toHijriDateString(start);
    showToast(`تم حجز موعد للملف ${fileNo} يوم ${toGregorianDateString(start)} (${hijriStr})`, 'success');
    
    logAudit({
      action: AuditAction.Create,
      fileNo,
      providerId: provider.id,
      providerName: provider.name,
      start: start.toISOString(),
      end: end.toISOString(),
      details: `حجز يدوي - ${appointmentType}`,
    });
    
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="حجز موعد يدوي">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">رقم الملف</label>
          <input
            type="text"
            value={fileNo}
            onChange={(e) => setFileNo(normalizeArabicDigits(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="أدخل رقم الملف"
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">المعالج</label>
          <select
            value={selectedProviderId}
            onChange={(e) => setSelectedProviderId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">اختر المعالج</option>
            {providers.map(p => (
              <option key={p.id} value={p.id}>{p.name} - {p.specialty}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">التاريخ</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الوقت</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              disabled={!selectedProviderId || !selectedDate}
            >
              <option value="">اختر الوقت</option>
              {availableTimeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
              {defaults?.time && !availableTimeSlots.includes(defaults.time) && (
                <option key={defaults.time} value={defaults.time} disabled>
                  {defaults.time} (محجوز)
                </option>
              )}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">نوع الموعد</label>
          <select
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value as AppointmentType)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {Object.values(AppointmentType).filter(t => t !== AppointmentType.Nearest).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-800 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleBook}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
            disabled={!selectedProviderId || !selectedDate || !selectedTime || !fileNo.trim()}
          >
            تأكيد الحجز
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ManualBookingModal;