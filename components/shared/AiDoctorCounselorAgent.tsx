"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  MessageSquare, 
  Stethoscope, 
  ChevronRight, 
  Phone, 
  GraduationCap, 
  Building2, 
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Search,
  MessageCircle,
  Award,
  Layers,
  FileCheck
} from "lucide-react";
import { medicalKnowledgeBase, KnowledgeBaseEntry } from "@/lib/knowledgeBase";
import { courses, siteSettings } from "@/lib/data";
import { submitLeadAction } from "@/features/leads/leadActions";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Message {
  id: string;
  sender: "ai" | "doctor";
  text: string;
  category?: string;
  matchedQuestion?: string;
  relatedFaqs?: string[];
  recommendation?: {
    title: string;
    slug: string;
    duration: string;
    feeINR: number;
    hospitals: string;
  };
  showLeadCapture?: boolean;
}

const FAQS_STORAGE_KEY = "imc_faqs_catalog";

export function AiDoctorCounselorAgent() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  const [kbEntries, setKbEntries] = useState<KnowledgeBaseEntry[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(FAQS_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Merge custom saved FAQs with our rich medical Knowledge Base
            const customMapped: KnowledgeBaseEntry[] = parsed.map((item: any) => ({
              id: item.id || Date.now(),
              category: item.category || "General",
              question: item.question,
              answer: item.answer,
              keywords: item.question.toLowerCase().split(/\s+/),
              suggestedFollowUps: ["What are the 0% EMI options?", "How do hospital rotations work?"],
            }));

            // Deduplicate by question title
            const existingQuestions = new Set(customMapped.map((c) => c.question.toLowerCase()));
            const nonDuplicates = medicalKnowledgeBase.filter((k) => !existingQuestions.has(k.question.toLowerCase()));
            return [...customMapped, ...nonDuplicates];
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    return medicalKnowledgeBase;
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Namaste Doctor! 🩺 I am Dr. IMC, your Medical Academic AI Advisor. I have answers to all queries about our 150+ CPD-accredited Fellowships, eligibility without NEET PG, hands-on hospital bedside rotations, and 0% EMI financing. How can I help your clinical career today?",
      relatedFaqs: [
        "Who is eligible to apply for fellowship?",
        "Can I apply without NEET PG?",
        "How do hospital bedside rotations work?",
        "What are the 0% Interest EMI tuition options?",
        "Are certificates CPD UK accredited?",
        "Tell me about Fellowship in Clinical Cardiology",
      ],
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [doctorPhone, setDoctorPhone] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [hasCapturedLead, setHasCapturedLead] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // =========================================================================
  // SMOOTH DRAGGABLE & MOVABLE FLOATING BUTTON ENGINE (TOUCH & MOUSE)
  // =========================================================================
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number; moved: boolean }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    moved: false,
  });

  // Initialize position on mount (default bottom-right)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPos = localStorage.getItem("imc_ai_btn_pos");
      if (savedPos) {
        try {
          const parsed = JSON.parse(savedPos);
          if (parsed && typeof parsed.x === "number" && typeof parsed.y === "number") {
            const maxX = Math.max(10, window.innerWidth - 75);
            const maxY = Math.max(10, window.innerHeight - 75);
            setPosition({
              x: Math.min(Math.max(10, parsed.x), maxX),
              y: Math.min(Math.max(10, parsed.y), maxY),
            });
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setPosition({
        x: Math.max(10, window.innerWidth - 80),
        y: Math.max(10, window.innerHeight - 90),
      });
    }
  }, []);

  // Window resize bounds containment
  useEffect(() => {
    const handleResize = () => {
      if (!position) return;
      const maxX = Math.max(10, window.innerWidth - 75);
      const maxY = Math.max(10, window.innerHeight - 75);
      setPosition((prev) => {
        if (!prev) return null;
        return {
          x: Math.min(Math.max(10, prev.x), maxX),
          y: Math.min(Math.max(10, prev.y), maxY),
        };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [position]);

  // Global mousemove and mouseup / touchend listeners when dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current || !isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        dragRef.current.moved = true;
      }
      const newX = Math.min(Math.max(10, dragRef.current.initialX + dx), window.innerWidth - 75);
      const newY = Math.min(Math.max(10, dragRef.current.initialY + dy), window.innerHeight - 75);
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (position && typeof window !== "undefined") {
          localStorage.setItem("imc_ai_btn_pos", JSON.stringify(position));
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragRef.current || !isDragging || !e.touches[0]) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragRef.current.startX;
      const dy = touch.clientY - dragRef.current.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        dragRef.current.moved = true;
      }
      const newX = Math.min(Math.max(10, dragRef.current.initialX + dx), window.innerWidth - 75);
      const newY = Math.min(Math.max(10, dragRef.current.initialY + dy), window.innerHeight - 75);
      setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        if (position && typeof window !== "undefined") {
          localStorage.setItem("imc_ai_btn_pos", JSON.stringify(position));
        }
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!position) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      moved: false,
    };
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!position || !e.touches[0]) return;
    const touch = e.touches[0];
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: position.x,
      initialY: position.y,
      moved: false,
    };
    setIsDragging(true);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    // If the button was dragged more than 4px, don't open the modal
    if (dragRef.current.moved) {
      dragRef.current.moved = false;
      return;
    }
    setIsOpen(true);
  };

  // Sync Knowledge Base when admin updates FAQs
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem(FAQS_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const customMapped: KnowledgeBaseEntry[] = parsed.map((item: any) => ({
              id: item.id || Date.now(),
              category: item.category || "General",
              question: item.question,
              answer: item.answer,
              keywords: item.question.toLowerCase().split(/\s+/),
              suggestedFollowUps: ["What are the 0% EMI options?", "How do hospital rotations work?"],
            }));
            const existingQuestions = new Set(customMapped.map((c) => c.question.toLowerCase()));
            const nonDuplicates = medicalKnowledgeBase.filter((k) => !existingQuestions.has(k.question.toLowerCase()));
            setKbEntries([...customMapped, ...nonDuplicates]);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "doctor",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      findKnowledgeBaseResponse(query);
    }, 450);
  };

  const findKnowledgeBaseResponse = (query: string) => {
    const qLower = query.toLowerCase().trim();
    const queryWords = qLower.split(/[\s,?.!]+/).filter((w) => w.length > 2);

    let bestEntry: KnowledgeBaseEntry | null = null;
    let maxScore = 0;

    for (const entry of kbEntries) {
      let score = 0;
      const questionText = entry.question.toLowerCase();
      const answerText = entry.answer.toLowerCase();

      // 1. Exact phrase match
      if (questionText.includes(qLower)) score += 25;
      if (answerText.includes(qLower)) score += 12;

      // 2. Keyword exact matches
      if (entry.keywords) {
        for (const kw of entry.keywords) {
          if (qLower.includes(kw.toLowerCase())) score += 8;
        }
      }

      // 3. Word token overlap
      for (const word of queryWords) {
        if (questionText.includes(word)) score += 4;
        if (answerText.includes(word)) score += 2;
        if (entry.category.toLowerCase().includes(word)) score += 3;
      }

      // 4. Critical clinical intent boosts
      if ((qLower.includes("neet") || qLower.includes("without neet")) && questionText.includes("neet")) score += 30;
      if ((qLower.includes("eligib") || qLower.includes("qualification") || qLower.includes("who can apply")) && (questionText.includes("eligible") || questionText.includes("eligibility"))) score += 30;
      if ((qLower.includes("hospital") || qLower.includes("rotation") || qLower.includes("bedside") || qLower.includes("attachment")) && questionText.includes("hospital")) score += 30;
      if ((qLower.includes("emi") || qLower.includes("fee") || qLower.includes("cost") || qLower.includes("price") || qLower.includes("scholarship")) && (questionText.includes("emi") || questionText.includes("scholarship") || questionText.includes("fee"))) score += 30;
      if ((qLower.includes("cpd") || qLower.includes("accredit") || qLower.includes("nmc") || qLower.includes("prescription") || qLower.includes("letterhead")) && (questionText.includes("cpd") || questionText.includes("nmc") || questionText.includes("prescription"))) score += 30;
      if ((qLower.includes("cardio") || qLower.includes("echo")) && questionText.includes("cardiology")) score += 30;
      if ((qLower.includes("icu") || qLower.includes("critical care") || qLower.includes("ventilator")) && questionText.includes("critical care")) score += 30;
      if ((qLower.includes("laparoscop") || qLower.includes("surgery") || qLower.includes("ot")) && questionText.includes("laparoscopic")) score += 30;
      if ((qLower.includes("fetal") || qLower.includes("ultrasound") || qLower.includes("anomaly")) && questionText.includes("fetal")) score += 30;
      if ((qLower.includes("derma") || qLower.includes("skin") || qLower.includes("laser")) && questionText.includes("dermatology")) score += 30;
      if ((qLower.includes("diabetes") || qLower.includes("diabetology") || qLower.includes("cgm")) && questionText.includes("diabetology")) score += 30;

      if (score > maxScore) {
        maxScore = score;
        bestEntry = entry;
      }
    }

    let replyText = "";
    let matchedQuestion: string | undefined = undefined;
    let category: string | undefined = undefined;
    let relatedFaqs: string[] = [];
    let recommendation: Message["recommendation"] = undefined;
    let showLeadCapture = false;

    if (bestEntry && maxScore >= 4) {
      matchedQuestion = bestEntry.question;
      replyText = bestEntry.answer;
      category = bestEntry.category;
      showLeadCapture = true;

      // Recommended follow-ups
      if (bestEntry.suggestedFollowUps && bestEntry.suggestedFollowUps.length > 0) {
        relatedFaqs = bestEntry.suggestedFollowUps;
      } else {
        relatedFaqs = kbEntries
          .filter((e) => e.id !== bestEntry?.id)
          .slice(0, 3)
          .map((e) => e.question);
      }

      // Course card attachment if specialty entry
      if (bestEntry.relevantCourseSlugs && bestEntry.relevantCourseSlugs.length > 0) {
        const foundCourse = courses.find((c) => c.slug === bestEntry?.relevantCourseSlugs?.[0]);
        if (foundCourse) {
          recommendation = {
            title: foundCourse.title,
            slug: foundCourse.slug,
            duration: foundCourse.duration,
            feeINR: foundCourse.feeINR,
            hospitals: foundCourse.clinicalHospitals.join(", "),
          };
        }
      }
    } else {
      replyText = `Thank you for your question, Doctor. Indian Medical Course offers 150+ CPD-accredited Post-Graduate Fellowships across Cardiology, Critical Care, Laparoscopy, Dermatology, and Fetal Medicine with hands-on bedside hospital attachments at Apollo, Fortis, and Max hospitals. Admission is open for MBBS / MD graduates without NEET PG.`;
      category = "Admissions & Fellowships";
      showLeadCapture = true;
      relatedFaqs = [
        "Who is eligible to apply for fellowship?",
        "Can I apply without NEET PG?",
        "What are the 0% Interest EMI tuition options?",
        "How do hospital bedside rotations work?",
      ];
    }

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: "ai",
      text: replyText,
      matchedQuestion,
      category,
      relatedFaqs,
      recommendation,
      showLeadCapture: showLeadCapture && !hasCapturedLead,
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorPhone.trim()) return;

    submitLeadAction({
      name: doctorName.trim() || "Doctor (Knowledge Base Inquiry)",
      mobile: doctorPhone.trim(),
      email: `${doctorPhone.replace(/\D/g, "")}@imc-kb-lead.in`,
      qualification: "MBBS",
      interestedCourse: "Knowledge Base Consulted Fellowship",
      formSource: "Dr. IMC Knowledge Base AI",
      leadSource: "Dr. IMC AI Advisor",
      priority: "URGENT",
      score: 95,
      notes: `Consulted Dr. IMC Medical Knowledge Base. Phone: ${doctorPhone}, Name: ${doctorName || "Doctor"}`,
    }).catch(console.error);

    setHasCapturedLead(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "ai",
        text: `Thank you, ${doctorName || "Doctor"}! 🙏 Our Senior Academic Director has been notified. The complete clinical logbook, hospital attachment schedule, and 0% EMI calculation have been dispatched to ${doctorPhone} on WhatsApp.`,
      },
    ]);
  };

  return (
    <>
      {/* Compact, Movable & Draggable Medical AI Doctor Floating Trigger Button */}
      {!isOpen && (
        <div
          style={{
            position: "fixed",
            left: position ? `${position.x}px` : "auto",
            top: position ? `${position.y}px` : "auto",
            right: position ? "auto" : "1.5rem",
            bottom: position ? "auto" : "1.5rem",
            zIndex: 40,
            touchAction: "none",
            userSelect: "none",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`cursor-grab active:cursor-grabbing transition-shadow ${isDragging ? "scale-105" : ""}`}
        >
          <div className="relative group">
            
            {/* Hover Tooltip Pill (Drag to Reposition hint) */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold py-2 px-3.5 rounded-2xl shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Dr. IMC AI Advisor</span>
              <span className="text-[10px] text-blue-300 font-mono">Drag to move • Click to ask</span>
            </div>

            {/* Main Interactive Button */}
            <button
              type="button"
              onClick={handleButtonClick}
              className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#0B4F9C] via-[#0D5BB5] to-[#1A73E8] hover:from-[#093E7D] hover:to-[#0B4F9C] text-white rounded-full shadow-xl shadow-blue-900/35 hover:shadow-2xl hover:shadow-blue-600/40 hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer border-2 border-white/40 backdrop-blur-md select-none"
              aria-label="Ask Dr. IMC Medical AI Agent (Movable)"
            >
              {/* Luminous Pulsing Aura */}
              <span className="absolute -inset-1 rounded-full bg-blue-500/40 opacity-75 animate-ping pointer-events-none" />

              {/* Combined Medical Stethoscope + AI Sparkle Icon */}
              <div className="relative flex items-center justify-center pointer-events-none">
                <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow-md ring-2 ring-white">
                  <Sparkles className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
                </span>
              </div>

              {/* Live Online Doctor Status Dot */}
              <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs pointer-events-none" />
            </button>

          </div>
        </div>
      )}

      {/* Interactive AI Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[430px] h-[590px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0B4F9C] via-blue-800 to-indigo-950 text-white flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 text-amber-300 shadow-inner">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-xs font-black text-white">Dr. IMC • Medical AI Advisor</h3>
                </div>
                <p className="text-[10px] text-blue-200">Connected to 40+ Medical Knowledge Base & FAQ Engine</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "doctor" ? "items-end" : "items-start"}`}
              >
                {/* Category Tag */}
                {msg.category && (
                  <span className="mb-1 text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <FileCheck className="w-3 h-3 text-[#0B4F9C]" />
                    <span>Verified • {msg.category}</span>
                  </span>
                )}

                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === "doctor"
                      ? "bg-[#0B4F9C] text-white rounded-br-xs font-medium shadow-xs"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-2xs whitespace-pre-line"
                  }`}
                >
                  {msg.matchedQuestion && (
                    <div className="font-black text-slate-900 mb-1.5 text-[11px] pb-1 border-b border-slate-100 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#0B4F9C] shrink-0" />
                      <span>{msg.matchedQuestion}</span>
                    </div>
                  )}
                  <div>{msg.text}</div>
                </div>

                {/* Structured Course Recommendation Card */}
                {msg.recommendation && (
                  <div className="mt-2.5 w-full bg-white p-3.5 rounded-2xl border border-blue-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-[#0B4F9C] bg-blue-50 px-2 py-0.5 rounded-md">
                        Recommended Fellowship
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">{msg.recommendation.duration}</span>
                    </div>

                    <div className="text-xs font-black text-slate-900">
                      {msg.recommendation.title}
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{msg.recommendation.hospitals}</span>
                    </div>

                    <div className="pt-1.5 flex items-center justify-between border-t border-slate-100">
                      <span className="text-xs font-extrabold text-slate-900">
                        ₹{msg.recommendation.feeINR.toLocaleString()}
                      </span>
                      <Link
                        href={`/courses/${msg.recommendation.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 bg-[#0B4F9C] text-white text-[10px] font-bold py-1 px-3 rounded-lg hover:bg-blue-800 transition-colors"
                      >
                        <span>View Syllabus</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Inline WhatsApp Prospectus Request Form */}
                {msg.showLeadCapture && !hasCapturedLead && (
                  <form
                    onSubmit={handleLeadSubmit}
                    className="mt-2.5 w-full bg-emerald-50/90 p-3.5 rounded-2xl border border-emerald-200 space-y-2"
                  >
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Get Official Prospectus, Syllabus & 0% EMI on WhatsApp:</span>
                    </div>
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        placeholder="Dr. Full Name"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-emerald-200 rounded-xl font-bold"
                      />
                      <input
                        type="tel"
                        placeholder="WhatsApp Number *"
                        value={doctorPhone}
                        onChange={(e) => setDoctorPhone(e.target.value)}
                        required
                        className="w-full text-xs p-2 bg-white border border-emerald-200 rounded-xl font-mono font-bold"
                      />
                      <button
                        type="submit"
                        className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs py-2 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-white" />
                        <span>Send Syllabus & Fee Details</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Related Knowledge Base Prompts */}
                {msg.relatedFaqs && msg.relatedFaqs.length > 0 && (
                  <div className="mt-2 space-y-1 w-full">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Related Inquiries:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.relatedFaqs.map((faqQ, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(faqQ)}
                          className="bg-white hover:bg-blue-50 text-blue-900 border border-blue-200/80 text-[11px] font-bold py-1 px-2.5 rounded-xl transition-all cursor-pointer shadow-2xs hover:border-[#0B4F9C] text-left"
                        >
                          {faqQ}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white p-3 rounded-2xl border border-slate-200 w-24">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* WhatsApp Direct Connect Bar */}
          <div className="p-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] shrink-0 px-3">
            <span className="text-slate-500">Need human counselor?</span>
            <a
              href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hello IMC Admissions, I have a question about 2026 Fellowships and eligibility criteria."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#25D366] font-extrabold hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask anything about eligibility, fees, hospital rotations..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0B4F9C] focus:bg-white transition-all font-medium"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 rounded-xl bg-[#0B4F9C] hover:bg-[#083E7D] text-white transition-colors cursor-pointer shrink-0 shadow-xs"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
