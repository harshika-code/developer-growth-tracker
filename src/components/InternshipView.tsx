import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Star, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Building2, 
  Calendar, 
  AlertCircle, 
  FileText 
} from 'lucide-react';
import { InternshipOpportunity } from '../types';

interface InternshipViewProps {
  internships: InternshipOpportunity[];
  setInternships: (internships: InternshipOpportunity[]) => void;
  darkMode: boolean;
  globalSearch: string;
  showFavouritesOnly: boolean;
}

export const InternshipView: React.FC<InternshipViewProps> = ({
  internships,
  setInternships,
  darkMode,
  globalSearch,
  showFavouritesOnly,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<InternshipOpportunity | null>(null);

  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formStatus, setFormStatus] = useState<'Saved' | 'Applied' | 'Interview' | 'Selected' | 'Rejected'>('Saved');
  const [formNotes, setFormNotes] = useState('');
  const [formIsFav, setFormIsFav] = useState(false);

  const filteredInternships = useMemo(() => {
    return internships.filter(opp => {
      const searchStr = `${opp.company} ${opp.role} ${opp.notes} ${opp.status}`.toLowerCase();
      const matchesGlobal = searchStr.includes(globalSearch.toLowerCase());
      const matchesLocal = searchStr.includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'All' || opp.status === statusFilter;
      const matchesFav = !showFavouritesOnly || opp.isFavourite;

      return matchesGlobal && matchesLocal && matchesStatus && matchesFav;
    });
  }, [internships, globalSearch, search, statusFilter, showFavouritesOnly]);

  const handleOpenCreate = () => {
    setEditingOpp(null);
    setFormCompany('');
    setFormRole('');
    setFormLink('');
    setFormDeadline(new Date().toISOString().split('T')[0]);
    setFormStatus('Saved');
    setFormNotes('');
    setFormIsFav(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (opp: InternshipOpportunity) => {
    setEditingOpp(opp);
    setFormCompany(opp.company);
    setFormRole(opp.role);
    setFormLink(opp.link);
    setFormDeadline(opp.deadline);
    setFormStatus(opp.status);
    setFormNotes(opp.notes);
    setFormIsFav(opp.isFavourite);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      setInternships(internships.filter(opp => opp.id !== id));
    }
  };

  const handleToggleFav = (opp: InternshipOpportunity) => {
    setInternships(internships.map(o => o.id === opp.id ? { ...o, isFavourite: !o.isFavourite } : o));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany.trim() || !formRole.trim()) return;

    if (editingOpp) {
      setInternships(internships.map(o => o.id === editingOpp.id ? {
        ...o,
        company: formCompany,
        role: formRole,
        link: formLink,
        deadline: formDeadline,
        status: formStatus,
        notes: formNotes,
        isFavourite: formIsFav
      } : o));
    } else {
      const newOpp: InternshipOpportunity = {
        id: `opp-${Date.now()}`,
        company: formCompany,
        role: formRole,
        link: formLink,
        deadline: formDeadline,
        status: formStatus,
        notes: formNotes,
        isFavourite: formIsFav
      };
      setInternships([newOpp, ...internships]);
    }
    setIsFormOpen(false);
  };

  const handleStatusChange = (id: string, nextStatus: 'Saved' | 'Applied' | 'Interview' | 'Selected' | 'Rejected') => {
    setInternships(internships.map(o => o.id === id ? { ...o, status: nextStatus } : o));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Opportunities Tracker</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Track job applications, schedule deadlines, log interview tasks, and manage correspondence status.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
        >
          <Plus size={14} />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search company, job role, status, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs outline-none border transition-all ${
                darkMode
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 placeholder-neutral-500 focus:border-neutral-700'
                  : 'bg-white border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:border-neutral-300'
              }`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-xs outline-none border ${
              darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'
            }`}
          >
            <option value="All">All Statuses</option>
            <option value="Saved">Saved</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <span className="text-xs font-mono text-neutral-400">
          Opportunities mapped: {filteredInternships.length}
        </span>
      </div>

      {/* Opportunities Table */}
      <div className={`overflow-x-auto rounded-xl border ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className={`border-b text-xs uppercase font-mono tracking-wider ${
              darkMode ? 'bg-neutral-950/80 border-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-500'
            }`}>
              <th className="p-4 w-10"></th>
              <th className="p-4">Company & Position</th>
              <th className="p-4 w-32">Status</th>
              <th className="p-4 w-36">Deadline</th>
              <th className="p-4">Process Notes</th>
              <th className="p-4 w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={darkMode ? 'divide-y divide-neutral-800' : 'divide-y divide-neutral-200'}>
            {filteredInternships.map((opp) => {
              const statusColor =
                opp.status === 'Selected'
                  ? 'text-green-500 bg-green-500/10'
                  : opp.status === 'Interview'
                    ? 'text-purple-500 bg-purple-500/10'
                    : opp.status === 'Applied'
                      ? 'text-blue-500 bg-blue-500/10'
                      : opp.status === 'Rejected'
                        ? 'text-red-500 bg-red-500/10'
                        : 'text-neutral-400 bg-neutral-400/10';

              return (
                <tr 
                  key={opp.id} 
                  className={`group transition-colors ${
                    darkMode ? 'hover:bg-neutral-900/40' : 'hover:bg-neutral-50'
                  }`}
                >
                  {/* Favourite */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleFav(opp)}
                      className={`transition-colors ${
                        opp.isFavourite 
                          ? 'text-amber-500' 
                          : 'text-neutral-300 dark:text-neutral-700 hover:text-amber-500'
                      }`}
                    >
                      <Star size={14} fill={opp.isFavourite ? 'currentColor' : 'none'} />
                    </button>
                  </td>

                  {/* Company & Role */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 font-medium text-neutral-900 dark:text-neutral-100">
                        <Building2 size={13} className="text-neutral-400 shrink-0" />
                        {opp.link ? (
                          <a
                            href={opp.link.startsWith('http') ? opp.link : `https://${opp.link}`}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1 group/link"
                          >
                            <span>{opp.company}</span>
                            <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-60 transition-opacity" />
                          </a>
                        ) : (
                          <span>{opp.company}</span>
                        )}
                      </div>
                      <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{opp.role}</span>
                    </div>
                  </td>

                  {/* Status dropdown */}
                  <td className="p-4">
                    <select
                      value={opp.status}
                      onChange={(e) => handleStatusChange(opp.id, e.target.value as any)}
                      className={`px-2 py-1 rounded text-xs border bg-transparent font-medium cursor-pointer outline-none ${statusColor} ${
                        darkMode ? 'border-neutral-800' : 'border-neutral-200'
                      }`}
                    >
                      <option value="Saved" className={darkMode ? 'bg-neutral-900 text-neutral-300' : 'bg-white text-neutral-700'}>Saved</option>
                      <option value="Applied" className={darkMode ? 'bg-neutral-900 text-neutral-300' : 'bg-white text-neutral-700'}>Applied</option>
                      <option value="Interview" className={darkMode ? 'bg-neutral-900 text-neutral-300' : 'bg-white text-neutral-700'}>Interview</option>
                      <option value="Selected" className={darkMode ? 'bg-neutral-900 text-neutral-300' : 'bg-white text-neutral-700'}>Selected</option>
                      <option value="Rejected" className={darkMode ? 'bg-neutral-900 text-neutral-300' : 'bg-white text-neutral-700'}>Rejected</option>
                    </select>
                  </td>

                  {/* Deadline */}
                  <td className="p-4 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="opacity-70" />
                      <span>{opp.deadline || 'No deadline'}</span>
                    </div>
                  </td>

                  {/* Notes text */}
                  <td className="p-4">
                    <div className="flex items-start gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 max-w-sm md:max-w-md">
                      <FileText size={12} className="shrink-0 mt-0.5 opacity-60" />
                      <span className="line-clamp-2 italic">{opp.notes || 'No process notes.'}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(opp)}
                        className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                        title="Edit Opportunity"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(opp.id)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-neutral-400 hover:text-red-500"
                        title="Delete Opportunity"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredInternships.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-sm text-neutral-400 dark:text-neutral-500 italic">
                  No opportunities match your current filters. Click &quot;Add Opportunity&quot; to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Side-Drawer Form Modal for Add/Edit */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h2 className="text-lg font-display font-semibold mb-4">
              {editingOpp ? '✏ Edit Opportunity' : '➕ Add Opportunity'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Job Role / Position *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontend Intern"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Job Description / Portal Link
                </label>
                <input
                  type="text"
                  placeholder="https://careers.google.com/..."
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Application Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200'
                        : 'bg-white border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Apply Deadline
                  </label>
                  <input
                    type="date"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Process Notes (Interviews, requirements, tasks...)
                </label>
                <textarea
                  placeholder="Need to review DBMS and operating system threads. OA is on HackerRank..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all resize-none ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="formIsFav"
                  checked={formIsFav}
                  onChange={(e) => setFormIsFav(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
                />
                <label htmlFor="formIsFav" className="text-xs text-neutral-500 dark:text-neutral-400 cursor-pointer select-none">
                  ⭐ Mark as High Priority Opportunity
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    darkMode
                      ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-300'
                      : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
