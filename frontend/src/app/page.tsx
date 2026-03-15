"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ArrowRight, Moon, Sun, Check, X, BrainCircuit, ShieldCheck, Clock, BarChart3, Settings, BookOpen } from "lucide-react";

const DEMO_QUESTION = {
  text: "What is the primary function of a reverse proxy in system architecture?",
  choices: ["Database indexing", "Load balancing & security", "Executing client-side JS", "Memory cache invalidation"],
  correct: 1,
};

const STATS = [
  { value: "10K+", label: "Assessments Generated" },
  { value: "50+", label: "Subject Domains" },
  { value: "2.5s", label: "Average Generation Time" },
  { value: "98%", label: "AI Accuracy Rate" },
];

export default function Home() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [selected, setSelected] = useState<number | null>(null);
  const isDark = theme === "dark";

  if (loading) return null;

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      
      {/* Background Pattern */}
      <div className={`absolute inset-0 z-0 ${isDark ? "opacity-[0.03]" : "opacity-[0.05]"}`} 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
      </div>

      {/* NAV */}
      <nav className={`relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b ${isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"}`}>
        <div className={`flex items-center gap-2.5 font-bold text-xl tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${isDark ? "bg-blue-600" : "bg-blue-600"}`}>
            <BrainCircuit size={18} />
          </div>
          QuizMaster AI
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition border ${isDark ? "border-slate-800 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {user ? (
            <Link href="/dashboard" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm">
              Dashboard &rarr;
            </Link>
          ) : (
            <>
              <Link href="/login" className={`font-medium text-sm px-4 py-2 transition ${isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}>
                Sign In
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Copy */}
        <div className="space-y-8">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider border ${isDark ? "border-blue-900 bg-blue-900/20 text-blue-400" : "border-blue-200 bg-blue-50 text-blue-700"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Enterprise-Grade Assessment Platform
          </div>

          <div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Professional AI <br />
              <span className="text-blue-600">Knowledge Evaluation</span>
            </h1>
          </div>

          <p className={`text-lg leading-relaxed max-w-lg ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            A secure, automated platform to generate robust technical assessments and quizzes in seconds. Built for evaluators, educators, and seamless candidate testing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            {user ? (
              <Link href="/dashboard" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-lg font-semibold text-base hover:bg-blue-700 transition-colors shadow-sm">
                Open Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link href="/register" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-lg font-semibold text-base hover:bg-blue-700 transition-colors shadow-sm">
                  Start Assessment <ArrowRight size={18} />
                </Link>
                <Link href="/login" className={`flex items-center justify-center px-8 py-3.5 rounded-lg font-semibold text-base border transition-colors ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-100"}`}>
                  Administrator Login
                </Link>
              </>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-200 dark:border-slate-800">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{s.value}</div>
                <div className={`text-xs font-medium uppercase tracking-wider mt-1 ${isDark ? "text-slate-500" : "text-slate-500"}`}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Demo Card */}
        <div className="relative">
          <div className={`relative rounded-xl border shadow-lg overflow-hidden ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
            {/* Card header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isDark ? "bg-emerald-500" : "bg-emerald-500"}`} />
                <span className={`text-sm font-semibold tracking-wide ${isDark ? "text-slate-300" : "text-slate-700"}`}>System Architecture Eval</span>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-700"}`}>
                ID: EVAL-8892
              </span>
            </div>

            {/* Question */}
            <div className="px-8 py-8">
              <div className="flex justify-between text-xs font-semibold mb-6 uppercase tracking-wider text-slate-500">
                <span>Question 1 of 5</span>
                <span className="text-blue-600 dark:text-blue-400">1:24 Remaining</span>
              </div>

              <p className={`text-lg font-semibold mb-6 leading-relaxed ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                {DEMO_QUESTION.text}
              </p>

              <div className="space-y-3">
                {DEMO_QUESTION.choices.map((choice, i) => {
                  const isSelected = selected === i;
                  const isCorrect = i === DEMO_QUESTION.correct;
                  const showResult = selected !== null;

                  let style = "";
                  if (!showResult) {
                     style = `border-slate-200 cursor-pointer transition-colors ${isDark ? "border-slate-700 hover:border-slate-500" : "hover:border-slate-400"}`;
                  } else if (isCorrect) {
                    style = "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20";
                  } else if (isSelected) {
                    style = "border-red-400 bg-red-50/50 dark:bg-rose-900/20";
                  } else {
                    style = `border-slate-200 opacity-40 ${isDark ? "border-slate-700" : ""}`;
                  }

                  return (
                    <button key={i} disabled={showResult !== null && selected !== null}
                      onClick={() => setSelected(i)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 rounded-lg border-2 text-left transition-all duration-200 ${style}`}
                    >
                      <span className={`font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        <span className="mr-3 text-xs font-bold text-slate-400">{String.fromCharCode(65 + i)}.</span>
                        {choice}
                      </span>
                      {showResult && isCorrect && <Check size={18} className="text-emerald-600 flex-shrink-0" />}
                      {showResult && isSelected && !isCorrect && <X size={18} className="text-red-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className={`mt-6 text-center transition-all duration-300 ${selected !== null ? "opacity-100" : "opacity-0"}`}>
                <button onClick={() => setSelected(null)}
                  className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">
                  Reset Demonstration
                </button>
              </div>
            </div>
            
            <div className={`px-6 py-3 border-t text-xs text-center ${isDark ? "bg-slate-800 border-slate-700 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
              Interactive module demonstration. Select an answer to evaluate.
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={`relative z-10 py-24 border-t ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 max-w-2xl">
            <h2 className={`text-3xl font-bold tracking-tight mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Platform Capabilities
            </h2>
            <p className={`text-lg ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              A comprehensive toolkit delivering rigorous, automated knowledge assessments specifically designed for professional environments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BrainCircuit size={24} />,
                title: "LLM-Powered Generation",
                desc: "Utilizes Google Gemini 2.5 Flash to synthesize domain-specific topics into strictly formatted, multi-tier difficulty assessments.",
              },
              {
                icon: <Clock size={24} />,
                title: "Time-Bound Testing",
                desc: "Enforces strict temporal constraints with automatic submission algorithms to simulate high-pressure professional environments.",
              },
              {
                icon: <BarChart3 size={24} />,
                title: "Granular Analytics",
                desc: "Delivers post-assessment performance breakdowns, highlighting specific knowledge gaps with automated correct-answer rationales.",
              },
              {
                icon: <Settings size={24} />,
                title: "System-Aware Theming",
                desc: "Adaptive UI rendering that respects user-agent color scheme preferences while maintaining high-contrast readability standards.",
              },
              {
                icon: <BookOpen size={24} />,
                title: "Historical Auditing",
                desc: "Maintains immutable records of all past evaluations, enabling longitudinal analysis of user performance metrics.",
              },
              {
                icon: <ShieldCheck size={24} />,
                title: "Secure Authentication",
                desc: "Implements DRF token-based authorization protocols ensuring that assessment data remains confidential and accessible only to authorized entities.",
              },
            ].map((feat) => (
              <div key={feat.title} className="group">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors ${isDark ? "bg-slate-800 text-blue-400 group-hover:bg-blue-900/40" : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"}`}>
                  {feat.icon}
                </div>
                <h3 className={`text-lg font-bold mb-3 ${isDark ? "text-slate-100" : "text-slate-900"}`}>{feat.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`relative z-10 py-24 px-6 text-center border-t ${isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"}`}>
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-3xl font-bold mb-5 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Ready to deploy professional assessments?
          </h2>
          <p className={`text-lg mb-10 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Initialize your organization's testing suite today and standardise your evaluation metrics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             {user ? (
               <Link href="/dashboard" className="px-8 py-3.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                 Access Control Panel
               </Link>
             ) : (
               <>
                 <Link href="/register" className="px-8 py-3.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                   Initialize Platform
                 </Link>
                 <Link href="/login" className={`px-8 py-3.5 rounded-lg font-semibold border transition-colors ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-100"}`}>
                   Authenticate
                 </Link>
               </>
             )}
          </div>
        </div>
      </section>
    </div>
  );
}
