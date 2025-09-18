import React from 'react';
import { useAppContext } from '../../context/AppContext';

const LanguageToggle: React.FC = () => {
  const { settings, setSettings } = useAppContext();
  
  // Set default language to 'ar' if not set
  const currentLang = settings.language || 'ar';

  const toggleLanguage = () => {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    setSettings({
      ...settings,
      language: newLang
    });
    // Force update document language and direction
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'en' ? 'ltr' : 'rtl';
  };
  
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-all shadow-sm hover:shadow-md transform hover:scale-105 active:scale-100"
      title={currentLang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      <span className="font-bold text-sm text-slate-700">
        {currentLang === 'ar' ? 'EN' : 'ع'}
      </span>
      {/* Language label for clarity */}
      <span className="text-xs text-slate-500 hidden sm:inline">
        {currentLang === 'ar' ? '(English)' : '(عربي)'}
      </span>
    </button>
  );
};

export default LanguageToggle;