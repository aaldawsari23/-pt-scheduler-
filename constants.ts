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

export const HEP_DISCLAIMER = {
  title: 'إخلاء مسؤولية هام',
  text: 'هذه التمارين هي إرشادات عامة ولا تغني عن استشارة الطبيب أو أخصائي العلاج الطبيعي. تم تصميمها لتكون آمنة لمعظم الحالات، ولكن يجب التوقف فورًا عن أداء أي تمرين يسبب ألمًا حادًا أو متزايدًا. تجمع عسير الصحي ومستشفى الملك عبدالله ببيشة لا يتحملان أي مسؤولية عن أي إصابات قد تنتج عن تطبيق هذه التمارين بشكل خاطئ. استشر معالجك دائمًا لتحديد الخطة العلاجية الأنسب لحالتك.',
  sourcesTitle: 'المصادر والإرشادات',
  sourcesText: 'تم إعداد هذه البرامج بناءً على أفضل الممارسات والأدلة العلمية الحديثة في مجال العلاج الطبيعي، وبالاستناد إلى إرشادات هيئات صحية معتمدة مثل الأكاديمية الأمريكية لجراحي العظام (AAOS) والمعهد الوطني لالتهاب المفاصل والأمراض العضلية الهيكلية والجلدية (NIAMS)، بما يتوافق مع التوجهات العامة لوزارة الصحة السعودية.',
};


