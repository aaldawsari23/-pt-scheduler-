import React, { useState } from 'react';
import { normalizeArabicDigits } from '../../utils/helpers';

interface QuickAddAppointmentProps {
  onBook: (fileNo: string) => void;
  onCancel: () => void;
  className?: string;
}

const QuickAddAppointment: React.FC<QuickAddAppointmentProps> = ({ onBook, onCancel, className = '' }) => {
  const [fileNo, setFileNo] = useState('');

  const handleBook = () => {
    if (fileNo.trim()) {
      onBook(fileNo.trim());
    }
  };

  return (
    <div className={`p-2 bg-blue-50 rounded-lg border border-blue-200 ${className}`}>
      <input
        type="text"
        value={fileNo}
        onChange={(e) => setFileNo(normalizeArabicDigits(e.target.value))}
        onKeyPress={(e) => e.key === 'Enter' && handleBook()}
        placeholder="رقم الملف..."
        className="w-full px-2 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 text-center"
        autoFocus
      />
      <div className="flex gap-2 mt-2">
        <button onClick={handleBook} className="flex-1 bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-blue-700">تأكيد</button>
        <button onClick={onCancel} className="flex-1 bg-slate-200 text-slate-700 text-sm px-3 py-1.5 rounded-md hover:bg-slate-300">إلغاء</button>
      </div>
    </div>
  );
};

export default QuickAddAppointment;