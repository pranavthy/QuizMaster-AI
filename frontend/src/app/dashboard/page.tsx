"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { PlusCircle, PlayCircle, History, LogOut, Target, Trophy, BookOpen, Moon, Sun, ArrowRight, BrainCircuit } from "lucide-react";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`} />;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, attemptsRes] = await Promise.all([
          api.get("/quizzes/"),
          api.get("/attempts/"),
        ]);
        setQuizzes(quizRes.data);
        setAttempts(attemptsRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum: number, a: any) => sum + (a.score / (a.total || a.num_questions || 1)), 0) / attempts.length * 100)
    : null;

  const bestScore = attempts.length > 0
    ? Math.max(...attempts.map((a: any) => Math.round((a.score / (a.total || a.num_questions || 1)) * 100)))
    : null;

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Header */}
      <nav className={`sticky top-0 z-20 backdrop-blur-md border-b transition-colors duration-300 ${isDark ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-black text-xl">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-600"}`}>
               <BrainCircuit size={20} />
            </div>
            <span className={isDark ? "text-white" : "text-slate-900"}>QuizMaster AI</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium hidden sm:block ${isDark ? "text-slate-400" : "text-slate-600"}`}>Hello, {user?.username} 👋</span>
            <button onClick={toggleTheme} className={`p-2 rounded-xl transition-all hover:scale-110 ${isDark ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500 hover:text-slate-900"}`}>
              {isDark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
            <button onClick={logout} className={`p-2 rounded-xl transition-colors ${isDark ? "text-slate-500 hover:text-red-400 hover:bg-red-500/10" : "text-slate-400 hover:text-red-600 hover:bg-red-50"}`} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-fade-up">
            <h1 className={`text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Dashboard</h1>
            <p className={`mt-2 text-lg font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>Track your journey and master new topics.</p>
          </div>
          <Link 
            href="/create-quiz"
            className="animate-fade-up delay-100 btn-shimmer inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-7 py-3.5 rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all"
          >
            <PlusCircle size={20} /> Generate New Quiz
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-up delay-200">
          {loading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl" />)
          ) : (
            <>
              <div className={`p-6 rounded-3xl border transition-all hover:shadow-xl hover:-translate-y-1 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner">
                    <BookOpen size={26} />
                  </div>
                  <div>
                    <p className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{attempts.length}</p>
                    <p className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>Quizzes Taken</p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-3xl border transition-all hover:shadow-xl hover:-translate-y-1 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
                    <Target size={26} />
                  </div>
                  <div>
                    <p className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{avgScore !== null ? `${avgScore}%` : '--'}</p>
                    <p className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>Average Score</p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-3xl border transition-all hover:shadow-xl hover:-translate-y-1 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-inner">
                    <Trophy size={26} />
                  </div>
                  <div>
                    <p className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{bestScore !== null ? `${bestScore}%` : '--'}</p>
                    <p className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>Best Score</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="grid lg:grid-cols-2 gap-10 animate-fade-up delay-300">
          {/* Quizzes List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                <h2 className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Ready to Master</h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black ${isDark ? "bg-indigo-900/40 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                {quizzes.length} Topic{quizzes.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
            ) : quizzes.length === 0 ? (
              <div className={`rounded-3xl border-2 border-dashed p-12 text-center transition-colors ${isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`}>
                <p className="text-slate-500 font-medium mb-4 text-lg">No quizzes generated yet.</p>
                <Link href="/create-quiz" className="text-indigo-600 font-bold hover:text-indigo-500 transition-colors inline-flex items-center gap-1 group">
                  Generate your first one <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className={`flex flex-col justify-center group p-6 rounded-3xl border transition-all hover:shadow-xl hover:-translate-y-1 w-full min-h-[130px] overflow-hidden ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                    <div className="flex justify-between items-center gap-4 w-full h-full">
                      <div className="min-w-0 flex-1 w-full">
                        <h3 className={`font-bold text-lg leading-tight truncate transition-colors ${isDark ? "text-slate-100 group-hover:text-indigo-400" : "text-slate-900 group-hover:text-indigo-600"}`}>{quiz.title}</h3>
                        <div className="flex items-center gap-3 mt-3">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider leading-none ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>{quiz.topic}</span>
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider leading-none ${
                            quiz.difficulty?.toLowerCase() === 'easy' ? (isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700') :
                            quiz.difficulty?.toLowerCase() === 'medium' ? (isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-700') :
                            (isDark ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-50 text-rose-700')
                          }`}>{quiz.difficulty}</span>
                          <span className="text-[11px] font-bold text-slate-400 italic mt-0.5">{quiz.question_count} Questions</span>
                        </div>
                      </div>
                      <Link 
                        href={`/quiz/${quiz.id}`}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex-shrink-0"
                      >
                        Start
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attempts Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                <h2 className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Recent Mastery</h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black ${isDark ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                {attempts.length} Attempt{attempts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
            ) : attempts.length === 0 ? (
              <div className={`rounded-3xl border-2 border-dashed p-12 text-center transition-colors ${isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"}`}>
                <p className="text-slate-500 font-medium mb-2">No attempts yet.</p>
                <p className="text-sm text-slate-400">Complete a quiz to see your progress here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {attempts.map((attempt) => {
                  const pct = Math.min(Math.round((attempt.score / (attempt.total || attempt.num_questions || 1)) * 100), 100);
                  const statusColor = pct >= 70 ? 'emerald' : pct >= 50 ? 'amber' : 'rose';
                  const statusColorClass = pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500';
                  
                  return (
                    <Link href={`/result/${attempt.id}`} key={attempt.id} className={`flex flex-col justify-center group p-6 rounded-3xl border transition-all hover:shadow-xl hover:-translate-y-1 w-full min-h-[130px] overflow-hidden ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                      <div className="flex justify-between items-center gap-4 w-full">
                        <div className="min-w-0 flex-1 w-full">
                          <h3 className={`font-bold text-lg leading-tight truncate transition-colors ${isDark ? "text-slate-100 group-hover:text-emerald-400" : "text-slate-900 group-hover:text-emerald-600"}`}>{attempt.quiz_title}</h3>
                          <p className={`text-[11px] font-bold uppercase tracking-widest mt-1.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            {new Date(attempt.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {new Date(attempt.completed_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                          <div className={`mt-4 w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${statusColorClass} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 min-w-[60px]">
                          <div className={`text-2xl font-black transition-colors bg-clip-text text-transparent bg-gradient-to-br ${statusColor === 'emerald' ? 'from-emerald-400 to-teal-600' : statusColor === 'amber' ? 'from-amber-400 to-orange-600' : 'from-rose-400 to-pink-600'}`}>
                            {pct}%
                          </div>
                          <div className={`text-xs font-black uppercase tracking-widest ${isDark ? "text-slate-600" : "text-slate-300"}`}>
                            {attempt.score} / {attempt.total || attempt.num_questions}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
