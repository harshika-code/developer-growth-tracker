import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Star, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  Tag, 
  Filter, 
  CheckCircle, 
  AlertCircle,
  MoreVertical,
  Activity
} from 'lucide-react';
import { Task, PriorityType, TaskStatusType } from '../types';

interface TaskTrackerViewProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  darkMode: boolean;
  globalSearch: string;
  showFavouritesOnly: boolean;
}

export const TaskTrackerView: React.FC<TaskTrackerViewProps> = ({
  tasks,
  setTasks,
  darkMode,
  globalSearch,
  showFavouritesOnly,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPriority, setFormPriority] = useState<PriorityType>('Normal');
  const [formStatus, setFormStatus] = useState<TaskStatusType>('Todo');
  const [formDeadline, setFormDeadline] = useState('');
  const [formTimeEstimate, setFormTimeEstimate] = useState<number>(1);
  const [formActualTimeSpent, setFormActualTimeSpent] = useState<number>(0);
  const [formNotes, setFormNotes] = useState('');
  const [formIsFavourite, setFormIsFavourite] = useState(false);

  // Categories list
  const categories = useMemo(() => {
    const cats = tasks.map(t => t.category.trim()).filter(Boolean);
    return Array.from(new Set(cats));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Global Search
      const searchStr = `${task.title} ${task.description} ${task.category} ${task.notes}`.toLowerCase();
      const matchesGlobal = searchStr.includes(globalSearch.toLowerCase());
      const matchesLocal = searchStr.includes(search.toLowerCase());

      // Status
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;

      // Priority
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

      // Category
      const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;

      // Favourite
      const matchesFavourite = !showFavouritesOnly || task.isFavourite;

      return matchesGlobal && matchesLocal && matchesStatus && matchesPriority && matchesCategory && matchesFavourite;
    });
  }, [tasks, globalSearch, search, statusFilter, priorityFilter, categoryFilter, showFavouritesOnly]);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('DSA');
    setFormPriority('Normal');
    setFormStatus('Todo');
    setFormDeadline(new Date().toISOString().split('T')[0]);
    setFormTimeEstimate(2);
    setFormActualTimeSpent(0);
    setFormNotes('');
    setFormIsFavourite(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormCategory(task.category);
    setFormPriority(task.priority);
    setFormStatus(task.status);
    setFormDeadline(task.deadline);
    setFormTimeEstimate(task.timeEstimate);
    setFormActualTimeSpent(task.actualTimeSpent);
    setFormNotes(task.notes);
    setFormIsFavourite(task.isFavourite);
    setIsFormOpen(true);
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updated = tasks.filter(t => t.id !== taskId);
      setTasks(updated);
    }
  };

  const handleToggleFavourite = (task: Task) => {
    const updated = tasks.map(t => t.id === task.id ? { ...t, isFavourite: !t.isFavourite } : t);
    setTasks(updated);
  };

  const handleUpdateStatus = (task: Task, newStatus: TaskStatusType) => {
    const updated = tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t);
    setTasks(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTask) {
      // Edit
      const updated = tasks.map(t => t.id === editingTask.id ? {
        ...t,
        title: formTitle,
        description: formDescription,
        category: formCategory,
        priority: formPriority,
        status: formStatus,
        deadline: formDeadline,
        timeEstimate: Number(formTimeEstimate),
        actualTimeSpent: Number(formActualTimeSpent),
        notes: formNotes,
        isFavourite: formIsFavourite
      } : t);
      setTasks(updated);
    } else {
      // Create New
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: formTitle,
        description: formDescription,
        category: formCategory,
        priority: formPriority,
        status: formStatus,
        deadline: formDeadline,
        timeEstimate: Number(formTimeEstimate) || 0,
        actualTimeSpent: Number(formActualTimeSpent) || 0,
        notes: formNotes,
        isFavourite: formIsFavourite
      };
      setTasks([newTask, ...tasks]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Task Database</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Organize, log hours, search, and manage your day-to-day career milestones.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus size={14} />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-xl border ${
        darkMode ? 'bg-neutral-950/40 border-neutral-800' : 'bg-neutral-100/50 border-neutral-200'
      } flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between`}>
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Local Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter tasks in this view..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs outline-none border transition-all ${
                darkMode
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 placeholder-neutral-500 focus:border-neutral-700'
                  : 'bg-white border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:border-neutral-300'
              }`}
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-xs outline-none border transition-all ${
              darkMode
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300'
                : 'bg-white border-neutral-200 text-neutral-700'
            }`}
          >
            <option value="All">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-xs outline-none border transition-all ${
              darkMode
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300'
                : 'bg-white border-neutral-200 text-neutral-700'
            }`}
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="Important">Important</option>
            <option value="Normal">Normal</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-xs outline-none border transition-all ${
              darkMode
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300'
                : 'bg-white border-neutral-200 text-neutral-700'
            }`}
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Stats segment */}
        <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 flex items-center gap-3 justify-end">
          <span>Total: {filteredTasks.length}</span>
          <span>•</span>
          <span>Done: {filteredTasks.filter(t => t.status === 'Completed').length}</span>
        </div>
      </div>

      {/* Task List / Kanban Style Table */}
      <div className={`overflow-x-auto rounded-xl border ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className={`border-b text-xs uppercase font-mono tracking-wider ${
              darkMode ? 'bg-neutral-950/80 border-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-500'
            }`}>
              <th className="p-4 w-10"></th>
              <th className="p-4">Task</th>
              <th className="p-4 w-28">Category</th>
              <th className="p-4 w-28">Priority</th>
              <th className="p-4 w-32">Status</th>
              <th className="p-4 w-32">Deadline</th>
              <th className="p-4 w-28">Time Spent</th>
              <th className="p-4 w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={darkMode ? 'divide-y divide-neutral-800' : 'divide-y divide-neutral-200'}>
            {filteredTasks.map((task) => {
              const priorityColor = 
                task.priority === 'Urgent' 
                  ? 'text-red-500 bg-red-500/10 border-red-500/20' 
                  : task.priority === 'Important' 
                    ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' 
                    : 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20';

              const statusColor =
                task.status === 'Completed'
                  ? 'text-green-500 bg-green-500/10'
                  : task.status === 'In Progress'
                    ? 'text-blue-500 bg-blue-500/10'
                    : 'text-neutral-400 bg-neutral-400/10';

              return (
                <tr 
                  key={task.id} 
                  className={`group transition-colors ${
                    darkMode ? 'hover:bg-neutral-900/40' : 'hover:bg-neutral-50'
                  }`}
                >
                  {/* Favourite Button */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleFavourite(task)}
                      className={`transition-colors ${
                        task.isFavourite 
                          ? 'text-amber-500' 
                          : 'text-neutral-300 dark:text-neutral-700 hover:text-amber-500'
                      }`}
                    >
                      <Star size={14} fill={task.isFavourite ? 'currentColor' : 'none'} />
                    </button>
                  </td>

                  {/* Title and description */}
                  <td className="p-4">
                    <div className="flex flex-col max-w-sm md:max-w-md">
                      <span className={`font-medium ${
                        task.status === 'Completed' 
                          ? 'line-through text-neutral-400 dark:text-neutral-500' 
                          : 'text-neutral-900 dark:text-neutral-100'
                      }`}>
                        {task.title}
                      </span>
                      {task.description && (
                        <span className="text-xs text-neutral-400 dark:text-neutral-500 line-clamp-1">
                          {task.description}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Category tag */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full border ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-neutral-400' : 'bg-neutral-200/50 border-neutral-300/50 text-neutral-600'
                    }`}>
                      <Tag size={10} />
                      {task.category || 'General'}
                    </span>
                  </td>

                  {/* Priority Pill */}
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs border font-medium ${priorityColor}`}>
                      {task.priority}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-4">
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateStatus(task, e.target.value as TaskStatusType)}
                      className={`px-2 py-1 rounded text-xs border bg-transparent font-medium cursor-pointer outline-none ${statusColor} ${
                        darkMode ? 'border-neutral-800' : 'border-neutral-200'
                      }`}
                    >
                      <option value="Todo" className={darkMode ? 'bg-neutral-900 text-neutral-300' : 'bg-white text-neutral-700'}>Todo</option>
                      <option value="In Progress" className={darkMode ? 'bg-neutral-900 text-neutral-300' : 'bg-white text-neutral-700'}>In Progress</option>
                      <option value="Completed" className={darkMode ? 'bg-neutral-900 text-neutral-300' : 'bg-white text-neutral-700'}>Completed</option>
                    </select>
                  </td>

                  {/* Deadline */}
                  <td className="p-4 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="opacity-70" />
                      <span>{task.deadline || 'No due date'}</span>
                    </div>
                  </td>

                  {/* Time Estimate and logged */}
                  <td className="p-4 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="opacity-70" />
                      <span>{task.actualTimeSpent}h / {task.timeEstimate}h</span>
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(task)}
                        className={`p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200`}
                        title="Edit Task"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className={`p-1.5 rounded hover:bg-red-500/10 text-neutral-400 hover:text-red-500`}
                        title="Delete Task"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={8} className="p-12 text-center text-sm text-neutral-400 dark:text-neutral-500 italic">
                  No tasks match your criteria. Click &quot;Add New Task&quot; to populate your checklist.
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
              {editingTask ? '✏ Edit Task' : '➕ Create New Task'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master DP Knapsack approach"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Detail the steps or scope of work..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all resize-none ${
                    darkMode
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                      : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DSA, Web, Career"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Deadline
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as PriorityType)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200'
                        : 'bg-white border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as TaskStatusType)}
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Est. Hours ({formTimeEstimate}h)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formTimeEstimate}
                    onChange={(e) => setFormTimeEstimate(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                      darkMode
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-800 focus:border-neutral-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Actual Spent ({formActualTimeSpent}h)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formActualTimeSpent}
                    onChange={(e) => setFormActualTimeSpent(Number(e.target.value))}
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
                  Notes
                </label>
                <textarea
                  placeholder="Notes, links, or specific thoughts on this task..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
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
                  id="formIsFavourite"
                  checked={formIsFavourite}
                  onChange={(e) => setFormIsFavourite(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
                />
                <label htmlFor="formIsFavourite" className="text-xs text-neutral-500 dark:text-neutral-400 cursor-pointer select-none">
                  ⭐ Mark as Favourite
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
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
