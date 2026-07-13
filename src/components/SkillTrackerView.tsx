import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Star, 
  Edit, 
  Trash2, 
  Clock, 
  BookOpen, 
  CheckSquare, 
  FileText,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { Skill, SkillTopic } from '../types';

interface SkillTrackerViewProps {
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
  darkMode: boolean;
  globalSearch: string;
  showFavouritesOnly: boolean;
}

export const SkillTrackerView: React.FC<SkillTrackerViewProps> = ({
  skills,
  setSkills,
  darkMode,
  globalSearch,
  showFavouritesOnly,
}) => {
  const [search, setSearch] = useState('');
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);

  // Skill Form state
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillName, setSkillName] = useState('');
  const [skillProgress, setSkillProgress] = useState<number>(0);
  const [skillHours, setSkillHours] = useState<number>(0);
  const [skillResources, setSkillResources] = useState('');
  const [skillNotes, setSkillNotes] = useState('');
  const [skillIsFav, setSkillIsFav] = useState(false);

  // Topic inline input state (by skillId)
  const [newTopicNames, setNewTopicNames] = useState<{ [skillId: string]: string }>({});

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const searchStr = `${skill.name} ${skill.resources} ${skill.notes} ${skill.topics.map(t => t.name).join(' ')}`.toLowerCase();
      const matchesGlobal = searchStr.includes(globalSearch.toLowerCase());
      const matchesLocal = searchStr.includes(search.toLowerCase());
      const matchesFav = !showFavouritesOnly || skill.isFavourite;
      return matchesGlobal && matchesLocal && matchesFav;
    });
  }, [skills, globalSearch, search, showFavouritesOnly]);

  const handleOpenCreateSkill = () => {
    setEditingSkill(null);
    setSkillName('');
    setSkillProgress(0);
    setSkillHours(0);
    setSkillResources('');
    setSkillNotes('');
    setSkillIsFav(false);
    setIsSkillFormOpen(true);
  };

  const handleOpenEditSkill = (skill: Skill, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSkill(skill);
    setSkillName(skill.name);
    setSkillProgress(skill.progress);
    setSkillHours(skill.hoursSpent);
    setSkillResources(skill.resources);
    setSkillNotes(skill.notes);
    setSkillIsFav(skill.isFavourite);
    setIsSkillFormOpen(true);
  };

  const handleDeleteSkill = (skillId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this skill and all its topics?')) {
      setSkills(skills.filter(s => s.id !== skillId));
    }
  };

  const handleToggleFav = (skill: Skill, e: React.MouseEvent) => {
    e.stopPropagation();
    setSkills(skills.map(s => s.id === skill.id ? { ...s, isFavourite: !s.isFavourite } : s));
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    if (editingSkill) {
      // Edit
      setSkills(skills.map(s => s.id === editingSkill.id ? {
        ...s,
        name: skillName,
        progress: Number(skillProgress),
        hoursSpent: Number(skillHours),
        resources: skillResources,
        notes: skillNotes,
        isFavourite: skillIsFav
      } : s));
    } else {
      // Create
      const newSkill: Skill = {
        id: `skill-${Date.now()}`,
        name: skillName,
        progress: Number(skillProgress) || 0,
        topics: [],
        resources: skillResources,
        notes: skillNotes,
        hoursSpent: Number(skillHours) || 0,
        isFavourite: skillIsFav
      };
      setSkills([...skills, newSkill]);
    }
    setIsSkillFormOpen(false);
  };

  // Manual update of progress slider
  const handleProgressChange = (skillId: string, progressVal: number) => {
    setSkills(skills.map(s => s.id === skillId ? { ...s, progress: progressVal } : s));
  };

  // Manual update of hours spent
  const handleHoursChange = (skillId: string, hoursVal: number) => {
    setSkills(skills.map(s => s.id === skillId ? { ...s, hoursSpent: hoursVal } : s));
  };

  // Inline topic management
  const handleAddTopic = (skillId: string) => {
    const topicName = newTopicNames[skillId]?.trim();
    if (!topicName) return;

    const newTopic: SkillTopic = {
      id: `topic-${Date.now()}`,
      name: topicName,
      status: 'Todo',
      progress: 0
    };

    setSkills(skills.map(s => {
      if (s.id === skillId) {
        return {
          ...s,
          topics: [...s.topics, newTopic]
        };
      }
      return s;
    }));

    setNewTopicNames({ ...newTopicNames, [skillId]: '' });
  };

  const handleToggleTopicStatus = (skillId: string, topicId: string) => {
    setSkills(skills.map(s => {
      if (s.id === skillId) {
        const updatedTopics = s.topics.map(t => {
          if (t.id === topicId) {
            let nextStatus: 'Todo' | 'Learning' | 'Completed' = 'Learning';
            let nextProgress = 50;
            if (t.status === 'Todo') {
              nextStatus = 'Learning';
              nextProgress = 50;
            } else if (t.status === 'Learning') {
              nextStatus = 'Completed';
              nextProgress = 100;
            } else {
              nextStatus = 'Todo';
              nextProgress = 0;
            }
            return { ...t, status: nextStatus, progress: nextProgress };
          }
          return t;
        });
        return { ...s, topics: updatedTopics };
      }
      return s;
    }));
  };

  const handleTopicProgressChange = (skillId: string, topicId: string, val: number) => {
    setSkills(skills.map(s => {
      if (s.id === skillId) {
        const updatedTopics = s.topics.map(t => {
          if (t.id === topicId) {
            let status: 'Todo' | 'Learning' | 'Completed' = 'Learning';
            if (val === 100) status = 'Completed';
            else if (val === 0) status = 'Todo';
            return { ...t, progress: val, status };
          }
          return t;
        });
        return { ...s, topics: updatedTopics };
      }
      return s;
    }));
  };

  const handleDeleteTopic = (skillId: string, topicId: string) => {
    if (window.confirm('Delete this topic?')) {
      setSkills(skills.map(s => {
        if (s.id === skillId) {
          return {
            ...s,
            topics: s.topics.filter(t => t.id !== topicId)
          };
        }
        return s;
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Skills Roadmap</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Define learning targets, track hours spent, list core topics, and gauge manual skill progress.
          </p>
        </div>
        <button
          onClick={handleOpenCreateSkill}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus size={14} />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Local search bar */}
      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
        <input
          type="text"
          placeholder="Filter skills by name, resources, topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs outline-none border transition-all ${
            darkMode
              ? 'bg-neutral-900 border-neutral-800 text-neutral-300 placeholder-neutral-500 focus:border-neutral-700'
              : 'bg-white border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:border-neutral-300'
          }`}
        />
      </div>

      {/* Grid of Skill Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredSkills.map((skill) => {
          const isExpanded = expandedSkillId === skill.id;
          return (
            <div
              key={skill.id}
              className={`rounded-2xl border transition-workspace overflow-hidden ${
                darkMode 
                  ? 'bg-neutral-950/40 border-neutral-800 text-neutral-200 hover:border-neutral-700' 
                  : 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-300'
              } flex flex-col`}
            >
              {/* Card Header Summary */}
              <div 
                className={`p-5 flex flex-col gap-3 cursor-pointer select-none ${
                  darkMode ? 'hover:bg-neutral-900/10' : 'hover:bg-neutral-50/50'
                }`}
                onClick={() => setExpandedSkillId(isExpanded ? null : skill.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleToggleFav(skill, e)}
                      className={`transition-colors ${
                        skill.isFavourite 
                          ? 'text-amber-500' 
                          : 'text-neutral-300 dark:text-neutral-700 hover:text-amber-500'
                      }`}
                    >
                      <Star size={14} fill={skill.isFavourite ? 'currentColor' : 'none'} />
                    </button>
                    <span className="font-display font-semibold text-base">{skill.name}</span>
                  </div>

                  {/* Actions & expand toggle */}
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleOpenEditSkill(skill, e)}
                      className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteSkill(skill.id, e)}
                      className="p-1 text-neutral-400 hover:text-red-500 rounded hover:bg-red-500/10"
                    >
                      <Trash2 size={12} />
                    </button>
                    <button
                      onClick={() => setExpandedSkillId(isExpanded ? null : skill.id)}
                      className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Progress bar info */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="font-mono">Progress: {skill.progress}%</span>
                    <span className="font-mono flex items-center gap-1">
                      <Clock size={12} /> {skill.hoursSpent}h logged
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-neutral-800 dark:bg-white h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, skill.progress))}%` }}
                    />
                  </div>
                </div>

                {/* Topics preview tag */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
                  <span>{skill.topics.length} topics mapped</span>
                  <span>Click to expand & edit topics</span>
                </div>
              </div>

              {/* Expanded content details */}
              {isExpanded && (
                <div className={`p-5 border-t space-y-5 ${
                  darkMode ? 'border-neutral-800 bg-neutral-950/20' : 'border-neutral-100 bg-neutral-50/30'
                }`}>
                  {/* Slider controls to change progress & hours directly */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                        Adjust Progress ({skill.progress}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.progress}
                        onChange={(e) => handleProgressChange(skill.id, Number(e.target.value))}
                        className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neutral-800 dark:accent-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                        Log Learning Hours ({skill.hoursSpent}h)
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleHoursChange(skill.id, Math.max(0, skill.hoursSpent - 1))}
                          className="px-2 py-0.5 text-xs rounded border hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          -1h
                        </button>
                        <input
                          type="number"
                          value={skill.hoursSpent}
                          onChange={(e) => handleHoursChange(skill.id, Number(e.target.value))}
                          className="w-16 px-1 py-0.5 text-xs text-center border rounded bg-transparent font-mono"
                        />
                        <button
                          onClick={() => handleHoursChange(skill.id, skill.hoursSpent + 1)}
                          className="px-2 py-0.5 text-xs rounded border hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          +1h
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Topics List */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
                      <CheckSquare size={12} />
                      <span>Syllabus & Core Topics</span>
                    </h4>

                    {/* Add topic form inline */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add dynamic topic (e.g. Trie traversal)..."
                        value={newTopicNames[skill.id] || ''}
                        onChange={(e) => setNewTopicNames({ ...newTopicNames, [skill.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTopic(skill.id)}
                        className={`flex-1 px-3 py-1.5 text-xs rounded-lg border outline-none transition-all ${
                          darkMode
                            ? 'bg-neutral-900 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                            : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-300'
                        }`}
                      />
                      <button
                        onClick={() => handleAddTopic(skill.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    {/* Actual topics rows */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {skill.topics.map((topic) => {
                        return (
                          <div
                            key={topic.id}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                              darkMode
                                ? 'bg-neutral-900/30 border-neutral-800/80 hover:bg-neutral-900/60'
                                : 'bg-neutral-50 border-neutral-200/60 hover:bg-neutral-100/50'
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <button
                                onClick={() => handleToggleTopicStatus(skill.id, topic.id)}
                                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                                title="Toggle status"
                              >
                                {topic.status === 'Completed' ? (
                                  <CheckSquare size={14} className="text-green-500 fill-green-500/10" />
                                ) : topic.status === 'Learning' ? (
                                  <Sliders size={14} className="text-blue-500" />
                                ) : (
                                  <Circle size={14} />
                                )}
                              </button>
                              <span className={topic.status === 'Completed' ? 'line-through text-neutral-400' : 'font-medium'}>
                                {topic.name}
                              </span>
                              <span className={`text-[9px] px-1 rounded uppercase font-mono tracking-wider ${
                                topic.status === 'Completed' 
                                  ? 'bg-green-500/10 text-green-500' 
                                  : topic.status === 'Learning' 
                                    ? 'bg-blue-500/10 text-blue-500' 
                                    : 'bg-neutral-400/10 text-neutral-400'
                              }`}>
                                {topic.status}
                              </span>
                            </div>

                            {/* Slider for topic progress and Delete */}
                            <div className="flex items-center gap-3 mt-1 sm:mt-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] text-neutral-400">{topic.progress}%</span>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  step="10"
                                  value={topic.progress}
                                  onChange={(e) => handleTopicProgressChange(skill.id, topic.id, Number(e.target.value))}
                                  className="w-16 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neutral-800 dark:accent-white"
                                />
                              </div>
                              <button
                                onClick={() => handleDeleteTopic(skill.id, topic.id)}
                                className="p-1 hover:text-red-500 text-neutral-400 rounded hover:bg-red-500/10"
                                title="Delete Topic"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {skill.topics.length === 0 && (
                        <p className="text-[11px] text-neutral-400 italic text-center py-2">No topics added. Map a topic to track milestones.</p>
                      )}
                    </div>
                  </div>

                  {/* Resources & Markdown Notes fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                        <BookOpen size={12} />
                        <span>Resource Links</span>
                      </label>
                      <div className={`p-3 rounded-lg border text-xs font-sans min-h-[60px] whitespace-pre-wrap ${
                        darkMode ? 'bg-neutral-900/20 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                      }`}>
                        {skill.resources || 'No resources linked yet. Edit skill details to add links.'}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                        <FileText size={12} />
                        <span>Syllabus Notes</span>
                      </label>
                      <div className={`p-3 rounded-lg border text-xs font-sans min-h-[60px] whitespace-pre-wrap ${
                        darkMode ? 'bg-neutral-900/20 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                      }`}>
                        {skill.notes || 'No notes taken yet. Edit skill details to add workspace notes.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredSkills.length === 0 && (
          <div className="col-span-full py-16 text-center text-neutral-400 dark:text-neutral-500 italic">
            No skill cards match your criteria. Click &quot;Add New Skill&quot; to build your roadmaps.
          </div>
        )}
      </div>

      {/* Edit/Create Skill Card Modal */}
      {isSkillFormOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h2 className="text-lg font-display font-semibold mb-4">
              {editingSkill ? '✏ Edit Skill Card' : '➕ Create New Skill Card'}
            </h2>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Design, Golang"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
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
                    Progress Percentage (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={skillProgress}
                    onChange={(e) => setSkillProgress(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Hours Spent Learning
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={skillHours}
                    onChange={(e) => setSkillHours(Number(e.target.value))}
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
                  Learning Resource Links
                </label>
                <textarea
                  placeholder="e.g. YouTube Playlist link, documentation pages..."
                  value={skillResources}
                  onChange={(e) => setSkillResources(e.target.value)}
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all resize-none ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Syllabus Notes
                </label>
                <textarea
                  placeholder="Write learning schedules or key core concepts..."
                  value={skillNotes}
                  onChange={(e) => setSkillNotes(e.target.value)}
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
                  id="skillIsFav"
                  checked={skillIsFav}
                  onChange={(e) => setSkillIsFav(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
                />
                <label htmlFor="skillIsFav" className="text-xs text-neutral-500 dark:text-neutral-400 cursor-pointer select-none">
                  ⭐ Mark as Favourite roadmap
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsSkillFormOpen(false)}
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
                  {editingSkill ? 'Save Changes' : 'Create Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
