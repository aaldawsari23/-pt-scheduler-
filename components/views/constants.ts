
import type { Provider, Settings, HepContent } from './types';
import { Specialty } from './types';

export const INITIAL_PROVIDERS: Provider[] = [
  { id: '1', name: 'عريز', specialty: Specialty.MSK, days: [0], dailyCapacity: 4, isNewPatientProvider: false, newPatientQuota: 0, slug: 'ariz' },
  { id: '2', name: 'عجيم', specialty: Specialty.MSK, days: [1], dailyCapacity: 4, isNewPatientProvider: false, newPatientQuota: 0, slug: 'ajim' },
  { id: '3', name: 'بناوي', specialty: Specialty.MSK, days: [2], dailyCapacity: 4, isNewPatientProvider: false, newPatientQuota: 0, slug: 'banawee' },
  { id: '4', name: 'سعد', specialty: Specialty.Neuro, days: [3], dailyCapacity: 4, isNewPatientProvider: false, newPatientQuota: 0, slug: 'saad' },
  { id: '5', name: 'محمد يوسف', specialty: Specialty.PT_Service, days: [0, 1, 2, 3], dailyCapacity: 6, isNewPatientProvider: true, newPatientQuota: 2, slug: 'mohamed_youssef' },
  { id: '6', name: 'خالد العماري', specialty: Specialty.PT_Service, days: [0, 1, 2, 3], dailyCapacity: 6, isNewPatientProvider: true, newPatientQuota: 1, slug: 'khaled_alamari' },
];

export const INITIAL_SETTINGS: Settings = {
  pin: null, // No PIN initially
  bookingLocked: false,
  bookingLockDate: null,
  urgentReserve: true,
  emergencySlotCode: null,
  followUp3wWeeks: 3,
  followUp1mMonths: 1,
  customLogoB64: null,
};

export const WORK_HOURS = {
  start: 8,
  end: 15.5, // 3:30 PM
  morningEnd: 12,
};

export const SLOT_DURATION_MINUTES = 15;

export const ASEER_LOGO_B64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTEwMCAxMCBDMTUwLDEwIDE5MCw1MCAxOTAsMTAwIEMxOTAsMTUwIDE1MCwxOTAgMTAwLDE5MCBDNTAsMTkwIDEwLDE1MCAxMCwxMDAgQzEwLDUwIDUwLDEwIDEwMCwxMFoiIGZpbGw9IiMwMDcxYmYiLz4KICA8cGF0aCBkPSJNNzIgMTUwIEM3MiwxNTAgODIsMTMwIDEwMCwxMzAgQzExOCwxMzAgMTI4LDE1MCAxMjgsMTUwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBmaWxsPSJ0cmFuc3BhcmVudCIvPgogIDxwYXRoIGQ9Ik03MCA4MCBDNzAsODAgODAsMTAwIDEwMCwxMDAgQzEyMCwxMDAgMTMwLDgwIDEzMCw4MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KICA8cGF0aCBkPSJNNzAgMTIwIEM3MCwxMjAgODAsMTQwIDEwMCwxNDAgQzEyMCwxNDAgMTMwLDEyMCAxMzAsMTIwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBmaWxsPSJ0cmFuc3BhcmVudCIvPgogIDxwYXRoIGQ9Ik03MCAxMDAgQzcwLDEwMCA4MCwxMjAgMTAwLDEyMCBDMTIwLDEyMCAxMzAsMTAwIDEzMCwxMDAiIHN0cm9rZS1iYWNrZ3JvdW5kPSIjZmZmIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBmaWxsPSJ0cmFuc3BhcmVudCIvPgogIDxwYXRoIGQ9Ik03NSA2MCBDNzUsNjAgODUsODAgMTAwLDgwIEMxMTUsODAgMTI1LDYwIDEyNSw2MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPC9zdmc+";

