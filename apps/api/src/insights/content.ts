import { PhaseKey } from '../moon/moon.service';

export type Lang = 'en' | 'km';
export type Category = 'haircut' | 'garden' | 'health' | 'finance' | 'love' | 'general';

type Bilingual = Record<Lang, string>;

interface PhaseContent {
  mood: Bilingual; // short headline for the day's energy
  advice: Partial<Record<Category, Bilingual>>;
}

export const PHASE_CONTENT: Record<PhaseKey, PhaseContent> = {
  new: {
    mood: {
      en: 'A clean slate. Set intentions and plant seeds — literally and figuratively.',
      km: 'ការចាប់ផ្ដើមថ្មី។ កំណត់បំណង និងសាបព្រោះគ្រាប់ពូជ ទាំងន័យត្រង់និងន័យធៀប។',
    },
    advice: {
      general: { en: 'Begin new projects and routines.', km: 'ចាប់ផ្ដើមគម្រោង និងទម្លាប់ថ្មីៗ។' },
      haircut: { en: 'Trim now to slow regrowth and keep a shape longer.', km: 'កាត់សក់ឥឡូវ ដើម្បីឲ្យដុះយឺត និងរក្សាទ្រង់ទ្រាយបានយូរ។' },
      garden: { en: 'Sow leafy greens and start seedlings.', km: 'សាបបន្លែស្លឹក និងបណ្ដុះកូនស្ទូង។' },
      health: { en: 'Start a detox or a new healthy habit.', km: 'ចាប់ផ្ដើមសម្អាតរាងកាយ ឬទម្លាប់សុខភាពថ្មី។' },
      finance: { en: 'Draft a budget; avoid big spending today.', km: 'រៀបចំថវិកា; ជៀសវាងការចំណាយធំថ្ងៃនេះ។' },
      love: { en: 'Have the honest conversation you have postponed.', km: 'និយាយដោយស្មោះ ដែលអ្នកបានពន្យារពេល។' },
    },
  },
  waxingCrescent: {
    mood: {
      en: 'Momentum builds. Take the first concrete steps.',
      km: 'កម្លាំងកំពុងកើនឡើង។ ចាប់ផ្ដើមជំហានជាក់ស្ដែង។',
    },
    advice: {
      general: { en: 'Act on the intentions you set at the new moon.', km: 'អនុវត្តបំណងដែលអ្នកបានកំណត់ពេលខែថ្មី។' },
      haircut: { en: 'Good time for a trim that should grow back fuller.', km: 'ពេលល្អកាត់សក់ ឲ្យដុះឡើងវិញពេញ។' },
      garden: { en: 'Water and feed; growth accelerates now.', km: 'ស្រោចទឹក និងដាក់ជី; ការលូតលាស់កើនឡើង។' },
      health: { en: 'Build strength; energy is rising.', km: 'បង្កើនកម្លាំង; ថាមពលកំពុងកើនឡើង។' },
      finance: { en: 'Invest in skills and small, steady moves.', km: 'វិនិយោគលើជំនាញ និងជំហានតូចៗជាប្រចាំ។' },
      love: { en: 'Make the small gesture that shows you care.', km: 'ធ្វើកាយវិការតូចដែលបង្ហាញការយកចិត្តទុកដាក់។' },
    },
  },
  firstQuarter: {
    mood: {
      en: 'Decision point. Push through the first resistance.',
      km: 'ពេលសម្រេចចិត្ត។ ឆ្លងផុតឧបសគ្គដំបូង។',
    },
    advice: {
      general: { en: 'Commit and overcome obstacles.', km: 'ប្ដេជ្ញា និងយកឈ្នះឧបសគ្គ។' },
      haircut: { en: 'Cut for strong, thick regrowth.', km: 'កាត់សក់ ដើម្បីដុះក្រាស់និងរឹងមាំ។' },
      garden: { en: 'Plant fruiting crops and transplant.', km: 'ដាំដំណាំមានផ្លែ និងផ្លាស់ប្ដូរទីតាំង។' },
      health: { en: 'Push your training; stay hydrated.', km: 'បង្កើនការហាត់ប្រាណ; ផឹកទឹកឲ្យបានគ្រប់គ្រាន់។' },
      finance: { en: 'Negotiate and make decisions.', km: 'ចរចា និងធ្វើការសម្រេចចិត្ត។' },
      love: { en: 'Address tension directly and kindly.', km: 'ដោះស្រាយភាពតានតឹងដោយត្រង់ និងសុភាព។' },
    },
  },
  waxingGibbous: {
    mood: {
      en: 'Refine and prepare. The peak is near.',
      km: 'កែលម្អ និងរៀបចំ។ កំពូលជិតមកដល់។',
    },
    advice: {
      general: { en: 'Polish details before the full moon.', km: 'រៀបចំលម្អិតមុនខែពេញ។' },
      haircut: { en: 'Style and treatments work especially well.', km: 'ការធ្វើស្ទីល និងថែទាំសក់មានប្រសិទ្ធភាពល្អ។' },
      garden: { en: 'Feed plants; growth is strong.', km: 'ដាក់ជីដំណាំ; លូតលាស់ខ្លាំង។' },
      health: { en: 'Eat nourishing food; the body absorbs well.', km: 'បរិភោគអាហារមានជីវជាតិ; រាងកាយស្រូបយកបានល្អ។' },
      finance: { en: 'Review plans and tidy loose ends.', km: 'ពិនិត្យផែនការ និងបញ្ចប់កិច្ចការនៅសល់។' },
      love: { en: 'Plan something special together.', km: 'រៀបចំអ្វីពិសេសជាមួយគ្នា។' },
    },
  },
  full: {
    mood: {
      en: 'Peak energy and emotion. Celebrate, release, and reflect.',
      km: 'ថាមពល និងអារម្មណ៍កំពូល។ អបអរ ដោះលែង និងពិចារណា។',
    },
    advice: {
      general: { en: 'Harvest results; emotions run high — be gentle.', km: 'ប្រមូលផល; អារម្មណ៍ខ្ពស់ — សូមទន់ភ្លន់។' },
      haircut: { en: 'Cut for maximum volume and shine.', km: 'កាត់សក់ ឲ្យមានបរិមាណ និងភ្លឺ។' },
      garden: { en: 'Harvest fruit and herbs at full potency.', km: 'ប្រមូលផ្លែ និងគ្រឿងទេសពេលមានឥទ្ធិពលខ្លាំង។' },
      health: { en: 'Rest well; sleep may be lighter tonight.', km: 'សម្រាកឲ្យបានល្អ; ការគេងអាចស្រាលជាងធម្មតា។' },
      finance: { en: 'Avoid impulsive purchases tonight.', km: 'ជៀសវាងការទិញតាមអារម្មណ៍យប់នេះ។' },
      love: { en: 'Express gratitude and celebrate connection.', km: 'បង្ហាញការដឹងគុណ និងអបអរទំនាក់ទំនង។' },
    },
  },
  waningGibbous: {
    mood: {
      en: 'Share and give back. Gratitude and teaching.',
      km: 'ចែករំលែក និងបង្វិលត្រឡប់។ ការដឹងគុណ និងការបង្រៀន។',
    },
    advice: {
      general: { en: 'Share knowledge; wind down intense efforts.', km: 'ចែករំលែកចំណេះដឹង; បន្ធូរបន្ថយការខិតខំ។' },
      haircut: { en: 'Trim to slow growth gradually.', km: 'កាត់សក់ ដើម្បីបន្ថយការដុះបន្តិចម្ដងៗ។' },
      garden: { en: 'Prune and harvest roots.', km: 'កាត់មែក និងប្រមូលផលឫស។' },
      health: { en: 'Focus on digestion and recovery.', km: 'ផ្ដោតលើការរំលាយអាហារ និងការស្ដារឡើងវិញ។' },
      finance: { en: 'Pay down debts; settle accounts.', km: 'សងបំណុល; បិទបញ្ជី។' },
      love: { en: 'Forgive and let go of small grievances.', km: 'អភ័យទោស និងលែងប្រកាន់រឿងតូចៗ។' },
    },
  },
  lastQuarter: {
    mood: {
      en: 'Release and declutter. Let go of what no longer serves.',
      km: 'ដោះលែង និងសម្អាត។ លែងនូវអ្វីដែលលែងមានប្រយោជន៍។',
    },
    advice: {
      general: { en: 'Clear clutter and finish old tasks.', km: 'សម្អាតរបស់រាយប៉ាយ និងបញ្ចប់កិច្ចការចាស់។' },
      haircut: { en: 'Trim to keep growth slow and tidy.', km: 'កាត់សក់ ដើម្បីរក្សាការដុះយឺត និងស្អាត។' },
      garden: { en: 'Weed, prune, and improve the soil.', km: 'ដកស្មៅ កាត់មែក និងកែលម្អដី។' },
      health: { en: 'Cut back; gentle fasting suits this phase.', km: 'កាត់បន្ថយ; ការតមអាហារស្រាលសមនឹងដំណាក់កាលនេះ។' },
      finance: { en: 'Cancel unused subscriptions; review spending.', km: 'បោះបង់ការជាវដែលមិនប្រើ; ពិនិត្យការចំណាយ។' },
      love: { en: 'Release resentment; make space for peace.', km: 'លែងការអាក់អន់ចិត្ត; បើកលំហសម្រាប់សន្តិភាព។' },
    },
  },
  waningCrescent: {
    mood: {
      en: 'Rest and restore. Turn inward before the next cycle.',
      km: 'សម្រាក និងស្ដារ។ ងាកចូលខាងក្នុង មុនវដ្ដបន្ទាប់។',
    },
    advice: {
      general: { en: 'Rest, reflect, and recover energy.', km: 'សម្រាក ពិចារណា និងស្ដារថាមពល។' },
      haircut: { en: 'Best phase to slow regrowth the most.', km: 'ដំណាក់កាលល្អបំផុតដើម្បីបន្ថយការដុះច្រើនបំផុត។' },
      garden: { en: 'Rest the beds; prepare for the new moon.', km: 'សម្រាកដី; រៀបចំសម្រាប់ខែថ្មី។' },
      health: { en: 'Prioritise sleep and quiet recovery.', km: 'ផ្ដល់អាទិភាពលើការគេង និងការស្ដារដោយស្ងប់ស្ងាត់។' },
      finance: { en: 'Plan, but wait to act until the new moon.', km: 'រៀបចំផែនការ ប៉ុន្តែរង់ចាំសកម្មភាពដល់ខែថ្មី។' },
      love: { en: 'Give each other space and quiet care.', km: 'ផ្ដល់លំហ និងការថែទាំដោយស្ងប់ស្ងាត់ដល់គ្នា។' },
    },
  },
};

