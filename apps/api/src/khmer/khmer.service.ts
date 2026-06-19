import { Injectable } from '@nestjs/common';
import * as momentkh from '@thyrith/momentkh';

const MONTH_EN = [
  'Migasir', 'Boss', 'Meak', 'Phalgun', 'Chetr', 'Visakh',
  'Jesth', 'Asadh', 'Srap', 'Phutrabot', 'Assoch', 'Kadeuk',
  'First Asadh', 'Second Asadh',
];

const ANIMAL_EN = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig',
];

const SAK_EN = [
  'Samridhi', 'Aek', 'To', 'Trei', 'Chattva',
  'Pancha', 'Chha', 'Sappa', 'Attha', 'Nappa',
];

const WEEKDAY_EN = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

export interface KhmerLunar {
  day: number;
  moonPhase: number; // 0 waxing (កើត), 1 waning (រោច)
  moonPhaseKm: string;
  moonPhaseEn: 'waxing' | 'waning';
  monthIndex: number;
  monthKm: string;
  monthEn: string;
  isLeapMonth: boolean; // អធិកមាស (extra Asadh)
  beYear: number; // Buddhist Era
  jsYear: number; // Jolak Sakaraj
  animalIndex: number;
  animalKm: string;
  animalEn: string;
  sakKm: string;
  sakEn: string;
  weekdayIndex: number;
  weekdayKm: string;
  weekdayEn: string;
  formattedKm: string; // full traditional date, Khmer numerals
  formattedEn: string;
}

@Injectable()
export class KhmerService {
  forDate(year: number, month: number, day: number): KhmerLunar {
    const res: any = (momentkh as any).fromGregorian(year, month, day);
    const k = res.khmer;
    const monthIndex: number = k.monthIndex;
    const animalIndex: number = k.animalYear;
    const sakIndex: number = k.sak;
    const weekdayIndex: number = k.dayOfWeek;
    const moonPhase: number = k.moonPhase;
    const isLeapMonth = monthIndex === 12 || monthIndex === 13;

    const formattedKm: string = (momentkh as any).format(res);
    const formattedEn = `${WEEKDAY_EN[weekdayIndex]}, ${k.day} ${
      moonPhase === 0 ? 'waxing' : 'waning'
    }, month of ${MONTH_EN[monthIndex]}, Year of the ${ANIMAL_EN[animalIndex]}, BE ${k.beYear}`;

    return {
      day: k.day,
      moonPhase,
      moonPhaseKm: k.moonPhaseName,
      moonPhaseEn: moonPhase === 0 ? 'waxing' : 'waning',
      monthIndex,
      monthKm: k.monthName,
      monthEn: MONTH_EN[monthIndex] ?? k.monthName,
      isLeapMonth,
      beYear: k.beYear,
      jsYear: k.jsYear,
      animalIndex,
      animalKm: k.animalYearName,
      animalEn: ANIMAL_EN[animalIndex] ?? k.animalYearName,
      sakKm: k.sakName,
      sakEn: SAK_EN[sakIndex] ?? k.sakName,
      weekdayIndex,
      weekdayKm: k.dayOfWeekName,
      weekdayEn: WEEKDAY_EN[weekdayIndex] ?? k.dayOfWeekName,
      formattedKm,
      formattedEn,
    };
  }
}
