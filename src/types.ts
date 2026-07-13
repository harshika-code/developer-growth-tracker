export type PriorityType = 'Urgent' | 'Important' | 'Normal';
export type TaskStatusType = 'Todo' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: PriorityType;
  deadline: string;
  timeEstimate: number; // in hours
  actualTimeSpent: number; // in hours
  status: TaskStatusType;
  notes: string;
  isFavourite: boolean;
}

export interface SkillTopic {
  id: string;
  name: string;
  status: 'Todo' | 'Learning' | 'Completed';
  progress: number; // 0 to 100
}

export interface Skill {
  id: string;
  name: string;
  progress: number; // user manually inputs/controls this
  topics: SkillTopic[];
  resources: string;
  notes: string;
  hoursSpent: number;
  isFavourite: boolean;
}

export interface DSAProblem {
  id: string;
  name: string;
  link: string;
  status: 'Todo' | 'Solving' | 'Completed';
  notes: string;
}

export interface DSATopic {
  id: string;
  name: string;
  problems: DSAProblem[];
  isFavourite: boolean;
  notes: string;
}

export interface WebDevTopic {
  id: string;
  name: string;
  status: 'Todo' | 'In Progress' | 'Completed';
  notes: string;
  isFavourite: boolean;
}

export interface Resource {
  id: string;
  name: string;
  link: string;
  category: string;
  description: string;
  status: 'To Read' | 'In Progress' | 'Completed';
  notes: string;
  isFavourite: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string; // Comma separated or string
  githubLink: string;
  demoLink: string;
  status: 'Idea' | 'Building' | 'Completed';
  isFavourite: boolean;
}

export interface InternshipOpportunity {
  id: string;
  company: string;
  role: string;
  link: string;
  deadline: string;
  status: 'Saved' | 'Applied' | 'Interview' | 'Selected' | 'Rejected';
  notes: string;
  isFavourite: boolean;
}

export interface QuickLink {
  id: string;
  label: string;
  url: string;
  isFavourite: boolean;
}

export interface WeeklyReview {
  id: string;
  date: string; // e.g. "Week of 2026-07-12"
  achievements: string;
  problemsFaced: string;
  lessonsLearned: string;
  nextWeekGoals: string;
  isFavourite: boolean;
}

export type WidgetType = 
  | 'todays_tasks'
  | 'top_priority'
  | 'learning_hours'
  | 'skill_progress'
  | 'weekly_review'
  | 'quick_links';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  visible: boolean;
  order: number;
}

export interface CommitInfo {
  hash: string;
  message: string;
  date: string;
  author: string;
  url: string;
}

export interface GitHubIntegration {
  username: string;
  repo: string;
  commits: CommitInfo[];
  commitsCount: number;
  lastSynced?: string;
  token?: string;
}

export interface LeetCodeIntegration {
  username: string;
  solvedCount: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  lastSynced?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'study' | 'task' | 'exam' | 'other';
  synced: boolean;
}

export interface InterviewLog {
  id: string;
  company: string;
  role: string;
  date: string;
  round: string;
  status: 'Scheduled' | 'Completed' | 'Offered' | 'Rejected' | 'Pending';
  questions: string[];
  mistakes: string;
  improvements: string;
  notes?: string;
}

export interface WikiNote {
  id: string;
  title: string;
  content: string;
  category: string;
  lastModified: string;
  links: string[]; // referenced topics or notes
}

export interface TrackerState {
  tasks: Task[];
  skills: Skill[];
  dsaTopics: DSATopic[];
  webDevTopics: WebDevTopic[];
  resources: Resource[];
  projects: Project[];
  internships: InternshipOpportunity[];
  quickLinks: QuickLink[];
  weeklyReviews: WeeklyReview[];
  widgets: DashboardWidget[];
  customResourceCategories: string[];
  
  // New features state integrations
  githubIntegration?: GitHubIntegration;
  leetcodeIntegration?: LeetCodeIntegration;
  customIntegrations?: CustomIntegration[];
  calendarEvents?: CalendarEvent[];
  interviews?: InterviewLog[];
  wikiNotes?: WikiNote[];

  // Customizable profile parameters
  profileName?: string;
  targetRole?: string;
  startDate?: string;
  endDate?: string;
}

export interface CustomIntegration {
  id: string;
  platformName: string; // e.g. "HackerRank", "Codeforces", "CodeChef", "GeeksforGeeks"
  username: string;
  profileUrl: string;
  solvedCount?: number;
  rating?: number;
  lastSynced?: string;
  customMetricLabel?: string; // e.g. "Points", "Stars", "Global Rank"
  customMetricValue?: string; // e.g. "1240", "5 Star", "420"
}