export const HEP_CONTENT: HepContent[] = [
  {
    id: 'facial_palsy',
    title: 'تمارين شلل العصب الوجهي',
    exercises: [
      {
        name: 'رفع الحاجبين',
        description: 'ارفع حاجبيك لأعلى قدر الإمكان، كأنك متفاجئ. حافظ على هذه الوضعية لمدة 10-15 ثانية ثم استرخ. كرر التمرين 10 مرات.',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiNmMDBmOGUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGVsbGlwc2UgY3g9IjM1IiBjeT0iNDUiIHJ4PSI4IiByeT0iNCIgZmlsbD0iIzJlM2EzNyIvPgogIDxlbGxpcHNlIGN4PSI2NSIgY3k9IjQ1IiByeD0iOCIgcnk9IjQiIGZpbGw9IiMyZTNhMzciLz4KICA8cGF0aCBkPSJNMjUgMzUgQzI1IDMwIDQ1IDMwIDQ1IDM1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0idHJhbnNwYXJlbnQiLz4KICA8cGF0aCBkPSJNNTUgMzUgQzU1IDMwIDc1IDMwIDc1IDM1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0idHJhbnNwYXJlbnQiLz4KICA8cGF0aCBkPSJNMzUgNzAgQzUwIDgwIDY1IDcwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0idHJhbnNwYXJlbnQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4='
      },
      {
        name: 'إغماض العينين بقوة',
        description: 'أغمض عينيك بقوة مع شد العضلات المحيطة بهما. حافظ على هذه الوضعية لمدة 10 ثوانٍ ثم استرخ تمامًا. كرر التمرين 10 مرات.',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiNmMDBmOGUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHBhdGggZD0iTTI1IDQ1IEMzNSA0MCA0NSA0NSIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz4KICA8cGF0aCBkPSJNNTUgNDUgQzY1IDQwIDc1IDQ1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0yNSA0MCBDMjAgMzUgMzAgMzUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTc1IDQwIEM4MCAzNSA3MCAzNSIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz4KICA8cGF0aCBkPSJNMzUgNzAgQzUwIDcwIDY1IDcwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0idHJhbnNwYXJlbnQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4='
      },
      {
        name: 'الابتسامة العريضة',
        description: 'ابتسم ابتسامة عريضة قدر الإمكان مع إظهار أسنانك. حاول أن ترفع زوايا فمك للأعلى. حافظ على الوضعية 10 ثوانٍ. كرر 10 مرات.',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiNmMDBmOGUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGNpcmNsZSBjeD0iMzUiIGN5PSI0NSIgcj0iNSIgZmlsbD0iIzJlM2EzNyIvPgogIDxjaXJjbGUgY3g9IjY1IiBjeT0iNDUiIHI9IjUiIGZpbGw9IiMyZTNhMzciLz4KICA8cGF0aCBkPSJNMzAgNjUgQzUwIDg1IDcwIDY1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0idHJhbnNwYXJlbnQiLz4KICA8cGF0aCBkPSJNMzUgNzIgSDY1IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg=='
      },
      {
        name: 'نفخ الخدين',
        description: 'املأ فمك بالهواء وانفخ خديك. حافظ على شفتيك مغلقتين بإحكام. استمر لمدة 10 ثوانٍ ثم أخرج الهواء ببطء. كرر 5 مرات.',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiNmMDBmOGUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGNpcmNsZSBjeD0iMzUiIGN5PSI0NSIgcj0iNSIgZmlsbD0iIzJlM2EzNyIvPgogIDxjaXJjbGUgY3g9IjY1IiBjeT0iNDUiIHI9IjUiIGZpbGw9IiMyZTNhMzciLz4KICA8cGF0aCBkPSJNMjAgNzAgQzMwIDYwIDQwIDcwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik04MCA3MCBDNzAgNjAgNjAgNzAiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI3MiIgcj0iMyIgZmlsbD0iIzJlM2EzNyIvPgo8L3N2Zz4='
      }
    ],
    disclaimer: 'تنبيه: هذه التمارين هي إرشادات عامة. يجب اتباع تعليمات أخصائي العلاج الطبيعي المسؤول عن الحالة. وزارة الصحة لا تتحمل مسؤولية أي مضاعفات تنتج عن سوء تطبيق التمارين.',
  },
  {
    id: 'low_back',
    title: 'تمارين آلام أسفل الظهر',
    exercises: [
        {
            name: 'سحب الركبة إلى الصدر',
            description: 'استلقِ على ظهرك مع ثني الركبتين. اسحب ركبة واحدة بلطف نحو صدرك باستخدام يديك. حافظ على الوضعية لمدة 20-30 ثانية. كرر 3 مرات لكل ساق.',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTIwIDgwIEw4MCA4MCIgc3Ryb2tlPSIjYWRhN2E3IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSIyNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMmUzYTM3Ii8+CiAgPHBhdGggZD0iTTI1IDQ1IEw0MCA2MCBMNTUgNzUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNNjAgNjAgTDc1IDUwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTcwIDYwIEw4NSA1NSIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4='
        },
        {
            name: 'تمرين الجسر (Bridge)',
            description: 'استلقِ على ظهرك مع ثني الركبتين والقدمين على الأرض. ارفع وركيك ببطء عن الأرض حتى يشكل جسمك خطًا مستقيمًا من كتفيك إلى ركبتيك. حافظ على الوضعية 5 ثوانٍ ثم انزل ببطء. كرر 12 مرة.',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTIwIDgwIEw4MCA4MCIgc3Ryb2tlPSIjYWRhN2E3IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSIyNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMmUzYTM3Ii8+CiAgPHBhdGggZD0iTTI1IDQ1IEw1MCA1NSBMNzUgNzAiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNNzUgNzAgTDgwIDgwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg=='
        },
        {
            name: 'إطالة الظهر (Cat-Cow)',
            description: 'ابدأ على يديك وركبتيك. قم بتقويس ظهرك للأعلى (مثل القطة) مع سحب بطنك للداخل. ثم، قم بخفض ظهرك ببطء مع رفع رأسك وصدرك للأعلى (وضعية البقرة). كرر الحركة ببطء 10-15 مرة.',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTIwIDgwIEw4MCA4MCIgc3Ryb2tlPSIjYWRhN2E3IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSIyNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMmUzYTM3Ii8+CiAgPHBhdGggZD0iTTI1IDQ1IEwzNSA2NSBMNjUgNjUgTDc1IDQ1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTM1IDY1IEwzNSA4MCIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik02NSA2NUw2NSA4MCIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4='
        }
    ],
    disclaimer: 'تنبيه: هذه التمارين هي إرشادات عامة. يجب اتباع تعليمات أخصائي العلاج الطبيعي المسؤول عن الحالة. وزارة الصحة لا تتحمل مسؤولية أي مضاعفات تنتج عن سوء تطبيق التمارين.',
  },
  {
    id: 'knee',
    title: 'تمارين تقوية الركبة',
    exercises: [
        {
            name: 'رفع الساق المستقيمة',
            description: 'استلقِ على ظهرك مع ثني إحدى الركبتين. ارفع الساق الأخرى بشكل مستقيم حوالي 20-30 سم عن الأرض. حافظ على الوضعية لمدة 5 ثوانٍ ثم انزل ببطء. كرر 10-15 مرة لكل ساق.',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTIwIDgwIEw4MCA4MCIgc3Ryb2tlPSIjYWRhN2E3IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSIyNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMmUzYTM3Ii8+CiAgPHBhdGggZD0iTTI1IDQ1IEw0MCA2MCBMNjAgNzUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNNjAgNzUgTDg1IDUwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg=='
        },
        {
            name: 'القرفصاء الجزئي (Mini Squat)',
            description: 'قف مستندًا على حائط مع مباعدة قدميك بعرض الكتفين. انزل ببطء كأنك تجلس على كرسي، حتى تصل إلى زاوية 45 درجة في الركبة. حافظ على ظهرك مستقيمًا. استمر 5 ثوانٍ ثم اصعد ببطء. كرر 10 مرات.',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTgwIDIwIEw4MCA4MCIgc3Ryb2tlPSIjYWRhN2E3IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjMwIiByPSI1IiBmaWxsPSIjMmUzYTM3Ii8+CiAgPHBhdGggZD0iTTUwIDM1IEw1MCA1NSBMNDAgNzUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNNTAgNTUgTDYwIDc1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg=='
        },
        {
            name: 'إطالة أوتار الركبة (Hamstring)',
            description: 'اجلس على حافة كرسي. مد ساق واحدة أمامك بشكل مستقيم مع الحفاظ على الكعب على الأرض. انحنِ للأمام ببطء من عند الوركين حتى تشعر بشد لطيف خلف الفخذ. استمر لمدة 20-30 ثانية. كرر 3 مرات لكل ساق.',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTIwIDgwIEw0MCA4MCA0MCA2MCAyMCA2MCBaIiBmaWxsPSIjYWRhN2E3Ii8+CiAgPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNSIgZmlsbD0iIzJlM2EzNyIvPgogIDxwYXRoIGQ9Ik0zMCAzNSBMMzAgNjAgTDgwIDgwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg=='
        }
    ],
    disclaimer: 'تنبيه: هذه التمارين هي إرشادات عامة. يجب اتباع تعليمات أخصائي العلاج الطبيعي المسؤول عن الحالة. وزارة الصحة لا تتحمل مسؤولية أي مضاعفات تنتج عن سوء تطبيق التمارين.',
  },
  {
    id: 'neck',
    title: 'تمارين آلام الرقبة',
    exercises: [
        {
            name: 'سحب الذقن (Chin Tuck)',
            description: 'اجلس أو قف بشكل مستقيم. اسحب رأسك وذقنك للخلف بشكل مستقيم، كأنك تصنع ذقنًا مزدوجًا، دون إمالة رأسك للأسفل. ستشعر بشد في مؤخرة الرقبة. حافظ على الوضعية 5 ثوانٍ. كرر 10 مرات.',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSIzMCIgcj0iMTIiIGZpbGw9IiNmMDBmOGUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHBhdGggZD0iTTUwIDQyIFY4MCIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik01MCA1NSBIMzUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNNTAgNTUgSDY1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTUwIDgwIEwzNSA5NSIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik01MCA4MCBINjUgOTUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNNjUgMzAgTDc1IDMwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtZGFzaGFycmF5PSI1IDUiLz4KICA8cG9seWxpbmUgcG9pbnRzPSI3NSwzNSA3MCwzMCA3NSwyNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4='
        },
        {
            name: 'إطالة الرقبة الجانبية',
            description: 'اجلس بشكل مستقيم. قم بإمالة رأسك بلطف نحو كتفك الأيمن. يمكنك استخدام يدك اليمنى لزيادة الشد بلطف. ستشعر بشد في الجانب الأيسر من رقبتك. حافظ على الوضعية 20-30 ثانية. كرر للجهة الأخرى.',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSIzMCIgcj0iMTIiIGZpbGw9IiNmMDBmOGUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIyIiB0cmFuc2Zvcm09InJvdGF0ZSgxNSw1MCwzMCkiLz4KICA8cGF0aCBkPSJNNTAgNDIgVjg1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTUwIDU1IEgzNSIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik01MCA1NSBINjUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg=='
        },
        {
            name: 'إطالة العضلة الشوكية (Levator)',
            description: 'اجلس بشكل مستقيم. أدر رأسك بزاوية 45 درجة إلى اليمين، ثم انظر للأسفل نحو إبطك الأيمن. يمكنك وضع يدك اليمنى على رأسك لزيادة الشد. حافظ على الوضعية 20-30 ثانية. كرر للجهة الأخرى.',
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSIzMCIgcj0iMTIiIGZpbGw9IiNmMDBmOGUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIyIiB0cmFuc2Zvcm09InJvdGF0ZSgyMCw1MCwzMCkgdHJhbnNsYXRlKDUsIDUpIi8+CiAgPHBhdGggZD0iTTUwIDQyIFY4NSIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik01MCA1NSBIMzUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNNTAgNTUgSDY1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg=='
        }
    ],
    disclaimer: 'تنبيه: هذه التمارين هي إرشادات عامة. يجب اتباع تعليمات أخصائي العلاج الطبيعي المسؤول عن الحالة. وزارة الصحة لا تتحمل مسؤولية أي مضاعفات تنتج عن سوء تطبيق التمارين.',
  }
];