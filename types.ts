
export interface TithiEvent {
  date: string; // ISO format (Primary observation date)
  name: string;
  banglaName: string;
  startDateTime: string; // Full ISO 8601 timestamp
  endDateTime: string;   // Full ISO 8601 timestamp
  description: string;
  type: 'Purnima' | 'Amavasya' | 'Pratipada' | 'Ekadashi' | 'Festival' | 'Other';
}

export interface BanglaDate {
  day: number;
  month: string;
  year: number;
  monthIndex: number;
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
