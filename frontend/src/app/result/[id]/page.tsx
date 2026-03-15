"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Loader2, RotateCcw, Trophy, Star, Share2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { useTheme } from "@/context/ThemeContext";

function ScoreRing({ percentage }: { percentage: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 70 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-48 h-48 mx-auto group">
      <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
      <svg className="w-full h-full -rotate-90 relative transition-transform duration-500 group-hover:scale-105" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)",
            filter: "drop-shadow(0 0 12px rgba(255,255,255,0.4))"
          }}
          className="animate-ring"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-white drop-shadow-md">{percentage}%</span>
        <span className="text-xs font-black text-white/60 uppercase tracking-[0.2em] mt-1">Score</span>
      </div>
    </div>
  );
}

export default function QuizResult() {
  const { id } = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const hasFiredConfetti = useRef(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/attempts/${id}/`);
        setResult(res.data);
        
        const pct = Math.round((res.data.score / res.data.total) * 100);
        
        if (pct >= 80 && !hasFiredConfetti.current) {
          hasFiredConfetti.current = true;
          setTimeout(() => {
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#2563eb', '#3b82f6', '#60a5fa', '#10b981']
            });
          }, 500);
        }

        setTimeout(() => setShowDetails(true), 400);
      } catch (err) {
        console.error("Failed to fetch results", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center dark:bg-slate-950 bg-slate-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy className="text-blue-600 w-6 h-6 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-slate-500 font-bold tracking-tight animate-pulse uppercase text-sm">Grading your responses...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full text-center p-8">
          <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900">Result not found</h2>
          <Link href="/dashboard" className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.total) * 100);
  const isPerfect = percentage === 100;
  
  const gradientClass = percentage >= 80
    ? "from-blue-600 to-blue-800 shadow-blue-500/40"
    : percentage >= 50
    ? "from-amber-500 to-orange-600 shadow-amber-500/30"
    : "from-rose-600 to-pink-700 shadow-rose-500/30";

  const feedback = percentage === 100 ? "Flawless Victory! 🌟" :
    percentage >= 80 ? "Expert Mastery! 🔥" :
    percentage >= 60 ? "Solid Performance! 👍" :
    percentage >= 40 ? "Getting There! 💪" :
    "More Study Needed! 📚";

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-slate-50 py-12 px-4 transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-black text-sm uppercase tracking-wider transition-all group">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Dashboard
          </Link>
          <button className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 transition-colors">
            <Share2 size={18} />
          </button>
        </div>

        {/* Score Card */}
        <div className={`relative bg-gradient-to-br ${gradientClass} rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden animate-fade-up`}>
          {/* Decorative shapes */}
          <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-black/10 rounded-full blur-2xl" />

          {isPerfect && (
            <div className="absolute top-6 right-6 bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 animate-bounce">
              <Star size={14} fill="currentColor" /> Perfect
            </div>
          )}

          <div className="text-center mb-8 relative z-10">
            <p className="text-white/60 text-xs font-black uppercase tracking-[0.3em] mb-3">{result.quiz_title}</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{feedback}</h1>
          </div>

          <ScoreRing percentage={percentage} />

          <div className="flex items-center justify-center gap-8 mt-10 relative z-10">
            <div className="text-center group">
              <div className="text-4xl font-black group-hover:scale-110 transition-transform">{result.score}</div>
              <div className="text-xs text-white/50 font-black uppercase tracking-widest mt-1.5">Correct</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center group">
              <div className="text-4xl font-black group-hover:scale-110 transition-transform">{result.total - result.score}</div>
              <div className="text-xs text-white/50 font-black uppercase tracking-widest mt-1.5">Mistakes</div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all duration-700 ${showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Analysis Breakdown</h3>
            <div className="flex gap-3">
               <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-tighter flex items-center gap-1.5">
                  <CheckCircle2 size={14}/> {result.score} Correct
               </div>
               <div className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-tighter flex items-center gap-1.5">
                  <XCircle size={14}/> {result.total - result.score} Wrong
               </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {result.answers.map((ans: any, idx: number) => (
              <div key={idx} className={`p-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors ${ans.is_correct ? 'border-l-4 border-emerald-500' : 'border-l-4 border-rose-500'}`}>
                <div className="flex gap-6 items-start">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-sm border ${ans.is_correct ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {ans.question}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className={`rounded-2xl p-4 flex items-center justify-between border-2 ${ans.is_correct ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/10 dark:border-emerald-800 dark:text-emerald-400' : 'bg-rose-50/50 border-rose-200 text-rose-800 dark:bg-rose-900/10 dark:border-rose-800 dark:text-rose-400'}`}>
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Your Choice</div>
                        <div className="font-bold">{ans.selected_choice || "—"}</div>
                      </div>
                      {!ans.is_correct && (
                        <div className="rounded-2xl p-4 flex items-center justify-between border-2 bg-emerald-50/50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/10 dark:border-emerald-800 dark:text-emerald-400">
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Correct Answer</div>
                          <div className="font-bold">{ans.correct_choice}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-10 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-quiz" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <RotateCcw size={18} /> New Challenge
            </Link>
            <Link href="/dashboard" className={`flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold border-2 transition-all hover:bg-white dark:hover:bg-slate-800 ${isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-600 hover:shadow-sm"}`}>
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
