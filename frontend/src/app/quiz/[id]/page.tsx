"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Loader2, AlertCircle, CheckCircle2, ChevronRight, Send, Clock, ChevronLeft } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function QuizTakingInterface() {
  const { id } = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSubmit = useCallback(async (forcedAnswers?: Record<number, number>) => {
    const finalAnswers = forcedAnswers ?? answers;
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(finalAnswers).map(([qId, cId]) => ({
        question_id: parseInt(qId),
        choice_id: cId
      }));
      const res = await api.post(`/quizzes/${id}/submit/`, { answers: formattedAnswers });
      router.push(`/result/${res.data.attempt_id}`);
    } catch (err) {
      setError("Failed to submit quiz. Please try again.");
      setSubmitting(false);
    }
  }, [answers, id, router]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}/`);
        setQuiz(res.data);
        setTimeLeft(res.data.questions.length * 90);
      } catch (err: any) {
        setError("Failed to load the quiz. It may not exist.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft === null || submitting) return;
    if (timeLeft <= 0) {
      handleSubmit(answers);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => (t ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, submitting, handleSubmit, answers]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading || submitting || error) return;
      const key = e.key.toLowerCase();
      if (['1', '2', '3', '4'].includes(key)) {
        const idx = parseInt(key) - 1;
        const currentQ = quiz?.questions[currentQuestionIdx];
        if (currentQ && currentQ.choices[idx]) {
          handleSelectChoice(currentQ.id, currentQ.choices[idx].id);
        }
      } else if (key === 'arrowright' || key === 'enter') {
        goToNext();
      } else if (key === 'arrowleft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quiz, currentQuestionIdx, loading, submitting, error]);

  const handleSelectChoice = (questionId: number, choiceId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: choiceId }));
  };

  const goToNext = () => {
    if (currentQuestionIdx < (quiz?.questions.length || 0) - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIdx(prev => prev + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const goToPrev = () => {
    if (currentQuestionIdx > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIdx(prev => prev - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const currentQuestion = quiz?.questions[currentQuestionIdx];
  const answeredCount = Object.keys(answers).length;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const timerColor = timeLeft !== null && timeLeft < 30
    ? 'text-rose-500 animate-pulse'
    : timeLeft !== null && timeLeft < 60
    ? 'text-amber-500'
    : isDark ? 'text-slate-400' : 'text-slate-600';

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-700"}`}>
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-black tracking-tight uppercase text-sm">Preparing Assessment...</h2>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        <div className={`max-w-md w-full p-10 rounded-[2.5rem] border text-center ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xl"}`}>
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
          <h2 className={`text-2xl font-black mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>Unavailable</h2>
          <p className="text-slate-500 mb-8">{error}</p>
          <button onClick={() => router.push('/dashboard')} className="w-full bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentQuestionIdx + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIdx === quiz.questions.length - 1;

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 transition-colors duration-500 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-up">

        {/* Header and Progress */}
        <div className={`rounded-[2.5rem] border p-8 transition-colors ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"}`}>
          <div className="flex justify-between items-center mb-6 gap-4">
            <div className="min-w-0">
              <h1 className={`text-2xl font-black truncate tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>{quiz.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400"}`}>
                   Q{currentQuestionIdx + 1} of {quiz.questions.length}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${answeredCount === quiz.questions.length ? "bg-emerald-500/10 text-emerald-500" : (isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400")}`}>
                  {answeredCount} Answered
                </span>
              </div>
            </div>
            <div className={`flex flex-col items-end gap-1 flex-shrink-0 p-3 rounded-2xl border ${isDark ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
              <div className="flex items-center gap-2">
                <Clock size={16} className={timerColor} />
                <span className={`text-xl font-black font-mono tracking-tighter ${timerColor}`}>
                  {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                </span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Time Left</span>
            </div>
          </div>
          
          <div className={`w-full overflow-hidden h-2.5 rounded-full ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
            <div 
              className="bg-blue-600 h-full transition-all duration-700 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Question Content */}
        <div className={`relative rounded-[2.5rem] border overflow-hidden transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'} ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-2xl shadow-slate-200/60"}`}>
          <div className="p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm opacity-90">
                {currentQuestionIdx + 1}
              </div>
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
            </div>

            <h2 className={`text-2xl sm:text-3xl font-black leading-tight mb-10 ${isDark ? "text-slate-100" : "text-slate-800"}`}>
              {currentQuestion.text}
            </h2>
            
            <div className="grid gap-4">
              {currentQuestion.choices.map((choice: any, idx: number) => {
                const isSelected = answers[currentQuestion.id] === choice.id;
                const letter = String.fromCharCode(65 + idx);
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(currentQuestion.id, choice.id)}
                    className={`group w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-500 shadow-sm'
                        : isDark ? 'border-slate-800 hover:border-blue-500/50 hover:bg-slate-800' : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                       <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                         isSelected ? 'bg-blue-600 text-white' : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50')
                       }`}>
                         {letter}
                       </span>
                       <span className={`text-lg transition-colors ${isSelected ? 'text-blue-700 dark:text-blue-400 font-semibold' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                         {choice.text}
                       </span>
                    </div>
                    {isSelected && <CheckCircle2 size={24} className="text-blue-600 flex-shrink-0 animate-fade-in" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className={`px-10 py-8 flex items-center justify-between border-t transition-colors ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/50 border-slate-100"}`}>
            <button
              onClick={goToPrev}
              disabled={currentQuestionIdx === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-0 ${isDark ? "text-slate-500 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
            >
              <ChevronLeft size={18} /> Prev
            </button>

            <div className="flex items-center gap-2">
              {quiz.questions.map((_: any, i: number) => (
                <div key={i} className={`h-1.5 rounded-full transition-all flex-shrink-0 ${
                  i === currentQuestionIdx ? 'w-6 bg-blue-600' : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`} />
              ))}
            </div>
            
            {!isLastQuestion ? (
              <button
                onClick={goToNext}
                className="bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
              >
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => handleSubmit()}
                disabled={submitting}
                className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-70 active:scale-95 shadow-sm"
              >
                {submitting ? (
                  <><Loader2 className="animate-spin" size={18} /> Sending...</>
                ) : (
                  <><Send size={18} /> Submit</>
                )}
              </button>
            )}
          </div>
        </div>
        
        <p className={`text-center text-[10px] font-black uppercase tracking-[0.2em] animate-pulse ${isDark ? "text-slate-700" : "text-slate-300"}`}>
          💡 Use keys 1-4 to select • Arrow keys for navigation
        </p>
      </div>
    </div>
  );
}
