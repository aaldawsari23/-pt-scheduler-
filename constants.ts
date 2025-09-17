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
  language: 'ar',
  urgentDaysAhead: 1,
  semiUrgentDaysAhead: 3,
  normalDaysAhead: 30,
  chronicWeeksAhead: 8,
  blockWeekends: true,
  blockFridays: true,
  morningStartHour: 8,
  morningEndHour: 12,
  afternoonStartHour: 12,
  afternoonEndHour: 15.5,
  autoDistributeBookings: true,
};

export const WORK_HOURS = {
  start: 8,
  end: 15.5, // 3:30 PM
  morningEnd: 12,
};

export const SLOT_DURATION_MINUTES = 15;

export const ASEER_LOGO_URL = "/logo.png";

// FIX: Updated HEP_CONTENT to match the HepContent interface and use correct image paths.
export const HEP_CONTENT: HepContent[] = [
  {
    id: 'facial_palsy',
    navTitle: 'شلل الوجه',
    title: 'تمارين شلل العصب الوجهي',
    tipsTitle: 'نصائح هامة',
    tips: [
        'قم بأداء التمارين أمام المرآة للمساعدة في التركيز وضمان الأداء الصحيح.',
        'الاستمرارية هي مفتاح التحسن، حاول أداء التمارين يوميًا.',
        'لا تجهد العضلات، الراحة مهمة.'
    ],
    exercises: [
      {
        name: 'رفع الحاجبين',
        description: ['ارفع حاجبيك لأعلى قدر الإمكان، كأنك متفاجئ. حافظ على هذه الوضعية لمدة 10-15 ثانية ثم استرخ. كرر التمرين 10 مرات.'],
        image: '/exercises/eyebrowrise.png'
      },
      {
        name: 'إغماض العينين بقوة',
        description: ['أغمض عينيك بقوة مع شد العضلات المحيطة بهما. حافظ على هذه الوضعية لمدة 10 ثوانٍ ثم استرخ تمامًا. كرر التمرين 10 مرات.'],
        image: '/exercises/eyeclose.png'
      },
      {
        name: 'الابتسامة العريضة',
        description: ['ابتسم ابتسامة عريضة قدر الإمكان مع إظهار أسنانك. حاول أن ترفع زوايا فمك للأعلى. حافظ على الوضعية 10 ثوانٍ. كرر 10 مرات.'],
        image: '/exercises/smile.png'
      },
      {
        name: 'نفخ الخدين',
        description: ['املأ فمك بالهواء وانفخ خديك. حافظ على شفتيك مغلقتين بإحكام. استمر لمدة 10 ثوانٍ ثم أخرج الهواء ببطء. كرر 5 مرات.'],
        image: '/exercises/chickblow.png'
      }
    ],
  },
  {
    id: 'low_back',
    navTitle: 'أسفل الظهر',
    title: 'تمارين آلام أسفل الظهر',
    tipsTitle: 'نصائح لتخفيف آلام الظهر',
    tips: [
        'تجنب الجلوس لفترات طويلة، وحاول الوقوف والتحرك كل 30 دقيقة.',
        'عند رفع الأشياء، اثنِ ركبتيك وحافظ على ظهرك مستقيمًا.',
        'استخدم كمادات دافئة أو باردة على منطقة الألم لمدة 15-20 دقيقة.'
    ],
    exercises: [
        {
            name: 'سحب الركبة إلى الصدر',
            description: ['استلقِ على ظهرك مع ثني الركبتين. اسحب ركبة واحدة بلطف نحو صدرك باستخدام يديك. حافظ على الوضعية لمدة 20-30 ثانية. كرر 3 مرات لكل ساق.'],
            image: '/exercises/kneetochest.png'
        },
        {
            name: 'تمرين الجسر (Bridge)',
            description: ['استلقِ على ظهرك مع ثني الركبتين والقدمين على الأرض. ارفع وركيك ببطء عن الأرض حتى يشكل جسمك خطًا مستقيمًا من كتفيك إلى ركبتيك. حافظ على الوضعية 5 ثوانٍ ثم انزل ببطء. كرر 12 مرة.'],
            image: '/exercises/briddging.png'
        },
        {
            name: 'إطالة الظهر (Cat-Cow)',
            description: ['ابدأ على يديك وركبتيك. قم بتقويس ظهرك للأعلى (مثل القطة) مع سحب بطنك للداخل. ثم، قم بخفض ظهرك ببطء مع رفع رأسك وصدرك للأعلى (وضعية البقرة). كرر الحركة ببطء 10-15 مرة.'],
            image: '/exercises/catcamel.png'
        }
    ],
  },
  {
    id: 'knee',
    navTitle: 'الركبة',
    title: 'تمارين تقوية الركبة',
    tipsTitle: 'إرشادات لتمارين الركبة',
    tips: [
        'توقف عن التمرين فورًا إذا شعرت بألم حاد.',
        'الحفاظ على وزن صحي يقلل الضغط على مفصل الركبة.',
        'ارتدِ أحذية مريحة وداعمة أثناء ممارسة الأنشطة اليومية.'
    ],
    exercises: [
        {
            name: 'رفع الساق المستقيمة',
            description: ['استلقِ على ظهرك مع ثني إحدى الركبتين. ارفع الساق الأخرى بشكل مستقيم حوالي 20-30 سم عن الأرض. حافظ على الوضعية لمدة 5 ثوانٍ ثم انزل ببطء. كرر 10-15 مرة لكل ساق.'],
            image: '/exercises/slr.png'
        },
        {
            name: 'القرفصاء الجزئي (Mini Squat)',
            description: ['قف مستندًا على حائط مع مباعدة قدميك بعرض الكتفين. انزل ببطء كأنك تجلس على كرسي، حتى تصل إلى زاوية 45 درجة في الركبة. حافظ على ظهرك مستقيمًا. استمر 5 ثوانٍ ثم اصعد ببطء. كرر 10 مرات.'],
            image: '/exercises/minisquat.png'
        },
        {
            name: 'شد العضلة الرباعية (Isometric Quad)',
            description: ['اجلس مع مد ساقك بشكل مستقيم. شد عضلة الفخذ الأمامية بأقصى قوة ممكنة دون تحريك الساق. استمر في الشد لمدة 5-10 ثوانٍ ثم استرخ. كرر 10 مرات.'],
            image: '/exercises/isometricquad.png'
        }
    ],
  },
  {
    id: 'neck',
    navTitle: 'الرقبة',
    title: 'تمارين آلام الرقبة',
    tipsTitle: 'توصيات لتجنب آلام الرقبة',
    tips: [
        'حافظ على وضعية جيدة أثناء الجلوس والوقوف.',
        'تجنب النوم على بطنك، ويفضل استخدام وسادة داعمة للرقبة.',
        'اضبط شاشة الكمبيوتر لتكون في مستوى النظر لتجنب انحناء الرقبة.'
    ],
    exercises: [
        {
            name: 'سحب الذقن (Chin Tuck)',
            description: ['اجلس أو قف بشكل مستقيم. اسحب رأسك وذقنك للخلف بشكل مستقيم، كأنك تصنع ذقنًا مزدوجًا، دون إمالة رأسك للأسفل. ستشعر بشد في مؤخرة الرقبة. حافظ على الوضعية 5 ثوانٍ. كرر 10 مرات.'],
            image: '/exercises/chintuck.png'
        },
        {
            name: 'إطالة الرقبة الجانبية',
            description: ['اجلس بشكل مستقيم. قم بإمالة رأسك بلطف نحو كتفك الأيمن. يمكنك استخدام يدك اليمنى لزيادة الشد بلطف. ستشعر بشد في الجانب الأيسر من رقبتك. حافظ على الوضعية 20-30 ثانية. كرر للجهة الأخرى.'],
            image: '/exercises/stretchneck.png'
        },
        {
            name: 'تدوير الرقبة (Neck Rotation)',
            description: ['اجلس بشكل مستقيم. أدر رأسك ببطء إلى اليمين قدر الإمكان دون الشعور بألم. حافظ على الوضعية 5 ثوانٍ ثم عد ببطء إلى المركز. كرر للجهة اليسرى. قم بأداء 5 تكرارات لكل جانب.'],
            image: '/exercises/neckrotation.png'
        }
    ],
  }
];

export const HEP_DISCLAIMER = {
  title: 'تنبيه وإخلاء مسؤولية',
  text: 'هذه التمارين هي إرشادات عامة. يجب اتباع تعليمات أخصائي العلاج الطبيعي المسؤول عن الحالة. التوجهات العامة لوزارة الصحة السعودية والتجمعات الصحية لا تتحمل مسؤولية أي مضاعفات تنتج عن سوء تطبيق التمارين.',
  sourcesTitle: 'المصادر والإرشادات',
  sourcesText: 'تم إعداد هذا المحتوى بالاستناد إلى الأدلة العلمية والممارسات الموصى بها في مجال العلاج الطبيعي، وبما يتوافق مع التوجهات العامة لوزارة الصحة السعودية والتجمعات الصحية.'
};