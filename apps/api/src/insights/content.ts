import { PhaseKey } from '../moon/moon.service';

export type Lang = 'en' | 'km';
export type Category = 'haircut' | 'garden' | 'health' | 'finance' | 'love' | 'general';

export interface Bi {
  en: string;
  km: string;
}

interface PhaseContent {
  moods: Bi[];
  advice: Partial<Record<Category, Bi[]>>;
}

/** FNV-1a hash → stable per (date, profile, slot) so a day's reading is fixed but varied. */
export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export const PHASE_CONTENT: Record<PhaseKey, PhaseContent> = {
  new: {
    moods: [
      { en: 'A clean slate. Set intentions and quietly plant the seeds of what you want to grow.', km: 'ការចាប់ផ្ដើមថ្មីស្អាតស្អំ។ កំណត់បំណង ហើយសាបព្រោះគ្រាប់ពូជនៃអ្វីដែលអ្នកចង់ឲ្យលូតលាស់។' },
      { en: 'The dark moon invites stillness. Dream first, act later — today is for planting, not harvesting.', km: 'ខែដាច់នាំមកនូវភាពស្ងប់ស្ងាត់។ សុបិនមុន សកម្មភាពក្រោយ — ថ្ងៃនេះសម្រាប់សាបព្រោះ មិនមែនច្រូតកាត់ទេ។' },
      { en: 'A fresh cycle begins. Whatever you start now carries the energy of a whole lunar month.', km: 'វដ្ដថ្មីចាប់ផ្ដើម។ អ្វីដែលអ្នកចាប់ផ្ដើមឥឡូវ នឹងផ្ទុកថាមពលពេញមួយខែច័ន្ទ។' },
    ],
    advice: {
      general: [
        { en: 'Begin new projects, routines, and intentions today.', km: 'ចាប់ផ្ដើមគម្រោង ទម្លាប់ និងបំណងថ្មីៗថ្ងៃនេះ។' },
        { en: 'Write down what you want this month to become.', km: 'សរសេរនូវអ្វីដែលអ្នកចង់ឲ្យខែនេះក្លាយជា។' },
        { en: 'Keep it low-key — rest and plan more than you push.', km: 'រក្សាភាពស្ងប់ស្ងាត់ — សម្រាក និងរៀបចំផែនការ ច្រើនជាងការខំ។' },
      ],
      haircut: [
        { en: 'Trim now to slow regrowth and hold a shape longer.', km: 'កាត់សក់ឥឡូវ ដើម្បីឲ្យដុះយឺត និងរក្សាទ្រង់ទ្រាយបានយូរ។' },
        { en: 'A good day for a fresh, simple cut to match a new start.', km: 'ថ្ងៃល្អសម្រាប់កាត់សក់ស្រស់ៗ សាមញ្ញ ត្រូវនឹងការចាប់ផ្ដើមថ្មី។' },
      ],
      garden: [
        { en: 'Sow leafy greens and start seedlings indoors.', km: 'សាបបន្លែស្លឹក និងបណ្ដុះកូនស្ទូងក្នុងផ្ទះ។' },
        { en: 'Prepare beds and soil — growth begins below the surface.', km: 'រៀបចំ​ដី និងគ្រែដាំ — ការលូតលាស់ចាប់ផ្ដើមនៅក្រោមដី។' },
      ],
      health: [
        { en: 'Start a gentle detox or one small healthy habit.', km: 'ចាប់ផ្ដើមសម្អាតរាងកាយ ឬទម្លាប់សុខភាពតូចមួយ។' },
        { en: 'Set an intention for your body this cycle; begin softly.', km: 'កំណត់បំណងសម្រាប់រាងកាយវដ្ដនេះ; ចាប់ផ្ដើមដោយថ្នមៗ។' },
      ],
      finance: [
        { en: 'Draft a budget; avoid big purchases for now.', km: 'រៀបចំថវិកា; ជៀសវាងការទិញធំៗសិន។' },
        { en: 'Open the plan, not the wallet — map your money goals.', km: 'បើកផែនការ មិនមែនកាបូប — គូសផែនទីគោលដៅប្រាក់របស់អ្នក។' },
      ],
      love: [
        { en: 'Have the honest conversation you have been postponing.', km: 'និយាយដោយស្មោះ ដែលអ្នកបានពន្យារពេល។' },
        { en: 'A quiet, sincere start matters more than grand gestures.', km: 'ការចាប់ផ្ដើមស្ងប់ស្ងាត់ ស្មោះត្រង់ សំខាន់ជាងកាយវិការធំ។' },
      ],
    },
  },
  waxingCrescent: {
    moods: [
      { en: 'Momentum builds. Take the first concrete steps toward your intention.', km: 'កម្លាំងកំពុងកើនឡើង។ ចាប់ផ្ដើមជំហានជាក់ស្ដែងឆ្ពោះទៅបំណងរបស់អ្នក។' },
      { en: 'The young moon rewards courage. A small brave move opens the door.', km: 'ច័ន្ទវ័យក្មេងផ្ដល់រង្វាន់ដល់ភាពក្លាហាន។ ការផ្លាស់ប្ដូរក្លាហានតូចបើកទ្វារ។' },
      { en: 'Energy is rising like the light. Nurture what you began.', km: 'ថាមពលកំពុងកើនឡើងដូចពន្លឺ។ ថែទាំនូវអ្វីដែលអ្នកបានចាប់ផ្ដើម។' },
    ],
    advice: {
      general: [
        { en: 'Act on the intentions you set at the new moon.', km: 'អនុវត្តបំណងដែលអ្នកបានកំណត់ពេលខែថ្មី។' },
        { en: 'Build a habit by doing it once today, however small.', km: 'បង្កើតទម្លាប់ដោយធ្វើវាម្ដងថ្ងៃនេះ ទោះតូចយ៉ាងណា។' },
        { en: 'Say yes to one opportunity you would normally delay.', km: 'ឆ្លើយយល់ព្រមនឹងឱកាសមួយ ដែលធម្មតាអ្នកនឹងពន្យារ។' },
      ],
      haircut: [
        { en: 'Good time for a trim that should grow back fuller.', km: 'ពេលល្អកាត់សក់ ឲ្យដុះឡើងវិញពេញ។' },
        { en: 'Cut to encourage healthy, steady growth.', km: 'កាត់សក់ ដើម្បីលើកទឹកចិត្តឲ្យដុះល្អ ជាប់លាប់។' },
      ],
      garden: [
        { en: 'Water and feed; growth accelerates now.', km: 'ស្រោចទឹក និងដាក់ជី; ការលូតលាស់កើនឡើង។' },
        { en: 'Plant above-ground crops — leaves and flowers thrive.', km: 'ដាំដំណាំលើដី — ស្លឹក និងផ្កាលូតលាស់ល្អ។' },
      ],
      health: [
        { en: 'Build strength gradually; energy is on your side.', km: 'បង្កើនកម្លាំងបន្តិចម្ដងៗ; ថាមពលនៅខាងអ្នក។' },
        { en: 'Add nutrients now — the body takes them in well.', km: 'បន្ថែមជីវជាតិឥឡូវ — រាងកាយស្រូបយកបានល្អ។' },
      ],
      finance: [
        { en: 'Invest in skills and small, steady moves.', km: 'វិនិយោគលើជំនាញ និងជំហានតូចៗជាប្រចាំ។' },
        { en: 'Start saving toward a clear goal while motivation is high.', km: 'ចាប់ផ្ដើមសន្សំឆ្ពោះទៅគោលដៅច្បាស់លាស់ ពេលមានកម្លាំងចិត្តខ្ពស់។' },
      ],
      love: [
        { en: 'Make the small gesture that shows you care.', km: 'ធ្វើកាយវិការតូចដែលបង្ហាញការយកចិត្តទុកដាក់។' },
        { en: 'Reach out first — warmth grows when offered.', km: 'ផ្ដើមទាក់ទងមុនគេ — ភាពកក់ក្ដៅកើនឡើងពេលផ្ដល់ឲ្យ។' },
      ],
    },
  },
  firstQuarter: {
    moods: [
      { en: 'Decision point. Push through the first wall of resistance.', km: 'ពេលសម្រេចចិត្ត។ ឆ្លងផុតជញ្ជាំងឧបសគ្គដំបូង។' },
      { en: 'Half-lit and climbing — commit fully or adjust the plan.', km: 'ភ្លឺពាក់កណ្ដាល ហើយកំពុងឡើង — ប្ដេជ្ញាពេញ ឬកែផែនការ។' },
      { en: 'Tension is fuel today. Channel it into one bold action.', km: 'ភាពតានតឹងជាឥន្ធនៈថ្ងៃនេះ។ បញ្ជូនវាទៅសកម្មភាពក្លាហានមួយ។' },
    ],
    advice: {
      general: [
        { en: 'Commit, decide, and overcome obstacles head-on.', km: 'ប្ដេជ្ញា សម្រេចចិត្ត និងយកឈ្នះឧបសគ្គដោយផ្ទាល់។' },
        { en: 'Finish the hard task you keep avoiding.', km: 'បញ្ចប់កិច្ចការពិបាកដែលអ្នកតែងជៀសវាង។' },
        { en: 'Choose one path and stop second-guessing it.', km: 'ជ្រើសផ្លូវមួយ ហើយឈប់សង្ស័យវាទៀត។' },
      ],
      haircut: [
        { en: 'Cut for strong, thick regrowth.', km: 'កាត់សក់ ដើម្បីដុះក្រាស់និងរឹងមាំ។' },
        { en: 'Bold change suits today — try the new style.', km: 'ការផ្លាស់ប្ដូរក្លាហានសមនឹងថ្ងៃនេះ — សាកស្ទីលថ្មី។' },
      ],
      garden: [
        { en: 'Plant fruiting crops and transplant seedlings.', km: 'ដាំដំណាំមានផ្លែ និងផ្លាស់ប្ដូរកូនស្ទូង។' },
        { en: 'Stake and support plants before they stretch.', km: 'ដោតបង្គោល និងទ្រដំណាំ មុនពេលវាលូតវែង។' },
      ],
      health: [
        { en: 'Push your training; stay well hydrated.', km: 'បង្កើនការហាត់ប្រាណ; ផឹកទឹកឲ្យបានគ្រប់គ្រាន់។' },
        { en: 'Face a health task you have delayed — book it today.', km: 'ប្រឈមនឹងកិច្ចការសុខភាពដែលអ្នកពន្យារ — ណាត់វាថ្ងៃនេះ។' },
      ],
      finance: [
        { en: 'Negotiate, ask, and make the firm decision.', km: 'ចរចា សួរ និងធ្វើការសម្រេចចិត្តម៉ឺងម៉ាត់។' },
        { en: 'Tackle a bill or debt you have been avoiding.', km: 'ដោះស្រាយវិក្កយបត្រ ឬបំណុលដែលអ្នកជៀសវាង។' },
      ],
      love: [
        { en: 'Address tension directly, but with kindness.', km: 'ដោះស្រាយភាពតានតឹងដោយត្រង់ ប៉ុន្តែដោយសុភាព។' },
        { en: 'Speak your need clearly instead of hinting.', km: 'និយាយតម្រូវការរបស់អ្នកឲ្យច្បាស់ ជំនួសការប្រាប់ប្រយោល។' },
      ],
    },
  },
  waxingGibbous: {
    moods: [
      { en: 'Refine and prepare. The peak is near — polish the details.', km: 'កែលម្អ និងរៀបចំ។ កំពូលជិតមកដល់ — រៀបចំលម្អិត។' },
      { en: 'Almost full. Trust your progress and tidy the loose ends.', km: 'ជិតពេញ។ ជឿជាក់លើវឌ្ឍនភាព ហើយរៀបចំកិច្ចការនៅសល់។' },
      { en: 'Anticipation builds. Patience now makes the harvest sweeter.', km: 'ការរង់ចាំកើនឡើង។ ការអត់ធ្មត់ឥឡូវ ធ្វើឲ្យផលផ្អែមជាង។' },
    ],
    advice: {
      general: [
        { en: 'Polish details and prepare before the full moon.', km: 'រៀបចំលម្អិត និងត្រៀមមុនខែពេញ។' },
        { en: 'Review your work; refine instead of restarting.', km: 'ពិនិត្យការងាររបស់អ្នក; កែលម្អ ជំនួសការចាប់ផ្ដើមឡើងវិញ។' },
        { en: 'Keep going — you are closer than it feels.', km: 'បន្តទៅ — អ្នកនៅជិតជាងអ្វីដែលអ្នកគិត។' },
      ],
      haircut: [
        { en: 'Styling and treatments work especially well today.', km: 'ការធ្វើស្ទីល និងថែទាំសក់មានប្រសិទ្ធភាពល្អថ្ងៃនេះ។' },
        { en: 'Deep-condition now for shine and body.', km: 'ប្រើ​ឱសថ​ថែទាំ​ជ្រៅឥឡូវ ដើម្បីភ្លឺ និងមានបរិមាណ។' },
      ],
      garden: [
        { en: 'Feed plants; growth is strong and full.', km: 'ដាក់ជីដំណាំ; លូតលាស់ខ្លាំង និងពេញ។' },
        { en: 'Water generously — plants drink deeply now.', km: 'ស្រោចទឹកឲ្យបានច្រើន — ដំណាំស្រូបទឹកជ្រៅឥឡូវ។' },
      ],
      health: [
        { en: 'Eat nourishing food; the body absorbs well.', km: 'បរិភោគអាហារមានជីវជាតិ; រាងកាយស្រូបយកបានល្អ។' },
        { en: 'Top up rest before the full-moon peak.', km: 'សម្រាកបន្ថែម មុនកំពូលខែពេញ។' },
      ],
      finance: [
        { en: 'Review plans and tidy the loose ends.', km: 'ពិនិត្យផែនការ និងបញ្ចប់កិច្ចការនៅសល់។' },
        { en: 'Double-check details before you sign anything.', km: 'ពិនិត្យលម្អិតម្ដងទៀត មុនពេលអ្នកចុះហត្ថលេខា។' },
      ],
      love: [
        { en: 'Plan something special together.', km: 'រៀបចំអ្វីពិសេសជាមួយគ្នា។' },
        { en: 'Show appreciation before you ask for anything.', km: 'បង្ហាញការដឹងគុណ មុនពេលអ្នកស្នើសុំអ្វី។' },
      ],
    },
  },
  full: {
    moods: [
      { en: 'Peak energy and emotion. Celebrate, release, and let your heart be full.', km: 'ថាមពល និងអារម្មណ៍កំពូល។ អបអរ ដោះលែង ហើយឲ្យបេះដូងពេញ។' },
      { en: 'The moon is whole. Feelings run high — be tender with yourself and others.', km: 'ខែពេញបរិបូរណ៍។ អារម្មណ៍ខ្ពស់ — សូមទន់ភ្លន់ចំពោះខ្លួន និងអ្នកដទៃ។' },
      { en: 'Harvest time. What you nurtured now shows its light.', km: 'ពេលច្រូតកាត់។ អ្វីដែលអ្នកថែទាំ ឥឡូវបង្ហាញពន្លឺរបស់វា។' },
    ],
    advice: {
      general: [
        { en: 'Harvest results and celebrate; emotions run high, so be gentle.', km: 'ប្រមូលផល និងអបអរ; អារម្មណ៍ខ្ពស់ ដូច្នេះសូមទន់ភ្លន់។' },
        { en: 'Release what is finished; make space by letting go.', km: 'ដោះលែងនូវអ្វីដែលបញ្ចប់; បើកលំហដោយការលែង។' },
        { en: 'Notice what is full in your life and give thanks.', km: 'កត់សម្គាល់នូវអ្វីដែលពេញក្នុងជីវិត ហើយដឹងគុណ។' },
      ],
      haircut: [
        { en: 'Cut for maximum volume and shine.', km: 'កាត់សក់ ឲ្យមានបរិមាណ និងភ្លឺ។' },
        { en: 'A celebratory restyle suits the full moon.', km: 'ការប្ដូរស្ទីលអបអរ សមនឹងខែពេញ។' },
      ],
      garden: [
        { en: 'Harvest fruit and herbs at full potency.', km: 'ប្រមូលផ្លែ និងគ្រឿងទេសពេលមានឥទ្ធិពលខ្លាំង។' },
        { en: 'Gather medicinal and aromatic plants now.', km: 'ប្រមូលរុក្ខជាតិឱសថ និងក្រអូបឥឡូវ។' },
      ],
      health: [
        { en: 'Rest well; sleep may be lighter tonight.', km: 'សម្រាកឲ្យបានល្អ; ការគេងអាចស្រាលជាងធម្មតាយប់នេះ។' },
        { en: 'Hydrate and calm the mind before bed.', km: 'ផឹកទឹក និងធ្វើចិត្តឲ្យស្ងប់មុនពេលគេង។' },
      ],
      finance: [
        { en: 'Avoid impulsive purchases tonight.', km: 'ជៀសវាងការទិញតាមអារម្មណ៍យប់នេះ។' },
        { en: 'Celebrate a win, but keep the big decisions for later.', km: 'អបអរជោគជ័យ ប៉ុន្តែទុកការសម្រេចចិត្តធំសម្រាប់ពេលក្រោយ។' },
      ],
      love: [
        { en: 'Express gratitude and celebrate your connection.', km: 'បង្ហាញការដឹងគុណ និងអបអរទំនាក់ទំនង។' },
        { en: 'Speak from the heart — feelings are clear tonight.', km: 'និយាយចេញពីបេះដូង — អារម្មណ៍ច្បាស់យប់នេះ។' },
      ],
    },
  },
  waningGibbous: {
    moods: [
      { en: 'Share and give back. A day for gratitude and teaching.', km: 'ចែករំលែក និងបង្វិលត្រឡប់។ ថ្ងៃសម្រាប់ការដឹងគុណ និងការបង្រៀន។' },
      { en: 'The light recedes. Pass on what you learned this cycle.', km: 'ពន្លឺថយចុះ។ បន្តចំណេះដឹងដែលអ្នករៀនវដ្ដនេះ។' },
      { en: 'Wind down with purpose. Generosity returns to you.', km: 'បន្ធូរបន្ថយដោយគោលដៅ។ ការសប្បុរសត្រឡប់មកអ្នកវិញ។' },
    ],
    advice: {
      general: [
        { en: 'Share knowledge and ease off the intensity.', km: 'ចែករំលែកចំណេះដឹង និងបន្ធូរបន្ថយ។' },
        { en: 'Help someone — generosity flows well now.', km: 'ជួយនរណាម្នាក់ — ការសប្បុរសហូរល្អឥឡូវ។' },
        { en: 'Reflect on what worked and write it down.', km: 'ពិចារណាលើអ្វីដែលបានជោគជ័យ ហើយកត់ត្រាវា។' },
      ],
      haircut: [
        { en: 'Trim to slow growth gradually.', km: 'កាត់សក់ ដើម្បីបន្ថយការដុះបន្តិចម្ដងៗ។' },
        { en: 'Tidy the ends rather than a big change.', km: 'រៀបចំចុងសក់ ជំនួសការផ្លាស់ប្ដូរធំ។' },
      ],
      garden: [
        { en: 'Prune and harvest roots.', km: 'កាត់មែក និងប្រមូលផលឫស។' },
        { en: 'Make compost and tend the soil.', km: 'ធ្វើជីកំប៉ុស្ត និងថែទាំដី។' },
      ],
      health: [
        { en: 'Focus on digestion and recovery.', km: 'ផ្ដោតលើការរំលាយអាហារ និងការស្ដារឡើងវិញ។' },
        { en: 'Stretch, breathe, and unwind slowly.', km: 'ទាញសាច់ដុំ ដកដង្ហើម និងបន្ធូរអារម្មណ៍យឺតៗ។' },
      ],
      finance: [
        { en: 'Pay down debts and settle accounts.', km: 'សងបំណុល និងបិទបញ្ជី។' },
        { en: 'Give or donate a little — it circulates back.', km: 'ឲ្យ ឬបរិច្ចាគបន្តិច — វាវិលត្រឡប់មកវិញ។' },
      ],
      love: [
        { en: 'Forgive and let go of small grievances.', km: 'អភ័យទោស និងលែងប្រកាន់រឿងតូចៗ។' },
        { en: 'Listen more than you speak today.', km: 'ស្ដាប់ច្រើនជាងនិយាយថ្ងៃនេះ។' },
      ],
    },
  },
  lastQuarter: {
    moods: [
      { en: 'Release and declutter. Let go of what no longer serves you.', km: 'ដោះលែង និងសម្អាត។ លែងនូវអ្វីដែលលែងមានប្រយោជន៍ដល់អ្នក។' },
      { en: 'Half-dark and clearing. Forgive, finish, and free up space.', km: 'ងងឹតពាក់កណ្ដាល ហើយកំពុងសម្អាត។ អភ័យទោស បញ្ចប់ និងបើកលំហ។' },
      { en: 'A turning point inward. Edit your life down to what matters.', km: 'ចំណុចបង្វែរចូលខាងក្នុង។ កាត់បន្ថយជីវិតមកត្រឹមអ្វីដែលសំខាន់។' },
    ],
    advice: {
      general: [
        { en: 'Clear clutter and finish old, lingering tasks.', km: 'សម្អាតរបស់រាយប៉ាយ និងបញ្ចប់កិច្ចការចាស់ដែលនៅសល់។' },
        { en: 'Drop one habit that holds you back.', km: 'លះបង់ទម្លាប់មួយដែលរារាំងអ្នក។' },
        { en: 'Say no to free your time and energy.', km: 'និយាយថាទេ ដើម្បីដោះលែងពេលវេលា និងថាមពលរបស់អ្នក។' },
      ],
      haircut: [
        { en: 'Trim to keep growth slow and tidy.', km: 'កាត់សក់ ដើម្បីរក្សាការដុះយឺត និងស្អាត។' },
        { en: 'Clear split ends; less is more today.', km: 'កាត់ចុងសក់ខូច; តិចគឺល្អជាងថ្ងៃនេះ។' },
      ],
      garden: [
        { en: 'Weed, prune, and improve the soil.', km: 'ដកស្មៅ កាត់មែក និងកែលម្អដី។' },
        { en: 'Clear dead growth to make room for new.', km: 'សម្អាតដំណាំស្លាប់ ដើម្បីបើកកន្លែងសម្រាប់ថ្មី។' },
      ],
      health: [
        { en: 'Cut back; gentle fasting suits this phase.', km: 'កាត់បន្ថយ; ការតមអាហារស្រាលសមនឹងដំណាក់កាលនេះ។' },
        { en: 'Declutter your diet of one thing that drains you.', km: 'កាត់ចេញពីរបបអាហារនូវរបស់មួយដែលធ្វើឲ្យអ្នកអស់កម្លាំង។' },
      ],
      finance: [
        { en: 'Cancel unused subscriptions and review spending.', km: 'បោះបង់ការជាវដែលមិនប្រើ និងពិនិត្យការចំណាយ។' },
        { en: 'Sell or give away what you no longer need.', km: 'លក់ ឬឲ្យចេញនូវអ្វីដែលអ្នកលែងត្រូវការ។' },
      ],
      love: [
        { en: 'Release resentment and make space for peace.', km: 'លែងការអាក់អន់ចិត្ត ហើយបើកលំហសម្រាប់សន្តិភាព។' },
        { en: 'End a draining dynamic with honesty, not anger.', km: 'បញ្ចប់ទំនាក់ទំនងដែលធ្វើឲ្យអស់កម្លាំង ដោយស្មោះត្រង់ មិនមែនកំហឹង។' },
      ],
    },
  },
  waningCrescent: {
    moods: [
      { en: 'Rest and restore. Turn inward and recover before the next cycle.', km: 'សម្រាក និងស្ដារ។ ងាកចូលខាងក្នុង និងស្ដារ មុនវដ្ដបន្ទាប់។' },
      { en: 'The old moon fades. Slow down; dreams and rest carry wisdom now.', km: 'ខែចាស់រសាត់។ បន្ថយល្បឿន; សុបិន និងការសម្រាកនាំមកប្រាជ្ញាឥឡូវ។' },
      { en: 'Quiet endings. Empty the cup so it can be filled again.', km: 'ការបញ្ចប់ស្ងប់ស្ងាត់។ ចាក់ចេញពីពែង ដើម្បីឲ្យវាអាចបំពេញឡើងវិញ។' },
    ],
    advice: {
      general: [
        { en: 'Rest, reflect, and recover your energy.', km: 'សម្រាក ពិចារណា និងស្ដារថាមពលរបស់អ្នក។' },
        { en: 'Do less on purpose; protect your quiet.', km: 'ធ្វើតិចដោយចេតនា; ការពារភាពស្ងប់ស្ងាត់របស់អ្នក។' },
        { en: 'Tie up loose ends gently before the new moon.', km: 'បញ្ចប់កិច្ចការនៅសល់ដោយថ្នមៗ មុនខែថ្មី។' },
      ],
      haircut: [
        { en: 'Best phase to slow regrowth the most.', km: 'ដំណាក់កាលល្អបំផុតដើម្បីបន្ថយការដុះច្រើនបំផុត។' },
        { en: 'Save big changes — rest your hair and scalp.', km: 'ទុកការផ្លាស់ប្ដូរធំ — សម្រាកសក់ និងស្បែកក្បាល។' },
      ],
      garden: [
        { en: 'Rest the beds and prepare for the new moon.', km: 'សម្រាកគ្រែដាំ និងរៀបចំសម្រាប់ខែថ្មី។' },
        { en: 'Plan next plantings rather than digging now.', km: 'រៀបចំផែនការដាំបន្ទាប់ ជំនួសការជីកឥឡូវ។' },
      ],
      health: [
        { en: 'Prioritise sleep and quiet recovery.', km: 'ផ្ដល់អាទិភាពលើការគេង និងការស្ដារដោយស្ងប់ស្ងាត់។' },
        { en: 'A calm walk or gentle stretch is plenty today.', km: 'ការដើរស្ងប់ ឬទាញសាច់ដុំស្រាល គឺគ្រប់គ្រាន់ថ្ងៃនេះ។' },
      ],
      finance: [
        { en: 'Plan, but wait to act until the new moon.', km: 'រៀបចំផែនការ ប៉ុន្តែរង់ចាំសកម្មភាពដល់ខែថ្មី។' },
        { en: 'Review last month before starting anything new.', km: 'ពិនិត្យខែមុន មុនពេលចាប់ផ្ដើមអ្វីថ្មី។' },
      ],
      love: [
        { en: 'Give each other space and quiet care.', km: 'ផ្ដល់លំហ និងការថែទាំដោយស្ងប់ស្ងាត់ដល់គ្នា។' },
        { en: 'Rest together without needing to fix anything.', km: 'សម្រាកជាមួយគ្នា ដោយមិនចាំបាច់ដោះស្រាយអ្វី។' },
      ],
    },
  },
};