// Western zodiac sun signs with date ranges (month is 1-based).
export interface ZodiacSign {
  index: number; // 0 = Aries
  key: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  en: string;
  km: string;
}

export const ZODIAC: ZodiacSign[] = [
  { index: 0, key: 'aries', symbol: '♈', element: 'fire', en: 'Aries', km: 'រាសីមេស' },
  { index: 1, key: 'taurus', symbol: '♉', element: 'earth', en: 'Taurus', km: 'រាសីព្រឹស្ភ' },
  { index: 2, key: 'gemini', symbol: '♊', element: 'air', en: 'Gemini', km: 'រាសីមិថុន' },
  { index: 3, key: 'cancer', symbol: '♋', element: 'water', en: 'Cancer', km: 'រាសីកក្កដ' },
  { index: 4, key: 'leo', symbol: '♌', element: 'fire', en: 'Leo', km: 'រាសីសិង្ហ' },
  { index: 5, key: 'virgo', symbol: '♍', element: 'earth', en: 'Virgo', km: 'រាសីកន្យា' },
  { index: 6, key: 'libra', symbol: '♎', element: 'air', en: 'Libra', km: 'រាសីតុល្យ' },
  { index: 7, key: 'scorpio', symbol: '♏', element: 'water', en: 'Scorpio', km: 'រាសីពិច្ឆិក' },
  { index: 8, key: 'sagittarius', symbol: '♐', element: 'fire', en: 'Sagittarius', km: 'រាសីធនូ' },
  { index: 9, key: 'capricorn', symbol: '♑', element: 'earth', en: 'Capricorn', km: 'រាសីមករ' },
  { index: 10, key: 'aquarius', symbol: '♒', element: 'air', en: 'Aquarius', km: 'រាសីកុម្ភ' },
  { index: 11, key: 'pisces', symbol: '♓', element: 'water', en: 'Pisces', km: 'រាសីមីន' },
];

export function sunSignFromDate(month: number, day: number): ZodiacSign {
  // Zodiac indices ordered by month, starting with Capricorn (early January).
  const order = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8];
  // Last day of each month that still belongs to the "earlier" sign.
  const lastDay = [19, 18, 20, 19, 20, 20, 22, 22, 21, 22, 21, 21];
  const pos = day > lastDay[month - 1] ? month % 12 : month - 1;
  return ZODIAC[order[pos]];
}
