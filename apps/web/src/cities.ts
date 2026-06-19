export interface City {
  name: string;
  km: string;
  lat: number;
  lng: number;
  tz: number; // minutes east of UTC (standard time, DST ignored for MVP)
}

// A small curated list spanning the globe, led by Khmer cities.
export const CITIES: City[] = [
  { name: 'Phnom Penh', km: 'ភ្នំពេញ', lat: 11.5564, lng: 104.9282, tz: 420 },
  { name: 'Siem Reap', km: 'សៀមរាប', lat: 13.3633, lng: 103.8564, tz: 420 },
  { name: 'Battambang', km: 'បាត់ដំបង', lat: 13.0957, lng: 103.2022, tz: 420 },
  { name: 'Sihanoukville', km: 'ក្រុងព្រះសីហនុ', lat: 10.6253, lng: 103.5234, tz: 420 },
  { name: 'Bangkok', km: 'បាងកក', lat: 13.7563, lng: 100.5018, tz: 420 },
  { name: 'Ho Chi Minh City', km: 'ហូជីមិញ', lat: 10.8231, lng: 106.6297, tz: 420 },
  { name: 'Singapore', km: 'សិង្ហបុរី', lat: 1.3521, lng: 103.8198, tz: 480 },
  { name: 'Tokyo', km: 'តូក្យូ', lat: 35.6762, lng: 139.6503, tz: 540 },
  { name: 'Delhi', km: 'ដេលី', lat: 28.6139, lng: 77.209, tz: 330 },
  { name: 'Dubai', km: 'ឌុយបៃ', lat: 25.2048, lng: 55.2708, tz: 240 },
  { name: 'Moscow', km: 'ម៉ូស្គូ', lat: 55.7558, lng: 37.6173, tz: 180 },
  { name: 'Paris', km: 'ប៉ារីស', lat: 48.8566, lng: 2.3522, tz: 60 },
  { name: 'London', km: 'ឡុងដ៍', lat: 51.5074, lng: -0.1278, tz: 0 },
  { name: 'New York', km: 'ញូវយ៉ក', lat: 40.7128, lng: -74.006, tz: -300 },
  { name: 'Los Angeles', km: 'ឡូសអេនជឺឡេស', lat: 34.0522, lng: -118.2437, tz: -480 },
  { name: 'Sydney', km: 'ស៊ីដនី', lat: -33.8688, lng: 151.2093, tz: 600 },
];
