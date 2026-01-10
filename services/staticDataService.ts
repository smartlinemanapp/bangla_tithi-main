
import { TithiEvent } from "../types";

// Cache for loaded data
let cachedData: TithiEvent[] | null = null;

/**
 * Load Tithi data from static JSON file
 */
const loadStaticData = async (): Promise<TithiEvent[]> => {
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch('./tithi.json');
        if (!response.ok) {
            throw new Error(`Failed to load data: ${response.statusText}`);
        }
        cachedData = await response.json();
        return cachedData || [];
    } catch (error) {
        console.error('Error loading static Tithi data:', error);
        return [];
    }
};

/**
 * Fetches Tithis for a range of months from static data
 */
export const fetchTithisForRange = async (
    startYear: number,
    startMonth: number,
    monthCount: number = 6
): Promise<TithiEvent[]> => {
    const allData = await loadStaticData();

    // Calculate date range
    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(startYear, startMonth - 1 + monthCount, 0);

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    // Filter data by date range using the top-level date field
    // sorting is now done by date string directly as it is YYYY-MM-DD
    return allData.filter(tithi => {
        return tithi.date >= startStr && tithi.date <= endStr;
    });
};

/**
 * Get advice/description for a specific Tithi
 * Uses the description from static data
 */
export const getTithiAdvice = async (tithi: TithiEvent): Promise<string> => {
    // Return the description from the nested event object
    if (tithi.event && tithi.event.description) {
        return tithi.event.description;
    }

    // Fallback Bengali message
    return "এই তিথি সম্পর্কে কোনো বিস্তারিত তথ্য পাওয়া যায়নি।";
};