export const HEP_CONTENT: HepContent[] = [
  {
    id: 'back-pain',
    navTitle: 'آلام أسفل الظهر',
    title: 'تمارين منزلية لآلام أسفل الظهر',
    tipsTitle: 'نصائح وإرشادات هامة',
    tips: [
      'ابدأ التمارين ببطء وقم بزيادة عدد التكرارات تدريجيًا.',
      'تجنب الحركات المفاجئة التي قد تزيد من الألم.',
      'حافظ على وضعية جلوس ووقوف صحيحة خلال اليوم.',
      'استخدم كمادات دافئة قبل التمارين لتخفيف الشد العضلي، وكمادات باردة بعد التمارين لتقليل أي التهاب.',
      'التنفس بانتظام وعميق أثناء أداء التمارين.',
    ],
    exercises: [
      {
        name: 'تمرين سحب الركبة إلى الصدر',
        description: [
          'استلقِ على ظهرك مع ثني الركبتين وإبقاء القدمين مسطحتين على الأرض.',
          'استخدم يديك لسحب إحدى الركبتين برفق نحو صدرك.',
          'اثبت على هذا الوضع لمدة 20-30 ثانية.',
          'كرر التمرين 3 مرات لكل ساق.',
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTIwIDgwIEw4MCA4MCIgc3Ryb2tlPSIjYWRhN2E3IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSIyNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMmUzYTM3Ii8+CiAgPHBhdGggZD0iTTI1IDQ1IEw0MCA2MCBMNTUgNzUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNNjAgNjAgTDc1IDUwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTcwIDYwIEw4NSA1NSIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4='
      },
      {
        name: 'تمرين إمالة الحوض',
        description: [
          'استلقِ على ظهرك مع ثني الركبتين والقدمين على الأرض.',
          'شد عضلات بطنك واضغط بأسفل ظهرك على الأرض.',
          'اثبت على هذا الوضع لمدة 10 ثوانٍ.',
          'كرر التمرين 10 مرات.',
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTAgODAgSDkwIiBzdHJva2U9IiNhZGI1YmQiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxwYXRoIGQ9Ik0zMCA3NSBMNTUgNjAgTDgwIDc1IiBzdHJva2U9IiMyMTI1MjkiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTMwIDc1IEwyNSA4MCIgc3Ryb2tlPSIjMjEyNTI5IiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik04MCA3NSBMNzUgODAiIHN0cm9rZT0iMjEyNTI5IiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxjaXJjbGUgY3g9IjI1IiBjeT0iNTUiIHI9IjUiIGZpbGw9IiMyMTI1MjkiLz4KICA8cGF0aCBkPSJNNjAgNDUgUSA1NSAzNSw1MCAzME01MCAzMEEzMCAzMCAwIDAgMCAyNSA1NSIgc3Ryb2tlPSIjMDA3YmZmIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZS1kYXNoYXJyYXk9IjMgMyIvPgogIDxwb2x5bGluZSBwb2ludHM9IjU1LDMzIDUwLDMwIDQ3LDM1IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDdiZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg=='
      },
      {
        name: 'تمرين الجسر (كوبري)',
        description: [
          'استلقِ على ظهرك مع ثني الركبتين، واجعل ذراعيك بجانبك.',
          'ارفع وركيك عن الأرض حتى يصبح جسمك في خط مستقيم من كتفيك إلى ركبتيك.',
          'اثبت لمدة 5 ثوان ثم انزل ببطء.',
          'كرر التمرين 12 مرة.',
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTIwIDgwIEw4MCA4MCIgc3Ryb2tlPSIjYWRhN2E3IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSIyNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMmUzYTM3Ii8+CiAgPHBhdGggZD0iTTI1IDQ1IEw1MCA1NSBMNzUgNzAiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNNzUgNzAgTDgwIDgwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg=='
      },
      {
        name: 'تمرين Cat-Cow',
        description: [
          'اتخذ وضعية اليدين والركبتين على الأرض.',
          'قم بتقويس ظهرك للأعلى (مثل القطة) مع سحب بطنك للداخل.',
          'ثم قم بتقويس ظهرك للأسفل ببطء مع رفع رأسك.',
          'كرر الحركة ببطء 10 مرات.',
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTIwIDgwIEw4MCA4MCIgc3Ryb2tlPSIjYWRhN2E3IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSIyNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMmUzYTM3Ii8+CiAgPHBhdGggZD0iTTI1IDQ1IEwzNSA2NSBMNjUgNjUgTDc1IDQ1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTM1IDY1IEwzNSA4MCIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik02NSA2NUw2NSA4MCIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4='
      }
    ]
  },
  {
    id: 'knee-pain',
    navTitle: 'آلام الركبة',
    title: 'تمارين منزلية لآلام الركبة',
    tipsTitle: 'نصائح وإرشادات هامة',
    tips: [
      'تجنب الأنشطة التي تزيد من ألم الركبة مثل صعود السلالم بشكل متكرر أو الجلوس بوضعية القرفصاء.',
      'ارتداء أحذية مريحة وداعمة للقدم.',
      'إنقاص الوزن الزائد يمكن أن يقلل الضغط على مفصل الركبة بشكل كبير.',
      'ركز على تقوية العضلات حول الركبة (الفخذ الأمامية والخلفية) لدعم المفصل.',
    ],
    exercises: [
      {
        name: 'تمرين رفع الساق المستقيمة',
        description: [
          'استلقِ على ظهرك مع ثني إحدى الركبتين ومد الساق الأخرى.',
          'ارفع الساق الممدودة ببطء حوالي 20 سم عن الأرض مع الحفاظ على استقامتها.',
          'اثبت لمدة 5 ثوانٍ ثم أنزلها ببطء.',
          'كرر التمرين 10-15 مرة لكل ساق.',
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTIwIDgwIEw4MCA4MCIgc3Ryb2tlPSIjYWRhN2E3IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSIyNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMmUzYTM3Ii8+CiAgPHBhdGggZD0iTTI1IDQ1IEw0MCA2MCBMNjAgNzUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNNjAgNzUgTDg1IDUwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg=='
      },
      {
        name: 'تمرين تقوية العضلة الرباعية',
        description: [
          'اجلس على الأرض مع مد ساقيك أمامك.',
          'ضع منشفة ملفوفة تحت ركبة واحدة.',
          'اضغط بركبتك على المنشفة لشد عضلة الفخذ الأمامية.',
          'اثبت لمدة 5 ثوانٍ.',
          'كرر التمرين 10 مرات لكل ساق.',
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTAgODUgSDkwIiBzdHJva2U9IiNhZGI1YmQiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxwYXRoIGQ9Ik0yMCA4MCBMIDgwIDgwIiBzdHJva2U9IiMyMTI1MjkiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPGNpcmNsZSBjeD0iMjUiIGN5PSI1MCIgcj0iNSIgZmlsbD0iIzIxMjUyOSIvPgogIDxwYXRoIGQ9Ik0yNSA1NSBMIDIwIDgwIiBzdHJva2U9IiMyMTI1MjkiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPGNpcmNsZSBjeD0iNTUiIGN5PSI4MCIgcj0iNiIgZmlsbD0iI2RlZDJkNiIvPgogIDxwYXRoIGQ9Ik01NSA3MCBMIDU1IDYwIE01MCA2NSBMIDU1IDYwIEwgNjAgNjUiIHN0cm9rZT0iIzAwN2JmZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+'
      },
      {
        name: 'تمرين القرفصاء الجزئي (Mini-Squat)',
        description: [
          'قف بشكل مستقيم واستند على كرسي أو حائط لتحقيق التوازن.',
          'انزل ببطء بجسمك حوالي 15 سم (قرفصاء بسيطة).',
          'حافظ على ظهرك مستقيماً وتأكد من أن ركبتيك لا تتجاوز أصابع قدميك.',
          'اثبت لثوانٍ ثم عد لوضع البداية.',
          'كرر التمرين 10 مرات.',
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTgwIDIwIEw4MCA4MCIgc3Ryb2tlPSIjYWRhN2E3IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjMwIiByPSI1IiBmaWxsPSIjMmUzYTM3Ii8+CiAgPHBhdGggZD0iTTUwIDM1IEw1MCA1NSBMNDAgNzUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNNTAgNTUgTDYwIDc1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg=='
      },
    ]
  },
  {
    id: 'neck-pain',
    navTitle: 'آلام الرقبة',
    title: 'تمارين منزلية لآلام الرقبة',
    tipsTitle: 'نصائح وإرشادات هامة',
    tips: [
      'تجنب إمالة الرأس للأمام لفترات طويلة عند استخدام الهاتف أو الكمبيوتر.',
      'تأكد من أن شاشة الكمبيوتر في مستوى النظر.',
      'استخدم وسادة طبية مناسبة أثناء النوم لدعم الرقبة.',
      'قم بأداء التمارين برفق وبطء، وتوقف إذا شعرت بألم حاد أو دوخة.',
    ],
    exercises: [
      {
        name: 'تمرين إطالة الرقبة الجانبي',
        description: [
          'اجلس أو قف بشكل مستقيم.',
          'أمل رأسك برفق نحو كتفك الأيمن حتى تشعر بشد خفيف في الجانب الأيسر من رقبتك.',
          'يمكنك استخدام يدك اليمنى لزيادة الشد بلطف.',
          'اثبت لمدة 20-30 ثانية. كرر على الجانب الآخر.',
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSIzMCIgcj0iMTIiIGZpbGw9IiNmMDBmOGUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIyIiB0cmFuc2Zvcm09InJvdGF0ZSgxNSw1MCwzMCkiLz4KICA8cGF0aCBkPSJNNTAgNDIgVjg1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTUwIDU1IEgzNSIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik01MCA1NSBINjUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg=='
      },
      {
        name: 'تمرين سحب الذقن للداخل',
        description: [
          'اجلس بشكل مستقيم وانظر للأمام.',
          'اسحب ذقنك ورأسك للخلف بشكل مستقيم دون إمالة الرأس للأسفل.',
          'ستشعر بشد في الجزء الخلفي من الرقبة.',
          'اثبت لمدة 5 ثوانٍ. كرر التمرين 10 مرات.',
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSIzMCIgcj0iMTIiIGZpbGw9IiNmMDBmOGUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHBhdGggZD0iTTUwIDQyIFY4MCIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik01MCA1NSBIMzUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNNTAgNTUgSDY1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTUwIDgwIEwzNSA5NSIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik01MCA4MCBINjUgOTUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNNjUgMzAgTDc1IDMwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtZGFzaGFycmF5PSI1IDUiLz4KICA8cG9seWxpbmUgcG9pbnRzPSI3NSwzNSA3MCwzMCA3NSwyNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4='
      },
      {
        name: 'تمرين دوران الرقبة',
        description: [
          'اجلس بشكل مستقيم.',
          'أدر رأسك ببطء إلى اليمين قدر الإمكان بشكل مريح.',
          'اثبت لمدة 5 ثوانٍ ثم عد إلى المنتصف.',
          'كرر الحركة إلى اليسار. قم بعمل 5 تكرارات لكل جانب.',
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjMwIiByPSIxMiIgZmlsbD0iI2Y4ZjBlMyIgc3Ryb2tlPSIjMjEyNTI5IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBkPSJNNTAgNDIgViA4MCIgc3Ryb2tlPSIjMjEyNTI5IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik0zNSA1NSBIIDY1IiBzdHJva2U9IiMyMTI1MjkiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTcwIDMwIEEgMjAgMjAgMCAwIDEgODUgMzAiIHN0cm9rZT0iIzAwN2JmZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIiBzdHJva2UtZGFzaGFycmF5PSIzIDMiLz4KICA8cG9seWxpbmUgcG9pbnRzPSI4NSwzNSA5MCwzMCA4NSwyNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA3YmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4='
      },
    ]
  },
  {
    id: 'bells-palsy',
    navTitle: 'شلل الوجه (بيل)',
    title: 'تمارين منزلية لشلل الوجه (بيل)',
    tipsTitle: 'نصائح وإرشادات هامة',
    tips: [
      'قم بالتمارين أمام المرآة للمساعدة في تركيزك على الحركات الصحيحة.',
      'ابدأ بحركات صغيرة وبدون مجهود، ثم زد من نطاق الحركة تدريجيًا.',
      'لا ترهق نفسك، قم بالتمارين لفترات قصيرة عدة مرات في اليوم.',
      'استخدم قطرات العين المرطبة لحماية العين في الجانب المصاب إذا كنت تعاني من صعوبة في إغلاقها.',
      'حاول تدليك عضلات وجهك بلطف بأطراف أصابعك لتحفيزها.',
    ],
    exercises: [
      {
        name: 'تمرين رفع الحاجب',
        description: [
          'اجلس أمام المرآة.',
          'حاول رفع حاجبيك معًا كأنك متفاجئ.',
          'يمكنك استخدام إصبعك للمساعدة في رفع الحاجب في الجانب المصاب.',
          'اثبت لثوانٍ ثم استرخ. كرر التمرين 10 مرات.',
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiNmMDBmOGUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGVsbGlwc2UgY3g9IjM1IiBjeT0iNDUiIHJ4PSI4IiByeT0iNCIgZmlsbD0iIzJlM2EzNyIvPgogIDxlbGxpcHNlIGN4PSI2NSIgY3k9IjQ1IiByeD0iOCIgcnk9IjQiIGZpbGw9IiMyZTNhMzciLz4KICA8cGF0aCBkPSJNMjUgMzUgQzI1IDMwIDQ1IDMwIDQ1IDM1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0idHJhbnNwYXJlbnQiLz4KICA8cGF0aCBkPSJNNTUgMzUgQzU1IDMwIDc1IDMwIDc1IDM1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0idHJhbnNwYXJlbnQiLz4KICA8cGF0aCBkPSJNMzUgNzAgQzUwIDgwIDY1IDcwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0idHJhbnNwYXJlbnQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4='
      },
      {
        name: 'تمرين إغلاق العين وفتحها',
        description: [
          'حاول إغلاق عينيك بلطف.',
          'ركز على محاولة إغلاق العين في الجانب المصاب. لا تضغط بقوة.',
          'افتح عينيك ببطء.',
          'كرر التمرين 10 مرات.',
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiNmMDBmOGUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHBhdGggZD0iTTI1IDQ1IEMzNSA0MCA0NSA0NSIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz4KICA8cGF0aCBkPSJNNTUgNDUgQzY1IDQwIDc1IDQ1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0yNSA0MCBDMjAgMzUgMzAgMzUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTc1IDQwIEM4MCAzNSA3MCAzNSIgc3Ryb2tlPSIjMmUzYTM3IiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz4KICA8cGF0aCBkPSJNMzUgNzAgQzUwIDcwIDY1IDcwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0idHJhbnNwYXJlbnQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4='
      },
      {
        name: 'تمرين الابتسامة',
        description: [
          'حاول أن تبتسم بلطف مع إبقاء شفتيك مغلقتين.',
          'ثم حاول أن تبتسم مع إظهار أسنانك.',
          'ركز على تحريك زاوية الفم في الجانب المصاب.',
          'استرخ. كرر كل حركة 10 مرات.',
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiNmMDBmOGUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGNpcmNsZSBjeD0iMzUiIGN5PSI0NSIgcj0iNSIgZmlsbD0iIzJlM2EzNyIvPgogIDxjaXJjbGUgY3g9IjY1IiBjeT0iNDUiIHI9IjUiIGZpbGw9IiMyZTNhMzciLz4KICA8cGF0aCBkPSJNMzAgNjUgQzUwIDg1IDcwIDY1IiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0idHJhbnNwYXJlbnQiLz4KICA8cGF0aCBkPSJNMzUgNzIgSDY1IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg=='
      },
      {
        name: 'تمرين نفخ الخدين',
        description: [
          'خذ نفسًا عميقًا.',
          'انفخ خديك مع إبقاء شفتيك مغلقتين بإحكام لمنع تسرب الهواء.',
          'اثبت لمدة 5-10 ثوانٍ.',
          'كرر التمرين 5 مرات.',
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiNmMDBmOGUiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGNpcmNsZSBjeD0iMzUiIGN5PSI0NSIgcj0iNSIgZmlsbD0iIzJlM2EzNyIvPgogIDxjaXJjbGUgY3g9IjY1IiBjeT0iNDUiIHI9IjUiIGZpbGw9IiMyZTNhMzciLz4KICA8cGF0aCBkPSJNMjAgNzAgQzMwIDYwIDQwIDcwIiBzdHJva2U9IiMyZTNhMzciIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik04MCA3MCBDNzAgNjAgNjAgNzAiIHN0cm9rZT0iIzJlM2EzNyIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI3MiIgcj0iMyIgZmlsbD0iIzJlM2EzNyIvPgo8L3N2Zz4='
      }
    ]
  },
];
