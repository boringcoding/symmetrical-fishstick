// Khmer-first fortune content: animal years, born-day traits, fortune lines,
// lucky colours, and animal-compatibility verdicts. Everything bilingual.

export type Lang = 'en' | 'km';
export interface Bi {
  en: string;
  km: string;
}

export const ANIMALS: { km: string; en: string; emoji: string }[] = [
  { km: 'ជូត', en: 'Rat', emoji: '🐀' },
  { km: 'ឆ្លូវ', en: 'Ox', emoji: '🐂' },
  { km: 'ខាល', en: 'Tiger', emoji: '🐅' },
  { km: 'ថោះ', en: 'Rabbit', emoji: '🐇' },
  { km: 'រោង', en: 'Dragon', emoji: '🐉' },
  { km: 'ម្សាញ់', en: 'Snake', emoji: '🐍' },
  { km: 'មមី', en: 'Horse', emoji: '🐎' },
  { km: 'មមែ', en: 'Goat', emoji: '🐐' },
  { km: 'វក', en: 'Monkey', emoji: '🐒' },
  { km: 'រកា', en: 'Rooster', emoji: '🐓' },
  { km: 'ច', en: 'Dog', emoji: '🐕' },
  { km: 'កុរ', en: 'Pig', emoji: '🐖' },
];

// Short personality of each animal year.
export const ANIMAL_TRAIT: Bi[] = [
  { en: 'clever, charming and quick-witted', km: 'ឆ្លាតវៃ មានសណ្ដានចិត្ត និងប្រតិកម្មរហ័ស' },
  { en: 'patient, reliable and strong-willed', km: 'អត់ធ្មត់ ទុកចិត្តបាន និងមានឆន្ទៈមុតមាំ' },
  { en: 'brave, confident and magnetic', km: 'ក្លាហាន មានទំនុកចិត្ត និងទាក់ទាញ' },
  { en: 'gentle, elegant and kind-hearted', km: 'ស្លូតបូត ឆើតឆាយ និងចិត្តល្អ' },
  { en: 'bold, lucky and full of energy', km: 'ក្លាហាន មានសំណាង និងពោរពេញថាមពល' },
  { en: 'wise, graceful and intuitive', km: 'មានប្រាជ្ញា ទន់ភ្លន់ និងវិចារណញាណ' },
  { en: 'free-spirited, warm and adventurous', km: 'ស្រឡាញ់សេរីភាព កក់ក្ដៅ និងចូលចិត្តផ្សងព្រេង' },
  { en: 'creative, calm and compassionate', km: 'មានគំនិតច្នៃប្រឌិត ស្ងប់ និងមេត្តាករុណា' },
  { en: 'witty, lively and resourceful', km: 'មានប្រាជ្ញាវៃឆ្លាត រស់រវើក និងប៉ិនប្រសប់' },
  { en: 'honest, hardworking and proud', km: 'ស្មោះត្រង់ ឧស្សាហ៍ និងមានមោទនភាព' },
  { en: 'loyal, sincere and protective', km: 'ស្មោះស្ម័គ្រ ស្មោះត្រង់ និងការពារអ្នកជិតស្និទ្ធ' },
  { en: 'generous, easy-going and warm-hearted', km: 'សប្បុរស រួសរាយ និងចិត្តកក់ក្ដៅ' },
];

// Personality by day of the week one was born on (0 = Sunday).
export const BORN_DAY: Bi[] = [
  { en: 'a natural leader who shines in any crowd', km: 'អ្នកដឹកនាំពីកំណើត ដែលលេចធ្លោក្នុងហ្វូងមនុស្ស' },
  { en: 'gentle and caring, loved by those around you', km: 'ស្លូតបូត និងយកចិត្តទុកដាក់ ជាទីស្រឡាញ់របស់អ្នកជុំវិញ' },
  { en: 'fierce and determined, you never give up', km: 'មោះមុត និងតាំងចិត្ត អ្នកមិនដែលបោះបង់' },
  { en: 'clever and curious, a born problem-solver', km: 'ឆ្លាតវៃ និងចង់ដឹង ជាអ្នកដោះស្រាយបញ្ហាពីកំណើត' },
  { en: 'wise and generous, people seek your advice', km: 'មានប្រាជ្ញា និងសប្បុរស មនុស្សតែងសុំយោបល់ពីអ្នក' },
  { en: 'charming and romantic, beauty follows you', km: 'មានស្នេហ៍ និងស្នេហា សម្រស់តែងដើរតាមអ្នក' },
  { en: 'patient and grounded, you build things to last', km: 'អត់ធ្មត់ និងនឹងនរ អ្នកសាងអ្វីៗឲ្យបានយូរអង្វែង' },
];

export const LUCKY_COLORS: { km: string; en: string; hex: string }[] = [
  { km: 'មាស', en: 'Gold', hex: '#e8c987' },
  { km: 'ក្រហម', en: 'Red', hex: '#ff5e7a' },
  { km: 'ខៀវ', en: 'Blue', hex: '#5aa9ff' },
  { km: 'បៃតង', en: 'Green', hex: '#7ee0b0' },
  { km: 'ស្វាយ', en: 'Violet', hex: '#b58cff' },
  { km: 'ស', en: 'White', hex: '#f4f0e6' },
  { km: 'ផ្កាឈូក', en: 'Pink', hex: '#ff8fd0' },
  { km: 'លឿង', en: 'Yellow', hex: '#ffd86b' },
];

