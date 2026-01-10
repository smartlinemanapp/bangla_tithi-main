
import { TithiEvent } from "../types";

const CACHE_KEY = 'bangla_tithi_cache_v6';
const LAST_SYNC_KEY = 'bangla_tithi_last_sync';

export interface CachedData {
  tithis: TithiEvent[];
  lastSync: number;
}

export const getCachedTithis = (): TithiEvent[] => {
  try {
    const data = localStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to read cache", e);
    return [];
  }
};

export const saveTithisToCache = (newTithis: TithiEvent[]) => {
  try {
    const existing = getCachedTithis();
    // Merge and deduplicate based on date + name (or just date if no event)
    const merged = [...existing, ...newTithis];
    const unique = Array.from(new Map(merged.map(item => {
      const key = item.event ? (item.date + item.event.name) : item.date;
      return [key, item];
    })).values());

    // Sort by date
    unique.sort((a, b) => a.date.localeCompare(b.date));

    // Limit cache size to reasonable amount (e.g., 500 events)
    const trimmed = unique.slice(-500);

    localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
    localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
  } catch (e) {
    console.error("Failed to save cache", e);
  }
};

export const isCacheStale = (): boolean => {
  const lastSync = localStorage.getItem(LAST_SYNC_KEY);
  if (!lastSync) return true;
  const oneDay = 24 * 60 * 60 * 1000;
  return Date.now() - parseInt(lastSync) > (oneDay * 7); // Stale after 7 days
};
