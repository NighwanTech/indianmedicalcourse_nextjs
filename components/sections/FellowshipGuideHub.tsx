"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ChevronDown,
  Library,
  Layers,
  Activity,
  PhoneCall,
  X
} from "lucide-react";

export function FellowshipGuideHub() {
  const [activeTab, setActiveTab] = useState<"faqs" | "comparison" | "top_programs" | "credibility">("faqs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaqCategory, setSelectedFaqCategory] = useState("All");
  
  // Single active open FAQ state - when one opens, all others automatically close
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  // 13 Comprehensive Q&As provided by the user
  const allFaqs = [
    {
      id: 1,
      category: "Eligibility & NEET PG",
      question: "Who is Eligible to Apply for a Fellowship Program?",
      summary: "MBBS, MD, MS, DNB, BDS, MDS, AYUSH & Nursing practitioners with medical council registration.",
      answer: "Eligibility criteria for fellowship programs can vary depending on the specific program. Generally, applicants must have completed a medical or dental degree, postgraduate degree, or equivalent qualification (MBBS, MD, MS, DNB, BDS, MDS, or recognized AYUSH/nursing degrees), and must be registered with the relevant medical council.\n\nFor IMC online & hybrid fellowship programs, eligibility requirements differ based on the specific program you are interested in. IMC fellowships are tailored specifically for medical professionals who want to enhance their clinical acumen and procedural skills in a particular area of healthcare.",
    },
    {
      id: 2,
      category: "General",
      question: "What is a Medical Fellowship Program?",
      summary: "Specialized post-graduate clinical training focusing on procedural skills and advanced hospital cases.",
      answer: "A medical fellowship program is a specialized training course aimed at enhancing skills and providing in-depth education in a specific medical field. These programs, usually taken after completing an MBBS degree or postgraduate medical degree, are typically short-term to medium-term (lasting anywhere from a few months to a year), focusing on advanced clinical training in a particular specialty.",
    },
    {
      id: 3,
      category: "Eligibility & NEET PG",
      question: "Can I Apply for a Fellowship Without NEET PG?",
      summary: "Yes! Direct CV and qualification review without requiring the NEET PG entrance examination.",
      answer: "Yes, absolutely! Many healthcare ed-tech platforms, like IMC, offer fellowship programs for MBBS graduates that do not require the NEET PG entrance exam. You can apply for these fellowships by submitting your CV, medical degree, and state medical council registration. While select advanced surgical attachments may involve a brief counsellor interview, most do not, making the application process straightforward and hassle-free.",
    },
    {
      id: 4,
      category: "General",
      question: "What are the Different Types of Fellowships?",
      summary: "Sub-specialties in Cardiology, ICU, Laparoscopy, Dermatology, Fetal Ultrasound & Gastro.",
      answer: "The type of fellowship you choose depends on your career goals and the area of expertise you want to specialize in (e.g. Clinical Cardiology, Critical Care, Laparoscopy, Fetal Ultrasound, Clinical Dermatology, Gastroenterology). To ensure that you choose a fellowship program that aligns with your learning goals, research the clinical rotation dates and curriculum modules suitable for you.",
    },
    {
      id: 5,
      category: "General",
      question: "How Long do Fellowships Last?",
      summary: "Durations range from 3-month skill masterclasses to 6–12-month clinical hospital fellowships.",
      answer: "Fellowship programs typically last anywhere from six months to two years, depending on the specific program and your career goals. Short-term procedural workshops last 3 months, 1-year clinical fellowships focus on intensive bedside patient management and hospital attachments, and comprehensive long-term diplomas combine structured theory with hospital ICU/OT rotations.",
    },
    {
      id: 6,
      category: "Recognition & CME",
      question: "Are Fellowships Recognized by MCI / NMC and International Bodies?",
      summary: "Structured under international CPD Standards (UK), AFPI, BAC, and hospital quality standards.",
      answer: "Yes, fellowship programs in India are structured to meet established clinical standards and quality frameworks. IMC fellowship programs are accredited by CPD Standards Office (UK), AFPI, BAC, and leading healthcare institutions. Completing an accredited fellowship enhances your employability and gives you a competitive advantage in top hospital networks and private practice.",
    },
    {
      id: 7,
      category: "General",
      question: "What is the Difference Between a Fellowship and an Internship?",
      summary: "Fellowships offer sub-specialty mastery, while internships are mandatory undergraduate rotations.",
      answer: "A fellowship primarily focuses on professional development, advanced procedural training, and collaborating with senior specialists in a specialized field. Fellowships are longer-term programs that allow for deep exploration and skill development in a particular area.\n\nIn contrast, an internship is a mandatory undergraduate rotation that provides broad, rotational basic training across hospital departments to fulfill primary medical degree requirements.",
    },
    {
      id: 8,
      category: "Benefits & Fees",
      question: "What are the Key Benefits of a Fellowship Program?",
      summary: "Advanced procedures, 50+ hospital networks, 0% EMI financing, and verifiable CPD credentials.",
      answer: "• Professional Development: Enhance clinical knowledge, access modern case studies, and acquire new surgical & diagnostic techniques.\n• Hospital Attachments: Bedside training at 50+ tertiary hospital networks (Apollo, Fortis, Max, Medanta).\n• Networking: Connect with renowned faculty and peers, opening doors to consultant job opportunities and referrals.\n• Funding & Zero-Cost EMI: Flexible 0% interest EMI options through banking partners, easing the financial investment.\n• Prestige: Earning a fellowship credential boosts your professional reputation, OPD patient trust, and institutional credibility.",
    },
    {
      id: 9,
      category: "Recognition & CME",
      question: "How Can a Fellowship Add Credibility to My Practice?",
      summary: "Verified clinical logbooks, CPD certificates, and research access to McGraw Hill & Springer Nature.",
      answer: "• Recognition: Earning a fellowship certification signifies your expertise and commitment to clinical excellence.\n• Validation: Fellowship certificates serve as endorsements from reputable healthcare organizations (such as IMC and CPD UK).\n• Access to Esteemed Publishers: IMC fellows receive access to top-tier study materials and research articles from world-renowned publishers like McGraw Hill, Wolters Kluwer, and Springer Nature.",
    },
    {
      id: 10,
      category: "Admissions & Apply",
      question: "How Do I Apply for a Fellowship Program?",
      summary: "Simple 4-step online form, counsellor evaluation, and council credential submission.",
      answer: "Applying for an IMC fellowship is a simple, 4-step process:\n1. Identify the program matching your career goals on our website.\n2. Submit the online application form with your basic details.\n3. An Academic Admissions Counsellor will contact you to evaluate eligibility, explain clinical attachment schedules, and arrange 0% EMI financing.\n4. Submit your degree transcripts and medical council registration to receive your official confirmation letter.",
    },
    {
      id: 11,
      category: "Top Programs",
      question: "Which Fellowship is Best After MBBS?",
      summary: "Clinical Cardiology, Critical Care ICU, Family Medicine, Dermatology, and Fetal Ultrasound.",
      answer: "Popular high-yield programs after MBBS include:\n• Fellowship in Family Medicine: Accredited by AFPI, BAC, and CPD UK. Features 1-month clinical training at a flagship hospital and lifetime AFPI membership.\n• Fellowship in Clinical Cardiology: 2D Echo, ECG interpretation, Cath Lab observer-ships, and ICCU emergency protocols.\n• Fellowship in Critical Care: Mechanical ventilation, arterial lines, ARDS protocols, and ICU bedside rotations.\n• Fellowship in Endodontics: Tailored for dental surgeons with 3-month contact program performing live root canal procedures.\n• Fellowship in Pulmonology & Gastroenterology: 12-week clinical rotations at top tertiary hospitals under leading consultants.\n• Fellowship in Clinical Oncology: Video lectures, case capsules, and a 6-week contact program at top oncology centres.",
    },
    {
      id: 12,
      category: "General",
      question: "What to Look for in a Fellowship Program?",
      summary: "Verify accreditation, hospital bedside attachment depth, faculty credentials, and flexible schedule.",
      answer: "• Alignment with Career Goals: Choose a fellowship matching your intended clinical specialization.\n• Reputation & Institutional Quality: Verify accreditation (CPD UK, AFPI, tertiary hospital network).\n• Hands-on Mentorship: Ensure the program includes live bedside or wet-lab hospital attachments under senior specialists.\n• Scheduling Flexibility: Choose hybrid programs with recorded modules that fit around your hospital duty hours.",
    },
    {
      id: 13,
      category: "Benefits & Fees",
      question: "What 0% Interest EMI & Scholarship Options are Available?",
      summary: "3, 6, 9, 12-month zero-interest EMI financing and merit fee waivers up to 40%.",
      answer: "IMC provides 3, 6, 9, and 12-month zero-interest EMI financing through our banking partners with no hidden processing fees. Merit scholarships and early-bird fee waivers of up to 40% are also granted upon counsellor assessment.",
    },
  ];

  const categoriesList = ["All", "Eligibility & NEET PG", "General", "Recognition & CME", "Benefits & Fees", "Top Programs"];

  const filteredFaqs = allFaqs.filter((faq) => {
    if (selectedFaqCategory !== "All" && faq.category !== selectedFaqCategory) return false;
    if (
      searchQuery &&
      !faq.question.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !faq.summary.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Split into independent columns to eliminate CSS grid row-stretching completely
  const leftColFaqs = filteredFaqs.filter((_, i) => i % 2 === 0);
  const rightColFaqs = filteredFaqs.filter((_, i) => i % 2 === 1);

  return (
    <section className="py-20 bg-gradient-to-b from-white via-[#F8FAFC] to-white border-y border-slate-200/80 relative overflow-hidden">
      
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-100/80 text-[#0B4F9C] text-xs font-black uppercase px-3.5 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Doctor&apos;s Fellowship & PG Diploma Knowledge Hub</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-display">
            Frequently Asked Questions & <br />
            <span className="bg-gradient-to-r from-[#0B4F9C] via-[#1E40AF] to-[#0D9468] bg-clip-text text-transparent">
              Medical Career Advisory Guide
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about clinical eligibility without NEET PG, MCI/NMC recognition, tertiary hospital rotations, and prestigious publisher research access.
          </p>
        </div>

        {/* 4 Interactive Hub Tabs (Visual Navigation) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {[
            { id: "faqs", label: "Complete FAQs & Eligibility", icon: HelpCircle },
            { id: "comparison", label: "Fellowship vs Internship", icon: Layers },
            { id: "top_programs", label: "Best Programs After MBBS", icon: GraduationCap },
            { id: "credibility", label: "Publisher Access & Credibility", icon: Library },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all shadow-xs ${
                  isActive
                    ? "bg-[#0B4F9C] text-white shadow-md shadow-blue-900/20 scale-[1.02]"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-300" : "text-[#0B4F9C]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ALL FAQS WITH CLEAN WRAPPING PILLS & LIVE SEARCH (NO SCROLLBARS)   */}
        {/* ========================================================================= */}
        {activeTab === "faqs" && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200 max-w-5xl mx-auto">
            
            {/* Clean Centered Filter & Search Header */}
            <div className="space-y-4">
              
              {/* Category Pills (Flex-wrap without horizontal scrollbars) */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedFaqCategory(cat)}
                    className={`text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer shadow-2xs ${
                      selectedFaqCategory === cat
                        ? "bg-[#0D9468] text-white shadow-md shadow-emerald-900/20 scale-105"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Centered Search Bar */}
              <div className="max-w-md mx-auto relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions (e.g. NEET PG, MCI recognition, eligibility)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 text-xs bg-white border border-slate-200/90 rounded-full focus:outline-hidden focus:border-[#0B4F9C] focus:ring-2 focus:ring-blue-500/10 shadow-xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Showing count indicator */}
              <div className="text-center text-[11px] font-bold text-slate-500">
                Showing {filteredFaqs.length} of {allFaqs.length} FAQs
                {selectedFaqCategory !== "All" && ` in ${selectedFaqCategory}`}
              </div>

            </div>

            {/* Independent 2-Column Masonry (Zero Blank Space Bug) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              
              {/* Left Independent Column */}
              <div className="flex flex-col gap-4">
                {leftColFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? "bg-white border-blue-300 shadow-md ring-2 ring-blue-500/10"
                          : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs"
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="p-5 flex items-start justify-between gap-3 text-left w-full cursor-pointer select-none"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md">
                            {faq.category}
                          </span>
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                            {faq.question}
                          </h3>
                        </div>
                        <div
                          className={`p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 shrink-0 transition-transform duration-200 mt-1 ${
                            isOpen ? "rotate-180 text-blue-600 bg-blue-50 border-blue-200" : ""
                          }`}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3.5 whitespace-pre-line bg-slate-50/40">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Independent Column */}
              <div className="flex flex-col gap-4">
                {rightColFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? "bg-white border-blue-300 shadow-md ring-2 ring-blue-500/10"
                          : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs"
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="p-5 flex items-start justify-between gap-3 text-left w-full cursor-pointer select-none"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                            {faq.category}
                          </span>
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                            {faq.question}
                          </h3>
                        </div>
                        <div
                          className={`p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 shrink-0 transition-transform duration-200 mt-1 ${
                            isOpen ? "rotate-180 text-blue-600 bg-blue-50 border-blue-200" : ""
                          }`}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3.5 whitespace-pre-line bg-slate-50/40">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No matching questions found</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for keywords like &apos;NEET PG&apos;, &apos;eligibility&apos;, or &apos;hospital rotations&apos;.
                </p>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedFaqCategory("All"); }}
                  className="mt-3 text-xs font-bold text-[#0B4F9C] hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FELLOWSHIP VS INTERNSHIP COMPARISON                                */}
        {/* ========================================================================= */}
        {activeTab === "comparison" && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in zoom-in-95">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-emerald-700 text-xs font-black uppercase tracking-wider">
                Career Roadmap Comparison
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Medical Fellowship vs. Internship
              </h3>
              <p className="text-xs text-slate-600">
                Understand the key distinctions between undergraduate rotational internships and post-graduate clinical fellowships.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Fellowship Column */}
              <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-200 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0B4F9C] text-white flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-blue-950">Medical Fellowship Program</h4>
                    <span className="text-[10px] text-blue-700 font-bold">Post-Graduate Sub-Specialization</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Advanced Focus:</strong> In-depth procedural training in specific sub-specialties (Cardiology, ICU, Surgery, Ultrasound).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Eligibility:</strong> Qualified MBBS, MD, MS, DNB, or registered medical doctors.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Outcome:</strong> Verifiable CPD credentials, hospital consultant roles, and higher OPD patient trust.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Flexibility:</strong> Hybrid online theory + flexible bedside rotations designed around duty shifts.</span>
                  </li>
                </ul>
              </div>

              {/* Internship Column */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Compulsory Rotatory Internship</h4>
                    <span className="text-[10px] text-slate-500 font-bold">Undergraduate Degree Requirement</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>General Focus:</strong> Broad rotational exposure across Medicine, Surgery, OBG, and Community Medicine.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Eligibility:</strong> Medical students completing final-year MBBS curriculum.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Outcome:</strong> Completion satisfies statutory requirements for state medical council registration.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><strong>Structure:</strong> Full-time daily hospital roster without sub-specialty choice.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BEST FELLOWSHIPS AFTER MBBS (CARDS DECK)                           */}
        {/* ========================================================================= */}
        {activeTab === "top_programs" && (
          <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#0B4F9C] text-xs font-black uppercase tracking-wider">
                Specialty Recommendations
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Top Medical Fellowships After MBBS
              </h3>
              <p className="text-xs text-slate-600">
                Recommended clinical specialties offering high procedural volume, OPD autonomy, and hospital demand.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Program Card 1: Family Medicine */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    AFPI & CPD UK Accredited
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-2 font-display">
                    Fellowship in Family Medicine
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Designed by esteemed faculty. Includes 1-month clinical training at flagship tertiary hospital + lifetime AFPI membership.
                  </p>
                </div>
                <Link
                  href="/book-counselling"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F9C] hover:underline"
                >
                  <span>Apply & Syllabus</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Program Card 2: Clinical Cardiology */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Cath Lab & 2D Echo
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-2 font-display">
                    Fellowship in Clinical Cardiology
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    120+ Bedside 2D Echo scans, Cath Lab TPI observation, ICCU resuscitation, and ECG mastery.
                  </p>
                </div>
                <Link
                  href="/courses/fellowship-in-clinical-cardiology"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F9C] hover:underline"
                >
                  <span>View Course Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Program Card 3: Critical Care ICU */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded">
                    Ventilation & Resuscitation
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-2 font-display">
                    Fellowship in Critical Care Medicine
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Mechanical ventilation, central lines, hemodynamic monitoring, septic shock bundles, and ICU observer-ships.
                  </p>
                </div>
                <Link
                  href="/courses/fellowship-in-critical-care-medicine"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F9C] hover:underline"
                >
                  <span>View Course Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Program Card 4: Pulmonology */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                    12-Week Rotation
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-2 font-display">
                    Fellowship in Pulmonology
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Pleural interventions, obstructive airway diseases, interstitial lung pathologies, and bronchoscopy observation.
                  </p>
                </div>
                <Link
                  href="/book-counselling"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F9C] hover:underline"
                >
                  <span>Apply & Syllabus</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Program Card 5: Gastroenterology */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                    Therapeutic Endoscopy
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-2 font-display">
                    Fellowship in Gastroenterology
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Management of GI bleeding, endoscopy assisting, hepatology protocols, and 12-week clinical rotations at top hospitals.
                  </p>
                </div>
                <Link
                  href="/book-counselling"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F9C] hover:underline"
                >
                  <span>Apply & Syllabus</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Program Card 6: Clinical Oncology */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    6-Week Contact Program
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-2 font-display">
                    Fellowship in Clinical Oncology
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Chemotherapy regimens, radiation protocols, palliative care, and oncology case capsules guided by senior oncologists.
                  </p>
                </div>
                <Link
                  href="/book-counselling"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F9C] hover:underline"
                >
                  <span>Apply & Syllabus</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PUBLISHER ACCESS & CREDIBILITY                                     */}
        {/* ========================================================================= */}
        {activeTab === "credibility" && (
          <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 space-y-8 animate-in fade-in zoom-in-95 relative overflow-hidden">
            
            <div className="relative z-10 text-center max-w-2xl mx-auto space-y-3">
              <span className="text-amber-400 text-xs font-black uppercase tracking-wider">
                Academic Excellence & Research Access
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                How IMC Fellowship Programs Build Unrivaled Clinical Credibility
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Endorsed by international accreditation bodies and backed by full-text clinical research access from world-renowned medical publishers.
              </p>
            </div>

            {/* 3 Pillars of Credibility */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
              
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-white">1. Formal Recognition</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Earn CPD Standards Office (UK) accredited certificates and verifiable clinical logbooks that demonstrate specialized mastery.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-white">2. Institutional Validation</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Endorsements from 50+ tertiary hospital networks (Apollo, Fortis, Max, Medanta) recognized across India and overseas.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center font-bold">
                  <Library className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-white">3. Global Publisher Access</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Direct access to premium medical textbooks and clinical journals from <strong>McGraw Hill</strong>, <strong>Wolters Kluwer</strong>, and <strong>Springer Nature</strong>.
                </p>
              </div>

            </div>

            {/* CTA inside Card */}
            <div className="pt-4 border-t border-slate-800 text-center relative z-10">
              <Link
                href="/book-counselling"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-black py-3 px-6 rounded-xl shadow-lg transition-all"
              >
                <span>Speak with an Academic Counsellor (Free Eligibility Check)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Background Glow */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        )}

        {/* Bottom Help Prompt Bar */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left max-w-5xl mx-auto">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                Have questions about NEET PG exemption or your MBBS eligibility?
              </div>
              <div className="text-[11px] text-slate-500">
                Speak directly with a Senior Medical Admissions Counsellor for a free qualification assessment.
              </div>
            </div>
          </div>

          <Link
            href="/book-counselling"
            className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#083E7D] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Book Free Counselling Call</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
