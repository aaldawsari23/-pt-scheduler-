import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AuditAction, type Provider, type Appointment, type Vacation, type Settings, type SlotLock, type Toast, type ConfirmationState, type TimeOff, type ExtraCapacity, type AuditEntry, type EmergencyLogEntry } from '../types';
import { INITIAL_PROVIDERS, INITIAL_SETTINGS } from '../constants';
import { generateUniqueId } from '../utils/helpers';

interface AppContextType {
  providers: Provider[];
  // FIX: Updated setter types to support functional updates, which is the return type from the useLocalStorage hook.
  setProviders: React.Dispatch<React.SetStateAction<Provider[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  vacations: Vacation[];
  setVacations: React.Dispatch<React.SetStateAction<Vacation[]>>;
  timeOffs: TimeOff[];
  setTimeOffs: React.Dispatch<React.SetStateAction<TimeOff[]>>;
  extraCapacities: ExtraCapacity[];
  setExtraCapacities: React.Dispatch<React.SetStateAction<ExtraCapacity[]>>;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  slotLocks: SlotLock;
  setSlotLocks: React.Dispatch<React.SetStateAction<SlotLock>>;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  confirmation: ConfirmationState;
  askConfirmation: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirmation: () => void;
  auditLog: AuditEntry[];
  logAudit: (entry: Omit<AuditEntry, 'id'|'timestamp'> & { timestamp?: string }) => void;
  emergencyLog: EmergencyLogEntry[];
  logEmergency: (entry: Omit<EmergencyLogEntry, 'id'|'timestamp'>) => void;
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
  const [emergencyLog, setEmergencyLog] = useLocalStorage<EmergencyLogEntry[]>('emergencyLog', []);

  // Effect to merge stored settings with defaults on initial load.
  // This acts as a simple data migration to prevent issues with outdated settings.
  useEffect(() => {
    setSettings(prevSettings => ({
      ...INITIAL_SETTINGS,
      ...prevSettings,
    }));
  }, []); // Runs only once on mount

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
    
  const logEmergency = (entry: Omit<EmergencyLogEntry, 'id'|'timestamp'>) => {
      const newEntry: EmergencyLogEntry = {
          id: generateUniqueId(),
          timestamp: new Date().toISOString(),
          ...entry,
      };
      setEmergencyLog(prev => [newEntry, ...prev].slice(0, 500)); // Keep last 500 entries
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
    emergencyLog,
    logEmergency,
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