
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Provider, Appointment, Vacation, Settings, SlotLock, Toast, ConfirmationState, TimeOff, ExtraCapacity, AuditEntry } from '../types';
import { AuditAction } from '../types';
import { INITIAL_PROVIDERS, INITIAL_SETTINGS } from '../constants';
import { generateUniqueId } from '../utils/helpers';

interface AppContextType {
  providers: Provider[];
  setProviders: (providers: Provider[]) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  vacations: Vacation[];
  setVacations: (vacations: Vacation[]) => void;
  timeOffs: TimeOff[];
  setTimeOffs: (timeOffs: TimeOff[]) => void;
  extraCapacities: ExtraCapacity[];
  setExtraCapacities: (extraCapacities: ExtraCapacity[]) => void;
  settings: Settings;
  setSettings: (settings: Settings) => void;
  slotLocks: SlotLock;
  setSlotLocks: (locks: SlotLock) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  confirmation: ConfirmationState;
  askConfirmation: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirmation: () => void;
  auditLog: AuditEntry[];
  logAudit: (entry: Omit<AuditEntry, 'id'|'timestamp'> & { timestamp?: string }) => void;
  clearAudit: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [providers, setProviders] = useLocalStorage<Provider[]>('providers', INITIAL_PROVIDERS);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', []);
  const [vacations, setVacations] = useLocalStorage<Vacation[]>('vacations', []);
  const [timeOffs, setTimeOffs] = useLocalStorage<TimeOff[]>('timeOffs', []);
  const [extraCapacities, setExtraCapacities] = useLocalStorage<ExtraCapacity[]>('extraCapacities', []);
  const [settings, setSettings] = useLocalStorage<Settings>('settings', INITIAL_SETTINGS);
  const [slotLocks, setSlotLocks] = useLocalStorage<SlotLock>('slotLocks', {});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmation, setConfirmation] = useState<ConfirmationState>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [auditLog, setAuditLog] = useLocalStorage<AuditEntry[]>('auditLog', []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = generateUniqueId();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
          setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
      }, 5000);
  };

  const askConfirmation = (title: string, message: string, onConfirm: () => void) => {
      setConfirmation({ isOpen: true, title, message, onConfirm });
  };

  const closeConfirmation = () => {
      setConfirmation({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  };
  
  const logAudit = (entry: Omit<AuditEntry, 'id'|'timestamp'> & { timestamp?: string }) => {
      const newEntry: AuditEntry = {
        id: generateUniqueId(),
        timestamp: entry.timestamp ?? new Date().toISOString(),
        ...entry,
      };
      setAuditLog(prev => [newEntry, ...prev].slice(0, 1000)); // Keep last 1000 entries
    };

  const clearAudit = () => {
      askConfirmation('مسح السجل', 'هل أنت متأكد من مسح سجل العمليات بالكامل؟ لا يمكن التراجع عن هذا الإجراء.', () => {
          setAuditLog([]);
          showToast('تم مسح سجل العمليات.', 'info');
      });
  };


  const value = {
    providers,
    setProviders,
    appointments,
    setAppointments,
    vacations,
    setVacations,
    timeOffs,
    setTimeOffs,
    extraCapacities,
    setExtraCapacities,
    settings,
    setSettings,
    slotLocks,
    setSlotLocks,
    toasts,
    showToast,
    confirmation,
    askConfirmation,
    closeConfirmation,
    auditLog,
    logAudit,
    clearAudit,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};