/** Planetary ruler of the weekday (traditional Hora). 0 = Sunday. */
export const WEEKDAY_ENERGY: { planet: Bi; theme: Bi }[] = [
  {
    planet: { en: 'Sun', km: 'ព្រះអាទិត្យ' },
    theme: { en: 'vitality, confidence and leadership', km: 'ភាពរស់រវើក ទំនុកចិត្ត និងភាពជាអ្នកដឹកនាំ' },
  },
  {
    planet: { en: 'Moon', km: 'ព្រះច័ន្ទ' },
    theme: { en: 'emotion, intuition and home', km: 'អារម្មណ៍ វិចារណញាណ និងគ្រួសារ' },
  },
  {
    planet: { en: 'Mars', km: 'ភពអង្គារ' },
    theme: { en: 'energy, courage and drive', km: 'ថាមពល ភាពក្លាហាន និងកម្លាំងជំរុញ' },
  },
  {
    planet: { en: 'Mercury', km: 'ភពពុធ' },
    theme: { en: 'communication, learning and trade', km: 'ការទំនាក់ទំនង ការសិក្សា និងពាណិជ្ជកម្ម' },
  },
  {
    planet: { en: 'Jupiter', km: 'ភពព្រហស្បតិ៍' },
    theme: { en: 'growth, luck and wisdom', km: 'ការលូតលាស់ សំណាង និងប្រាជ្ញា' },
  },
  {
    planet: { en: 'Venus', km: 'ភពសុក្រ' },
    theme: { en: 'love, beauty and harmony', km: 'ស្នេហា សម្រស់ និងភាពសុខដុម' },
  },
  {
    planet: { en: 'Saturn', km: 'ភពសៅរ៍' },
    theme: { en: 'discipline, patience and endings', km: 'វិន័យ ការអត់ធ្មត់ និងការបញ្ចប់' },
  },
];

