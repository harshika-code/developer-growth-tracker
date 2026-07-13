import React, { useState } from 'react';
import { Award, Briefcase, Plus, Trash2, Edit2, Calendar, FileText, AlertCircle, TrendingUp, Save } from 'lucide-react';
import { InterviewLog } from '../types';

interface InterviewTrackerViewProps {
  interviews: InterviewLog[];
  setInterviews: (logs: InterviewLog[]) => void;
  darkMode: boolean;
}

export const InterviewTrackerView: React.FC<InterviewTrackerViewProps> = ({
  interviews,
  setInterviews,
  darkMode
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('2026-07-12');
  const [round, setRound] = useState('');
  const [status, setStatus] = useState<InterviewLog['status']>('Scheduled');
  const [questionsString, setQuestionsString] = useState('');
  const [mistakes, setMistakes] = useState('');
  const [improvements, setImprovements] = useState('');
  const [notes, setNotes] = useState('');

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleAddInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const parsedQuestions = questionsString
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    const added: InterviewLog = {
      id: `int-log-${Date.now()}`,
      company,
      role,
      date,
      round,
      status,
      questions: parsedQuestions.length > 0 ? parsedQuestions : [questionsString],
      mistakes,
      improvements,
      notes
    };

    setInterviews([added, ...interviews]);
    resetForm();
  };

  const resetForm = () => {
    setCompany('');
    setRole('');
    setDate('2026-07-12');
    setRound('');
    setStatus('Scheduled');
    setQuestionsString('');
    setMistakes('');
    setImprovements('');
    setNotes('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setInterviews(interviews.filter(i => i.id !== id));
  };

  // Filtered interviews
  const filtered = interviews.filter(i => {
    if (filterStatus === 'all') return true;
    return i.status.toLowerCase() === filterStatus.toLowerCase();
  });

  // Calculate statistics
  const totalRounds = interviews.length;
  const completedCount = interviews.filter(i => i.status === 'Completed').length;
  const offeredCount = interviews.filter(i => i.status === 'Offered').length;
  const pendingCount = interviews.filter(i => i.status === 'Scheduled').length;

  return (
    <div className="space-y-8 animate-fade-in" id="interview-tracker-container">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display font-bold text-2xl tracking-tight">Interview Loop Tracker</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Log technical interview loops, record behavioral questions, isolate mistakes, and plan direct recovery steps.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-semibold shadow-sm cursor-pointer transition-all"
        >
          <Plus size={14} />
          <span>{showAddForm ? "View Logs" : "Add Interview Loop"}</span>
        </button>
      </div>

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="kpi-panel">
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
        }`}>
          <p className="text-xs text-neutral-400 font-medium">Total Rounds Tracked</p>
          <h3 className="text-2xl font-bold mt-1 text-neutral-200 dark:text-white">{totalRounds}</h3>
        </div>
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
        }`}>
          <p className="text-xs text-neutral-400 font-medium">Offers Received</p>
          <h3 className="text-2xl font-bold mt-1 text-emerald-500">{offeredCount}</h3>
        </div>
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
        }`}>
          <p className="text-xs text-neutral-400 font-medium">Completed Loops</p>
          <h3 className="text-2xl font-bold mt-1 text-blue-500">{completedCount}</h3>
        </div>
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
        }`}>
          <p className="text-xs text-neutral-400 font-medium">Upcoming Interviews</p>
          <h3 className="text-2xl font-bold mt-1 text-amber-500">{pendingCount}</h3>
        </div>
      </div>

      {/* Add Interview Form */}
      {showAddForm ? (
        <form onSubmit={handleAddInterview} className={`p-6 rounded-xl border space-y-6 ${
          darkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200'
        }`} id="add-interview-form">
          <h2 className="font-display font-bold text-base">Record a New Recruitment Round</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium opacity-70">Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Google, Microsoft"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-md border outline-none ${
                  darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-neutral-700' : 'bg-white border-neutral-200 focus:border-neutral-300'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium opacity-70">Target Role</label>
              <input
                type="text"
                required
                placeholder="e.g. SWE Intern, Backend Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-md border outline-none ${
                  darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-neutral-700' : 'bg-white border-neutral-200 focus:border-neutral-300'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium opacity-70">Interview Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className={`w-full px-3 py-2 text-xs rounded-md border outline-none ${
                  darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200'
                }`}
              >
                <option value="Scheduled">Scheduled (Upcoming)</option>
                <option value="Completed">Completed (Evaluating)</option>
                <option value="Offered">Offer Received 🎉</option>
                <option value="Rejected">Round Rejected</option>
                <option value="Pending">Pending Callback</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium opacity-70">Round Description</label>
              <input
                type="text"
                placeholder="e.g. Technical Screening, Hiring Manager round"
                value={round}
                onChange={(e) => setRound(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-md border outline-none ${
                  darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium opacity-70">Interview Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-md border outline-none ${
                  darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200'
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium opacity-70">Questions Asked (One question per line)</label>
            <textarea
              rows={3}
              placeholder="e.g. Find the maximum subset sum in O(n)\nDesign a rate-limiter system architecture."
              value={questionsString}
              onChange={(e) => setQuestionsString(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-md border outline-none font-sans ${
                darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-neutral-700' : 'bg-white border-neutral-200 focus:border-neutral-300'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-red-500">Mistakes Committed</label>
              <textarea
                rows={3}
                placeholder="Where did you get stuck? Mention code blunders or nervous pauses."
                value={mistakes}
                onChange={(e) => setMistakes(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-md border outline-none ${
                  darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-red-700' : 'bg-white border-neutral-200 focus:border-red-300'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-emerald-500">Concrete Improvement Action Items</label>
              <textarea
                rows={3}
                placeholder="What to study or practice before the next round to prevent repeating these?"
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-md border outline-none ${
                  darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-emerald-700' : 'bg-white border-neutral-200 focus:border-emerald-300'
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium opacity-70">Additional Loop Notes</label>
            <textarea
              rows={2}
              placeholder="Hiring manager parameters, overall feelings, follow up expectations."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-md border outline-none ${
                darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-neutral-700' : 'bg-white border-neutral-200 focus:border-neutral-300'
              }`}
            />
          </div>

          <div className="flex gap-3 justify-end pt-3">
            <button
              type="button"
              onClick={resetForm}
              className={`px-4 py-2 rounded-lg text-xs font-medium border ${
                darkMode ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-400' : 'border-neutral-200 hover:bg-neutral-100 text-neutral-600'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-semibold cursor-pointer"
            >
              <Save size={12} />
              <span>Save Interview Record</span>
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* Filters Bar */}
          <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex gap-2">
              {['all', 'Scheduled', 'Completed', 'Offered', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    filterStatus === status
                      ? 'bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 font-semibold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {status === 'all' ? 'All Logs' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Interview List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="interview-list-grid">
            {filtered.map((log) => (
              <div
                key={log.id}
                className={`p-6 rounded-xl border flex flex-col gap-4 transition-all ${
                  darkMode 
                    ? 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700' 
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex justify-between items-start border-b pb-3 border-neutral-200 dark:border-neutral-800">
                  <div className="space-y-0.5">
                    <h3 className="font-display font-bold text-base text-neutral-200 dark:text-white">
                      {log.company}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {log.role} • <span className="italic">{log.round}</span>
                    </p>
                  </div>

                  <span className={`text-[10px] uppercase font-mono px-2 py-1 rounded font-semibold ${
                    log.status === 'Offered'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : log.status === 'Scheduled'
                      ? 'bg-amber-500/10 text-amber-500'
                      : log.status === 'Rejected'
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {log.status}
                  </span>
                </div>

                {/* Questions asked */}
                {log.questions && log.questions.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">Questions Asked</p>
                    <div className="flex flex-col gap-1 text-xs pl-2 border-l border-neutral-200 dark:border-neutral-800 text-neutral-300 dark:text-neutral-200">
                      {log.questions.map((q, idx) => (
                        <p key={idx} className="font-mono text-xs">{q}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mistakes made */}
                {log.mistakes && (
                  <div className="space-y-1 p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-xs">
                    <p className="font-semibold text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      <span>Blunders & Obstacles</span>
                    </p>
                    <p className="text-neutral-300 leading-relaxed pl-4">{log.mistakes}</p>
                  </div>
                )}

                {/* Improvements needed */}
                {log.improvements && (
                  <div className="space-y-1 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-xs">
                    <p className="font-semibold text-emerald-400 flex items-center gap-1">
                      <TrendingUp size={12} />
                      <span>Direct Recovery Action</span>
                    </p>
                    <p className="text-neutral-300 leading-relaxed pl-4">{log.improvements}</p>
                  </div>
                )}

                {/* Date and Delete actions */}
                <div className="flex justify-between items-center text-[10px] text-neutral-400 mt-auto border-t pt-3 border-neutral-200 dark:border-neutral-800">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    <span>Interview Date: {log.date}</span>
                  </span>
                  
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="p-1 rounded text-neutral-400 hover:text-red-500 hover:bg-neutral-800 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="md:col-span-2 text-center py-12 text-neutral-400 italic">
                No interview logs recorded.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