// Daily fortune headline by score band (high → low). Punchy, shareable.
export const FORTUNE_HEADLINE: { min: number; lines: Bi[] }[] = [
  {
    min: 90,
    lines: [
      { en: 'A golden day — the stars are wide open for you.', km: 'ថ្ងៃមាស — ផ្កាយបើកផ្លូវយ៉ាងទូលាយសម្រាប់អ្នក។' },
      { en: 'Luck is on fire today. Say yes to the big thing.', km: 'សំណាងឆេះសន្ធោសន្ធៅថ្ងៃនេះ។ ឆ្លើយយល់ព្រមនឹងរឿងធំ។' },
    ],
  },
  {
    min: 75,
    lines: [
      { en: 'A bright day — push forward, fortune favours you.', km: 'ថ្ងៃភ្លឺ — រុញទៅមុខ សំណាងនៅខាងអ្នក។' },
      { en: 'Good energy all around. Make your move.', km: 'ថាមពលល្អជុំវិញ។ ចាប់ផ្ដើមសកម្មភាពរបស់អ្នក។' },
    ],
  },
  {
    min: 60,
    lines: [
      { en: 'A steady day. Small effort brings sweet reward.', km: 'ថ្ងៃនឹងនរ។ ការខិតខំតិច នាំមកនូវផលផ្អែម។' },
      { en: 'Keep calm and stay kind — good things follow.', km: 'រក្សាចិត្តស្ងប់ និងសុភាព — រឿងល្អនឹងតាមមក។' },
    ],
  },
  {
    min: 45,
    lines: [
      { en: 'A mixed day. Slow down and choose carefully.', km: 'ថ្ងៃលាយឡំ។ បន្ថយល្បឿន និងជ្រើសរើសដោយប្រុងប្រយ័ត្ន។' },
      { en: 'Patience today protects you tomorrow.', km: 'ការអត់ធ្មត់ថ្ងៃនេះ ការពារអ្នកនៅថ្ងៃស្អែក។' },
    ],
  },
  {
    min: 0,
    lines: [
      { en: 'A quiet day to rest and protect your energy.', km: 'ថ្ងៃស្ងប់ ដើម្បីសម្រាក និងការពារថាមពលរបស់អ្នក។' },
      { en: 'Lay low today — brighter days are coming.', km: 'នៅស្ងៀមថ្ងៃនេះ — ថ្ងៃភ្លឺៗកំពុងមកដល់។' },
    ],
  },
];

// Animal compatibility. Secret-friend pairs (六合) and same-trine (三合) are best.
const SECRET_FRIEND: Record<number, number> = {
  0: 1, 1: 0, 2: 11, 11: 2, 3: 10, 10: 3, 4: 9, 9: 4, 5: 8, 8: 5, 6: 7, 7: 6,
};
const TRINES = [
  [0, 4, 8], // Rat, Dragon, Monkey
  [1, 5, 9], // Ox, Snake, Rooster
  [2, 6, 10], // Tiger, Horse, Dog
  [3, 7, 11], // Rabbit, Goat, Pig
];
// Clash = opposite (6 apart).
function isClash(a: number, b: number): boolean {
  return Math.abs(a - b) === 6;
}
function sameTrine(a: number, b: number): boolean {
  return TRINES.some((t) => t.includes(a) && t.includes(b));
}

export function baseCompatBand(a: number, b: number): number {
  if (SECRET_FRIEND[a] === b) return 95;
  if (a === b) return 75;
  if (sameTrine(a, b)) return 86;
  if (isClash(a, b)) return 38;
  return 63;
}

export const COMPAT_VERDICT: { min: number; lines: Bi[] }[] = [
  {
    min: 90,
    lines: [
      { en: 'Soulmates ❤️ — written in the stars.', km: 'គូព្រេងនិមិត្ត ❤️ — ត្រូវកំណត់ដោយផ្កាយ។' },
      { en: 'A rare, magnetic match. Hold on tight.', km: 'គូដ៏កម្រ និងទាក់ទាញ។ កាន់ឲ្យជាប់។' },
    ],
  },
  {
    min: 75,
    lines: [
      { en: 'A strong, sweet match — you bring out the best in each other.', km: 'គូរឹងមាំ និងផ្អែមល្ហែម — អ្នកនាំចេញនូវអ្វីល្អបំផុតពីគ្នា។' },
    ],
  },
  {
    min: 58,
    lines: [
      { en: 'A good match with a little effort — keep talking.', km: 'គូល្អ បើខិតខំបន្តិច — បន្តនិយាយគ្នា។' },
    ],
  },
  {
    min: 45,
    lines: [
      { en: 'Opposites attract — different, but it can spark.', km: 'ផ្ទុយគ្នាទាក់ទាញគ្នា — ខុសគ្នា ប៉ុន្តែអាចមានភ្លើងស្នេហ៍។' },
    ],
  },
  {
    min: 0,
    lines: [
      { en: 'A challenging match — patience and humour will save you.', km: 'គូលំបាក — ការអត់ធ្មត់ និងភាពលេងសើច នឹងជួយអ្នក។' },
    ],
  },
];

export function bandLine(table: { min: number; lines: Bi[] }[], score: number, seed: number): Bi {
  for (const b of table) {
    if (score >= b.min) return b.lines[seed % b.lines.length];
  }
  return table[table.length - 1].lines[0];
}

export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
