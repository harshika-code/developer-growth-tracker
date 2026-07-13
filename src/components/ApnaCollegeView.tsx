import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Star, 
  Edit, 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  BookOpen, 
  HelpCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Award,
  BookMarked
} from 'lucide-react';
import { DSATopic, WebDevTopic, DSAProblem } from '../types';

interface ApnaCollegeViewProps {
  dsaTopics: DSATopic[];
  setDsaTopics: (topics: DSATopic[]) => void;
  webDevTopics: WebDevTopic[];
  setWebDevTopics: (topics: WebDevTopic[]) => void;
  darkMode: boolean;
  globalSearch: string;
  showFavouritesOnly: boolean;
}

export const ApnaCollegeView: React.FC<ApnaCollegeViewProps> = ({
  dsaTopics,
  setDsaTopics,
  webDevTopics,
  setWebDevTopics,
  darkMode,
  globalSearch,
  showFavouritesOnly,
}) => {
  const [activeTab, setActiveTab] = useState<'dsa' | 'web'>('dsa');
  const [search, setSearch] = useState('');
  const [expandedDsaId, setExpandedDsaId] = useState<string | null>('dsa-1');

  // Topic modals
  const [isDsaTopicModalOpen, setIsDsaTopicModalOpen] = useState(false);
  const [editingDsaTopic, setEditingDsaTopic] = useState<DSATopic | null>(null);
  const [dsaTopicName, setDsaTopicName] = useState('');
  const [dsaTopicNotes, setDsaTopicNotes] = useState('');
  const [dsaTopicIsFav, setDsaTopicIsFav] = useState(false);

  // Problem modal
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [targetDsaTopicId, setTargetDsaTopicId] = useState<string | null>(null);
  const [editingProblem, setEditingProblem] = useState<DSAProblem | null>(null);
  const [probName, setProbName] = useState('');
  const [probLink, setProbLink] = useState('');
  const [probStatus, setProbStatus] = useState<'Todo' | 'Solving' | 'Completed'>('Todo');
  const [probNotes, setProbNotes] = useState('');

  // Web topic modal
  const [isWebTopicModalOpen, setIsWebTopicModalOpen] = useState(false);
  const [editingWebTopic, setEditingWebTopic] = useState<WebDevTopic | null>(null);
  const [webTopicName, setWebTopicName] = useState('');
  const [webTopicStatus, setWebTopicStatus] = useState<'Todo' | 'In Progress' | 'Completed'>('Todo');
  const [webTopicNotes, setWebTopicNotes] = useState('');
  const [webTopicIsFav, setWebTopicIsFav] = useState(false);

  // Filters
  const filteredDsaTopics = useMemo(() => {
    return dsaTopics.filter(topic => {
      const probSearchStr = topic.problems.map(p => `${p.name} ${p.notes}`).join(' ');
      const searchStr = `${topic.name} ${topic.notes} ${probSearchStr}`.toLowerCase();
      const matchesGlobal = searchStr.includes(globalSearch.toLowerCase());
      const matchesLocal = searchStr.includes(search.toLowerCase());
      const matchesFav = !showFavouritesOnly || topic.isFavourite;
      return matchesGlobal && matchesLocal && matchesFav;
    });
  }, [dsaTopics, globalSearch, search, showFavouritesOnly]);

  const filteredWebTopics = useMemo(() => {
    return webDevTopics.filter(topic => {
      const searchStr = `${topic.name} ${topic.notes} ${topic.status}`.toLowerCase();
      const matchesGlobal = searchStr.includes(globalSearch.toLowerCase());
      const matchesLocal = searchStr.includes(search.toLowerCase());
      const matchesFav = !showFavouritesOnly || topic.isFavourite;
      return matchesGlobal && matchesLocal && matchesFav;
    });
  }, [webDevTopics, globalSearch, search, showFavouritesOnly]);

  // DSA Topic Actions
  const handleOpenCreateDsaTopic = () => {
    setEditingDsaTopic(null);
    setDsaTopicName('');
    setDsaTopicNotes('');
    setDsaTopicIsFav(false);
    setIsDsaTopicModalOpen(true);
  };

  const handleOpenEditDsaTopic = (topic: DSATopic, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDsaTopic(topic);
    setDsaTopicName(topic.name);
    setDsaTopicNotes(topic.notes);
    setDsaTopicIsFav(topic.isFavourite);
    setIsDsaTopicModalOpen(true);
  };

  const handleDeleteDsaTopic = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this DSA sheet topic and all its problems?')) {
      setDsaTopics(dsaTopics.filter(t => t.id !== topicId));
    }
  };

  const handleToggleDsaFav = (topic: DSATopic, e: React.MouseEvent) => {
    e.stopPropagation();
    setDsaTopics(dsaTopics.map(t => t.id === topic.id ? { ...t, isFavourite: !t.isFavourite } : t));
  };

  const handleSaveDsaTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dsaTopicName.trim()) return;

    if (editingDsaTopic) {
      setDsaTopics(dsaTopics.map(t => t.id === editingDsaTopic.id ? {
        ...t,
        name: dsaTopicName,
        notes: dsaTopicNotes,
        isFavourite: dsaTopicIsFav
      } : t));
    } else {
      const newTopic: DSATopic = {
        id: `dsa-${Date.now()}`,
        name: dsaTopicName,
        problems: [],
        isFavourite: dsaTopicIsFav,
        notes: dsaTopicNotes
      };
      setDsaTopics([...dsaTopics, newTopic]);
    }
    setIsDsaTopicModalOpen(false);
  };

  // Problem actions
  const handleOpenAddProblem = (topicId: string) => {
    setTargetDsaTopicId(topicId);
    setEditingProblem(null);
    setProbName('');
    setProbLink('');
    setProbStatus('Todo');
    setProbNotes('');
    setIsProblemModalOpen(true);
  };

  const handleOpenEditProblem = (topicId: string, prob: DSAProblem) => {
    setTargetDsaTopicId(topicId);
    setEditingProblem(prob);
    setProbName(prob.name);
    setProbLink(prob.link);
    setProbStatus(prob.status);
    setProbNotes(prob.notes);
    setIsProblemModalOpen(true);
  };

  const handleDeleteProblem = (topicId: string, problemId: string) => {
    if (window.confirm('Delete this LeetCode problem?')) {
      setDsaTopics(dsaTopics.map(t => {
        if (t.id === topicId) {
          return {
            ...t,
            problems: t.problems.filter(p => p.id !== problemId)
          };
        }
        return t;
      }));
    }
  };

  const handleSaveProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!probName.trim() || !targetDsaTopicId) return;

    setDsaTopics(dsaTopics.map(t => {
      if (t.id === targetDsaTopicId) {
        if (editingProblem) {
          // Edit existing problem
          const updatedProbs = t.problems.map(p => p.id === editingProblem.id ? {
            ...p,
            name: probName,
            link: probLink,
            status: probStatus,
            notes: probNotes
          } : p);
          return { ...t, problems: updatedProbs };
        } else {
          // Add new problem
          const newProb: DSAProblem = {
            id: `dsap-${Date.now()}`,
            name: probName,
            link: probLink,
            status: probStatus,
            notes: probNotes
          };
          return { ...t, problems: [...t.problems, newProb] };
        }
      }
      return t;
    }));
    setIsProblemModalOpen(false);
  };

  const handleToggleProblemCheck = (topicId: string, problemId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Completed' ? 'Todo' : 'Completed';
    setDsaTopics(dsaTopics.map(t => {
      if (t.id === topicId) {
        const updatedProbs = t.problems.map(p => p.id === problemId ? { ...p, status: nextStatus as any } : p);
        return { ...t, problems: updatedProbs };
      }
      return t;
    }));
  };

  // Web Topic Actions
  const handleOpenCreateWebTopic = () => {
    setEditingWebTopic(null);
    setWebTopicName('');
    setWebTopicStatus('Todo');
    setWebTopicNotes('');
    setWebTopicIsFav(false);
    setIsWebTopicModalOpen(true);
  };

  const handleOpenEditWebTopic = (topic: WebDevTopic) => {
    setEditingWebTopic(topic);
    setWebTopicName(topic.name);
    setWebTopicStatus(topic.status);
    setWebTopicNotes(topic.notes);
    setWebTopicIsFav(topic.isFavourite);
    setIsWebTopicModalOpen(true);
  };

  const handleDeleteWebTopic = (topicId: string) => {
    if (window.confirm('Delete this Web Development topic?')) {
      setWebDevTopics(webDevTopics.filter(t => t.id !== topicId));
    }
  };

  const handleToggleWebFav = (topic: WebDevTopic) => {
    setWebDevTopics(webDevTopics.map(t => t.id === topic.id ? { ...t, isFavourite: !t.isFavourite } : t));
  };

  const handleSaveWebTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webTopicName.trim()) return;

    if (editingWebTopic) {
      setWebDevTopics(webDevTopics.map(t => t.id === editingWebTopic.id ? {
        ...t,
        name: webTopicName,
        status: webTopicStatus,
        notes: webTopicNotes,
        isFavourite: webTopicIsFav
      } : t));
    } else {
      const newTopic: WebDevTopic = {
        id: `web-${Date.now()}`,
        name: webTopicName,
        status: webTopicStatus,
        notes: webTopicNotes,
        isFavourite: webTopicIsFav
      };
      setWebDevTopics([...webDevTopics, newTopic]);
    }
    setIsWebTopicModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Tab Switchers / Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Apna College Trackers</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Completely editable trackers mapping your progress in algorithmic sheets and full-stack web tracks.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className={`p-1 rounded-xl border flex ${
          darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
        }`}>
          <button
            onClick={() => setActiveTab('dsa')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dsa'
                ? darkMode
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'bg-white text-neutral-950 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-200'
            }`}
          >
            DSA Sheet
          </button>
          <button
            onClick={() => setActiveTab('web')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'web'
                ? darkMode
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'bg-white text-neutral-950 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-200'
            }`}
          >
            Web Development
          </button>
        </div>
      </div>

      {/* Search and Action segment */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            placeholder={activeTab === 'dsa' ? 'Filter DSA topics & problems...' : 'Filter Web topics...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs outline-none border transition-all ${
              darkMode
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300 placeholder-neutral-500 focus:border-neutral-700'
                : 'bg-white border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:border-neutral-300'
            }`}
          />
        </div>

        <button
          onClick={activeTab === 'dsa' ? handleOpenCreateDsaTopic : handleOpenCreateWebTopic}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={12} />
          <span>Add New Topic</span>
        </button>
      </div>

      {/* ================= DSA SHEET VIEW ================= */}
      {activeTab === 'dsa' && (
        <div className="space-y-4">
          {filteredDsaTopics.map((topic) => {
            const isExpanded = expandedDsaId === topic.id;
            const completedCount = topic.problems.filter(p => p.status === 'Completed').length;
            const totalCount = topic.problems.length;
            const topicProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div
                key={topic.id}
                className={`rounded-xl border overflow-hidden transition-all ${
                  darkMode 
                    ? 'bg-neutral-950/40 border-neutral-800 text-neutral-200' 
                    : 'bg-white border-neutral-200 text-neutral-800'
                }`}
              >
                {/* Topic Header Row */}
                <div 
                  onClick={() => setExpandedDsaId(isExpanded ? null : topic.id)}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none ${
                    darkMode ? 'hover:bg-neutral-900/10' : 'hover:bg-neutral-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleToggleDsaFav(topic, e)}
                      className={`transition-colors ${
                        topic.isFavourite 
                          ? 'text-amber-500' 
                          : 'text-neutral-300 dark:text-neutral-700 hover:text-amber-500'
                      }`}
                    >
                      <Star size={14} fill={topic.isFavourite ? 'currentColor' : 'none'} />
                    </button>
                    <span className="font-display font-medium text-sm">{topic.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                      {completedCount}/{totalCount} Slated
                    </span>
                  </div>

                  {/* Right elements: Progress bar & Actions */}
                  <div className="flex items-center gap-4 text-xs" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-green-500 h-full transition-all"
                          style={{ width: `${topicProgress}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-neutral-400">{topicProgress}%</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleOpenEditDsaTopic(topic, e)}
                        className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        title="Edit Topic Info"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteDsaTopic(topic.id, e)}
                        className="p-1 rounded text-neutral-400 hover:text-red-500 hover:bg-red-500/10"
                        title="Delete Topic"
                      >
                        <Trash2 size={12} />
                      </button>
                      <button
                        onClick={() => setExpandedDsaId(isExpanded ? null : topic.id)}
                        className="p-1 text-neutral-400"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Problems Details */}
                {isExpanded && (
                  <div className={`p-4 border-t space-y-4 ${
                    darkMode ? 'border-neutral-800 bg-neutral-950/20' : 'border-neutral-100 bg-neutral-50/20'
                  }`}>
                    {/* Topic Notes */}
                    {topic.notes && (
                      <div className="flex items-start gap-2 text-xs p-2.5 rounded bg-neutral-100/50 dark:bg-neutral-900/30 text-neutral-500 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800">
                        <FileText size={13} className="shrink-0 mt-0.5" />
                        <span>{topic.notes}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">Problem List</span>
                      <button
                        onClick={() => handleOpenAddProblem(topic.id)}
                        className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <Plus size={10} />
                        <span>Add Problem Link</span>
                      </button>
                    </div>

                    {/* Problems Table */}
                    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className={`border-b font-mono ${darkMode ? 'bg-neutral-900/50 border-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-500'}`}>
                            <th className="p-3 w-8">Done</th>
                            <th className="p-3">Problem Name</th>
                            <th className="p-3 w-32">Status</th>
                            <th className="p-3">Solution / Notes</th>
                            <th className="p-3 w-20 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className={darkMode ? 'divide-y divide-neutral-800' : 'divide-y divide-neutral-200'}>
                          {topic.problems.map((problem) => {
                            const isDone = problem.status === 'Completed';
                            return (
                              <tr key={problem.id} className={darkMode ? 'hover:bg-neutral-900/20' : 'hover:bg-neutral-50/50'}>
                                {/* Checkbox cell */}
                                <td className="p-3">
                                  <input
                                    type="checkbox"
                                    checked={isDone}
                                    onChange={() => handleToggleProblemCheck(topic.id, problem.id, problem.status)}
                                    className="rounded text-green-600 focus:ring-green-600 border-neutral-300 dark:border-neutral-700 cursor-pointer"
                                  />
                                </td>

                                {/* Name Cell */}
                                <td className="p-3 font-medium">
                                  {problem.link ? (
                                    <a
                                      href={problem.link}
                                      target="_blank"
                                      referrerPolicy="no-referrer"
                                      rel="noopener noreferrer"
                                      className="hover:underline text-neutral-900 dark:text-neutral-100 flex items-center gap-1 group/link"
                                    >
                                      <span className={isDone ? 'line-through text-neutral-400' : ''}>{problem.name}</span>
                                      <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-60 transition-opacity" />
                                    </a>
                                  ) : (
                                    <span className={isDone ? 'line-through text-neutral-400' : ''}>{problem.name}</span>
                                  )}
                                </td>

                                {/* Status Tag */}
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wide ${
                                    problem.status === 'Completed'
                                      ? 'bg-green-500/10 text-green-500'
                                      : problem.status === 'Solving'
                                        ? 'bg-blue-500/10 text-blue-500'
                                        : 'bg-neutral-400/10 text-neutral-400'
                                  }`}>
                                    {problem.status}
                                  </span>
                                </td>

                                {/* Notes Cell */}
                                <td className="p-3 text-neutral-500 dark:text-neutral-400 italic">
                                  {problem.notes || '-'}
                                </td>

                                {/* Problem Actions */}
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={() => handleOpenEditProblem(topic.id, problem)}
                                      className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 rounded"
                                      title="Edit problem"
                                    >
                                      <Edit size={11} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProblem(topic.id, problem.id)}
                                      className="p-1 hover:text-red-500 text-neutral-400 rounded"
                                      title="Delete problem"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {topic.problems.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-6 text-center text-neutral-400 italic font-mono text-[11px]">
                                No problems added yet. Click &quot;Add Problem Link&quot; above to map LeetCode items.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filteredDsaTopics.length === 0 && (
            <div className="py-12 text-center text-neutral-400 dark:text-neutral-500 italic">
              No DSA sheet topics found matching your query.
            </div>
          )}
        </div>
      )}

      {/* ================= WEB DEVELOPMENT VIEW ================= */}
      {activeTab === 'web' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredWebTopics.map((topic) => {
            const statusColor = 
              topic.status === 'Completed'
                ? 'text-green-500 bg-green-500/10 border-green-500/20'
                : topic.status === 'In Progress'
                  ? 'text-blue-500 bg-blue-500/10 border-blue-500/20'
                  : 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20';

            return (
              <div
                key={topic.id}
                className={`p-5 rounded-xl border flex flex-col justify-between gap-4 transition-all ${
                  darkMode 
                    ? 'bg-neutral-950/40 border-neutral-800 text-neutral-200 hover:border-neutral-700' 
                    : 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleWebFav(topic)}
                        className={`transition-colors ${
                          topic.isFavourite 
                            ? 'text-amber-500' 
                            : 'text-neutral-300 dark:text-neutral-700 hover:text-amber-500'
                        }`}
                      >
                        <Star size={13} fill={topic.isFavourite ? 'currentColor' : 'none'} />
                      </button>
                      <h3 className="font-display font-semibold text-sm">{topic.name}</h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditWebTopic(topic)}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 rounded"
                        title="Edit Web Topic"
                      >
                        <Edit size={11} />
                      </button>
                      <button
                        onClick={() => handleDeleteWebTopic(topic.id)}
                        className="p-1 hover:text-red-500 text-neutral-400 rounded"
                        title="Delete Web Topic"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${statusColor}`}>
                    {topic.status}
                  </span>

                  {/* Notes text */}
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3">
                    {topic.notes || <span className="italic opacity-60">No notes written yet. Click edit to compile syllabus.</span>}
                  </p>
                </div>

                <div className="border-t border-neutral-100 dark:border-neutral-900 pt-2 flex justify-between items-center text-[10px] font-mono text-neutral-400">
                  <span>Tracked Curriculum</span>
                  <BookMarked size={12} className="opacity-50" />
                </div>
              </div>
            );
          })}
          {filteredWebTopics.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-400 dark:text-neutral-500 italic">
              No Web Development topics found matching your query.
            </div>
          )}
        </div>
      )}

      {/* ================= MODALS & FORMS ================= */}

      {/* 1. DSA SHEET TOPIC MODAL */}
      {isDsaTopicModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h2 className="text-lg font-display font-semibold mb-4">
              {editingDsaTopic ? '✏ Edit DSA Topic' : '➕ Create New DSA Topic'}
            </h2>

            <form onSubmit={handleSaveDsaTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Topic Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heaps & Priority Queues"
                  value={dsaTopicName}
                  onChange={(e) => setDsaTopicName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Topic Guidelines / Notes
                </label>
                <textarea
                  placeholder="Important pointers or notes regarding this DSA topic..."
                  value={dsaTopicNotes}
                  onChange={(e) => setDsaTopicNotes(e.target.value)}
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
                  id="dsaTopicIsFav"
                  checked={dsaTopicIsFav}
                  onChange={(e) => setDsaTopicIsFav(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
                />
                <label htmlFor="dsaTopicIsFav" className="text-xs text-neutral-500 dark:text-neutral-400 cursor-pointer select-none">
                  ⭐ Mark as Favourite sheet topic
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsDsaTopicModalOpen(false)}
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
                  Save Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. DSA PROBLEM LINK MODAL */}
      {isProblemModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h2 className="text-lg font-display font-semibold mb-4">
              {editingProblem ? '✏ Edit Problem' : '➕ Add Problem Link'}
            </h2>

            <form onSubmit={handleSaveProblem} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Problem Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Merge k Sorted Lists"
                  value={probName}
                  onChange={(e) => setProbName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  LeetCode / HackerRank Link
                </label>
                <input
                  type="text"
                  placeholder="https://leetcode.com/problems/..."
                  value={probLink}
                  onChange={(e) => setProbLink(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Solving Status
                </label>
                <select
                  value={probStatus}
                  onChange={(e) => setProbStatus(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200'
                      : 'bg-white border-neutral-200 text-neutral-800'
                  }`}
                >
                  <option value="Todo">Todo</option>
                  <option value="Solving">Solving</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  My Solutions / Notes
                </label>
                <textarea
                  placeholder="Note complexity details, helper variables, or logical pitfalls..."
                  value={probNotes}
                  onChange={(e) => setProbNotes(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all resize-none ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsProblemModalOpen(false)}
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
                  Save Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. WEB TOPIC MODAL */}
      {isWebTopicModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h2 className="text-lg font-display font-semibold mb-4">
              {editingWebTopic ? '✏ Edit Web Development Topic' : '➕ Create Web Development Topic'}
            </h2>

            <form onSubmit={handleSaveWebTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Topic Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js Routing, Web Sockets"
                  value={webTopicName}
                  onChange={(e) => setWebTopicName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Track Status
                </label>
                <select
                  value={webTopicStatus}
                  onChange={(e) => setWebTopicStatus(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200'
                      : 'bg-white border-neutral-200 text-neutral-800'
                  }`}
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Syllabus / Notes
                </label>
                <textarea
                  placeholder="Enter links, study milestones, or standard notes on the web modules..."
                  value={webTopicNotes}
                  onChange={(e) => setWebTopicNotes(e.target.value)}
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
                  id="webTopicIsFav"
                  checked={webTopicIsFav}
                  onChange={(e) => setWebTopicIsFav(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
                />
                <label htmlFor="webTopicIsFav" className="text-xs text-neutral-500 dark:text-neutral-400 cursor-pointer select-none">
                  ⭐ Mark as Favourite web topic
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsWebTopicModalOpen(false)}
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
                  Save Web Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
