"use client";

import React, { useState, useEffect } from "react";
import { medicalKnowledgeBase } from "@/lib/knowledgeBase";
import { 
  HelpCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  CheckCircle2, 
  X, 
  Save,
  RotateCcw,
  Tag,
  BookOpen,
  Sparkles
} from "lucide-react";
import { AdminSecurityConfirmModal } from "@/components/admin/AdminSecurityConfirmModal";

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQS_STORAGE_KEY = "imc_faqs_catalog";

export default function AdminFaqsPage() {
  const [faqsList, setFaqsList] = useState<FaqItem[]>(() =>
    medicalKnowledgeBase.map((k) => ({
      id: k.id,
      question: k.question,
      answer: k.answer,
      category: k.category,
    }))
  );

  const [search, setSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [activeModal, setActiveModal] = useState<"create" | "edit" | null>(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isSuccessNotification, setIsSuccessNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("Knowledge base updated!");

  const [formData, setFormData] = useState<FaqItem>({
    id: 0,
    question: "",
    answer: "",
    category: "General",
  });

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setIsSuccessNotification(true);
    setTimeout(() => setIsSuccessNotification(false), 2500);
  };

  const updateFaqsAndStorage = (updated: FaqItem[]) => {
    setFaqsList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem(FAQS_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setFaqsList(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const filtered = faqsList.filter((f) => {
    if (selectedCategoryFilter !== "ALL" && f.category.toLowerCase() !== selectedCategoryFilter.toLowerCase()) {
      return false;
    }
    if (
      search &&
      !f.question.toLowerCase().includes(search.toLowerCase()) &&
      !f.answer.toLowerCase().includes(search.toLowerCase()) &&
      !f.category.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const openCreateModal = () => {
    setFormData({
      id: Date.now(),
      question: "",
      answer: "",
      category: "Admissions",
    });
    setActiveModal("create");
  };

  const openEditModal = (faq: FaqItem) => {
    setFormData({ ...faq });
    setActiveModal("edit");
  };

  const handleSave = () => {
    if (!formData.question.trim()) return;

    let updated: FaqItem[];
    if (activeModal === "create") {
      updated = [formData, ...faqsList];
    } else {
      updated = faqsList.map((f) => (f.id === formData.id ? formData : f));
    }

    updateFaqsAndStorage(updated);
    setActiveModal(null);
    showNotification(activeModal === "create" ? "New Knowledge Base entry added!" : "Knowledge Base entry saved!");
  };

  const handleDelete = (id: number, question: string) => {
    if (confirm(`Delete FAQ: "${question}"?`)) {
      const updated = faqsList.filter((f) => f.id !== id);
      updateFaqsAndStorage(updated);
      showNotification("FAQ deleted.");
    }
  };

  const handleResetDefaults = () => {
    const defaults = medicalKnowledgeBase.map((k) => ({
      id: k.id,
      question: k.question,
      answer: k.answer,
      category: k.category,
    }));
    updateFaqsAndStorage(defaults);
    showNotification("Reset to master knowledge catalog.");
  };

  const categoriesList = [
    "ALL",
    "Eligibility",
    "Admissions",
    "Clinical Rotations",
    "Certificates & CME",
    "Fees & EMI",
    "Specialties",
    "LMS & Exam",
    "General",
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-display">
              Medical FAQ & Knowledge Base CMS
            </h1>
            <span className="bg-blue-100 text-[#0B4F9C] text-[10px] font-black px-2.5 py-0.5 rounded-full">
              {faqsList.length} Entries
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manages the live website FAQ Accordion and feeds the Dr. IMC Medical AI Agent knowledge base in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isSuccessNotification && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notificationMsg}</span>
            </div>
          )}

          <button
            onClick={() => setIsSecurityModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 text-xs font-bold py-2.5 px-3.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            title="Reset to 40+ default seed Knowledge Base"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Master KB</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Q&A</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions, answers, or medical keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0B4F9C]"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedCategoryFilter === cat
                  ? "bg-[#0B4F9C] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "ALL" ? `All (${faqsList.length})` : cat}
            </button>
          ))}
        </div>

      </div>

      {/* FAQ Items List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.map((faq) => (
          <div key={faq.id} className="p-5 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-4">
            
            <div className="space-y-1.5 max-w-3xl">
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md inline-block">
                {faq.category}
              </span>
              <h3 className="text-sm font-extrabold text-slate-900">
                {faq.question}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {faq.answer}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              <button
                onClick={() => openEditModal(faq)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0B4F9C] hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(faq.id, faq.question)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                title="Delete Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-700">No Knowledge Base entries match your search</div>
            <p className="text-xs text-slate-400 mt-0.5">Try a different category or search term.</p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* REAL INTERACTIVE MODAL: ADD / EDIT FAQ                                    */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  {activeModal === "create" ? "Add New Knowledge Base Q&A" : "Edit Q&A Entry"}
                </h3>
                <p className="text-xs text-slate-500">
                  Instantly updates the website FAQ Accordion and trains the Dr. IMC Medical AI Agent.
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Tag
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                >
                  <option value="Eligibility">Eligibility</option>
                  <option value="Admissions">Admissions</option>
                  <option value="Clinical Rotations">Clinical Rotations</option>
                  <option value="Certificates & CME">Certificates & CME</option>
                  <option value="Fees & EMI">Fees & EMI</option>
                  <option value="Specialties">Specialties</option>
                  <option value="LMS & Exam">LMS & Exam</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  placeholder="e.g. What clinical skills are mastered in the Cardiology fellowship?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Answer
                </label>
                <textarea
                  rows={5}
                  placeholder="Provide clinical and academic details clearly..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 py-2.5 px-4 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!formData.question.trim()}
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Knowledge Base</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Master Security Password Modal for Reset */}
      <AdminSecurityConfirmModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        onSuccess={handleResetDefaults}
        title="Reset FAQs & Medical Knowledge Base"
        description="Are you sure you want to restore the 40+ topic Master Knowledge Base to factory defaults? Any custom added questions will be replaced."
        actionLabel="Confirm & Reset Knowledge Base"
      />

    </div>
  );
}
