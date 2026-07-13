import React, { useState } from 'react';
import { FileText, Printer, Sparkles, Plus, Trash2, Code, Mail, Github, Linkedin, Briefcase, Award, Loader2 } from 'lucide-react';
import { Project, Skill } from '../types';

interface ResumeBuilderViewProps {
  projects: Project[];
  skills: Skill[];
  darkMode: boolean;
  profileName?: string;
  targetRole?: string;
}

export const ResumeBuilderView: React.FC<ResumeBuilderViewProps> = ({
  projects,
  skills,
  darkMode,
  profileName: initialProfileName = 'Developer',
  targetRole: initialTargetRole = 'Big Tech Software Engineer'
}) => {
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [profileName, setProfileName] = useState(initialProfileName);
  const [profileEmail, setProfileEmail] = useState(`${initialProfileName.toLowerCase()}@example.com`);
  const [profilePhone, setProfilePhone] = useState('+91 98765 43210');
  const [profileLinkedin, setProfileLinkedin] = useState(`linkedin.com/in/${initialProfileName.toLowerCase()}`);
  const [profileGithub, setProfileGithub] = useState(`github.com/${initialProfileName.toLowerCase()}-dev`);

  // AI Tailored State
  const [aiSummary, setAiSummary] = useState('A highly motivated computer science student tracking skills roadmap, DSA structures, and responsive web development systems. Proven knowledge in React, state architectures, and problem-solving.');
  const [aiProjects, setAiProjects] = useState<{ name: string; bullets: string[] }[]>([
    {
      name: 'Developer Portfolio',
      bullets: [
        'Designed and deployed a responsive personal portfolio using React and Tailwind CSS resulting in a 30% speedup in loading times.',
        'Structured modular views to trace skills roadmap progress, project repositories, and technical course metrics.',
        'Engineered optimized transition animations using Motion library to create an immersive developer workspace.'
      ]
    },
    {
      name: 'Task Flow CLI',
      bullets: [
        'Created a CLI task productivity manager in Node.js enabling fully local offline backup structures and system logs.',
        'Leveraged commander.js and chalk utilities to construct interactive prompts, improving task creation speed.',
        'Devised structured JSON storage workflows to secure task persistency across operating system boots.'
      ]
    }
  ]);
  const [aiSkills, setAiSkills] = useState<string[]>(['React', 'Node.js', 'Express', 'Tailwind CSS', 'TypeScript', 'Python', 'Data Structures & Algorithms']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Call server api to optimize resume details based on Target Role
  const handleAITailorResume = async () => {
    setLoading(true);
    setError('');
    try {
      const customKey = localStorage.getItem('dev_growth_tracker_gemini_api_key') || '';
      const response = await fetch('/api/ai-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': customKey,
        },
        body: JSON.stringify({
          targetRole,
          projects,
          skills
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate optimized resume. Check Gemini API key.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.summary) setAiSummary(data.summary);
      if (data.tailoredProjects) setAiProjects(data.tailoredProjects);
      if (data.suggestedSkills) setAiSkills(data.suggestedSkills);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while contacting Gemini Resume Optimizer.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintResume = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in print:p-0 print:space-y-0" id="resume-builder-container">
      {/* View Header - Hidden when printing */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-500" size={24} />
            <h1 className="font-display font-bold text-2xl tracking-tight">Resume Builder</h1>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Auto-generate and tailor a beautiful, print-ready, ATS-optimized resume directly from your logged projects and skills.
          </p>
        </div>

        <button
          onClick={handlePrintResume}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-semibold shadow-sm cursor-pointer transition-all"
        >
          <Printer size={14} />
          <span>Print / PDF Export</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
        {/* Editor controls - Hidden when printing */}
        <div className="space-y-6 print:hidden">
          {/* Profile Configuration Card */}
          <div className={`p-6 rounded-xl border flex flex-col gap-4 ${
            darkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200'
          }`} id="profile-config-card">
            <h2 className="font-display font-bold text-base">Contact Information</h2>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium opacity-70">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className={`w-full px-3 py-1.5 text-xs rounded-md border outline-none ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-neutral-700' : 'bg-white border-neutral-200 focus:border-neutral-300'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium opacity-70">Target SWE Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className={`w-full px-3 py-1.5 text-xs rounded-md border outline-none ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-neutral-700' : 'bg-white border-neutral-200 focus:border-neutral-300'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium opacity-70">Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className={`w-full px-3 py-1.5 text-xs rounded-md border outline-none ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-neutral-700' : 'bg-white border-neutral-200 focus:border-neutral-300'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium opacity-70">Phone Number</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className={`w-full px-3 py-1.5 text-xs rounded-md border outline-none ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white focus:border-neutral-700' : 'bg-white border-neutral-200 focus:border-neutral-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium opacity-70">LinkedIn handle</label>
                  <input
                    type="text"
                    value={profileLinkedin}
                    onChange={(e) => setProfileLinkedin(e.target.value)}
                    className={`w-full px-2 py-1.5 text-[11px] rounded-md border outline-none ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium opacity-70">GitHub handle</label>
                  <input
                    type="text"
                    value={profileGithub}
                    onChange={(e) => setProfileGithub(e.target.value)}
                    className={`w-full px-2 py-1.5 text-[11px] rounded-md border outline-none ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Tailoring Card */}
          <div className={`p-6 rounded-xl border flex flex-col gap-4 ${
            darkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200'
          }`} id="ai-tailoring-card">
            <h2 className="font-display font-bold text-base flex items-center gap-2">
              <Sparkles className="text-yellow-500" size={16} />
              <span>AI Resume Enhancer</span>
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Tailor project metrics and skills definitions into result-driven descriptions optimized with Gemini for your target role.
            </p>

            <button
              onClick={handleAITailorResume}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Enhancing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  <span>Tailor & Optimize Resume</span>
                </>
              )}
            </button>

            {error && (
              <p className="text-[10px] text-red-500 bg-red-500/5 p-2 rounded border border-red-500/10">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Paper Resume Sheet Preview */}
        <div className="lg:col-span-2 print:col-span-1 print:p-0">
          <div className="p-8 sm:p-10 bg-white text-neutral-950 shadow-2xl rounded-2xl border border-neutral-200 min-h-[1050px] font-sans flex flex-col gap-6 print:shadow-none print:border-none print:p-0 print:rounded-none" id="resume-sheet">
            {/* Header section */}
            <div className="text-center space-y-2 border-b pb-4 border-neutral-300">
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-display">
                {profileName.toUpperCase()}
              </h1>
              <p className="text-xs font-semibold text-neutral-500 tracking-widest uppercase">
                {targetRole}
              </p>
              
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-neutral-600 font-mono">
                <span className="flex items-center gap-1">
                  <Mail size={11} /> {profileEmail}
                </span>
                <span>•</span>
                <span>{profilePhone}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Linkedin size={11} /> {profileLinkedin}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Github size={11} /> {profileGithub}
                </span>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold tracking-widest uppercase border-b border-neutral-300 pb-1 text-neutral-900 font-display">
                Professional Summary
              </h2>
              <p className="text-[12px] text-neutral-700 leading-relaxed">
                {aiSummary}
              </p>
            </div>

            {/* Core Skills */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold tracking-widest uppercase border-b border-neutral-300 pb-1 text-neutral-900 font-display">
                Core Competencies & Skills
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                {aiSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-[11px] bg-neutral-100 border border-neutral-200 text-neutral-800 px-2.5 py-0.5 rounded font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tailored Projects Section */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold tracking-widest uppercase border-b border-neutral-300 pb-1 text-neutral-900 font-display">
                Featured Projects
              </h2>
              <div className="space-y-4">
                {aiProjects.map((proj, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-[13px] font-bold text-neutral-900">
                        {proj.name}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {projects[i]?.techStack || "React, TypeScript"}
                      </span>
                    </div>
                    <ul className="list-disc pl-5 text-[11px] text-neutral-700 space-y-1 leading-relaxed">
                      {proj.bullets?.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Seed section */}
            <div className="space-y-2 mt-auto">
              <h2 className="text-xs font-bold tracking-widest uppercase border-b border-neutral-300 pb-1 text-neutral-900 font-display">
                Education
              </h2>
              <div className="flex justify-between items-start text-[12px] text-neutral-700">
                <div>
                  <p className="font-bold text-neutral-900">Bachelor of Science in Computer Science</p>
                  <p className="text-xs text-neutral-500">Indian Institute of Technology Madras (IITM)</p>
                </div>
                <span className="text-xs font-mono text-neutral-500">2023 - 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
