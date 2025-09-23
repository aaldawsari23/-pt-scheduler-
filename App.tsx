import React from 'react';
import Scheduler from './components/Scheduler';
import { AppProvider, useAppContext } from './context/AppContext';
import Toast from './components/common/Toast';
import ConfirmationModal from './components/common/ConfirmationModal';

const AppContent: React.FC = () => {
  const { toasts, confirmation, closeConfirmation } = useAppContext();

  const handleConfirm = () => {
    if (confirmation.onConfirm) {
      confirmation.onConfirm();
    }
    closeConfirmation();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Scheduler />

      {/* --- Global Components --- */}

      {/* Toast Container */}
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} type={toast.type} id={toast.id} />
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmation.isOpen && (
        <ConfirmationModal
          title={confirmation.title}
          message={confirmation.message}
          onConfirm={handleConfirm}
          onCancel={closeConfirmation}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