/** Buddhist precept / observance days (Uposatha, ថ្ងៃសីល). */
export interface Observance {
  title: Bi;
  note: Bi;
}

export function observanceFor(moonPhase: number, khmerDay: number): Observance | null {
  const major = khmerDay === 15; // full / new
  const minor = khmerDay === 8;
  if (!major && !minor) return null;
  if (major) {
    return {
      title: { en: 'Buddhist Precept Day (Sila)', km: 'ថ្ងៃសីល (ថ្ងៃធំ)' },
      note: {
        en: 'A holy observance day. A traditional time for the temple, offerings, meditation and keeping the precepts.',
        km: 'ថ្ងៃបុណ្យសីល។ ពេលប្រពៃណីសម្រាប់ទៅវត្ត ថ្វាយទាន អង្គុយសមាធិ និងកាន់សីល។',
      },
    };
  }
  return {
    title: { en: 'Half-Moon Precept Day', km: 'ថ្ងៃសីល (កន្លះខែ)' },
    note: {
      en: 'A quieter observance day — good for reflection, kindness and a calm mind.',
      km: 'ថ្ងៃសីលស្ងប់ស្ងាត់ — ល្អសម្រាប់ការពិចារណា សេចក្ដីសប្បុរស និងចិត្តស្ងប់។',
    },
  };
}

