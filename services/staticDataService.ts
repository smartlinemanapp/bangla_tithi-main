import { supabase, isSupabaseConfigured } from './supabase';
import { TithiEvent } from '../types';

export const fetchTithisForRange = async (year: number, month: number, count: number): Promise<TithiEvent[]> => {
    if (isSupabaseConfigured()) {
        try {
            const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
            const endDateDate = new Date(year, month - 1 + count, 0); // Last day of the range
            const endDate = endDateDate.toISOString().split('T')[0];

            console.log(`Fetching from Supabase: ${startDate} to ${endDate}`);

            const { data, error } = await supabase
                .from('tithi_events')
                .select('*')
                .gte('date', startDate)
                .lte('date', endDate)
                .order('date', { ascending: true });

            if (error) {
                console.error('Supabase fetch error:', error);
                throw error;
            }

            if (data) {
                // Transform back to TithiEvent
                // Supabase returns { id, date, type, data: {...} }
                // We stored the full object in 'data' column
                // But wait, the migration script stored:
                // { date: t.date, type: t.event?.type, data: t }
                // So we just need to pluck 'data'
                return data.map((row: any) => row.data as TithiEvent);
            }
        } catch (e) {
            console.error('Supabase fetch failed, falling back to static cache/data if possible', e);
            // Fallthrough to fetch from JSON if Supabase fails? 
            // Or just return empty to let cache handle it?
        }
    }

    // Fallback: Fetch from public/tithi.json (Legacy / Offline / Dev without Creds)
    try {
        const response = await fetch('/tithi.json');
        const allTithis = await response.json() as TithiEvent[];

        // Filter locally
        const startStr = `${year}-${String(month).padStart(2, '0')}`;
        // Primitive range filter for fallback
        // Just returning everything is fine for now as it's small, 
        // but let's emulate the range slightly to match behavior
        return allTithis.filter(t => t.date >= `${year}-${String(month).padStart(2, '0')}-01`);
    } catch (e) {
        console.error('Failed to fetch local tithi.json', e);
        return [];
    }
};

export const getTithiAdvice = async (tithi: TithiEvent): Promise<string> => {
    // Advice generation remains static/client-side for now
    // In a real app, this could also be in the DB
    const { event } = tithi;
    if (!event) return "আজকের দিনটি আপনার জন্য শুভ হোক।";

    const type = (event.type || 'Normal').split(',')[0].trim();

    // Basic static advice map
    const adviceMap: Record<string, string> = {
        'Amavasya': "আজ অমাবস্যা। মানসিক প্রশান্তির জন্য ধ্যান বা দান করা শুভ। নতুন কোনো শুভ কাজ শুরু করা থেকে বিরত থাকুন।",
        'Purnima': "আজ পূর্ণিমা। সত্যনারায়ণ পূজা বা কোনো শুভ কাজের জন্য দিনটি অত্যন্ত প্রশস্ত।",
        'Ekadashi': "আজ একাদশী। উপবাস পালন শরীর ও মনের জন্য মঙ্গলজনক। চাল ও শর্করা জাতীয় খাবার বর্জনীয়।",
        'Sankranti': "আজ সংক্রান্তি। সূর্য দেবতার আরাধনা ও দান কার্যের জন্য বিশেষ দিন।",
        'Festival': `${event.banglaName} উপলক্ষে আপনাকে শুভেচ্ছা। পরিবারের সাথে আনন্দ ভাগ করে নিন।`
    };

    return adviceMap[type] || "আজকের দিনটি আপনার জন্য মঙ্গলময় হোক। প্রতিটি মুহূর্ত আনন্দে কাটুক।";
};
