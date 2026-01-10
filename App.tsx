
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getBanglaDate, toBengaliNumber, formatBengaliTime } from './utils/banglaUtils';
import { getCachedTithis, saveTithisToCache, isCacheStale } from './utils/cacheUtils';
import { fetchTithisForRange, getTithiAdvice } from './services/staticDataService';
import { TithiEvent, DAYS_BN, BANGLA_MONTHS_BN, ENGLISH_MONTHS_BN } from './types';
import { TithiIcon } from './components/TithiIcon';
import { LunarBackground } from './components/LunarBackground';
import { BottomNav, TabType } from './components/BottomNav';
import { M3Card } from './components/M3Card';
import { triggerHaptic } from './utils/hapticUtils';
import { TithiModal } from './components/TithiModal';

type FilterType = 'All' | 'Purnima' | 'Amavasya' | 'Ekadashi' | 'Festival';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tithis, setTithis] = useState<TithiEvent[]>(getCachedTithis());
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedTithi, setSelectedTithi] = useState<TithiEvent | null>(null);
  const [advice, setAdvice] = useState<string>('');
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [upcomingPage, setUpcomingPage] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const todayStr = useMemo(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);

  const syncData = useCallback(async (force = false) => {
    if (!force && !isCacheStale() && tithis.length > 50) return;

    setSyncing(true);
    const now = new Date();
    // Sync a large range (18 months) to ensure full coverage of the new data
    const data = await fetchTithisForRange(now.getFullYear(), now.getMonth() + 1, 18);

    if (data && data.length > 0) {
      saveTithisToCache(data);
      setTithis(getCachedTithis());
    }
    setSyncing(false);
  }, [tithis.length]);

  useEffect(() => {
    // Force cleanup of all old bangla_tithi_cache_v* keys except the current one (v5)
    const CURRENT_VERSION = 'v5';
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('bangla_tithi_cache_') && !key.endsWith(CURRENT_VERSION)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => {
        localStorage.removeItem(k);
        console.log(`Cleaned up legacy cache: ${k}`);
      });
    } catch (e) {
      console.error("Cache cleanup failed", e);
    }

    // Handle shortcuts / tab query param
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'calendar' || tab === 'upcoming' || tab === 'home') {
      setActiveTab(tab as TabType);
      // Clean up the URL to keep it clean
      window.history.replaceState({}, '', window.location.pathname);
    }

    syncData();
  }, [syncData]);

  useEffect(() => {
    // Precise theme-color sync for Android Status Bar (Sacred Saffron / Cream)
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#FFFBF0');
    }
  }, []);

  // Ensure tithis are always sorted chronologically by date
  const sortedTithis = useMemo(() => {
    return [...tithis]
      .filter(t => t && t.date) // Defensive check, allow null events
      .sort((a, b) => {
        const d = a.date.localeCompare(b.date);
        if (d !== 0) return d;
        return (a.event?.startDateTime || '').localeCompare(b.event?.startDateTime || '');
      });
  }, [tithis]);

  // Today's specific tithi
  const todayTithi = useMemo(() =>
    sortedTithis.find(t => t.date === todayStr),
    [sortedTithis, todayStr]
  );

  // Filtered list for 'Upcoming' section - Paginated batches of 5
  const { paginatedTithis, totalPages, totalCount } = useMemo(() => {
    // 1. Get all future tithis (strictly after today)
    // For 'Upcoming', we still only want entries with actual events
    let list = sortedTithis.filter(t => t.date > todayStr && t.event);

    // 2. Filter by type
    if (activeFilter !== 'All') {
      list = list.filter(t => {
        const typeStr = t.event?.type || '';
        const tithiBN = t.banglaDate?.tithi || '';
        if (activeFilter === 'Purnima') return typeStr.includes('Purnima') || tithiBN === 'পূর্ণিমা';
        if (activeFilter === 'Amavasya') return typeStr.includes('Amavasya') || tithiBN === 'অমাবস্যা';
        if (activeFilter === 'Ekadashi') return typeStr.includes('Ekadashi') || tithiBN.includes('একাদশী');
        return typeStr.includes(activeFilter);
      });
    }

    const count = list.length;
    const pages = Math.ceil(count / 5);
    const batch = list.slice(upcomingPage * 5, (upcomingPage + 1) * 5);

    return {
      paginatedTithis: batch,
      totalPages: pages,
      totalCount: count
    };
  }, [sortedTithis, activeFilter, todayStr, upcomingPage]);

  const handleDateChange = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
    setSelectedTithi(null);
    setAdvice('');

    const monthStr = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
    const hasData = tithis.some(t => t.date.startsWith(monthStr));
    if (!hasData) {
      setLoading(true);
      fetchTithisForRange(newDate.getFullYear(), newDate.getMonth() + 1, 3).then(data => {
        saveTithisToCache(data);
        setTithis(getCachedTithis());
        setLoading(false);
      });
    }
  };

  const handleTithiClick = async (tithi: TithiEvent) => {
    triggerHaptic('selection');
    if (selectedTithi?.event?.name === tithi.event?.name && selectedTithi?.date === tithi.date) {
      setSelectedTithi(null);
      return;
    }
    setSelectedTithi(tithi);
    setAdviceLoading(true);
    const text = await getTithiAdvice(tithi);
    setAdvice(text);
    setAdviceLoading(false);
  };

  const handleTabChange = (tab: TabType) => {
    triggerHaptic('light');
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const credTheme = {
    bg: 'bg-[#050505]',
    header: 'bg-[#050505]/90 border-[#1A1A1A] text-white',
    textMain: 'text-[#E0E0E0]',
    textMuted: 'text-[#888888]',
    textAccent: 'text-[#C49B66]',
    card: 'bg-[#121212] border-[#1A1A1A] hover:border-[#333333] shadow-2xl',
    secondary: 'bg-[#FF2E63]',
  };

  const getTithiColorClass = (type: string) => {
    const primaryType = type.split(',')[0].trim();
    switch (primaryType) {
      case 'Festival': return 'from-red-100 to-orange-200 border-red-300 text-red-950';
      case 'Purnima': return 'from-amber-100 to-yellow-200 border-amber-300 text-amber-950';
      case 'Amavasya': return 'from-slate-700 to-slate-900 border-slate-600 text-white';
      case 'Ekadashi': return 'from-orange-100 to-orange-200 border-orange-300 text-orange-950';
      case 'Pratipada': return 'from-emerald-100 to-emerald-200 border-emerald-300 text-emerald-950';
      default: return 'from-sky-100 to-indigo-200 border-indigo-300 text-indigo-950';
    }
  };

  const activeTheme = credTheme;
  const todayLabel = (() => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const y = d.getFullYear();
    const dayName = DAYS_BN[d.getDay()];
    return {
      formatted: `${toBengaliNumber(day)}/${toBengaliNumber(m)}/${toBengaliNumber(y)}`,
      dayName: dayName
    };
  })();

  const TimeBlock = ({ label, isoDateTime, isEnd = false, isHero = false }: { label: string, isoDateTime: string, isEnd?: boolean, isHero?: boolean }) => {
    if (!isoDateTime) return null;
    const d = new Date(isoDateTime);
    const day = String(d.getDate()).padStart(2, '0');
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const y = d.getFullYear();
    const dayName = DAYS_BN[d.getDay()];
    return (
      <div className={`flex flex-col gap-0.5 ${isEnd ? 'items-end text-right' : 'items-start text-left'}`}>
        <span className={`text-[9px] font-black uppercase tracking-widest bangla-font ${isHero ? 'opacity-50' : activeTheme.textMuted}`}>{label}</span>
        <div className="flex flex-col">
          <span className={`text-base font-black leading-tight tracking-tight ${isHero ? '' : activeTheme.textMain}`}>{formatBengaliTime(isoDateTime)}</span>
          <span className={`text-[9px] font-bold bangla-font ${isHero ? 'opacity-60' : activeTheme.textMuted}`}>{dayName}, {toBengaliNumber(day)}/{toBengaliNumber(m)}/{toBengaliNumber(y)}</span>
        </div>
      </div>
    );
  };

  const CompactTithiCard = ({ t, isHero = false }: { t: TithiEvent, isHero?: boolean, key?: string }) => {
    const isSelected = selectedTithi?.event?.name === t.event?.name && selectedTithi?.date === t.date;
    const eventType = (t.event?.type || 'Normal').split(',')[0].trim();
    const colorClass = getTithiColorClass(eventType);

    return (
      <div className="flex flex-col gap-3">
        <M3Card
          onClick={() => handleTithiClick(t)}
          variant={isHero ? 'elevated' : 'outlined'}
          className={`
            relative group p-6 overflow-hidden border-none 
            transition-all duration-500 hover:scale-[1.01] active:scale-[0.98]
            ${isHero ? `cred-hero-card ${colorClass}` : `${activeTheme.card} ${isSelected ? 'ring-2 ring-[#C49B66]/20 shadow-lg' : 'hover:shadow-md'}`}
            animate-in fade-in slide-in-from-bottom-2 duration-500
          `}
        >
          {isHero && <LunarBackground type={eventType} />}

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shadow-inner ${isHero ? 'bg-white/10 backdrop-blur-3xl border border-white/20' : 'bg-white/[0.03]'}`}>
                  <TithiIcon type={eventType} size={isHero ? "md" : "sm"} />
                </div>
                <div>
                  <h3 className={`
                    ${isHero ? 'text-4xl' : 'text-xl'} 
                    font-black bangla-font tracking-tighter leading-none mb-1
                    ${isHero ? 'text-white' : activeTheme.textMain}
                  `}>
                    {t.event?.banglaName || 'সাধারণ দিন'}
                  </h3>
                  <div className={`flex items-center gap-1.5 mt-0.5 ${isHero ? 'opacity-60' : activeTheme.textMuted}`}>
                    <span className="text-[10px] font-bold bangla-font tracking-wider uppercase opacity-40">
                      {(() => {
                        const b = getBanglaDate(new Date(t.date));
                        return `${toBengaliNumber(b.day)} ${BANGLA_MONTHS_BN[b.monthIndex]}, ${toBengaliNumber(b.year)}`;
                      })()}
                    </span>
                  </div>
                </div>
              </div>
              {!isHero && (
                <div className="px-3 py-1.5 rounded-xl flex flex-col items-center justify-center min-w-[50px] bg-white/[0.02] border border-white/[0.05]">
                  <span className={`text-lg font-black leading-none ${activeTheme.textMain}`}>{toBengaliNumber(new Date(t.date).getDate())}</span>
                  <span className={`text-[7px] font-black opacity-40 uppercase tracking-widest mt-0.5 ${activeTheme.textMain}`}>{ENGLISH_MONTHS_BN[new Date(t.date).getMonth()]}</span>
                </div>
              )}
            </div>

            <div className={`flex justify-between items-center gap-2 py-4 px-1 border-y ${isHero ? 'border-white/10' : 'border-white/5'}`}>
              <TimeBlock label="আরম্ভ" isoDateTime={t.event?.startDateTime || ''} isHero={isHero} />
              <div className={`h-8 w-[1px] hidden sm:block ${isHero ? 'bg-white/10' : 'bg-white/5'} opacity-20`}></div>
              <TimeBlock label="সমাপ্তি" isoDateTime={t.event?.endDateTime || ''} isEnd isHero={isHero} />
            </div>

            {isHero && (
              <button
                onClick={(e) => { e.stopPropagation(); triggerHaptic('medium'); alert('রিমাইন্ডার সেট করা হয়েছে (Demo)'); }}
                className="w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-[#C49B66] text-black hover:bg-[#D4AB76] shadow-xl copper-glow"
              >
                Set Reminder
              </button>
            )}
          </div>
        </M3Card>
      </div>
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-28 border-r border-b border-white/[0.02] bg-white/[0.01]" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const tithiOnDay = sortedTithis.find(t => t.date.startsWith(dateStr));
      const isToday = todayStr === dateStr;
      const bDateInfo = getBanglaDate(new Date(year, month, d));

      days.push(
        <div key={d} className={`h-28 border-r border-b p-1.5 transition-all hover:bg-white/[0.02] relative flex flex-col items-center border-white/[0.02] ${isToday ? 'bg-[#C49B66]/5' : ''} ${((firstDay + d) % 7 === 0) ? 'border-r-0' : ''}`}>
          <div className="flex flex-col items-center gap-0.5 pt-1">
            <span className={`text-[10px] font-black opacity-30 ${activeTheme.textMain}`}>{d}</span>
            <span className={`text-lg font-black bangla-font ${isToday ? activeTheme.textAccent : activeTheme.textMain} tracking-tight leading-none`}>
              {toBengaliNumber(bDateInfo.day)}
            </span>
          </div>

          <div className="mt-auto mb-1 w-full flex flex-col items-center">
            {tithiOnDay && tithiOnDay.event && (
              <div
                onClick={() => handleTithiClick(tithiOnDay)}
                className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105 w-full"
              >
                <TithiIcon type={tithiOnDay.event.type.split(',')[0].trim()} size="sm" />
                <span className={`text-[8px] font-black bangla-font opacity-80 truncate w-full text-center ${activeTheme.textMain}`}>{tithiOnDay.event.banglaName}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  const FilterChips = () => {
    const filters: { label: string, val: FilterType, icon: string }[] = [
      { label: 'সব', val: 'All', icon: '✦' },
      { label: 'পূজা/উৎসব', val: 'Festival', icon: '🪔' },
      { label: 'পূর্ণিমা', val: 'Purnima', icon: '🌕' },
      { label: 'অমাবস্যা', val: 'Amavasya', icon: '🌑' },
      { label: 'একাদশী', val: 'Ekadashi', icon: '🌙' },
    ];

    return (
      <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar -mx-5 px-5 scroll-smooth">
        {filters.map(f => (
          <button
            key={f.val}
            onClick={() => {
              triggerHaptic('selection');
              setActiveFilter(f.val);
              setUpcomingPage(0);
              setSelectedTithi(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap transition-all duration-300 ${activeFilter === f.val
              ? `${activeTheme.secondary} text-white border-transparent shadow-lg scale-105`
              : `bg-white/40 ${activeTheme.textMain} border-current/10 hover:border-current/30`}`}
          >
            <span className="text-[10px] opacity-70">{f.icon}</span>
            <span className="text-xs font-black bangla-font tracking-tight">{f.label}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-500 font-sans ${activeTheme.bg} ${activeTheme.textMain}`}>
      {/* Top App Bar - Fixed/Pinned */}
      <header className={`backdrop-blur-xl border-b p-5 sticky top-0 z-50 transition-all duration-500 ${activeTheme.header} safe-top`}>
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10">
              <svg className={`w-6 h-6 ${activeTheme.textAccent}`} fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            </div>
            <div className="relative">
              <h1 className={`text-xl font-black bangla-font tracking-tight ${activeTheme.textAccent}`}>বঙ্গ তিথি দর্পণ</h1>
              <div className="flex items-center gap-1.5 mt-0.5 opacity-60">
                <span className="text-[10px] font-black uppercase tracking-widest bangla-font">{todayLabel.dayName}, {todayLabel.formatted}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto mt-6 px-5 relative pb-20">

        {/* Tab 1: Home (Redesigned: Today & Solar & Quick Highlights) */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            {/* 1. Today's Premium Hero */}
            <section className="relative overflow-hidden rounded-[2.5rem] p-10 -mx-1 cred-hero-card text-white border border-[#C49B66]/20">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              </div>
              <div className="relative z-10 flex flex-col gap-10">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C49B66] mb-3">Today's Panjika</h2>
                    <div className="flex flex-col">
                      <span className="text-6xl font-black tracking-tighter leading-none mb-2">
                        {todayLabel.formatted.split('/')[0]} {ENGLISH_MONTHS_BN[new Date().getMonth()]}
                      </span>
                      <span className="text-xl font-medium text-white/50 tracking-wide">{todayLabel.dayName} • {toBengaliNumber(new Date().getFullYear().toString())}</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-white/5 backdrop-blur-3xl rounded-full border border-white/5 text-[11px] font-black bangla-font tracking-tight text-[#C49B66]">আজকের দিন</div>
                </div>

                <div className="flex items-center gap-6 py-6 border-t border-white/5 mt-4">
                  <div className="flex-1 flex flex-col items-center p-4 rounded-3xl bg-white/[0.02] border border-white/[0.03]">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Bangla Date</span>
                    <span className="text-xl font-black text-[#C49B66]">
                      {(() => {
                        const b = getBanglaDate(new Date());
                        return `${toBengaliNumber(b.day)} ${BANGLA_MONTHS_BN[b.monthIndex]}`;
                      })()}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center p-4 rounded-3xl bg-white/[0.02] border border-white/[0.03]">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Bangla Year</span>
                    <span className="text-xl font-black text-[#C49B66]">
                      {toBengaliNumber(getBanglaDate(new Date()).year.toString())}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Today's Tithi Special Card (If exists) */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className={`text-lg font-black bangla-font ${activeTheme.textMain}`}>আজকের বিশেষ তিথি</h2>
                {!todayTithi && <span className="text-[9px] font-black bangla-font opacity-40 uppercase tracking-widest pt-1">কোনো বিশেষ তিথি নেই</span>}
              </div>

              {todayTithi ? (
                <div className="space-y-4">
                  <CompactTithiCard t={todayTithi} isHero />
                </div>
              ) : (
                <M3Card variant="outlined" className="p-6 border-dashed flex items-center gap-4 bg-gray-50/50">
                  <div className="p-3 rounded-full bg-gray-100">
                    <svg className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <p className="text-xs font-bold bangla-font opacity-50 flex-1">আজকের দিনটি সাধারণ ক্যালেন্ডার অনুযায়ী পালন করুন।</p>
                </M3Card>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4 px-1">
                <h2 className={`text-lg font-black bangla-font ${activeTheme.textMain}`}>Solar & Atmosphere</h2>
                <div className="flex-1 h-[1px] bg-white/5 ml-2"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-6 rounded-[2.5rem] border ${activeTheme.card} flex flex-col gap-3 relative overflow-hidden group cred-card`}>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#C49B66]/5 rounded-full blur-2xl group-hover:bg-[#C49B66]/10 transition-all"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C49B66] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C49B66] copper-glow"></span> RAW SUNRISE
                  </span>
                  <span className={`text-4xl font-black tracking-tighter ${activeTheme.textMain}`}>
                    {todayTithi?.sun.sunrise || "০৬:২০"}
                  </span>
                  <span className="text-[9px] font-medium text-white/30 uppercase tracking-[0.1em]">Horizon Check • IST</span>
                </div>

                <div className={`p-6 rounded-[2.5rem] border ${activeTheme.card} flex flex-col gap-3 relative overflow-hidden group cred-card`}>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FF2E63]/5 rounded-full blur-2xl group-hover:bg-[#FF2E63]/10 transition-all"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#FF2E63] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E63] neon-glow"></span> DUSK CALC
                  </span>
                  <span className={`text-4xl font-black tracking-tighter ${activeTheme.textMain}`}>
                    {todayTithi?.sun.sunset || "১৭:১৭"}
                  </span>
                  <span className="text-[9px] font-medium text-white/30 uppercase tracking-[0.1em]">Standard Deviation • IST</span>
                </div>
              </div>

              {todayTithi?.sun.dayLength && (
                <div className={`mt-4 p-5 rounded-3xl border border-white/5 flex justify-between items-center bg-white/[0.01] cred-card`}>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C49B66]">Cycle Duration</span>
                  <span className="text-sm font-black tracking-wider text-white/80">{todayTithi.sun.dayLength}</span>
                </div>
              )}
            </section>

            {/* 4. Mini Coming Up Section */}
            <section className="pb-8">
              <div className="flex items-center gap-2 mb-4 px-1">
                <h2 className={`text-lg font-black bangla-font ${activeTheme.textMain}`}>আসন্ন তিথি</h2>
                <button
                  onClick={() => handleTabChange('upcoming')}
                  className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ml-auto ${activeTheme.textAccent}`}
                >
                  সব দেখুন <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {sortedTithis.filter(t => t.date > todayStr).slice(0, 1).map((t, i) => (
                  <CompactTithiCard key={i} t={t} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Calendar (Full Month View) */}
        {activeTab === 'calendar' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className={`w-1.5 h-6 rounded-full bg-[#C49B66] shadow-md copper-glow`}></div>
                <h2 className={`text-xl font-black bangla-font ${activeTheme.textMain}`}>মাসিক ক্যালেন্ডার</h2>
              </div>
            </div>

            <M3Card variant="elevated" className="mb-10 overflow-hidden border-none p-0 bg-[#121212] cred-card">
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <button onClick={() => { handleDateChange(-1); triggerHaptic('selection'); }} className="p-3 rounded-2xl transition-all hover:bg-white/5 active:scale-95 text-[#C49B66]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg></button>
                <h3 className={`font-black uppercase tracking-[0.2em] text-[10px] ${activeTheme.textMain}`}>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h3>
                <button onClick={() => { handleDateChange(1); triggerHaptic('selection'); }} className="p-3 rounded-2xl transition-all hover:bg-white/5 active:scale-95 text-[#C49B66]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg></button>
              </div>
              <div className="grid grid-cols-7 border-b border-white/5">
                {DAYS_BN.map(day => <div key={day} className={`py-3 text-center font-black bangla-font text-[10px] uppercase opacity-50 ${activeTheme.textMain}`}>{day}</div>)}
              </div>
              <div className="grid grid-cols-7">
                {loading ? <div className="col-span-7 h-40 flex items-center justify-center"><div className={`animate-spin h-6 w-6 border-2 border-t-transparent rounded-full ${activeTheme.textAccent}`}></div></div> : renderCalendarDays()}
              </div>
            </M3Card>
          </div>
        )}

        {/* Tab 3: Upcoming (Paginated List) */}
        {activeTab === 'upcoming' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className={`w-1.5 h-6 rounded-full bg-[#C49B66] shadow-md copper-glow`}></div>
                <h2 className={`text-xl font-black bangla-font ${activeTheme.textMain}`}>
                  {activeFilter === 'All' ? 'আসন্ন বিশেষ দিনসমূহ' : `আসন্ন ${activeFilter === 'Festival' ? 'উৎসব' : activeFilter === 'Purnima' ? 'পূর্ণিমা' : activeFilter === 'Amavasya' ? 'অমাবস্যা' : activeFilter === 'Ekadashi' ? 'একাদশী' : activeFilter}`}
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              <FilterChips />

              <div id="upcoming-list" className="grid grid-cols-1 gap-5">
                {syncing && tithis.length === 0 ? [1, 2, 3].map(i => <div key={i} className="h-32 rounded-3xl animate-pulse bg-white/[0.03] border border-white/[0.05]"></div>) :
                  (paginatedTithis.length > 0 ? paginatedTithis.map((t, idx) => <CompactTithiCard key={`${t.date}-${t.event.name}-${idx}`} t={t} />) : (
                    <M3Card variant="outlined" className="p-12 text-center opacity-30 border-white/[0.05] bg-white/[0.01]">
                      <h3 className="text-sm font-black bangla-font">কোনো তথ্য পাওয়া যায়নি</h3>
                    </M3Card>
                  ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 py-6">
                  <button
                    disabled={upcomingPage === 0}
                    onClick={() => { setUpcomingPage(p => Math.max(0, p - 1)); triggerHaptic('selection'); }}
                    className={`p-3 rounded-2xl transition-all ${upcomingPage === 0 ? 'opacity-20 cursor-not-allowed' : 'bg-black/5 hover:bg-black/10 active:scale-90'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <span className="text-[11px] font-black bangla-font opacity-40 uppercase tracking-widest">{toBengaliNumber(upcomingPage + 1)} / {toBengaliNumber(totalPages)}</span>
                  <button
                    disabled={upcomingPage >= totalPages - 1}
                    onClick={() => { setUpcomingPage(p => Math.min(totalPages - 1, p + 1)); triggerHaptic('selection'); }}
                    className={`p-3 rounded-2xl transition-all ${upcomingPage >= totalPages - 1 ? 'opacity-20 cursor-not-allowed' : 'bg-black/5 hover:bg-black/10 active:scale-90'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Background Refreshing Indicator (Minimal Android Pulsar) */}
      {syncing && (
        <div className="fixed top-20 right-5 z-[60] flex items-center gap-2 bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] px-3 py-1.5 rounded-full shadow-lg animate-bounce">
          <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Syncing</span>
        </div>
      )}

      {/* Professional Tithi Detail Modal */}
      <TithiModal
        tithi={selectedTithi}
        isOpen={!!selectedTithi}
        onClose={() => setSelectedTithi(null)}
        advice={advice}
        adviceLoading={adviceLoading}
      />
    </div>
  );
};

export default App;
