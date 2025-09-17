import React, { useState, useEffect, ReactNode, useRef } from 'react';
import Modal from '../common/Modal';
import { HEP_CONTENT, HEP_DISCLAIMER, ASEER_LOGO_B64 } from '../../constants';
import type { HepContent, HepExercise } from '../../types';
import { useAppContext } from '../../context/AppContext';

const ExerciseCard: React.FC<{ 
  exercise: HepExercise; 
  index: number;
  contentId: string;
  onImageUpload: (exerciseIndex: number, imageData: string) => void;
}> = ({ exercise, index, contentId, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;
      onImageUpload(index, imageData);
      // Store in localStorage
      const storageKey = `hep_image_${contentId}_${index}`;
      localStorage.setItem(storageKey, imageData);
    };
    reader.readAsDataURL(file);
  };
  
  // Load image from localStorage if available
  const storageKey = `hep_image_${contentId}_${index}`;
  const storedImage = localStorage.getItem(storageKey);
  const displayImage = storedImage || exercise.image;
  
  return (
    <div className="exercise-card p-4 border rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{`${index + 1}. ${exercise.name}`}</h3>
        <div className="relative group">
          <img src={displayImage} alt={`رسم توضيحي لـ ${exercise.name}`} 
               className="w-full h-48 object-contain rounded-md bg-gray-100 mb-4" />
          <button onClick={() => fileInputRef.current?.click()}
                  className="absolute top-2 left-2 bg-white/90 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md no-print">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          {exercise.description.map((step, i) => <li key={i}>{step}</li>)}
        </ul>
    </div>
  );
};

const ContentSection: React.FC<{ 
  hep: HepContent; 
  onPrint: (id: string) => void;
  onImageUpload: (contentId: string, exerciseIndex: number, imageData: string) => void;
}> = ({ hep, onPrint, onImageUpload }) => (
     <section id={hep.id} className="content-section printable-area">
         <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-6">
             <h2 className="text-3xl font-bold text-blue-800">{hep.title}</h2>
             <button onClick={() => onPrint(hep.id)} className="no-print bg-green-600 text-white py-2 px-5 rounded-lg font-semibold shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-colors">
                 طباعة
             </button>
         </div>

         <div className="mb-8 p-4 bg-blue-50 border-r-4 border-blue-500 rounded-lg tips-box">
             <h3 className="font-bold text-lg mb-2 text-blue-900">{hep.tipsTitle}</h3>
             <ul className="list-disc list-inside space-y-2 text-gray-700">
                 {hep.tips.map((tip, i) => <li key={i}>{tip}</li>)}
             </ul>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 exercise-grid">
             {hep.exercises.map((ex, index) => (
                 <ExerciseCard 
                   key={index} 
                   exercise={ex} 
                   index={index}
                   contentId={hep.id}
                   onImageUpload={(exerciseIndex, imageData) => onImageUpload(hep.id, exerciseIndex, imageData)}
                 />
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
  const logo = settings.customLogoB64 || ASEER_LOGO_B64;
  
  const activeHep = HEP_CONTENT.find(hep => hep.id === activeTab);

  const handlePrint = (sectionId: string) => {
    const sectionToPrint = document.getElementById(sectionId);
    if (sectionToPrint) {
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

  const handleImageUpload = (contentId: string, exerciseIndex: number, imageData: string) => {
    // Image is already stored in localStorage in the ExerciseCard component
    // This handler is for any additional logic if needed
    // Force a re-render to show the new image
    setActiveTab('');
    setTimeout(() => setActiveTab(contentId), 0);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="برامج التمارين المنزلية">
       <div className="container mx-auto print-container">
        
        {/* --- Screen Header --- */}
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
        
        {/* --- Print Header --- */}
        <header className="print-header hidden">
            <div className="flex items-center">
                <img src={logo} alt="شعار" className="h-20 w-20 object-contain" />
                <div className="mr-4">
                    <h1 className="text-lg font-bold">مستشفى الملك عبدالله ببيشة</h1>
                    <p className="text-sm">قسم التأهيل الطبي - العلاج الطبيعي</p>
                    <p className="text-sm font-semibold">برنامج تمارين منزلية</p>
                </div>
            </div>
            <div className="text-left">
                <h2 className="text-md font-bold">{activeHep?.title}</h2>
                <p className="text-xs mt-1">وفقاً للتوجهات العامة لوزارة الصحة السعودية</p>
            </div>
        </header>

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
            
            {HEP_CONTENT.map(hep => (
                 <div key={hep.id} className={activeTab === hep.id ? '' : 'hidden'}>
                    <ContentSection 
                      hep={hep} 
                      onPrint={handlePrint}
                      onImageUpload={handleImageUpload}
                    />
                 </div>
            ))}

            <footer className="mt-12 pt-6 border-t-2 border-gray-200 print-footer">
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