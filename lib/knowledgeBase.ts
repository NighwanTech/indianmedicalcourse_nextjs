export interface KnowledgeBaseEntry {
  id: number;
  category: "Admissions" | "Eligibility" | "Clinical Rotations" | "Certificates & CME" | "Fees & EMI" | "Specialties" | "LMS & Exam" | "General";
  question: string;
  answer: string;
  keywords: string[];
  suggestedFollowUps?: string[];
  relevantCourseSlugs?: string[];
}

export const medicalKnowledgeBase: KnowledgeBaseEntry[] = [
  // =========================================================================
  // 1. ADMISSIONS & ELIGIBILITY
  // =========================================================================
  {
    id: 1,
    category: "Eligibility",
    question: "Who is Eligible to Apply for an IMC Fellowship or PG Diploma?",
    answer: "Any candidate holding a recognized medical degree—including MBBS, MD, MS, DNB, BDS, MDS, or recognized AYUSH degrees (BAMS, BHMS, BUMS)—with valid registration under the National Medical Commission (NMC) or respective State Medical Council is eligible. Both fresh medical graduates and practicing senior doctors can apply.",
    keywords: ["eligible", "eligibility", "qualification", "mbbs", "bams", "bhms", "ayush", "bds", "md", "ms", "dnb", "registration", "nmc", "state council", "who can apply"],
    suggestedFollowUps: ["Can I apply without NEET PG?", "Which fellowship is best after MBBS?", "What documents are required?"],
  },
  {
    id: 2,
    category: "Admissions",
    question: "Can I Apply for an IMC Medical Fellowship Without NEET PG?",
    answer: "Yes, absolutely! All IMC clinical fellowships, post-graduate diplomas, and masterclasses do NOT require the NEET PG entrance examination. Admissions are based on merit, medical qualification, and council registration, enabling doctors to enhance their practical procedural skills immediately without waiting for NEET counselling cycles.",
    keywords: ["neet", "neet pg", "without neet", "entrance exam", "rank", "score", "qualify", "exam required", "no neet"],
    suggestedFollowUps: ["Who is eligible to apply?", "How do hospital bedside rotations work?", "What are the 0% EMI tuition options?"],
  },
  {
    id: 3,
    category: "Eligibility",
    question: "Are Foreign Medical Graduates (FMGs / FMGE Cleared) Eligible?",
    answer: "Yes! Foreign Medical Graduates who have cleared the FMGE / NExT exam and obtained permanent or provisional registration with the National Medical Commission (NMC) or State Medical Council are fully eligible for all IMC fellowship programs and hospital attachments.",
    keywords: ["fmge", "fmg", "foreign medical graduate", "russia", "philippines", "china", "georgia", "next", "provisional registration"],
    suggestedFollowUps: ["What documents are required?", "Can I apply without NEET PG?"],
  },
  {
    id: 4,
    category: "Eligibility",
    question: "Can AYUSH (BAMS, BHMS, BUMS) and Dental (BDS, MDS) Doctors Apply?",
    answer: "Yes, AYUSH practitioners and Dental surgeons are eligible for dedicated certification and diploma programs in Clinical Cosmetology, Trichology, Diabetology, Emergency Medicine & Basic Life Support, and Hospital Administration tailored to their regulatory scope of practice.",
    keywords: ["bams", "bhms", "bums", "ayush", "bds", "mds", "dentist", "dental", "homeopathy", "ayurveda"],
    suggestedFollowUps: ["Which fellowship is best after MBBS?", "Are certificates CPD UK accredited?"],
  },
  {
    id: 5,
    category: "Admissions",
    question: "What Documents are Required for Admission?",
    answer: "To secure admission, submit copies of:\n1. MBBS / Medical Degree Certificate or Provisional Passing Certificate.\n2. State Medical Council or NMC Permanent Registration Certificate.\n3. Internship Completion Certificate.\n4. Government Photo ID (Aadhaar / Passport / Voter ID).\n5. Updated Clinical CV / Resume.\n6. Two Passport-size Photographs.",
    keywords: ["documents", "docs", "papers", "certificates", "id proof", "aadhaar", "passport", "degree copy", "registration certificate"],
    suggestedFollowUps: ["How do I apply for a program?", "What are the 0% EMI tuition options?"],
  },
  {
    id: 6,
    category: "Admissions",
    question: "Are International and NRI Doctors Eligible to Join?",
    answer: "Yes! IMC welcomes international doctors from the UAE, Saudi Arabia, Oman, Qatar, Kuwait, the UK, Nepal, Bangladesh, Sri Lanka, and Africa. International candidates receive CPD (UK) accredited certificates and can complete clinical attachments at our partner hospitals in India or through international observership modules.",
    keywords: ["international", "nri", "dubai", "uae", "saudi", "gulf", "gcc", "nepal", "bangladesh", "uk doctor", "overseas"],
    suggestedFollowUps: ["Are certificates CPD UK accredited?", "How are clinical rotations scheduled?"],
  },

  // =========================================================================
  // 2. CLINICAL ROTATIONS & HOSPITAL ATTACHMENTS
  // =========================================================================
  {
    id: 7,
    category: "Clinical Rotations",
    question: "How are Hospital Bedside Clinical Rotations Organized?",
    answer: "Clinical attachments take place at our accredited network of 50+ tertiary hospital partners including Apollo Hospitals, Fortis Healthcare, Max Super Speciality, Medanta The Medicity, and Manipal Hospitals. Fellows participate in live patient bedside management, procedural demonstrations, Cath Lab observer-ships, ICU rounds, and surgical scrub-ins under Senior Consultants.",
    keywords: ["hospital", "rotation", "bedside", "attachment", "apollo", "fortis", "max", "medanta", "manipal", "hands on", "observership", "cath lab", "icu rotation"],
    suggestedFollowUps: ["Can working doctors attend weekend rotations?", "Is accommodation provided during hospital rotations?"],
  },
  {
    id: 8,
    category: "Clinical Rotations",
    question: "Can Working Doctors and Government Medical Officers Attend Flexible Rotations?",
    answer: "Yes! IMC's hybrid model is purpose-built for working medical officers and private clinic practitioners. Online theoretical modules and surgical video simulations are accessible 24/7 on our LMS, while hands-on hospital bedside postings can be scheduled during weekends or condensed into a 1 to 2-week intensive clinical block to suit your duty roster.",
    keywords: ["working doctor", "duty", "government doctor", "shift", "weekend", "flexible", "leave", "part time", "hybrid", "clinic timing"],
    suggestedFollowUps: ["How are hospital clinical rotations organized?", "How long do fellowships last?"],
  },
  {
    id: 9,
    category: "Clinical Rotations",
    question: "Is Accommodation Provided During Hands-on Hospital Rotations?",
    answer: "Our dedicated Student Hospital Coordination Desk assists visiting fellows with curated, pre-verified guest houses, doctor hostels, and partner hotel accommodations in close proximity (within 1-2 km) to the host hospital centers in Delhi-NCR, Bengaluru, Mumbai, Jaipur, and Hyderabad at discounted doctor rates.",
    keywords: ["accommodation", "stay", "hostel", "hotel", "lodging", "food", "travel", "outstation doctor"],
    suggestedFollowUps: ["How are hospital clinical rotations organized?", "What cities have hospital attachments?"],
  },
  {
    id: 10,
    category: "Clinical Rotations",
    question: "In Which Cities are Hospital Attachments Available?",
    answer: "Clinical training and bedside observer-ships are conducted across major medical hubs in India:\n• Delhi-NCR (Apollo, Fortis, Max, Medanta Gurugram)\n• Bengaluru (Manipal, Narayana Health, Cloudnine)\n• Mumbai & Pune (Jupiter Hospital, Apollo Navi Mumbai)\n• Hyderabad (Rainbow Children's, Yashoda Hospitals)\n• Kolkata (AMRI, Medica Superspecialty)\n• Jaipur, Lucknow, Chennai, and Ahmedabad.",
    keywords: ["cities", "location", "delhi", "gurugram", "ncr", "bengaluru", "bangalore", "mumbai", "hyderabad", "jaipur", "kolkata", "chennai", "lucknow"],
    suggestedFollowUps: ["How are hospital clinical rotations organized?", "What documents are required?"],
  },

  // =========================================================================
  // 3. ACCREDITATION, CERTIFICATION & LEGAL VALIDITY
  // =========================================================================
  {
    id: 11,
    category: "Certificates & CME",
    question: "Are IMC Fellowships Accredited by CPD Standards Office (UK)?",
    answer: "Yes, IMC fellowship and PG diploma programs are accredited by the prestigious CPD Standards Office (United Kingdom), providing internationally verifiable Continuous Professional Development (CPD) credits. Each certificate features a verifiable cryptographic QR code and CPD accreditation badge accepted globally.",
    keywords: ["cpd", "cpd uk", "accreditation", "international recognition", "uk accreditation", "validity", "cme credits", "recognized"],
    suggestedFollowUps: ["Can I mention this fellowship on my prescription pad?", "Are fellowships recognized by NMC / MCI?"],
  },
  {
    id: 12,
    category: "Certificates & CME",
    question: "Are IMC Fellowships Recognized by NMC / MCI?",
    answer: "IMC fellowships and PG diplomas are post-graduate professional enhancement and skill-certification programs accredited by CPD (UK) and international medical education bodies. They are designed for clinical competency development and skill enrichment. Under NMC regulations, degrees like MD/MS require NEET PG entrance, while professional fellowships serve as specialized post-MBBS skill credentials for clinical mastery in private hospitals and OPD practice.",
    keywords: ["nmc", "mci", "national medical commission", "degree vs fellowship", "legal", "recognition", "government job"],
    suggestedFollowUps: ["Can I mention this fellowship on my prescription pad?", "Are certificates CPD UK accredited?"],
  },
  {
    id: 13,
    category: "Certificates & CME",
    question: "Can I Mention the Fellowship on My Prescription Pad, Letterhead & Nameboard?",
    answer: "Yes, you can proudly write 'Fellow in Clinical Cardiology (IMC)', 'Fellow in Critical Care (FCCM)', or 'Fellow in Laparoscopic Surgery' on your prescription pad, visiting cards, hospital ID, and OPD clinic nameboard as a skill qualification reflecting your specialized clinical training and CPD accreditation.",
    keywords: ["prescription pad", "letterhead", "nameboard", "visiting card", "dr title", "suffix", "fccm", "fetal fellow", "cardio fellow"],
    suggestedFollowUps: ["Are certificates CPD UK accredited?", "How can a fellowship add credibility to my practice?"],
  },
  {
    id: 14,
    category: "Certificates & CME",
    question: "How are Certificates Verified by Hospitals and Employers?",
    answer: "Every graduate receives an official hard-copy certificate, clinical transcript, and verified procedure logbook signed by the Chief Mentor. In addition, an instant digital QR code verification portal is provided, allowing hospital HR departments and overseas health authorities to verify your credentials 24/7.",
    keywords: ["verification", "qr code", "credential", "certificate verification", "transcript", "logbook", "hr check"],
    suggestedFollowUps: ["Are certificates CPD UK accredited?", "What documents are required?"],
  },

  // =========================================================================
  // 4. TUITION FEES, SCHOLARSHIPS & 0% EMI
  // =========================================================================
  {
    id: 15,
    category: "Fees & EMI",
    question: "What are the 0% Interest EMI Tuition Options?",
    answer: "IMC partners with leading healthcare NBFCs (Bajaj Finserv, Eduvanz, Propelld, Liquiloans) to provide interest-free 0% EMI plans over 3, 6, 9, or 12 months with zero hidden charges. Monthly installments start from just ₹6,500/month, and instant pre-approval is completed in 10 minutes with minimal documentation.",
    keywords: ["emi", "0% emi", "no cost emi", "fees", "cost", "price", "installment", "bajaj", "eduvanz", "loan", "monthly payment"],
    suggestedFollowUps: ["How can I apply for a 40% scholarship?", "What is the fee for cardiology fellowship?"],
  },
  {
    id: 16,
    category: "Fees & EMI",
    question: "How Can I Apply for the 40% Merit Scholarship?",
    answer: "IMC awards Early-Bird Merit Scholarships of up to 40% fee reduction to deserving doctors based on MBBS marks, rural service background, early batch registration, and counsellor evaluation. To apply, submit your application form early and mention scholarship consideration to your assigned admissions counsellor.",
    keywords: ["scholarship", "discount", "merit scholarship", "fee waiver", "40% off", "concession", "financial aid", "rural doctor"],
    suggestedFollowUps: ["What are the 0% Interest EMI options?", "How do I apply for a program?"],
  },
  {
    id: 17,
    category: "Fees & EMI",
    question: "Is There a Tax Benefit on Fellowship Tuition Fees?",
    answer: "Yes! Medical practitioners and working doctors can claim tuition fees paid for IMC fellowships and PG diplomas as an allowable professional upskilling/training expense or under Section 80E of the Indian Income Tax Act, reducing their overall taxable income.",
    keywords: ["tax", "tax benefit", "section 80e", "gst invoice", "receipt", "income tax", "professional expense"],
    suggestedFollowUps: ["What are the 0% Interest EMI options?", "What documents are required?"],
  },

  // =========================================================================
  // 5. SPECIALTY-SPECIFIC CLINICAL PROGRAMS
  // =========================================================================
  {
    id: 18,
    category: "Specialties",
    question: "Tell Me About the Fellowship in Clinical Cardiology",
    answer: "The 12-Month Fellowship in Clinical Cardiology covers in-depth 2D Echocardiography, Doppler hemodynamics, 12-Lead ECG arrhythmia mastery, TMT, Holter monitoring, ICCU bedside management, and Cath Lab diagnostic angiogram observer-ship under Senior DM Cardiologists.",
    keywords: ["cardiology", "echo", "2d echo", "ecg", "cath lab", "heart", "cardiac", "tmt", "holter", "iccu", "angiography"],
    suggestedFollowUps: ["How do hospital bedside rotations work?", "What are the 0% EMI tuition options?"],
    relevantCourseSlugs: ["fellowship-in-clinical-cardiology"],
  },
  {
    id: 19,
    category: "Specialties",
    question: "Tell Me About the Fellowship in Critical Care Medicine (FCCM)",
    answer: "The 12-Month Critical Care Fellowship equips doctors to lead multi-disciplinary ICUs. Key competencies include invasive mechanical ventilation (modes, lung-protective strategies, weaning), central venous & arterial cannulation, ultrasound-guided vascular access, ABG analysis, septic shock resuscitation, and ECMO overview.",
    keywords: ["critical care", "icu", "fccm", "ventilator", "mechanical ventilation", "abg", "central line", "arterial line", "ecmo", "shock", "intensivist"],
    suggestedFollowUps: ["How do hospital bedside rotations work?", "Can working doctors attend weekend rotations?"],
    relevantCourseSlugs: ["fellowship-in-critical-care-medicine"],
  },
  {
    id: 20,
    category: "Specialties",
    question: "Tell Me About the Fellowship in Laparoscopic Surgery",
    answer: "The 6-Month Fellowship in Laparoscopic Surgery combines intensive box-trainer wet-lab ergonomic training with live operating theatre scrub-in sessions. Fellows master port placement, triangulation, knot tying, laparoscopic cholecystectomy, appendectomy, and diagnostic laparoscopy.",
    keywords: ["laparoscopy", "surgery", "lap", "surgeon", "ot", "scrub in", "cholecystectomy", "appendectomy", "minimal access", "wet lab", "box trainer"],
    suggestedFollowUps: ["How are hospital clinical rotations organized?", "What are the 0% EMI tuition options?"],
    relevantCourseSlugs: ["fellowship-in-laparoscopic-surgery"],
  },
  {
    id: 21,
    category: "Specialties",
    question: "Tell Me About the Fellowship in Fetal Medicine & Ultrasound",
    answer: "The 6-Month Fetal Medicine Fellowship follows Fetal Medicine Foundation (FMF-UK) protocols. Fellows gain hands-on proficiency in 11-13+6 week NT scans, Level-II anomaly detection, fetal echocardiography, obstetric Doppler (MCA, Umbilical artery), and high-risk obstetric management on live patients.",
    keywords: ["fetal medicine", "ultrasound", "usg", "nt scan", "anomaly scan", "level 2", "doppler", "fmf", "obstetrics", "gynecology", "fetal echo"],
    suggestedFollowUps: ["How do hospital bedside rotations work?", "What documents are required?"],
    relevantCourseSlugs: ["fellowship-in-fetal-medicine"],
  },
  {
    id: 22,
    category: "Specialties",
    question: "Tell Me About the Fellowship in Clinical Dermatology & Aesthetics",
    answer: "The 12-Month Dermatology & Aesthetic Fellowship covers both core medical dermatoses (acne, eczema, psoriasis, fungal infections) and high-revenue aesthetic procedures: chemical peels, laser hair reduction, Q-switched Nd:YAG for pigmentation, PRP for hair restoration, and electrocautery.",
    keywords: ["dermatology", "skin", "aesthetics", "lasers", "prp", "chemical peel", "trichology", "botox", "fillers", "cautery", "derma"],
    suggestedFollowUps: ["Who is eligible to apply?", "What are the 0% EMI tuition options?"],
    relevantCourseSlugs: ["pg-diploma-in-dermatology"],
  },
  {
    id: 23,
    category: "Specialties",
    question: "Tell Me About the Fellowship in Clinical Diabetology",
    answer: "The 6-Month Clinical Diabetology Fellowship focuses on advanced insulin initiation & titration algorithms, Continuous Glucose Monitoring (CGM) interpretation, Time-in-Range (TIR) analysis, diabetic foot salvage protocols, and managing cardiovascular & renal complications in type-2 diabetes.",
    keywords: ["diabetes", "diabetology", "insulin", "cgm", "tir", "diabetic foot", "endocrinology", "hba1c", "blood sugar"],
    suggestedFollowUps: ["Which fellowship is best after MBBS?", "What are the 0% EMI tuition options?"],
    relevantCourseSlugs: ["fellowship-in-clinical-diabetology"],
  },
  {
    id: 24,
    category: "Specialties",
    question: "Tell Me About the Fellowship in Emergency Medicine & Trauma",
    answer: "The 12-Month Emergency Medicine Fellowship prepares doctors for acute resuscitation, ATLS & ACLS protocols, polytrauma triage, emergency airway (RSI), chest tube thoracostomy, and point-of-care ultrasound (E-FAST) in busy emergency rooms.",
    keywords: ["emergency medicine", "er", "trauma", "atls", "acls", "resuscitation", "efast", "chest tube", "casualty", "airway"],
    suggestedFollowUps: ["How do hospital bedside rotations work?", "Are certificates CPD UK accredited?"],
    relevantCourseSlugs: ["fellowship-in-emergency-medicine"],
  },

  // =========================================================================
  // 6. LMS, LEARNING EXPERIENCE & EXAM STRUCTURE
  // =========================================================================
  {
    id: 25,
    category: "LMS & Exam",
    question: "How is the Online Learning Delivered on the LMS Portal?",
    answer: "IMC provides a state-of-the-art Doctor Learning Management Portal and Mobile App (iOS & Android). Features include 4K recorded surgical & clinical lectures, interactive case simulations, journal clubs, digital logbook submissions, and live monthly masterclasses with Chief Faculty.",
    keywords: ["lms", "portal", "app", "mobile app", "online classes", "lectures", "recorded video", "simulations", "digital learning"],
    suggestedFollowUps: ["How are final exams and assessments conducted?", "How long do fellowships last?"],
  },
  {
    id: 26,
    category: "LMS & Exam",
    question: "How are Final Examinations and Assessments Conducted?",
    answer: "Assessment consists of two components:\n1. Formative Assessment: Module-end MCQs and verified clinical logbook review.\n2. Summative Assessment: Online final exit examination featuring clinical case scenarios and viva voce with senior faculty. You have multiple flexible attempts to clear the exit exam without extra fee.",
    keywords: ["exam", "assessment", "mcq", "viva", "test", "pass marks", "exit exam", "logbook review"],
    suggestedFollowUps: ["Are certificates CPD UK accredited?", "How are certificates verified?"],
  },
  {
    id: 27,
    category: "LMS & Exam",
    question: "What If I Miss a Live Masterclass or Need a Batch Extension?",
    answer: "All live interactive masterclasses and grand rounds are recorded in HD and uploaded to your LMS account within 24 hours. If unforeseen hospital duties or family commitments occur, IMC provides free 6-month batch extensions so you can complete your curriculum stress-free.",
    keywords: ["miss class", "recorded", "extension", "pause", "batch transfer", "flexibility", "duty conflict"],
    suggestedFollowUps: ["How is online learning delivered?", "How do hospital bedside rotations work?"],
  },

  // =========================================================================
  // 7. GENERAL & CAREER OUTCOMES
  // =========================================================================
  {
    id: 28,
    category: "General",
    question: "What Career Advantages Do IMC Fellows Gain?",
    answer: "IMC graduates experience an average 3.2x growth in independent procedural OPD income, faster promotion to Clinical In-Charge / Consultant roles in corporate hospitals, and enhanced patient trust. Over 12,000+ doctors across India and the GCC have successfully graduated from IMC programs.",
    keywords: ["career", "salary", "job", "growth", "income", "promotion", "consultant", "opd practice", "benefits", "advantage"],
    suggestedFollowUps: ["Who is eligible to apply?", "How do I apply for a program?"],
  },
  {
    id: 29,
    category: "General",
    question: "How Do I Get in Touch with Admissions Right Now?",
    answer: "You can connect immediately through:\n• WhatsApp Desk: +91 8295843006\n• Admissions Hotline: +91 8295843006\n• Email: admissions@indianmedicalcourses.com\n• Online: Fill out the application form on any course page to receive an instant callback within 15 minutes.",
    keywords: ["contact", "phone", "whatsapp", "call", "hotline", "email", "address", "helpline", "talk to counsellor"],
    suggestedFollowUps: ["What documents are required?", "What are the 0% EMI tuition options?"],
  },
];
