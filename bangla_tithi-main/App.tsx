
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getBanglaDate, toBengaliNumber, formatBengaliTime } from './utils/banglaUtils';
import { getCachedTithis, saveTithisToCache, isCacheStale } from './utils/cacheUtils';
import { fetchTithisForRange, getTithiAdvice } from './services/staticDataService';
import { TithiEvent, DAYS_BN, BANGLA_MONTHS_BN, ENGLISH_MONTHS_BN } from './types';
import { TithiIcon } from './components/TithiIcon';
import { LunarBackground } from './components/LunarBackground';

type Theme = 'saffron' | 'midnight' | 'emerald';
type FilterType = 'All' | 'Purnima' | 'Amavasya' | 'Ekadashi' | 'Festival';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tithis, setTithis] = useState<TithiEvent[]>(getCachedTithis());
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedTithi, setSelectedTithi] = useState<TithiEvent | null>(null);
  const [advice, setAdvice] = useState<string>('');
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [theme, setTheme] = useState<Theme>('saffron');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [upcomingPage, setUpcomingPage] = useState(0);

  const todayStr = useMemo(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);

  const syncData = useCallback(async (force = false) => {
    if (!force && !isCacheStale() && tithis.length > 0) return;

    setSyncing(true);
    const now = new Date();
    const data = await fetchTithisForRange(now.getFullYear(), now.getMonth() + 1, 6);

    if (data && data.length > 0) {
      saveTithisToCache(data);
      setTithis(getCachedTithis());
    }
    setSyncing(false);
  }, [tithis.length]);

  useEffect(() => {
    syncData();
  }, []);

  // Ensure tithis are always sorted chronologically by date and start time
  const sortedTithis = useMemo(() => {
    return [...tithis].sort((a, b) => {
      const d = a.date.localeCompare(b.date);
      if (d !== 0) return d;
      return a.startDateTime.localeCompare(b.startDateTime);
    });
  }, [tithis]);

  // Today's specific tithi
  const todayTithi = useMemo(() =>
    sortedTithis.find(t => t.date.startsWith(todayStr)),
    [sortedTithis, todayStr]
  );

  // Filtered list for 'Upcoming' section - Paginated batches of 5
  const { paginatedTithis, totalPages, totalCount } = useMemo(() => {
    // 1. Get all future tithis (strictly after today)
    let list = sortedTithis.filter(t => t.date > todayStr);

    // 2. Filter by type
    if (activeFilter !== 'All') {
      list = list.filter(t => t.type === activeFilter);
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
    if (selectedTithi?.name === tithi.name && selectedTithi?.date === tithi.date) {
      setSelectedTithi(null);
      return;
    }
    setSelectedTithi(tithi);
    setAdviceLoading(true);
    const text = await getTithiAdvice(tithi);
    setAdvice(text);
    setAdviceLoading(false);
  };

  const getTithiColorClass = (type: string) => {
    if (theme === 'midnight') {
      switch (type) {
        case 'Festival': return 'from-red-950 to-orange-950 border-red-800/30 text-red-50';
        case 'Purnima': return 'from-yellow-900/60 to-amber-950 border-amber-500/30 text-amber-50';
        case 'Amavasya': return 'from-slate-700 to-black border-slate-600 text-slate-100';
        case 'Ekadashi': return 'from-orange-950 to-red-950 border-orange-800/30 text-orange-50';
        case 'Pratipada': return 'from-emerald-950 to-teal-950 border-emerald-800/30 text-emerald-50';
        default: return 'from-indigo-950 to-slate-950 border-indigo-800/30 text-indigo-50';
      }
    }
    switch (type) {
      case 'Festival': return 'from-red-100 to-orange-200 border-red-300 text-red-950';
      case 'Purnima': return 'from-amber-100 to-yellow-200 border-amber-300 text-amber-950';
      case 'Amavasya': return 'from-slate-700 to-slate-900 border-slate-600 text-white';
      case 'Ekadashi': return 'from-orange-100 to-orange-200 border-orange-300 text-orange-950';
      case 'Pratipada': return 'from-emerald-100 to-emerald-200 border-emerald-300 text-emerald-950';
      default: return 'from-sky-100 to-indigo-200 border-indigo-300 text-indigo-950';
    }
  };

  const themeClasses = {
    saffron: {
      bg: 'bg-[#faf9f6]',
      header: 'bg-white/95 border-orange-200 text-orange-950',
      textMain: 'text-amber-950',
      textMuted: 'text-amber-800/70',
      textAccent: 'text-orange-700',
      card: 'bg-white border-orange-100 hover:border-orange-300 shadow-sm',
      secondary: 'bg-orange-600',
    },
    midnight: {
      bg: 'bg-[#020617]',
      header: 'bg-slate-950/95 border-slate-800 text-slate-100',
      textMain: 'text-slate-100',
      textMuted: 'text-slate-400',
      textAccent: 'text-indigo-400',
      card: 'bg-slate-900 border-slate-800/60 hover:border-indigo-500/40 shadow-sm',
      secondary: 'bg-indigo-600',
    },
    emerald: {
      bg: 'bg-[#f0fdf4]',
      header: 'bg-white/95 border-emerald-200 text-emerald-950',
      textMain: 'text-emerald-950',
      textMuted: 'text-emerald-800/70',
      textAccent: 'text-emerald-700',
      card: 'bg-white border-emerald-100 hover:border-emerald-300 shadow-sm',
      secondary: 'bg-emerald-600',
    }
  };

  const activeTheme = themeClasses[theme];
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
    const isSelected = selectedTithi?.name === t.name && selectedTithi?.date === t.date;
    const colorClass = getTithiColorClass(t.type);

    return (
      <div className="flex flex-col gap-3">
        <div
          onClick={() => handleTithiClick(t)}
          className={`relative group p-5 rounded-[2rem] border transition-all duration-500 cursor-pointer overflow-hidden ${isHero ? `shadow-2xl border-none ${colorClass}` : `${activeTheme.card} ${isSelected ? 'ring-2 ring-current/10 border-current/40 scale-[1.01]' : ''}`}`}
        >
          {isHero && <LunarBackground type={t.type} />}

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shadow-inner ${isHero ? 'bg-white/20 backdrop-blur-3xl border border-white/30' : (theme === 'midnight' ? 'bg-slate-800' : 'bg-gray-100/60')}`}>
                  <TithiIcon type={t.type} size={isHero ? "md" : "sm"} />
                </div>
                <div>
                  <h3 className={`${isHero ? 'text-3xl' : 'text-xl'} font-black bangla-font tracking-tight leading-none ${isHero ? '' : activeTheme.textMain}`}>{t.banglaName}</h3>
                  <div className={`flex items-center gap-1.5 mt-0.5 ${isHero ? 'opacity-60' : activeTheme.textMuted}`}>
                    <span className="text-[10px] font-black bangla-font">
                      {(() => {
                        const b = getBanglaDate(new Date(t.date));
                        return `${toBengaliNumber(b.day)} ${BANGLA_MONTHS_BN[b.monthIndex]}, ${toBengaliNumber(b.year)}`;
                      })()}
                    </span>
                  </div>
                </div>
              </div>
              {!isHero && (
                <div className={`px-3 py-1.5 rounded-xl flex flex-col items-center justify-center min-w-[50px] ${theme === 'midnight' ? 'bg-slate-800/80' : 'bg-gray-100/40'}`}>
                  <span className={`text-lg font-black leading-none ${activeTheme.textMain}`}>{toBengaliNumber(new Date(t.date).getDate())}</span>
                  <span className={`text-[7px] font-black opacity-60 bangla-font mt-0.5 ${activeTheme.textMain}`}>{ENGLISH_MONTHS_BN[new Date(t.date).getMonth()]}</span>
                </div>
              )}
            </div>

            <div className={`flex justify-between items-center gap-2 py-3 px-0.5 border-y ${isHero ? 'border-white/10' : 'border-current/5'}`}>
              <TimeBlock label="আরম্ভ" isoDateTime={t.startDateTime} isHero={isHero} />
              <div className={`h-6 w-[1px] hidden sm:block ${isHero ? 'bg-white/10' : 'bg-current/10'}`}></div>
              <TimeBlock label="সমাপ্তি" isoDateTime={t.endDateTime} isEnd isHero={isHero} />
            </div>

            {isHero && (
              <button className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest bangla-font transition-all ${theme === 'midnight' ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg' : 'bg-black text-white hover:bg-gray-900 shadow-xl'}`}>রিমাইন্ডার সেট করুন</button>
            )}
          </div>
        </div>

        {isSelected && !isHero && (
          <div className={`rounded-[3rem] p-1 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700 mx-2 -mt-6 relative z-20 border-0 transition-all overflow-hidden ${theme === 'midnight' ? 'bg-gradient-to-b from-slate-900 to-black' : 'bg-gradient-to-b from-white to-orange-50/30'}`}>
            <div className={`rounded-[2.8rem] p-7 border transition-all ${theme === 'midnight' ? 'bg-slate-900/40 border-slate-800/50 text-slate-100' : 'bg-white border-orange-100/50 text-gray-900'}`}>

              {/* Header with Icon & Title */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-6 rounded-full ${activeTheme.secondary} shadow-[0_0_15px_rgba(var(--secondary-rgb),0.5)]`}></div>
                  <h5 className={`text-xs font-black bangla-font tracking-widest uppercase opacity-60`}>তিথির মাহাত্ম্য ও গুরুত্ব</h5>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setSelectedTithi(null); }} className="p-2 rounded-full hover:bg-black/5 transition-colors opacity-30 hover:opacity-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Date & Day Banner */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {/* English Date Badge */}
                  <div className={`px-4 py-2.5 rounded-2xl flex flex-col items-start gap-0.5 border shadow-sm shrink-0 ${theme === 'midnight' ? 'bg-indigo-950/30 border-indigo-500/20' : 'bg-blue-50/50 border-blue-100'}`}>
                    <span className={`text-[8px] font-black uppercase tracking-widest opacity-40 ${theme === 'midnight' ? 'text-indigo-300' : 'text-blue-900'}`}>ইংরেজি ক্যালেন্ডার</span>
                    <span className={`text-xs font-black bangla-font whitespace-nowrap ${theme === 'midnight' ? 'text-indigo-100' : 'text-blue-900'}`}>
                      {toBengaliNumber(new Date(t.date).getDate())} {ENGLISH_MONTHS_BN[new Date(t.date).getMonth()]}, {toBengaliNumber(new Date(t.date).getFullYear())}
                    </span>
                  </div>

                  {/* Bangla Date Badge */}
                  {(() => {
                    const b = getBanglaDate(new Date(t.date));
                    return (
                      <div className={`px-4 py-2.5 rounded-2xl flex flex-col items-start gap-0.5 border shadow-sm shrink-0 ${theme === 'midnight' ? 'bg-orange-950/30 border-orange-500/20' : 'bg-orange-50/50 border-orange-100'}`}>
                        <span className={`text-[8px] font-black uppercase tracking-widest opacity-40 ${theme === 'midnight' ? 'text-orange-300' : 'text-orange-900'}`}>বাংলা তারিখ</span>
                        <span className={`text-xs font-black bangla-font whitespace-nowrap ${theme === 'midnight' ? 'text-orange-100' : 'text-orange-900'}`}>
                          {toBengaliNumber(b.day)} {BANGLA_MONTHS_BN[b.monthIndex]}, {toBengaliNumber(b.year)}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Day Badge */}
                  <div className={`px-4 py-2.5 rounded-2xl flex flex-col items-start gap-0.5 border shadow-sm shrink-0 ${theme === 'midnight' ? 'bg-emerald-950/30 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-100'}`}>
                    <span className={`text-[8px] font-black uppercase tracking-widest opacity-40 ${theme === 'midnight' ? 'text-emerald-300' : 'text-emerald-900'}`}>বার</span>
                    <span className={`text-xs font-black bangla-font whitespace-nowrap ${theme === 'midnight' ? 'text-emerald-100' : 'text-emerald-900'}`}>
                      {DAYS_BN[new Date(t.date).getDay()]}বার
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Content */}
              <div className="relative">
                <div className={`absolute -left-4 top-0 bottom-0 w-1 rounded-full opacity-10 ${activeTheme.secondary}`}></div>
                {adviceLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className={`w-8 h-8 border-[3px] border-t-transparent animate-spin rounded-full ${activeTheme.textAccent}`}></div>
                    <span className="text-[10px] font-black bangla-font opacity-40 uppercase tracking-widest">তথ্য লোড হচ্ছে...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className={`text-[15px] leading-[1.8] bangla-font font-medium opacity-90 text-justify ${theme === 'midnight' ? 'text-slate-300' : 'text-gray-700'}`}>
                      {advice}
                    </p>
                    <div className="pt-4 flex items-center justify-between border-t border-current/5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${activeTheme.secondary}`}></div>
                        <span className="text-[9px] font-black bangla-font opacity-40 uppercase tracking-widest">পূণ্যফল ও শুভ লক্ষণ</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedTithi(null); }} className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all transform active:scale-95 uppercase tracking-[0.1em] bangla-font ${theme === 'midnight' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-black'}`}>বন্ধ করুন</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
      days.push(<div key={`empty-${i}`} className={`h-24 border-r border-b ${theme === 'midnight' ? 'border-slate-800 bg-slate-900/10' : 'border-gray-50 bg-gray-50/10'}`} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const tithiOnDay = sortedTithis.find(t => t.date.startsWith(dateStr));
      const isToday = todayStr === dateStr;
      const bDateInfo = getBanglaDate(new Date(year, month, d));

      days.push(
        <div key={d} className={`h-24 border-r border-b p-2 transition-all hover:bg-gray-500/5 relative flex flex-col ${theme === 'midnight' ? 'border-slate-800' : 'border-gray-100'} ${isToday ? (theme === 'midnight' ? 'bg-indigo-900/20' : 'bg-orange-50/30') : ''}`}>
          <div className="flex justify-between items-start w-full mb-1">
            <span className={`text-[9px] font-medium opacity-40 ${activeTheme.textMain}`}>{d}</span>
            <span className={`text-[11px] font-black bangla-font ${isToday ? activeTheme.textAccent : activeTheme.textMain}`}>
              {toBengaliNumber(bDateInfo.day)}
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            {tithiOnDay && (
              <div
                onClick={() => handleTithiClick(tithiOnDay)}
                className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105 w-full"
              >
                <TithiIcon type={tithiOnDay.type} size="sm" />
                <span className={`text-[7px] font-black bangla-font mt-1 opacity-90 truncate w-full text-center ${activeTheme.textMain}`}>{tithiOnDay.banglaName}</span>
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
      <header className={`backdrop-blur-xl border-b p-5 sticky top-0 z-50 transition-all duration-500 ${activeTheme.header}`}>
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme === 'midnight' ? 'bg-indigo-500/10' : 'bg-orange-500/10'}`}>
              <svg className={`w-5 h-5 ${activeTheme.textAccent}`} fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            </div>
            <div className="relative">
              <h1 className={`text-lg font-black bangla-font tracking-tight ${activeTheme.textAccent}`}>বঙ্গ তিথি দর্পণ</h1>
              <div className="flex items-center gap-1.5 mt-0.5 opacity-60">
                <span className="text-[8px] font-black uppercase tracking-widest bangla-font">{todayLabel.dayName}, {todayLabel.formatted}</span>
                {syncing && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" title="Syncing data in background..."></div>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 bg-black/5 p-1 rounded-full border border-black/5">
              {(['saffron', 'midnight', 'emerald'] as Theme[]).map(t => (
                <button key={t} onClick={() => setTheme(t)} className={`w-6 h-6 rounded-full border transition-all ${theme === t ? 'scale-110 border-white shadow-md' : 'border-transparent opacity-40 hover:opacity-100'} ${t === 'saffron' ? 'bg-orange-500' : t === 'midnight' ? 'bg-indigo-900' : 'bg-emerald-500'}`} />
              ))}
            </div>
            <button onClick={() => setShowCalendar(!showCalendar)} className={`p-2 rounded-lg border transition-all ${showCalendar ? 'bg-indigo-600 text-white border-indigo-600' : `bg-white/10 ${activeTheme.textMuted} border-current/10 hover:border-current/30`}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto mt-8 px-5">
        <FilterChips />

        {showCalendar && (
          <div className={`mb-10 rounded-[2rem] shadow-xl overflow-hidden border transition-all duration-500 animate-in slide-in-from-top-2 ${theme === 'midnight' ? 'bg-slate-950 border-slate-800' : 'bg-white border-orange-50'}`}>
            <div className={`p-4 border-b flex justify-between items-center ${theme === 'midnight' ? 'bg-slate-900/40' : 'bg-gray-50/40'}`}>
              <button onClick={() => handleDateChange(-1)} className={`p-1.5 rounded-lg transition-all ${theme === 'midnight' ? 'hover:bg-slate-800' : 'hover:bg-white shadow-sm'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg></button>
              <h3 className={`font-black uppercase tracking-[0.1em] text-[11px] ${activeTheme.textMain}`}>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h3>
              <button onClick={() => handleDateChange(1)} className={`p-1.5 rounded-lg transition-all ${theme === 'midnight' ? 'hover:bg-slate-800' : 'hover:bg-white shadow-sm'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg></button>
            </div>
            <div className={`grid grid-cols-7 border-b ${theme === 'midnight' ? 'border-slate-800' : 'border-gray-50'}`}>
              {DAYS_BN.map(day => <div key={day} className={`py-3 text-center font-black bangla-font text-[9px] uppercase opacity-50 ${activeTheme.textMain}`}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7">
              {loading ? <div className="col-span-7 h-40 flex items-center justify-center"><div className={`animate-spin h-5 w-5 border-2 border-t-transparent rounded-full ${activeTheme.textAccent}`}></div></div> : renderCalendarDays()}
            </div>
          </div>
        )}

        {/* Today's Section - Always Visible */}
        <section className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2.5 mb-6">
            <div className={`w-1.5 h-6 rounded-full ${activeTheme.secondary} shadow-md`}></div>
            <h2 className={`text-xl font-black bangla-font ${activeTheme.textMain}`}>আজকের দিন</h2>
          </div>

          {todayTithi ? (
            <CompactTithiCard t={todayTithi} isHero />
          ) : (
            <div className={`relative p-8 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-500 ${theme === 'midnight' ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white/40 border-orange-100 text-slate-500'}`}>
              <div className={`p-4 rounded-2xl mb-4 ${theme === 'midnight' ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-lg font-black bangla-font mb-1 tracking-tight">আজ কোনো বিশেষ তিথি নেই</h3>
              <p className="text-xs opacity-60 max-w-[200px] leading-relaxed">আজকের দিনটি সাধারণ। আপনার দিনটি শুভ হোক!</p>
            </div>
          )}
        </section>

        {/* Upcoming Section - Navigable batches */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className={`w-1.5 h-6 rounded-full bg-current opacity-10`}></div>
              <h2 className={`text-xl font-black bangla-font ${activeTheme.textMain}`}>
                {activeFilter === 'All' ? 'আসন্ন ' : `আসন্ন ${activeFilter === 'Festival' ? 'উৎসব' : activeFilter === 'Purnima' ? 'পূর্ণিমা' : activeFilter === 'Amavasya' ? 'অমাবস্যা' : activeFilter === 'Ekadashi' ? 'একাদশী' : activeFilter}`}
                {totalCount > 0 && <span className="text-xs opacity-40 ml-2 font-black">{toBengaliNumber(upcomingPage * 5 + 1)}-{toBengaliNumber(Math.min((upcomingPage + 1) * 5, totalCount))} ({toBengaliNumber(2026)} সালে মোট {toBengaliNumber(totalCount)}টি)</span>}
              </h2>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2 bg-black/5 p-1 rounded-2xl border border-black/5">
                <button
                  disabled={upcomingPage === 0}
                  onClick={() => {
                    setUpcomingPage(p => Math.max(0, p - 1));
                    window.scrollTo({ top: document.getElementById('upcoming-section')?.offsetTop ? document.getElementById('upcoming-section')!.offsetTop - 100 : 0, behavior: 'smooth' });
                  }}
                  className={`p-2 rounded-xl transition-all ${upcomingPage === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white shadow-sm active:scale-90 opacity-100'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span className="text-[10px] px-2 font-black bangla-font opacity-40 uppercase tracking-widest">{toBengaliNumber(upcomingPage + 1)} / {toBengaliNumber(totalPages)}</span>
                <button
                  disabled={upcomingPage >= totalPages - 1}
                  onClick={() => {
                    setUpcomingPage(p => Math.min(totalPages - 1, p + 1));
                    window.scrollTo({ top: document.getElementById('upcoming-section')?.offsetTop ? document.getElementById('upcoming-section')!.offsetTop - 100 : 0, behavior: 'smooth' });
                  }}
                  className={`p-2 rounded-xl transition-all ${upcomingPage >= totalPages - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white shadow-sm active:scale-90 opacity-100'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </div>
          <div id="upcoming-section" className="grid grid-cols-1 gap-5">
            {syncing && tithis.length === 0 ? [1, 2, 3].map(i => <div key={i} className={`h-24 rounded-[2rem] animate-pulse ${theme === 'midnight' ? 'bg-slate-900' : 'bg-gray-100'}`}></div>) :
              (paginatedTithis.length > 0 ? paginatedTithis.map((t, idx) => <CompactTithiCard key={`${t.date}-${t.name}-${idx}`} t={t} />) : (
                <div className={`p-12 rounded-[2rem] border-2 border-dashed text-center opacity-30 ${theme === 'midnight' ? 'border-slate-800' : 'border-orange-200'}`}>
                  <h3 className="text-sm font-black bangla-font">কোনো তথ্য পাওয়া যায়নি</h3>
                </div>
              ))}
          </div>

          {/* Bottom Pagination for convenience */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-6">
              <button
                disabled={upcomingPage === 0}
                onClick={() => {
                  setUpcomingPage(p => Math.max(0, p - 1));
                  window.scrollTo({ top: document.getElementById('upcoming-section')?.offsetTop ? document.getElementById('upcoming-section')!.offsetTop - 100 : 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 py-3 px-6 rounded-2xl font-black text-xs bangla-font transition-all ${upcomingPage === 0 ? 'opacity-20' : 'bg-black/5 hover:bg-black/10 active:scale-95'}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                আগের ৫টি
              </button>

              <span className="text-[10px] font-black bangla-font opacity-40 uppercase tracking-widest">{toBengaliNumber(upcomingPage + 1)} পাতা</span>

              <button
                disabled={upcomingPage >= totalPages - 1}
                onClick={() => {
                  setUpcomingPage(p => Math.min(totalPages - 1, p + 1));
                  window.scrollTo({ top: document.getElementById('upcoming-section')?.offsetTop ? document.getElementById('upcoming-section')!.offsetTop - 100 : 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 py-3 px-6 rounded-2xl font-black text-xs bangla-font transition-all ${upcomingPage >= totalPages - 1 ? 'opacity-20' : 'bg-black/5 hover:bg-black/10 active:scale-95'}`}
              >
                পরের ৫টি
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}
        </section>
      </main>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none z-50">
        <button
          onClick={() => {
            setCurrentDate(new Date());
            setShowCalendar(false);
            setActiveFilter('All');
            setSelectedTithi(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`pointer-events-auto group px-6 py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-3 border border-white/10 relative overflow-hidden ${theme === 'midnight' ? 'bg-slate-900 text-white shadow-black' : 'bg-black text-white shadow-gray-400/40'}`}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white"></div>
          <span className="bangla-font text-lg font-black relative z-10">আজকের দিন</span>
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>
        </button>
      </div>
    </div>
  );
};

export default App;
