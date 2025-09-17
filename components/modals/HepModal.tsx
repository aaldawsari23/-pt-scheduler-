import React, { useState, useEffect, ReactNode } from 'react';
import Modal from '../common/Modal';
import { HEP_CONTENT, HEP_DISCLAIMER } from '../../constants';
import type { HepContent, HepExercise } from '../../types';
import { useAppContext } from '../../context/AppContext';


const PrintHeader: React.FC<{ logo: string }> = ({ logo }) => (
    <header className="print-header hidden w-full p-4 border-b bg-white items-center justify-between">
        <div className="flex items-center">
            <img src={logo} alt="شعار تجمع عسير الصحي" className="h-20 w-20 object-contain" />
            <div className="mr-4">
                <h1 className="text-lg font-bold text-gray-900">تجمع عسير الصحي</h1>
                <p className="text-sm text-gray-600">مستشفى الملك عبدالله ببيشة</p>
                <p className="text-sm font-semibold text-gray-700">قسم التأهيل الطبي - العلاج الطبيعي</p>
            </div>
        </div>
        <div className="text-left">
             <h2 className="text-xl font-bold text-blue-800">برنامج تمارين منزلية</h2>
        </div>
    </header>
);

const ScreenHeader: React.FC<{ logo: string }> = ({ logo }) => (
    <header className="no-print w-full p-6 bg-white rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between border-b-4 border-blue-600">
        <div className="flex items-center">
            <img src={logo} alt="شعار تجمع عسير الصحي" className="h-24 w-24 object-contain" />
            <div className="mr-4">
                <h1 className="text-xl font-bold text-gray-900">تجمع عسير الصحي</h1>
                <p className="text-md text-gray-600">مستشفى الملك عبدالله ببيشة</p>
                <p className="text-md font-semibold text-gray-700">قسم التأهيل الطبي - العلاج الطبيعي</p>
            </div>
        </div>
        <div>
             <h2 className="text-2xl font-bold text-blue-800">برامج التمارين المنزلية</h2>
        </div>
    </header>
);

const ExerciseCard: React.FC<{ exercise: HepExercise, index: number }> = ({ exercise, index }) => (
    <div className="exercise-card p-4 border rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{`${index + 1}. ${exercise.name}`}</h3>
        <img src={exercise.image} alt={`رسم توضيحي لـ ${exercise.name}`} className="w-full h-48 object-contain rounded-md bg-gray-100 mb-4" />
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          {exercise.description.map((step, i) => <li key={i}>{step}</li>)}
        </ul>
    </div>
);

const ContentSection: React.FC<{ hep: HepContent; onPrint: (id: string) => void }> = ({ hep, onPrint }) => (
    <section id={hep.id} className="content-section printable-area">
        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-6">
            <h2 className="text-3xl font-bold text-blue-800">{hep.title}</h2>
            <button onClick={() => onPrint(hep.id)} className="no-print bg-green-600 text-white py-2 px-5 rounded-lg font-semibold shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-colors">
                طباعة
            </button>
        </div>

        <div className="mb-8 p-4 bg-blue-50 border-r-4 border-blue-500 rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-blue-900">{hep.tipsTitle}</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
                {hep.tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hep.exercises.map((ex, index) => (
                <ExerciseCard key={index} exercise={ex} index={index} />
            ))}
        </div>
    </section>
);

interface HepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HepModal: React.FC<HepModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useAppContext();
  const [activeTab, setActiveTab] = useState(HEP_CONTENT[0].id);
  const logo = settings.customLogoB64 || "https://storage.googleapis.com/gemini-prod/images/56436a53-33b6-4b95-a131-01e4318d1a12";

  const handlePrint = (sectionId: string) => {
    const sectionToPrint = document.getElementById(sectionId);
    if (sectionToPrint) {
        // Add a class to the specific section to mark it for printing
        document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active-print'));
        sectionToPrint.classList.add('active-print');
        window.print();
    }
  };

  // Cleanup print class after print dialog is closed
  useEffect(() => {
    const afterPrintHandler = () => {
        const activePrintSection = document.querySelector('.active-print');
        if (activePrintSection) {
            activePrintSection.classList.remove('active-print');
        }
    };

    window.addEventListener('afterprint', afterPrintHandler);
    return () => {
        window.removeEventListener('afterprint', afterPrintHandler);
    };
  }, []);
  
  const handleClose = () => {
      setActiveTab(HEP_CONTENT[0].id); // Reset to first tab on close
      onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="برامج التمارين المنزلية">
      <PrintHeader logo={logo} />
       <div className="container mx-auto print-container">
        <ScreenHeader logo={logo} />

        <nav className="no-print my-6 bg-white p-3 rounded-xl shadow-md">
            <div className="flex flex-wrap justify-center gap-2">
                {HEP_CONTENT.map(hep => (
                     <button 
                        key={hep.id}
                        onClick={() => setActiveTab(hep.id)}
                        className={`py-2 px-4 rounded-lg font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors ${
                            activeTab === hep.id 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                        {hep.navTitle}
                    </button>
                ))}
            </div>
        </nav>

        <main id="content-container" className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="print-header-spacer"></div>
            
            {HEP_CONTENT.map(hep => (
                 <div key={hep.id} className={activeTab === hep.id ? '' : 'hidden'}>
                    <ContentSection hep={hep} onPrint={handlePrint} />
                 </div>
            ))}

            <footer className="mt-12 pt-6 border-t-2 border-gray-200">
                <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 rounded-lg">
                    <h3 className="font-bold text-lg mb-2 text-red-900">{HEP_DISCLAIMER.title}</h3>
                    <p className="text-gray-700">{HEP_DISCLAIMER.text}</p>
                </div>
                <div>
                     <h3 className="font-bold text-lg mb-2 text-gray-700">{HEP_DISCLAIMER.sourcesTitle}</h3>
                     <p className="text-sm text-gray-600">{HEP_DISCLAIMER.sourcesText}</p>
                </div>
            </footer>
        </main>
      </div>
    </Modal>
  );
};

export default HepModal;
