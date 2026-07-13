import React, { useState } from 'react';
import { Calendar, Plus, RefreshCw, Clock, CheckCircle2, AlertTriangle, Trash2, CalendarDays } from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarSyncViewProps {
  events: CalendarEvent[];
  setEvents: (evs: CalendarEvent[]) => void;
  darkMode: boolean;
}

export const CalendarSyncView: React.FC<CalendarSyncViewProps> = ({
  events,
  setEvents,
  darkMode
}) => {
  const [loading, setLoading] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-07-13');
  const [newEventTime, setNewEventTime] = useState('12:00');
  const [newEventType, setNewEventType] = useState<'study' | 'task' | 'exam' | 'other'>('study');

  const handleSyncGoogleCalendar = () => {
    setLoading(true);
    // Simulate Workspace Google Calendar API syncing
    setTimeout(() => {
      const updated = events.map(e => ({ ...e, synced: true }));
      setEvents(updated);
      setLoading(false);
    }, 1200);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const added: CalendarEvent = {
      id: `cal-${Date.now()}`,
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime,
      type: newEventType,
      synced: false
    };

    setEvents([...events, added]);
    setNewEventTitle('');
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const toggleSyncStatus = (id: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, synced: !e.synced } : e));
  };

  // Quick helper to render day calendars
  const renderCalendarDays = () => {
    // Let's draw July 2026 calendar block starting on Wednesday (July 1st)
    const daysInJuly = 31;
    const startOffset = 3; // Wednesday
    const totalSlots = 35; // 5 weeks grid

    const grid = [];
    for (let i = 0; i < totalSlots; i++) {
      const dayNum = i + 1 - startOffset;
      const isValidDay = dayNum > 0 && dayNum <= daysInJuly;
      const formattedDate = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
      
      const dayEvents = isValidDay ? events.filter(e => e.date === formattedDate) : [];

      grid.push({
        dayNum: isValidDay ? dayNum : null,
        dateString: formattedDate,
        events: dayEvents,
        isToday: dayNum === 12 // July 12, 2026 is current simulated local date
      });
    }

    return (
      <div className="grid grid-cols-7 gap-1 text-center font-sans">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-xs font-semibold uppercase opacity-60 py-2">
            {d}
          </div>
        ))}
        {grid.map((slot, i) => (
          <div
            key={i}
            className={`min-h-[85px] border p-1 rounded-lg flex flex-col gap-1 transition-all ${
              darkMode 
                ? slot.isToday 
                  ? 'bg-neutral-800 border-neutral-700 ring-1 ring-neutral-700' 
                  : 'bg-neutral-950/60 border-neutral-900 hover:bg-neutral-900/40'
                : slot.isToday
                  ? 'bg-neutral-100 border-neutral-300 ring-1 ring-neutral-300'
                  : 'bg-white border-neutral-100 hover:bg-neutral-50'
            }`}
          >
            {slot.dayNum && (
              <div className="flex justify-between items-center px-1">
                <span className={`text-[11px] font-semibold ${
                  slot.isToday ? 'text-blue-500' : 'text-neutral-400'
                }`}>
                  {slot.dayNum}
                </span>
                {slot.isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Today" />
                )}
              </div>
            )}
            <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[60px] scrollbar-thin">
              {slot.events.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => toggleSyncStatus(ev.id)}
                  title={`${ev.title} (${ev.time}) - Click to toggle Google Calendar sync`}
                  className={`text-[9px] px-1.5 py-0.5 rounded font-medium truncate cursor-pointer select-none transition-all ${
                    ev.type === 'exam'
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                      : ev.type === 'study'
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                  } ${ev.synced ? 'opacity-100' : 'opacity-70 line-through'}`}
                >
                  {ev.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in" id="calendar-sync-container">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display font-bold text-2xl tracking-tight">Calendar Sync</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Schedule study blocks, track deadlines, and sync your workload with Google Calendar.
          </p>
        </div>

        <button
          onClick={handleSyncGoogleCalendar}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Synchronizing..." : "Sync with Google Calendar"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main interactive calendar grid */}
        <div className={`p-6 rounded-xl border xl:col-span-2 flex flex-col gap-4 ${
          darkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200'
        }`} id="calendar-grid-card">
          <div className="flex items-center justify-between border-b pb-3 border-neutral-200 dark:border-neutral-800">
            <h2 className="font-display font-bold text-base flex items-center gap-2">
              <CalendarDays className="text-blue-500" size={18} />
              <span>July 2026</span>
            </h2>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Study Session</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-500">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Tasks</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-500">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Exams/Deadlines</span>
              </div>
            </div>
          </div>

          {renderCalendarDays()}
        </div>

        {/* Create and list sidebars */}
        <div className="space-y-6">
          {/* Quick Add Event Form */}
          <div className={`p-6 rounded-xl border flex flex-col gap-4 ${
            darkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200'
          }`} id="add-event-card">
            <h2 className="font-display font-bold text-base">Quick-Add Calendar Event</h2>
            
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium opacity-70">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tree Traversal Practice"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-md outline-none border ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-neutral-700' : 'bg-white border-neutral-200 focus:border-neutral-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium opacity-70">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-md outline-none border ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium opacity-70">Time</label>
                  <input
                    type="time"
                    required
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-md outline-none border ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium opacity-70">Category Type</label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as any)}
                  className={`w-full px-3 py-2 text-xs rounded-md outline-none border ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200'
                  }`}
                >
                  <option value="study">Study Session</option>
                  <option value="task">Productivity Task</option>
                  <option value="exam">Exam or Application Deadline</option>
                  <option value="other">Other Event</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-semibold transition-all cursor-pointer"
              >
                Schedule & Add Event
              </button>
            </form>
          </div>

          {/* List view and Sync warnings */}
          <div className={`p-6 rounded-xl border flex flex-col gap-4 ${
            darkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200'
          }`} id="sync-warnings-card">
            <h2 className="font-display font-bold text-base">Unsynced Reminders</h2>
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-3 rounded-lg border flex justify-between items-center gap-2 ${
                    darkMode ? 'bg-neutral-950/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="space-y-1 truncate">
                    <p className="font-semibold text-xs truncate text-neutral-100 dark:text-white">{ev.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                      <Clock size={10} />
                      <span>{ev.date} at {ev.time}</span>
                      <span className={`px-1 rounded-full text-[8px] uppercase ${
                        ev.synced ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {ev.synced ? 'Synced' : 'Local'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleSyncStatus(ev.id)}
                      className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
                      title={ev.synced ? "Remove from GCal Sync" : "Sync to GCal"}
                    >
                      {ev.synced ? <CheckCircle2 size={13} className="text-emerald-500" /> : <AlertTriangle size={13} className="text-amber-500" />}
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-xs text-neutral-400 italic text-center py-4">No events scheduled yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
