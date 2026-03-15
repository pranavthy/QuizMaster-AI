"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Loader2, BrainCircuit, Settings, Wand2, Clock, CheckCircle2 } from "lucide-react";


import { useTheme } from "@/context/ThemeContext";

export default function CreateQuiz() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionTypes, setQuestionTypes] = useState<string[]>(["mcq"]);
  const [learningGoal, setLearningGoal] = useState("Practice");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";


  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/quizzes/generate/", {
        topic,
        difficulty,
        num_questions: numQuestions,
        question_types: questionTypes.length > 0 ? questionTypes : ["mcq"],
        learning_goal: learningGoal,
      });
      router.push(`/quiz/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate quiz. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 relative ${isDark ? "bg-[#09090b]" : "bg-slate-50"}`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? "opacity-20" : "opacity-50"}`}></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <Link href="/dashboard" className={`inline-flex items-center mb-10 font-bold text-sm tracking-wide uppercase transition-all group ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}>
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        
        <div className={`max-w-xl mx-auto rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-500 ${isDark ? "bg-[#111115] border-slate-800/80 shadow-black/50" : "bg-white border-slate-200/60 shadow-slate-200/50"}`}>
          {/* Header */}
          <div className="relative p-8 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
            {/* Decorative shapes */}
            <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 bg-black/20 rounded-full blur-2xl mix-blend-overlay"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20 shadow-lg">
                <BrainCircuit size={24} className="text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Design Assessment
              </h1>
              <p className="mt-2 text-blue-100/80 text-sm sm:text-base font-medium max-w-sm mx-auto">
                Precision-craft your AI evaluation parameters for optimal knowledge testing.
              </p>
            </div>
          </div>

          <div className={`p-8 ${isDark ? "bg-[#111115]" : "bg-white"}`}>
            {/* Visual Progress Flow */}
            <div className={`relative flex items-start justify-between mb-10 px-2 sm:px-6 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              {/* Absolute line connecting all steps */}
              <div className={`absolute top-4 left-10 right-10 h-[2px] -z-0 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}></div>
              
              <div className="flex flex-col items-center gap-3 w-16 text-blue-600 dark:text-blue-500 z-10 bg-transparent">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ring-[6px] ${isDark ? "bg-blue-900/40 ring-[#111115]" : "bg-blue-50 ring-white"}`}>1</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-center">Configure</span>
              </div>
              
              <div className="flex flex-col items-center gap-3 w-16 z-10 bg-transparent">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ring-[6px] transition-colors ${loading ? "bg-blue-600 text-white animate-pulse" : isDark ? "bg-slate-800" : "bg-slate-50"} ${isDark ? "ring-[#111115]" : "ring-white"}`}>
                  {loading ? <Loader2 size={14} className="animate-spin" /> : "2"}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest text-center transition-colors ${loading ? "text-blue-600 dark:text-blue-500" : ""}`}>Generate</span>
              </div>
              
              <div className="flex flex-col items-center gap-3 w-16 z-10 bg-transparent">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ring-[6px] ${isDark ? "bg-slate-800 ring-[#111115]" : "bg-slate-50 ring-white"}`}>3</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-center hidden sm:block">Take Quiz</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-center sm:hidden">Quiz</span>
              </div>
              
              <div className="flex flex-col items-center gap-3 w-16 z-10 bg-transparent">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ring-[6px] ${isDark ? "bg-slate-800 ring-[#111115]" : "bg-slate-50 ring-white"}`}>4</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-center">Review</span>
              </div>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start text-rose-600 dark:text-rose-400 font-medium">
                <span className="block">{error}</span>
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-8">
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Subject Domain</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Data Structures, Cell Biology, Macroeconomics"
                    className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all placeholder:font-medium font-bold text-base ${
                      isDark 
                        ? "bg-[#09090b] border-slate-800 text-white focus:border-blue-500 focus:bg-[#111115] placeholder:text-slate-600" 
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white placeholder:text-slate-400"
                    }`}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={loading}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-1">
                <div>
                  <div className={`flex items-center justify-between mb-2`}>
                    <label className={`block text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>Difficulty Level</label>
                    <span className={`text-[10px] font-bold ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      {difficulty === "Easy" ? "Basic Concepts" : difficulty === "Medium" ? "Problem Solving" : "Advanced Level"}
                    </span>
                  </div>
                  <div className={`flex items-center p-1 border-2 rounded-xl h-[52px] ${isDark ? "bg-[#09090b] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                    {["Easy", "Medium", "Hard"].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDifficulty(level)}
                        className={`flex-1 h-full rounded-lg text-xs font-bold transition-all ${
                          difficulty === level
                            ? isDark ? "bg-slate-800 text-white shadow-sm" : "bg-white text-blue-700 shadow-sm border border-slate-200/50"
                            : isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>Volume</label>
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                      <Clock size={12} />
                      ~{Math.ceil(numQuestions * 0.5)} min total
                    </div>
                  </div>
                  <div className={`flex items-center gap-4 px-4 py-3 border-2 rounded-xl h-[52px] ${isDark ? "bg-[#09090b] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                      disabled={loading}
                    />
                    <div className={`w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-lg font-black text-sm ${isDark ? "bg-slate-800 text-blue-400" : "bg-white text-blue-600 shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-slate-200"}`}>
                      {numQuestions}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className={`flex items-center justify-between mb-2`}>
                  <label className={`block text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>Learning Goal</label>
                  <span className={`text-[10px] font-bold ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    AI Context & Tone
                  </span>
                </div>
                <div className={`flex items-center p-1 border-2 rounded-xl h-[52px] ${isDark ? "bg-[#09090b] border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  {["Practice", "Interview Prep", "Exam Revision"].map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setLearningGoal(goal)}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all ${
                        learningGoal === goal
                          ? isDark ? "bg-slate-800 text-white shadow-sm" : "bg-white text-blue-700 shadow-sm border border-slate-200/50"
                          : isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Question Types</label>
                <div className="flex flex-wrap gap-4">
                  <label className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    questionTypes.includes("mcq") 
                      ? isDark ? "border-blue-500 bg-blue-900/20" : "border-blue-500 bg-blue-50" 
                      : isDark ? "border-slate-800 bg-[#09090b] hover:border-slate-700" : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-blue-600 rounded bg-slate-100 border-slate-300 dark:bg-slate-700 dark:border-slate-600" 
                      checked={questionTypes.includes("mcq")}
                      onChange={(e) => {
                        if (e.target.checked) setQuestionTypes([...questionTypes, "mcq"]);
                        else setQuestionTypes(questionTypes.filter(t => t !== "mcq"));
                      }}
                    />
                    <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>Multiple Choice</span>
                  </label>

                  <label className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    questionTypes.includes("tf") 
                      ? isDark ? "border-emerald-500 bg-emerald-900/20" : "border-emerald-500 bg-emerald-50" 
                      : isDark ? "border-slate-800 bg-[#09090b] hover:border-slate-700" : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-emerald-600 rounded bg-slate-100 border-slate-300 dark:bg-slate-700 dark:border-slate-600" 
                      checked={questionTypes.includes("tf")}
                      onChange={(e) => {
                        if (e.target.checked) setQuestionTypes([...questionTypes, "tf"]);
                        else setQuestionTypes(questionTypes.filter(t => t !== "tf"));
                      }}
                    />
                    <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>True / False</span>
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide uppercase hover:shadow-xl hover:shadow-blue-500/25 transition-all disabled:opacity-80 active:scale-[0.98] h-[52px]"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex justify-center items-center gap-3">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span className="opacity-90 tracking-widest">Generating Questions...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                      Generate Assessment
                    </>
                  )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