/** Flavour line by the element of the sign the Moon is travelling through. */
export const ELEMENT_FLAVOR: Record<'fire' | 'earth' | 'air' | 'water', Bi> = {
  fire: { en: 'The Moon rides a fire sign — bold, passionate, quick to act.', km: 'ព្រះច័ន្ទនៅរាសីភ្លើង — ក្លាហាន ស្រើបស្រាល និងសកម្មរហ័ស។' },
  earth: { en: 'The Moon rides an earth sign — grounded, practical, steady.', km: 'ព្រះច័ន្ទនៅរាសីដី — នឹងនរ ជាក់ស្ដែង និងជាប់លាប់។' },
  air: { en: 'The Moon rides an air sign — social, curious, full of ideas.', km: 'ព្រះច័ន្ទនៅរាសីខ្យល់ — ចូលចិត្តសង្គម ចង់ដឹង និងពោរពេញគំនិត។' },
  water: { en: 'The Moon rides a water sign — sensitive, intuitive, deep.', km: 'ព្រះច័ន្ទនៅរាសីទឹក — រសើប មានវិចារណញាណ និងជ្រៅ។' },
};

/** Biorhythm-aware note for the most pronounced rhythm of the day. */
export function biorhythmNote(
  b: { physical: number; emotional: number; intellectual: number },
): Bi | null {
  const entries: { k: 'physical' | 'emotional' | 'intellectual'; v: number }[] = [
    { k: 'physical', v: b.physical },
    { k: 'emotional', v: b.emotional },
    { k: 'intellectual', v: b.intellectual },
  ];
  // Pick the most extreme rhythm.
  entries.sort((a, c) => Math.abs(c.v) - Math.abs(a.v));
  const top = entries[0];
  if (Math.abs(top.v) < 60) return null; // only call out strong days
  const high = top.v > 0;
  const map: Record<string, { high: Bi; low: Bi }> = {
    physical: {
      high: { en: 'Your physical rhythm is high — a great day to move and do.', km: 'ចង្វាក់រាងកាយរបស់អ្នកខ្ពស់ — ថ្ងៃល្អសម្រាប់ផ្លាស់ទី និងធ្វើការ។' },
      low: { en: 'Your physical rhythm is low — pace yourself and rest more.', km: 'ចង្វាក់រាងកាយរបស់អ្នកទាប — ធ្វើការសមល្មម និងសម្រាកបន្ថែម។' },
    },
    emotional: {
      high: { en: 'Your emotional rhythm is high — connection feels easy today.', km: 'ចង្វាក់អារម្មណ៍របស់អ្នកខ្ពស់ — ការតភ្ជាប់មានភាពងាយស្រួលថ្ងៃនេះ។' },
      low: { en: 'Your emotional rhythm is low — be patient and gentle with feelings.', km: 'ចង្វាក់អារម្មណ៍របស់អ្នកទាប — អត់ធ្មត់ និងថ្នមនឹងអារម្មណ៍។' },
    },
    intellectual: {
      high: { en: 'Your mind is sharp today — tackle decisions and learning.', km: 'គំនិតរបស់អ្នកមុតស្រួចថ្ងៃនេះ — ដោះស្រាយការសម្រេចចិត្ត និងការសិក្សា។' },
      low: { en: 'Mental energy dips today — keep big decisions for later.', km: 'ថាមពលផ្លូវចិត្តធ្លាក់ចុះថ្ងៃនេះ — ទុកការសម្រេចចិត្តធំសម្រាប់ពេលក្រោយ។' },
    },
  };
  return high ? map[top.k].high : map[top.k].low;
}

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
