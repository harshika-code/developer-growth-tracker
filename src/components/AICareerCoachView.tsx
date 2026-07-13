import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Brain, HelpCircle, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TrackerState } from '../types';

interface AICareerCoachViewProps {
  trackerState: TrackerState;
  darkMode: boolean;
}

export const AICareerCoachView: React.FC<AICareerCoachViewProps> = ({
  trackerState,
  darkMode
}) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string>(() => {
    try {
      return localStorage.getItem('dev_growth_tracker_ai_advice') || '';
    } catch {
      return '';
    }
  });
  const [error, setError] = useState('');

  // Persist advice locally once generated
  useEffect(() => {
    try {
      localStorage.setItem('dev_growth_tracker_ai_advice', advice);
    } catch (e) {
      console.error(e);
    }
  }, [advice]);

  // Request comprehensive advice based on tracker state
  const handleGenerateAdvice = async (customPrompt?: string) => {
    setLoading(true);
    setError('');
    try {
      const customKey = localStorage.getItem('dev_growth_tracker_gemini_api_key') || '';
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': customKey,
        },
        body: JSON.stringify({
          state: trackerState,
          customPrompt: customPrompt || null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch career coaching advice. Check Gemini API key.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAdvice(data.advice);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with career coach.');
    } finally {
      setLoading(false);
    }
  };

  const PRESET_TOPICS = [
    { label: "DSA & Placement Readiness", prompt: "Evaluate my DSA topics progress and suggest a personalized placement prep plan." },
    { label: "Resume & Portfolio Feedback", prompt: "Look at my projects tech stack and suggest 3 resume optimization adjustments." },
    { label: "Next Week Study Priority", prompt: "Identify my bottleneck from pending tasks and organize a highly structured study plan." }
  ];

  return (
    <div className="space-y-8 animate-fade-in" id="ai-coach-container">
      {/* View Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Sparkles className="text-yellow-500 animate-pulse" size={24} />
          <h1 className="font-display font-bold text-2xl tracking-tight">AI Career Coach</h1>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Unlock highly personalized, strategic weekly advice based directly on your tasks, skills roadmaps, and project portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Control Panel */}
        <div className="space-y-6">
          <div className={`p-6 rounded-xl border flex flex-col gap-4 ${
            darkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200'
          }`} id="ai-control-panel">
            <h2 className="font-display font-bold text-base flex items-center gap-2">
              <Brain className="text-neutral-400" size={18} />
              <span>Coaching Trigger</span>
            </h2>
            <p className="text-xs text-neutral-400">
              The AI reads your real tracker stats, LeetCode quantities, active project repositories, and builds a specialized roadmap tailored for {trackerState.profileName || 'you'}.
            </p>

            <button
              onClick={() => handleGenerateAdvice()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 dark:from-white dark:to-neutral-100 dark:hover:from-neutral-100 dark:hover:to-neutral-200 text-white dark:text-neutral-950 font-semibold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Analyzing Growth State...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Generate Weekly Career Advice</span>
                </>
              )}
            </button>

            {error && (
              <div className="text-xs text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/20">
                {error}
              </div>
            )}
          </div>

          {/* Quick-Prompt Suggestions */}
          <div className={`p-6 rounded-xl border flex flex-col gap-4 ${
            darkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200'
          }`} id="prompt-suggestions-card">
            <h2 className="font-display font-bold text-base flex items-center gap-2">
              <HelpCircle className="text-neutral-400" size={18} />
              <span>Prompt Accelerators</span>
            </h2>
            <div className="space-y-2">
              {PRESET_TOPICS.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => handleGenerateAdvice(topic.prompt)}
                  disabled={loading}
                  className={`w-full text-left p-3 rounded-lg text-xs border transition-all flex items-center justify-between group ${
                    darkMode 
                      ? 'bg-neutral-950/40 border-neutral-800/80 hover:bg-neutral-800/40 hover:border-neutral-700 text-neutral-300' 
                      : 'bg-neutral-50 border-neutral-100 hover:bg-neutral-100/60 hover:border-neutral-200 text-neutral-700'
                  }`}
                >
                  <span>{topic.label}</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Output display area */}
        <div className="lg:col-span-2">
          <div className={`p-6 rounded-xl border min-h-[400px] flex flex-col ${
            darkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200'
          }`} id="ai-coaching-output">
            <div className="flex items-center justify-between border-b pb-3 mb-4 border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-yellow-500" />
                <h2 className="font-display font-bold text-base">Your Weekly Advice Report</h2>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest opacity-50">
                Gemini Powered Analysis
              </span>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-neutral-400 py-12">
                <Loader2 size={36} className="animate-spin text-neutral-500" />
                <p className="text-sm font-medium animate-pulse">Formulating personalized coaching strategies...</p>
                <p className="text-xs opacity-60 text-center max-w-sm">
                  Evaluating completed DSA problems, project tech stacks, and outstanding tasks. This will take a brief moment.
                </p>
              </div>
            ) : advice ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 space-y-4 leading-relaxed font-sans markdown-body">
                <ReactMarkdown>{advice}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-400 py-12 space-y-3">
                <Brain size={42} className="opacity-30" />
                <p className="text-sm font-medium">No advice report active.</p>
                <p className="text-xs opacity-60 max-w-sm">
                  Click the "Generate" button on the left to analyze your roadmap and draft a custom progress advice dossier.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
