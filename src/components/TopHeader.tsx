import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Calendar, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Menu, 
  Timer, 
  Coffee, 
  Sparkles, 
  Bell, 
  Plus, 
  Minus,
  CheckCircle2
} from 'lucide-react';

interface TopHeaderProps {
  darkMode: boolean;
  profileName?: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  darkMode,
  profileName = 'Developer',
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  // --- Live Clock State ---
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Helpers
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hoursStr = hours.toString().padStart(2, '0');
    return { hoursStr, minutes, seconds, ampm };
  };

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    
    return { dayName, dayStr: `${dayOfMonth} ${monthName} ${year}` };
  };

  const { hoursStr, minutes, seconds, ampm } = formatTime(currentTime);
  const { dayName, dayStr } = formatDate(currentTime);

  // --- Focus Timer State ---
  const [timerDuration, setTimerDuration] = useState(25 * 60); // Default 25 min
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState<'pomodoro' | 'deepFocus' | 'shortBreak' | 'longBreak' | 'custom'>('pomodoro');
  const [isMuted, setIsMuted] = useState(false);
  const [customInputVal, setCustomInputVal] = useState('45');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reference for precise interval handling
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle timer ticker
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer Finished!
            triggerCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Trigger synthesized sweet bell chime on completion
  const triggerCompletion = () => {
    setIsRunning(false);
    setSessionsCompleted((prev) => prev + 1);
    
    if (!isMuted) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Warm dual-tone synthesized bell
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc1.type = 'sine';
        osc2.type = 'triangle';
        
        // E5 (659.25 Hz) & A5 (880.00 Hz) harmonious chime
        osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime);
        osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime);
        
        // Chime sequence
        osc1.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.15);
        osc2.frequency.setValueAtTime(1318.51, audioCtx.currentTime + 0.15); // E6
        
        gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc1.start();
        osc2.start();
        
        osc1.stop(audioCtx.currentTime + 1.2);
        osc2.stop(audioCtx.currentTime + 1.2);
      } catch (err) {
        console.warn('Audio synthesis blocked by browser auto-play policy', err);
      }
    }

    // Flash or visual notification (Notion-style non-blocking toast)
    setToastMessage(`Your focus session is completed successfully! Take a well-deserved break.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  // Change preset types
  const handlePresetChange = (type: 'pomodoro' | 'deepFocus' | 'shortBreak' | 'longBreak', minutes: number) => {
    setIsRunning(false);
    setTimerType(type);
    setTimerDuration(minutes * 60);
    setTimeLeft(minutes * 60);
    setShowCustomInput(false);
  };

  // Apply custom duration
  const applyCustomDuration = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customInputVal, 10);
    if (!isNaN(mins) && mins > 0 && mins <= 180) {
      setIsRunning(false);
      setTimerType('custom');
      setTimerDuration(mins * 60);
      setTimeLeft(mins * 60);
      setShowCustomInput(false);
    }
  };

  const handleQuickAdjust = (amountSeconds: number) => {
    setTimeLeft((prev) => {
      const newVal = prev + amountSeconds;
      return newVal < 0 ? 0 : newVal;
    });
  };

  // Progress calculations
  const progressPercent = ((timerDuration - timeLeft) / timerDuration) * 100;
  
  // Format MM:SS
  const formatTimerString = (secondsCount: number) => {
    const m = Math.floor(secondsCount / 60).toString().padStart(2, '0');
    const s = (secondsCount % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <header className={`border-b transition-all duration-300 ${
      darkMode 
        ? 'bg-neutral-950/80 border-neutral-800 text-neutral-100' 
        : 'bg-white/80 border-neutral-200 text-neutral-800'
    } backdrop-blur-md sticky top-0 z-40 px-4 py-3 md:px-6`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Left Side: Brand/Hamburger & Welcome info */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              title="Toggle Sidebar"
            >
              <Menu size={18} />
            </button>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm tracking-tight text-neutral-800 dark:text-neutral-100">
                  {profileName}'s Tracker
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 hidden sm:block">
                Workspace Active & Synchronized
              </p>
            </div>
          </div>

          {/* Vertical Divider (Desktop Only) */}
          <div className="hidden md:block h-6 w-px bg-neutral-200 dark:bg-neutral-800" />

          {/* Date & Day Badge */}
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
            <Calendar size={13} className="text-blue-500 shrink-0" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{dayName}</span>
            <span className="opacity-40">•</span>
            <span>{dayStr}</span>
          </div>
        </div>

        {/* Right Side: POMODORO/STUDY FOCUS TIMER & LIVE DIGITAL CLOCK */}
        <div className="flex flex-wrap items-center gap-3 md:gap-5 justify-between md:justify-end">
          
          {/* FOCUS TIMER CARD */}
          <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border relative overflow-hidden transition-all duration-300 ${
            isRunning 
              ? 'border-emerald-500/30 bg-emerald-500/[0.02]' 
              : darkMode 
                ? 'bg-neutral-900/40 border-neutral-800/80' 
                : 'bg-neutral-50/60 border-neutral-200'
          }`}>
            
            {/* Subtle Progress Bar overlay at the bottom */}
            <div 
              className="absolute bottom-0 left-0 h-0.5 bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />

            {/* Timer Type Selector Pill */}
            <div className="flex items-center gap-1">
              <Timer size={14} className={isRunning ? 'text-emerald-500 animate-pulse' : 'text-neutral-400'} />
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-neutral-400 dark:text-neutral-500 hidden sm:inline">
                {timerType === 'pomodoro' ? 'Pomodoro' : 
                 timerType === 'deepFocus' ? 'Deep Focus' :
                 timerType === 'shortBreak' ? 'Short Break' :
                 timerType === 'longBreak' ? 'Long Break' : 'Custom'}
              </span>
            </div>

            {/* Live Count */}
            <div className="font-mono text-sm font-semibold tracking-tight tabular-nums min-w-[42px] text-center">
              {formatTimerString(timeLeft)}
            </div>

            {/* Quick +/- Control Buttons */}
            <div className="flex items-center">
              <button 
                onClick={() => handleQuickAdjust(-60)} 
                className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
                title="Subtract 1 minute"
              >
                <Minus size={11} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200" />
              </button>
              <button 
                onClick={() => handleQuickAdjust(60)} 
                className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
                title="Add 1 minute"
              >
                <Plus size={11} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />

            {/* Start/Pause and Reset Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`p-1.5 rounded-lg transition-all ${
                  isRunning 
                    ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' 
                    : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                }`}
                title={isRunning ? 'Pause Timer' : 'Start Focus Session'}
              >
                {isRunning ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
              </button>

              <button
                onClick={() => {
                  setIsRunning(false);
                  setTimeLeft(timerDuration);
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Reset Timer"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            {/* Config & Presets Dropdown/Trigger */}
            <div className="flex items-center gap-1 ml-0.5 border-l border-neutral-200 dark:border-neutral-800 pl-1.5">
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className={`p-1 rounded text-xs font-mono transition-colors ${
                  showCustomInput 
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200' 
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
                }`}
                title="Timer Presets & Custom Configuration"
              >
                ⚙️
              </button>

              {/* Sound Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                title={isMuted ? 'Unmute alerts' : 'Mute alerts'}
              >
                {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </button>
            </div>

            {/* Sessions completed count */}
            {sessionsCompleted > 0 && (
              <div className="flex items-center gap-1 text-[10px] font-mono bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-md ml-1" title="Sessions completed in current browser run">
                <CheckCircle2 size={10} />
                <span>x{sessionsCompleted}</span>
              </div>
            )}
          </div>

          {/* LIVE DIGITAL CLOCK PILL */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs font-medium tracking-tight shadow-sm ${
            darkMode 
              ? 'bg-neutral-900/60 border-neutral-800/80 text-neutral-200' 
              : 'bg-white border-neutral-200 text-neutral-700'
          }`}>
            <Clock size={13} className="text-purple-500 shrink-0" />
            
            <div className="flex items-center gap-0.5 select-none tabular-nums font-semibold">
              <span className="text-neutral-800 dark:text-neutral-100">{hoursStr}</span>
              <span className="animate-pulse font-sans font-bold text-neutral-400">:</span>
              <span className="text-neutral-800 dark:text-neutral-100">{minutes}</span>
              <span className="animate-pulse font-sans font-bold text-neutral-400">:</span>
              <span className="text-neutral-400 dark:text-neutral-500 text-[10px]">{seconds}</span>
              <span className="ml-1 text-[10px] uppercase font-bold text-neutral-400">{ampm}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Custom Floating Toast Alert (Notion / Linear Style) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-2xl ${
            darkMode 
              ? 'bg-neutral-900 border-neutral-800 text-neutral-100' 
              : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
              <Sparkles size={16} />
            </span>
            <div className="text-xs">
              <span className="font-bold block">Focus Session Ended!</span>
              <span className="text-neutral-400 dark:text-neutral-500">{toastMessage}</span>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 font-semibold ml-2 text-sm px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Popover Presets Container */}
      {showCustomInput && (
        <div className={`mt-2.5 mx-auto max-w-7xl p-3 rounded-xl border animate-fadeIn transition-all shadow-lg text-xs ${
          darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-600'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Quick presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold mr-1">Presets:</span>
              <button
                onClick={() => handlePresetChange('pomodoro', 25)}
                className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                  timerType === 'pomodoro' 
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                🍅 Pomodoro (25m)
              </button>
              <button
                onClick={() => handlePresetChange('deepFocus', 50)}
                className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                  timerType === 'deepFocus' 
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                ⚡ Deep Focus (50m)
              </button>
              <button
                onClick={() => handlePresetChange('shortBreak', 5)}
                className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                  timerType === 'shortBreak' 
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                ☕ Break (5m)
              </button>
              <button
                onClick={() => handlePresetChange('longBreak', 15)}
                className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                  timerType === 'longBreak' 
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                🌴 Long Break (15m)
              </button>
            </div>

            {/* Custom Minutes form */}
            <form onSubmit={applyCustomDuration} className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Custom Mins:</span>
              <input
                type="number"
                min="1"
                max="180"
                value={customInputVal}
                onChange={(e) => setCustomInputVal(e.target.value)}
                className={`w-12 px-1.5 py-0.5 text-center rounded border outline-none font-semibold ${
                  darkMode 
                    ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700' 
                    : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                }`}
              />
              <button
                type="submit"
                className="px-2 py-0.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded hover:opacity-90 font-medium"
              >
                Set
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
