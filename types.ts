
export interface SunData {
  sunrise: string;
  sunset: string;
  dayLength: string;
  nightLength: string;
  reference: string;
}

export interface EventDetails {
  name: string;
  banglaName: string;
  type: 'Purnima' | 'Amavasya' | 'Pratipada' | 'Ekadashi' | 'Festival' | 'Ritual' | 'Normal' | 'Other';
  description: string;
  startDateTime: string;
  endDateTime: string;
}

// Interface for the Bangla Date object found in the JSON data
export interface JsonBanglaDate {
  month: string;
  paksha: string;
  tithi: string;
  tithiType: string;
}

// Interface for the calculated Bangla Date used in utils
export interface BanglaDate {
  day: number;
  month: string;
  year: number;
  monthIndex: number;
}

export interface Weekday {
  en: string;
  bn: string;
}

export interface TithiEvent {
  date: string;
  weekday: Weekday;
  banglaDate: JsonBanglaDate;
  event: EventDetails;
  sun: SunData;
}

export const BANGLA_MONTHS = [
  'Boishakh', 'Jyaistha', 'Asharh', 'Shrabon', 'Bhadro', 'Ashwin',
  'Kartik', 'Agrahayan', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

export const BANGLA_MONTHS_BN = [
  'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
  'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
];

export const ENGLISH_MONTHS_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

export const DAYS_BN = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];
