import { BlogPost, Category, Course, DynamicMenu, FacultyMember, FaqItem, HospitalPartner, SiteSettings, Testimonial } from "@/types";

export const siteSettings: SiteSettings = {
  brandName: "Indian Medical Course",
  supportEmail: "indianmedicalcourses@gmail.com",
  admissionsEmail: "admissions@indianmedicalcourses.com",
  hotlinePhone: "+91 8295843006",
  whatsappNumber: "+918295843006",
  registeredAddress: "Narayni Polly clinic dhimshri shamshabad near police chowk and DAV inter College, Agra - UP, 283125, India",
  googleRating: "4.9",
  reviewsCount: 2480,
  announcementText: "Admissions Open for 2026 Batches | Limited Clinical Training Seats Available | 0% Interest EMI Options",
  announcementExpiry: "2026-08-31",
  googleAdsConversionId: "AW-11234567890",
  metaPixelId: "987654321098765",
};

export const headerMenu: DynamicMenu = {
  id: 1,
  slug: "HEADER_MAIN",
  name: "Header Main Navigation",
  items: [
    {
      id: 101,
      label: "Courses",
      url: "/courses",
      badgeText: "150+ Programs",
      badgeColor: "bg-emerald-500",
      children: [
        { id: 1011, label: "All Fellowships", url: "/courses?type=FELLOWSHIP", iconName: "GraduationCap" },
        { id: 1012, label: "Post Graduate Diplomas", url: "/courses?type=PG_DIPLOMA", iconName: "Award" },
        { id: 1013, label: "Clinical Cardiology", url: "/courses/category/cardiology", iconName: "HeartPulse" },
        { id: 1014, label: "Critical Care & ICU", url: "/courses/category/critical-care", iconName: "Activity" },
        { id: 1015, label: "Emergency Medicine", url: "/courses/category/emergency-medicine", iconName: "Cross" },
        { id: 1016, label: "Fetal Medicine & OB-GYN", url: "/courses/category/fetal-medicine", iconName: "Baby" },
        { id: 1017, label: "Clinical Dermatology", url: "/courses/category/dermatology", iconName: "Sparkles" },
        { id: 1018, label: "Clinical Diabetology", url: "/courses/category/diabetology", iconName: "Stethoscope" },
      ],
    },
    { id: 102, label: "About Us", url: "#about-section" },
    { id: 103, label: "Admission Process", url: "/admission-process" },
    { id: 104, label: "Hospital Partners", url: "/placement-partners", badgeText: "50+ Networks" },
    { id: 105, label: "Faculty", url: "/faculty" },
    { id: 106, label: "Success Stories", url: "/success-stories" },
    { id: 107, label: "Scholarships", url: "/scholarship", badgeText: "Up to 40% Off", badgeColor: "bg-amber-500" },
    { id: 108, label: "Contact", url: "/contact" },
  ],
};

export const categories: Category[] = [
  {
    id: 1,
    slug: "cardiology",
    name: "Clinical Cardiology",
    subtitle: "Echo, ECG, Cath Lab & ICCU Care",
    description: "Hands-on training in bedside echocardiography, coronary care, and non-invasive diagnostic protocols.",
    iconName: "HeartPulse",
    badgeText: "High Demand",
    courseCount: 18,
    isFeatured: true,
  },
  {
    id: 2,
    slug: "critical-care",
    name: "Critical Care & ICU",
    subtitle: "Ventilator Management, Hemodynamics & Sepsis",
    description: "Intensive training in invasive lines, mechanical ventilation, hemodynamic monitoring, and ECMO basics.",
    iconName: "Activity",
    badgeText: "100% Placement",
    courseCount: 14,
    isFeatured: true,
  },
  {
    id: 3,
    slug: "emergency-medicine",
    name: "Emergency Medicine",
    subtitle: "Trauma Resuscitation, ACLS & Acute Protocols",
    description: "Master resuscitation protocols, toxicological emergencies, point-of-care ultrasound (POCUS), and triage.",
    iconName: "Flame",
    badgeText: "Accredited",
    courseCount: 16,
    isFeatured: true,
  },
  {
    id: 4,
    slug: "fetal-medicine",
    name: "Fetal Medicine & Ultrasound",
    subtitle: "Target Scans, NT Scans & High-Risk Pregnancy",
    description: "Specialized ultrasound skills for anomaly scans, fetal Doppler, and prenatal screening guided by senior perinatologists.",
    iconName: "Baby",
    badgeText: "Clinical Seats",
    courseCount: 12,
    isFeatured: true,
  },
  {
    id: 5,
    slug: "dermatology",
    name: "Clinical & Aesthetic Dermatology",
    subtitle: "Lasers, Dermato-surgery & Skin Pathology",
    description: "Comprehensive procedural dermatology, chemical peels, trichology, and aesthetic injectable techniques.",
    iconName: "Sparkles",
    courseCount: 15,
    isFeatured: true,
  },
  {
    id: 6,
    slug: "diabetology",
    name: "Clinical Diabetology & Endocrinology",
    subtitle: "Insulin Regimens, CGMs & Diabetic Foot Care",
    description: "Advanced management of complex endocrine disorders, diabetic complications, and metabolic syndrome.",
    iconName: "Stethoscope",
    courseCount: 10,
    isFeatured: true,
  },
  {
    id: 7,
    slug: "pediatrics",
    name: "Pediatrics & Neonatology",
    subtitle: "NICU Care, PICU Resuscitation & Growth Disorders",
    description: "Neonatal resuscitation, mechanical ventilation for preterm infants, and pediatric emergency management.",
    iconName: "Users",
    courseCount: 9,
  },
  {
    id: 8,
    slug: "surgery-laparoscopy",
    name: "Minimal Access Surgery & Laparoscopy",
    subtitle: "Basic & Advanced Laparoscopic Procedures",
    description: "Endotrainer simulation, laparoscopic cholecystectomy, appendectomy, and hernia repair observer-ships.",
    iconName: "Award",
    courseCount: 11,
  },
];

export const courses: Course[] = [
  {
    "id": 1,
    "slug": "fellowship-in-clinical-cardiology",
    "title": "Fellowship in Clinical Cardiology",
    "tagline": "Comprehensive 12-Month Clinical Training in Echo, ECG, Cath Lab Observation & ICCU Protocols",
    "categoryId": 1,
    "categoryName": "Clinical Cardiology",
    "courseType": "FELLOWSHIP",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "12 Months",
    "clinicalHours": 180,
    "eligibility": "MBBS / MD / DNB recognized by NMC",
    "feeINR": 185000,
    "feeUSD": 2800,
    "emiStartingINR": 7800,
    "ratingVal": 4.9,
    "ratingCount": 342,
    "totalEnrolled": 1850,
    "nextBatchDate": "2026-09-01",
    "isFeatured": true,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Diagnostic ECG & Holter Interpretation",
        "topics": [
          "Complex Arrhythmias",
          "Ischemia Localization",
          "Electrolyte Imbalances"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Echocardiography Masterclass (2D, Doppler, TEE)",
        "topics": [
          "Valvular Heart Disease",
          "Left Ventricular Function",
          "Diastolic Dysfunction"
        ]
      },
      {
        "moduleNumber": 3,
        "title": "Acute Coronary Syndromes & ICCU Protocols",
        "topics": [
          "STEMI Thrombolysis vs PCI",
          "Cardiogenic Shock",
          "Inotropic Support"
        ]
      }
    ],
    "careerOpportunities": [
      "Consultant Clinical Cardiologist",
      "ICCU In-Charge Physician",
      "Echocardiography Specialist"
    ],
    "skillsCovered": [
      "2D Echocardiography",
      "Emergency TPI Assistance",
      "Cardiogenic Shock Protocol",
      "Holter Analysis"
    ],
    "clinicalHospitals": [
      "Apollo Hospitals",
      "Fortis Escorts Heart Institute",
      "Max Super Speciality Hospital",
      "Medanta"
    ],
    "faqs": [
      {
        "question": "Is this course recognized for clinical practice?",
        "answer": "Yes, this fellowship is designed to enhance clinical acumen and procedural competence under CPD Standards International guidelines."
      }
    ]
  },
  {
    "id": 2,
    "slug": "fellowship-in-critical-care-medicine",
    "title": "Fellowship in Critical Care Medicine",
    "tagline": "Intensive 12-Month Hands-on ICU Fellowship: Mechanical Ventilation, Hemodynamics, Sepsis & Arterial Lines",
    "categoryId": 2,
    "categoryName": "Critical Care & ICU",
    "courseType": "FELLOWSHIP",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "12 Months",
    "clinicalHours": 200,
    "eligibility": "MBBS / DA / MD / DNB (Medicine / Anaesthesia)",
    "feeINR": 195000,
    "feeUSD": 2950,
    "emiStartingINR": 8200,
    "ratingVal": 4.9,
    "ratingCount": 298,
    "totalEnrolled": 1420,
    "nextBatchDate": "2026-09-01",
    "isFeatured": true,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Advanced Mechanical Ventilation & ARDS",
        "topics": [
          "Volume vs Pressure Control",
          "Proning Protocol",
          "Weaning Indices"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Invasive Hemodynamic Monitoring",
        "topics": [
          "Central Venous Catheterization",
          "Arterial Line Insertion",
          "Vasoactive Drug Titration"
        ]
      }
    ],
    "careerOpportunities": [
      "Senior ICU Registrar",
      "Intensivist in Corporate Hospitals",
      "Critical Care Coordinator"
    ],
    "skillsCovered": [
      "Mechanical Ventilation",
      "Bedside Ultrasound (BLUE/FATE)",
      "Arterial Cannulation",
      "CRRT Management"
    ],
    "clinicalHospitals": [
      "Medanta - The Medicity",
      "Manipal Hospitals",
      "Max Healthcare",
      "Narayana Health"
    ],
    "faqs": [
      {
        "question": "What is the duration of the hands-on clinical attachment?",
        "answer": "The program includes dedicated 2-to-4-week hospital clinical attachments at partner tertiary ICUs."
      }
    ]
  },
  {
    "id": 3,
    "slug": "fellowship-in-laparoscopic-surgery",
    "title": "Fellowship in Laparoscopic Surgery",
    "tagline": "Master Basic & Advanced Minimal Access Surgery, Endotrainer Simulation & Hands-on Laparoscopy",
    "categoryId": 8,
    "categoryName": "Minimal Access Surgery",
    "courseType": "FELLOWSHIP",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "6 Months",
    "clinicalHours": 140,
    "eligibility": "MS / DNB (General Surgery / OBG) / MBBS with Surgical Experience",
    "feeINR": 175000,
    "feeUSD": 2650,
    "emiStartingINR": 7300,
    "ratingVal": 4.9,
    "ratingCount": 180,
    "totalEnrolled": 860,
    "nextBatchDate": "2026-09-15",
    "isFeatured": true,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Ergonomics & Endotrainer Knotting",
        "topics": [
          "Intracorporeal Suturing",
          "Trocar Insertion Physics",
          "Electrosurgical Safety"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Laparoscopic Cholecystectomy & Appendectomy",
        "topics": [
          "Calot's Triangle Dissection",
          "Critical View of Safety",
          "Complication Management"
        ]
      }
    ],
    "careerOpportunities": [
      "Consultant Laparoscopic Surgeon",
      "Minimal Access Surgical Specialist"
    ],
    "skillsCovered": [
      "Intracorporeal Knotting",
      "Lap Cholecystectomy",
      "Diagnostic Laparoscopy",
      "Lap Hernia Basics"
    ],
    "clinicalHospitals": [
      "Max Institute of Minimal Access Surgery",
      "Fortis Hospital",
      "Apollo Hospitals"
    ],
    "faqs": [
      {
        "question": "Is endotrainer box included?",
        "answer": "Candidates receive hands-on simulator access and intensive wet-lab training."
      }
    ]
  },
  {
    "id": 4,
    "slug": "fellowship-in-clinical-dermatology",
    "title": "Fellowship in Clinical Dermatology",
    "tagline": "Comprehensive Training in Dermatopathology, Lasers, Chemical Peels, PRP & Dermatosurgery",
    "categoryId": 5,
    "categoryName": "Clinical & Aesthetic Dermatology",
    "courseType": "FELLOWSHIP",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "12 Months",
    "clinicalHours": 140,
    "eligibility": "MBBS / DVD / MD / DNB (Dermatology)",
    "feeINR": 170000,
    "feeUSD": 2550,
    "emiStartingINR": 7100,
    "ratingVal": 4.9,
    "ratingCount": 215,
    "totalEnrolled": 1100,
    "nextBatchDate": "2026-09-20",
    "isFeatured": true,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Clinical Dermatology & Systemic Diseases",
        "topics": [
          "Psoriasis & Biologics",
          "Autoimmune Bullous Disorders",
          "Pigmentary Conditions"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Lasers & Energy-Based Devices",
        "topics": [
          "Q-Switched Nd:YAG",
          "Fractional CO2",
          "Laser Hair Reduction"
        ]
      }
    ],
    "careerOpportunities": [
      "Clinical Dermatologist",
      "Aesthetic Physician",
      "Trichology Specialist"
    ],
    "skillsCovered": [
      "Laser Physics & Safety",
      "Chemical Peeling Protocols",
      "PRP Hair/Skin",
      "Dermatosurgery"
    ],
    "clinicalHospitals": [
      "Max Healthcare",
      "Fortis Memorial Research Institute"
    ],
    "faqs": [
      {
        "question": "Are injectables like Botox covered?",
        "answer": "Facial anatomy, safety zones, and live demonstration observer-ships are included."
      }
    ]
  },
  {
    "id": 6,
    "slug": "fellowship-in-fetal-medicine-ultrasound",
    "title": "Fellowship in Fetal Medicine & Ultrasound",
    "tagline": "Hands-on Perinatology Training: 11-13 Week NT Scan, Level-II Target Anomalies & Fetal Doppler",
    "categoryId": 4,
    "categoryName": "Fetal Medicine & Ultrasound",
    "courseType": "FELLOWSHIP",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "6 Months",
    "clinicalHours": 120,
    "eligibility": "MBBS / MS (OBG) / DGO / DMRD / MD (Radiology)",
    "feeINR": 165000,
    "feeUSD": 2500,
    "emiStartingINR": 6900,
    "ratingVal": 5,
    "ratingCount": 190,
    "totalEnrolled": 940,
    "nextBatchDate": "2026-09-10",
    "isFeatured": true,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "First Trimester Screening & Aneuploidy",
        "topics": [
          "Nuchal Translucency (NT)",
          "Nasal Bone",
          "Ductus Venosus Doppler"
        ]
      }
    ],
    "careerOpportunities": [
      "Fetal Medicine Specialist",
      "Fetal Sonologist",
      "High-Risk Pregnancy Consultant"
    ],
    "skillsCovered": [
      "NT/NB Scan",
      "Target Anomaly Reporting",
      "Fetal Doppler Indices",
      "Counselling in Anomalies"
    ],
    "clinicalHospitals": [
      "Rainbow Children's Hospital & BirthRight",
      "Apollo Cradle",
      "Cloudnine Hospitals"
    ],
    "faqs": [
      {
        "question": "Is hands-on probe training provided?",
        "answer": "Yes, doctors get direct patient scanning experience under senior perinatologist guidance."
      }
    ]
  },
  {
    "id": 7,
    "slug": "fellowship-in-sports-injuries",
    "title": "Fellowship in Sports Injuries & Arthroscopy",
    "tagline": "Comprehensive Rehabilitation, Ligament Reconstruction & Arthroscopic Surgical Observer-ship",
    "categoryId": 8,
    "categoryName": "Orthopaedics & Sports Medicine",
    "courseType": "FELLOWSHIP",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "12 Months",
    "clinicalHours": 150,
    "eligibility": "MBBS / MS (Ortho) / DNB (Orthopaedics)",
    "feeINR": 180000,
    "feeUSD": 2700,
    "emiStartingINR": 7500,
    "ratingVal": 4.9,
    "ratingCount": 140,
    "totalEnrolled": 520,
    "nextBatchDate": "2026-09-15",
    "isFeatured": true,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "ACL/PCL Knee Reconstruction & Meniscal Repair",
        "topics": [
          "Graft Selection",
          "Tunnel Placement",
          "Rehab Protocol"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Shoulder Instability & Rotator Cuff Repair",
        "topics": [
          "Bankart Lesions",
          "Subacromial Decompression",
          "Sports Biomechanics"
        ]
      }
    ],
    "careerOpportunities": [
      "Sports Medicine Physician",
      "Arthroscopy Fellow",
      "Orthopedic Consultant"
    ],
    "skillsCovered": [
      "Diagnostic Knee Arthroscopy",
      "Shoulder Joint Injection",
      "Sports Injury Protocol"
    ],
    "clinicalHospitals": [
      "Kokilaben Dhirubhai Ambani Hospital",
      "Max Healthcare",
      "Apollo Hospitals"
    ],
    "faqs": [
      {
        "question": "Is live OT assisting included?",
        "answer": "Yes, candidates participate in surgical observation and cadaveric simulation workshops."
      }
    ]
  },
  {
    "id": 8,
    "slug": "fellowship-in-clinical-embryology",
    "title": "Fellowship in Clinical Embryology & ART",
    "tagline": "Hands-on IVF Lab Mastery: ICSI, Vitrification, Embryo Biopsy, PGT & Quality Control",
    "categoryId": 4,
    "categoryName": "Reproductive Medicine & Embryology",
    "courseType": "FELLOWSHIP",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "12 Months",
    "clinicalHours": 160,
    "eligibility": "MBBS / MD (OBG) / MSc (Life Sciences / Biotechnology)",
    "feeINR": 210000,
    "feeUSD": 3100,
    "emiStartingINR": 8800,
    "ratingVal": 4.9,
    "ratingCount": 175,
    "totalEnrolled": 640,
    "nextBatchDate": "2026-09-01",
    "isFeatured": true,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Semen Processing & Micro-manipulation",
        "topics": [
          "Sperm Preparation",
          "ICSI Technique",
          "Oocyte Denudation"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Embryo Culture & Cryopreservation",
        "topics": [
          "Vitrification Protocols",
          "Blastocyst Grading",
          "IVF Lab Cleanroom QA"
        ]
      }
    ],
    "careerOpportunities": [
      "Senior Clinical Embryologist",
      "IVF Lab Director",
      "ART Consultant"
    ],
    "skillsCovered": [
      "ICSI",
      "Embryo Vitrification",
      "Sperm Morphology Screening",
      "Cleanroom Air Quality QA"
    ],
    "clinicalHospitals": [
      "Nova IVF Fertility",
      "Indira IVF",
      "Apollo Fertility"
    ],
    "faqs": [
      {
        "question": "Are hands-on micromanipulation rigs available?",
        "answer": "Yes, each student practices on dedicated micromanipulator stations."
      }
    ]
  },
  {
    "id": 9,
    "slug": "fellowship-in-anorectal-laser-proctology",
    "title": "Fellowship in Anorectal & Laser Proctology",
    "tagline": "Modern Laser Hemorrhoidoplasty (LHP), FiLaC for Fistula & Diode Laser Surgery",
    "categoryId": 8,
    "categoryName": "Minimal Access Surgery",
    "courseType": "FELLOWSHIP",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "6 Months",
    "clinicalHours": 100,
    "eligibility": "MBBS / MS / DNB (General Surgery) / BAMS with Surgical Training",
    "feeINR": 150000,
    "feeUSD": 2300,
    "emiStartingINR": 6200,
    "ratingVal": 4.8,
    "ratingCount": 120,
    "totalEnrolled": 430,
    "nextBatchDate": "2026-09-15",
    "isFeatured": false,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Laser Physics & Anorectal Anatomy",
        "topics": [
          "Diode Laser Wavelengths",
          "Sphincter Preservation",
          "Energy Delivery Protocols"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "LHP, FiLaC & SiLaC Procedures",
        "topics": [
          "Laser Hemorrhoid Ablation",
          "Fistula Tract Coagulation",
          "Pilonidal Sinus Ablation"
        ]
      }
    ],
    "careerOpportunities": [
      "Laser Proctologist",
      "Day-Care Colorectal Surgeon"
    ],
    "skillsCovered": [
      "Diode Laser Operation",
      "Proctoscopy Diagnosis",
      "Sphincter Sparing Laser Ablation"
    ],
    "clinicalHospitals": [
      "Pristyn Care Clinics",
      "Max Healthcare",
      "Fortis Hospital"
    ],
    "faqs": [
      {
        "question": "Are live surgical cases demonstrated?",
        "answer": "Yes, doctors observe and scrub in for laser proctology procedures."
      }
    ]
  },
  {
    "id": 10,
    "slug": "fellowship-in-interventional-radiology",
    "title": "Fellowship in Interventional Radiology",
    "tagline": "Hands-on Catheter Angiography, Embolization, CT/USG Guided Biopsies & Drainage",
    "categoryId": 1,
    "categoryName": "Radiology & Imaging",
    "courseType": "FELLOWSHIP",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "12 Months",
    "clinicalHours": 180,
    "eligibility": "MD / DNB / DMRD (Radiodiagnosis)",
    "feeINR": 220000,
    "feeUSD": 3300,
    "emiStartingINR": 9200,
    "ratingVal": 5,
    "ratingCount": 110,
    "totalEnrolled": 310,
    "nextBatchDate": "2026-09-01",
    "isFeatured": true,
    "isPopular": false,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Vascular Access & Diagnostic Angiography",
        "topics": [
          "Femoral/Radial Puncture",
          "Catheter Selection",
          "Radiation Safety"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Non-Vascular & Interventional Oncology",
        "topics": [
          "TACE Protocols",
          "RFA/Microwave Tumor Ablation",
          "Biliary Drainage (PTBD)"
        ]
      }
    ],
    "careerOpportunities": [
      "Interventional Radiologist",
      "Cath Lab Vascular Specialist"
    ],
    "skillsCovered": [
      "Trans-arterial Embolization",
      "CT Biopsies",
      "PTBD",
      "Vascular Angioplasty"
    ],
    "clinicalHospitals": [
      "Medanta - The Medicity",
      "Apollo Hospitals",
      "Max Healthcare"
    ],
    "faqs": [
      {
        "question": "Is fluoroscopy suite training included?",
        "answer": "Yes, candidates participate in active tertiary DSA and fluoroscopy rotations."
      }
    ]
  },
  {
    "id": 11,
    "slug": "post-graduate-diploma-in-emergency-medicine",
    "title": "PG Diploma in Emergency Medicine",
    "tagline": "Master Acute Resuscitation, Polytrauma Protocols, Stroke Interventions & POCUS in the ER",
    "categoryId": 3,
    "categoryName": "Emergency Medicine",
    "courseType": "PG_DIPLOMA",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "12 Months",
    "clinicalHours": 160,
    "eligibility": "MBBS / Equivalent from NMC recognized institution",
    "feeINR": 175000,
    "feeUSD": 2600,
    "emiStartingINR": 7200,
    "ratingVal": 4.8,
    "ratingCount": 260,
    "totalEnrolled": 1280,
    "nextBatchDate": "2026-09-15",
    "isFeatured": true,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "ATLS Protocols & Trauma Resuscitation",
        "topics": [
          "Primary & Secondary Survey",
          "FAST Exam in Polytrauma",
          "Chest Tube Insertion"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Cardiovascular & Neurological Emergencies",
        "topics": [
          "STEMI Thrombolytic Pathways",
          "Acute Ischemic Stroke & tPA",
          "Status Epilepticus"
        ]
      }
    ],
    "careerOpportunities": [
      "ER Physician",
      "Emergency Department In-Charge",
      "Trauma Unit Specialist"
    ],
    "skillsCovered": [
      "E-FAST Ultrasound",
      "Rapid Sequence Intubation",
      "Central Line Access",
      "Defibrillation"
    ],
    "clinicalHospitals": [
      "Apollo Hospitals",
      "Fortis Healthcare",
      "Sir Ganga Ram Hospital"
    ],
    "faqs": [
      {
        "question": "Does this include simulation workshop training?",
        "answer": "Yes, advanced simulation sessions for mega-code and trauma management are integrated."
      }
    ]
  },
  {
    "id": 12,
    "slug": "pg-diploma-in-critical-care",
    "title": "PG Diploma in Critical Care",
    "tagline": "Comprehensive Clinical ICU Training: Ventilation, Inotropes, ABG Interpretation & Sepsis Bundles",
    "categoryId": 2,
    "categoryName": "Critical Care & ICU",
    "courseType": "PG_DIPLOMA",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "12 Months",
    "clinicalHours": 180,
    "eligibility": "MBBS / MD / DNB (Medicine / Anaesthesia / Pulmonary)",
    "feeINR": 180000,
    "feeUSD": 2700,
    "emiStartingINR": 7600,
    "ratingVal": 4.9,
    "ratingCount": 210,
    "totalEnrolled": 980,
    "nextBatchDate": "2026-09-01",
    "isFeatured": true,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Mechanical Ventilation Fundamentals",
        "topics": [
          "Ventilator Graphics",
          "PEEP Titration",
          "Weaning Strategies"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Septic Shock & Resuscitation",
        "topics": [
          "Surviving Sepsis Guidelines",
          "Inotropic Titration",
          "Lactate Clearance"
        ]
      }
    ],
    "careerOpportunities": [
      "ICU Medical Officer",
      "Critical Care Registrar",
      "Intensivist"
    ],
    "skillsCovered": [
      "Mechanical Ventilation Setup",
      "Arterial Blood Gas Analysis",
      "Bedside Ultrasound"
    ],
    "clinicalHospitals": [
      "Max Healthcare",
      "Medanta",
      "Manipal Hospitals"
    ],
    "faqs": [
      {
        "question": "Can working doctors attend weekend ICU rotations?",
        "answer": "Yes, hospital attachments are scheduled flexibly around your current duty shifts."
      }
    ]
  },
  {
    "id": 13,
    "slug": "pg-diploma-in-dermatology",
    "title": "PG Diploma in Dermatology",
    "tagline": "Clinical Skin Diseases, Trichology, Chemical Peels, Electrocautery & Aesthetic Procedures",
    "categoryId": 5,
    "categoryName": "Clinical & Aesthetic Dermatology",
    "courseType": "PG_DIPLOMA",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "12 Months",
    "clinicalHours": 140,
    "eligibility": "MBBS / MD / DNB",
    "feeINR": 165000,
    "feeUSD": 2500,
    "emiStartingINR": 6900,
    "ratingVal": 4.8,
    "ratingCount": 195,
    "totalEnrolled": 820,
    "nextBatchDate": "2026-09-20",
    "isFeatured": true,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Infectious & Inflammatory Dermatoses",
        "topics": [
          "Fungal & Bacterial Infections",
          "Acne Grading",
          "Eczema Management"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Office Procedural Dermatology",
        "topics": [
          "Chemical Peels",
          "Radiofrequency Ablation",
          "Comedone Extraction"
        ]
      }
    ],
    "careerOpportunities": [
      "Consultant Dermatologist",
      "Skin Clinic Practitioner",
      "Aesthetic Physician"
    ],
    "skillsCovered": [
      "Chemical Peeling",
      "RF Cautery",
      "Dermoscopy",
      "PRP Injections"
    ],
    "clinicalHospitals": [
      "Fortis Memorial Research Institute",
      "Apollo Hospitals"
    ],
    "faqs": [
      {
        "question": "Is aesthetic medicine included in this diploma?",
        "answer": "Yes, core aesthetic skills including chemical peeling and PRP are covered."
      }
    ]
  },
  {
    "id": 14,
    "slug": "pg-diploma-in-maternal-child-health",
    "title": "PG Diploma in Maternal & Child Health (MCH)",
    "tagline": "Antenatal High-Risk Obstetric Care, Normal Labour Protocols & Neonatal Resuscitation",
    "categoryId": 7,
    "categoryName": "Pediatrics & Neonatology",
    "courseType": "PG_DIPLOMA",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "12 Months",
    "clinicalHours": 150,
    "eligibility": "MBBS / DGO / MD (OBG / Peds)",
    "feeINR": 160000,
    "feeUSD": 2400,
    "emiStartingINR": 6700,
    "ratingVal": 4.9,
    "ratingCount": 160,
    "totalEnrolled": 710,
    "nextBatchDate": "2026-09-10",
    "isFeatured": false,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "High-Risk Pregnancy & Labor Management",
        "topics": [
          "Preeclampsia Management",
          "Postpartum Hemorrhage (PPH) Bundles",
          "Cardiotocography (CTG)"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Neonatal Resuscitation & Common Childhood Illnesses",
        "topics": [
          "NRP Guidelines",
          "Neonatal Sepsis",
          "Vaccination Schedules"
        ]
      }
    ],
    "careerOpportunities": [
      "MCH Officer",
      "OBG/Pediatric Clinical Registrar",
      "Primary Health Consultant"
    ],
    "skillsCovered": [
      "NRP Resuscitation",
      "CTG Interpretation",
      "PPH Emergency Protocol",
      "Kangaroo Mother Care"
    ],
    "clinicalHospitals": [
      "Cloudnine Hospitals",
      "Rainbow Children's Hospital",
      "Apollo Cradle"
    ],
    "faqs": [
      {
        "question": "Is neonatal resuscitation certification included?",
        "answer": "Yes, NRP algorithm training and practical assessments are part of the curriculum."
      }
    ]
  },
  {
    "id": 15,
    "slug": "pg-diploma-in-clinical-embryology",
    "title": "PG Diploma in Clinical Embryology",
    "tagline": "Complete Theoretical & Practical Foundations in Assisted Reproductive Technology (ART)",
    "categoryId": 4,
    "categoryName": "Reproductive Medicine & Embryology",
    "courseType": "PG_DIPLOMA",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "12 Months",
    "clinicalHours": 140,
    "eligibility": "MBBS / MD / MSc (Biotech / Microbiology / Zoology)",
    "feeINR": 190000,
    "feeUSD": 2850,
    "emiStartingINR": 7900,
    "ratingVal": 4.9,
    "ratingCount": 140,
    "totalEnrolled": 590,
    "nextBatchDate": "2026-09-01",
    "isFeatured": false,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Gametogenesis & In-Vitro Fertilization",
        "topics": [
          "Folliculogenesis",
          "Oocyte Recovery",
          "Media Preparation"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Laboratory Quality Management & Ethics",
        "topics": [
          "Incubator Monitoring",
          "Cryotank Maintenance",
          "ART Regulation Act"
        ]
      }
    ],
    "careerOpportunities": [
      "Junior Embryologist",
      "Andrology Lab Technologist",
      "IVF Coordinator"
    ],
    "skillsCovered": [
      "Semen Analysis (WHO 6th)",
      "IUI Preparation",
      "Oocyte Stripping"
    ],
    "clinicalHospitals": [
      "Nova IVF Fertility",
      "Indira IVF Clinics"
    ],
    "faqs": [
      {
        "question": "Does this course cover the new ART Regulation Act?",
        "answer": "Yes, all legal, ethical, and clinical requirements under the Indian ART Act are covered."
      }
    ]
  },
  {
    "id": 16,
    "slug": "certificate-course-in-2d-echocardiography",
    "title": "Certificate Course in 2D Echocardiography & Color Doppler",
    "tagline": "Hands-on Probe Handling, Standard Views, Valvular Assessment & EF Calculation",
    "categoryId": 1,
    "categoryName": "Clinical Cardiology",
    "courseType": "ADVANCED_CERTIFICATE",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "3 Months",
    "clinicalHours": 60,
    "eligibility": "MBBS / MD (Medicine) / DNB",
    "feeINR": 65000,
    "feeUSD": 980,
    "emiStartingINR": 2800,
    "ratingVal": 4.9,
    "ratingCount": 420,
    "totalEnrolled": 2400,
    "nextBatchDate": "2026-09-01",
    "isFeatured": true,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Standard Transthoracic Acoustic Windows",
        "topics": [
          "PLAX, PSAX, Apical 4-Chamber, Subcostal Views",
          "Probe Manipulation Physics"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Doppler Hemodynamics & Left Ventricular Function",
        "topics": [
          "Color Flow Doppler",
          "Pulsed & Continuous Wave Doppler",
          "Simpson's Biplane EF"
        ]
      }
    ],
    "careerOpportunities": [
      "Echocardiography Physician",
      "Cardiology Resident",
      "ICCU Consultant"
    ],
    "skillsCovered": [
      "2D Echo Acquisition",
      "Color Doppler",
      "LV Ejection Fraction Estimation",
      "Valvular Regurgitation Grading"
    ],
    "clinicalHospitals": [
      "Apollo Hospitals",
      "Fortis Escorts Heart Institute"
    ],
    "faqs": [
      {
        "question": "How many hands-on scans will I perform?",
        "answer": "Candidates perform at least 50 guided live echocardiograms during hospital rotations."
      }
    ]
  },
  {
    "id": 17,
    "slug": "certificate-in-mechanical-ventilation-icu",
    "title": "Certificate in Mechanical Ventilation & ICU Resuscitation",
    "tagline": "Master Invasive & Non-Invasive Ventilation (NIV), Waveform Graphics & Trouble-shooting",
    "categoryId": 2,
    "categoryName": "Critical Care & ICU",
    "courseType": "ADVANCED_CERTIFICATE",
    "deliveryMode": "ONLINE_LIVE",
    "duration": "3 Months",
    "clinicalHours": 50,
    "eligibility": "MBBS / DA / MD / DNB / Critical Care Nurses",
    "feeINR": 55000,
    "feeUSD": 850,
    "emiStartingINR": 2300,
    "ratingVal": 4.9,
    "ratingCount": 310,
    "totalEnrolled": 1800,
    "nextBatchDate": "2026-09-01",
    "isFeatured": true,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Ventilator Modes & Initial Settings",
        "topics": [
          "Volume Control vs Pressure Control",
          "SIMV, PRVC, PSV",
          "Dead Space & Alveolar Ventilation"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Waveform Analysis & Patient-Ventilator Asynchrony",
        "topics": [
          "Flow-Time & Pressure-Time Curves",
          "Auto-PEEP Detection",
          "Trigger Dyssynchrony"
        ]
      }
    ],
    "careerOpportunities": [
      "ICU Medical Officer",
      "Emergency Physician",
      "Anaesthetist"
    ],
    "skillsCovered": [
      "Ventilator Setup",
      "Graphic Waveform Interpretation",
      "ARDS Protective Ventilation",
      "Weaning Protocol"
    ],
    "clinicalHospitals": [
      "Medanta - The Medicity",
      "Max Healthcare"
    ],
    "faqs": [
      {
        "question": "Is this course accessible for working practitioners?",
        "answer": "Yes, live weekend interactive sessions with recorded access and virtual simulators."
      }
    ]
  },
  {
    "id": 18,
    "slug": "certificate-in-aesthetic-medicine-lasers",
    "title": "Certificate in Aesthetic Medicine & Clinical Lasers",
    "tagline": "Hands-on Chemical Peeling, Micro-needling, Dermaroller, PRP & Laser Safety",
    "categoryId": 5,
    "categoryName": "Clinical & Aesthetic Dermatology",
    "courseType": "ADVANCED_CERTIFICATE",
    "deliveryMode": "HYBRID_CLINICAL",
    "duration": "3 Months",
    "clinicalHours": 50,
    "eligibility": "MBBS / BDS / MD / DVD",
    "feeINR": 75000,
    "feeUSD": 1100,
    "emiStartingINR": 3200,
    "ratingVal": 4.8,
    "ratingCount": 280,
    "totalEnrolled": 1540,
    "nextBatchDate": "2026-09-20",
    "isFeatured": true,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Chemical Peels & Skin Rejuvenation",
        "topics": [
          "Glycolic, Salicylic & TCA Peels",
          "Pre/Post-Peel Care",
          "Hyperpigmentation Management"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Clinical Laser Physics & Energy Devices",
        "topics": [
          "Q-Switched Nd:YAG Laser",
          "Diode Laser Hair Removal",
          "Fractional CO2 for Scars"
        ]
      }
    ],
    "careerOpportunities": [
      "Aesthetic Medicine Practitioner",
      "Cosmetologist",
      "Skin Clinic In-Charge"
    ],
    "skillsCovered": [
      "Chemical Peeling",
      "Laser Operation & Safety",
      "PRP Hair/Face",
      "Dermapen Microneedling"
    ],
    "clinicalHospitals": [
      "Max Healthcare Aesthetic Centre",
      "Fortis Hospital"
    ],
    "faqs": [
      {
        "question": "Are live model patients provided for workshops?",
        "answer": "Yes, candidates practice chemical peeling, dermaroller, and laser settings on guided clinical cases."
      }
    ]
  },
  {
    "id": 19,
    "slug": "certificate-in-diabetes-mellitus-management",
    "title": "Certificate in Diabetes Mellitus Management",
    "tagline": "Master Modern Insulin Regimens, GLP-1 Analogues, SGLT-2 Inhibitors & CGM Technology",
    "categoryId": 6,
    "categoryName": "Clinical Diabetology",
    "courseType": "ADVANCED_CERTIFICATE",
    "deliveryMode": "ONLINE_LIVE",
    "duration": "3 Months",
    "clinicalHours": 40,
    "eligibility": "MBBS / MD / Family Physicians",
    "feeINR": 48000,
    "feeUSD": 720,
    "emiStartingINR": 2100,
    "ratingVal": 4.9,
    "ratingCount": 350,
    "totalEnrolled": 2100,
    "nextBatchDate": "2026-09-01",
    "isFeatured": false,
    "isPopular": true,
    "isAdmissionOpen": true,
    "heroImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
    "curriculum": [
      {
        "moduleNumber": 1,
        "title": "Pharmacotherapy & Glycemic Target Customization",
        "topics": [
          "Basal-Bolus Insulin",
          "GLP-1 RAs & Dual Incretins",
          "SGLT-2 Cardiorenal Protection"
        ]
      },
      {
        "moduleNumber": 2,
        "title": "Complication Screening & Technology",
        "topics": [
          "Continuous Glucose Monitoring (CGM)",
          "Diabetic Neuropathy Screening",
          "Diabetic Kidney Disease"
        ]
      }
    ],
    "careerOpportunities": [
      "Diabetologist Consultant",
      "Family Practice Physician",
      "Wellness Centre Doctor"
    ],
    "skillsCovered": [
      "Insulin Initiation & Titration",
      "CGM AGP Interpretation",
      "Diabetic Foot Examination"
    ],
    "clinicalHospitals": [
      "Apollo Sugar Clinics",
      "Medanta Endocrine Center"
    ],
    "faqs": [
      {
        "question": "Does this include CGM ambulatory profile interpretation?",
        "answer": "Yes, Time-in-Range (TIR) analysis and continuous glucose sensor reading are thoroughly taught."
      }
    ]
  }
];

export const hospitalPartners: HospitalPartner[] = [
  {
    id: 1,
    name: "Apollo Hospitals",
    logoUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&auto=format&fit=crop&q=80",
    location: "Pan-India Network",
    partnerType: "Clinical Attachments & ICU Rotations",
  },
  {
    id: 2,
    name: "Fortis Healthcare",
    logoUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&auto=format&fit=crop&q=80",
    location: "Delhi-NCR, Bengaluru, Mumbai",
    partnerType: "Tertiary Surgical & Critical Care",
  },
  {
    id: 3,
    name: "Max Healthcare",
    logoUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200&auto=format&fit=crop&q=80",
    location: "North India Network",
    partnerType: "Minimal Access & Laparoscopy",
  },
  {
    id: 4,
    name: "Medanta - The Medicity",
    logoUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&auto=format&fit=crop&q=80",
    location: "Gurugram, Lucknow",
    partnerType: "Cardiac Sciences & Cath Lab",
  },
  {
    id: 5,
    name: "Manipal Hospitals",
    logoUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=200&auto=format&fit=crop&q=80",
    location: "Bengaluru, Mangalore, Jaipur",
    partnerType: "Multi-Specialty Bedside Training",
  },
  {
    id: 6,
    name: "Narayana Health",
    logoUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=200&auto=format&fit=crop&q=80",
    location: "Bengaluru, Kolkata, Delhi",
    partnerType: "Cardiovascular & ICU Rotations",
  },
  {
    id: 7,
    name: "Cloudnine Hospitals",
    logoUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=200&auto=format&fit=crop&q=80",
    location: "Pan-India",
    partnerType: "Perinatology & Fetal Scans",
  },
  {
    id: 8,
    name: "Rainbow Children's Hospital",
    logoUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=200&auto=format&fit=crop&q=80",
    location: "Hyderabad, Bengaluru, Delhi",
    partnerType: "NICU, PICU & Pediatric Care",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    doctorName: "Dr. Ananya Iyer",
    qualification: "MBBS, Fellow in Clinical Cardiology",
    hospital: "Apex Heart & Vascular Center",
    city: "Bengaluru",
    state: "Karnataka",
    courseName: "Fellowship in Clinical Cardiology",
    quote: "The hands-on 2D Echo attachment and bedside case discussions boosted my clinical confidence tremendously. Within 2 months of graduation, I took charge of our hospital's 12-bed ICCU.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80",
    isFeatured: true,
  },
  {
    id: 2,
    doctorName: "Dr. Vikramaditya Rathore",
    qualification: "MBBS, FCCM",
    hospital: "Medicity Super Speciality Hospital",
    city: "Jaipur",
    state: "Rajasthan",
    courseName: "Fellowship in Critical Care Medicine",
    quote: "Learning mechanical ventilation curves, ARDS proning, and arterial line cannulation under eminent intensivists was a game changer. The hybrid format allowed me to study without leaving my regular job.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
    isFeatured: true,
  },
  {
    id: 3,
    doctorName: "Dr. Shalini Deshmukh",
    qualification: "MBBS, DGO, Fellow in Fetal Medicine",
    hospital: "Maternity & Fetal Wellness Clinic",
    city: "Pune",
    state: "Maharashtra",
    courseName: "Fellowship in Fetal Medicine & Ultrasound",
    quote: "Accurate first-trimester NT scans and fetal Doppler reporting require rigorous guidance. The perinatology mentors at IMC are world-class. My scan referral volume has tripled.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1594824813589-322194c77579?w=300&auto=format&fit=crop&q=80",
    isFeatured: true,
  },
  {
    id: 4,
    doctorName: "Dr. Rohan Mehta",
    qualification: "MBBS, MRCEM Primary",
    hospital: "Apollo Hospital Trauma Wing",
    city: "Ahmedabad",
    state: "Gujarat",
    courseName: "Fellowship in Emergency Medicine",
    quote: "Bedside ultrasound (E-FAST), difficult airway management, and rapid trauma resuscitation algorithms were taught with intense hands-on simulation. Exceptional faculty mentorship.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
    isFeatured: true,
  },
  {
    id: 5,
    doctorName: "Dr. Prerna Sharma",
    qualification: "MBBS, MD (Medicine)",
    hospital: "Max Super Speciality Hospital",
    city: "New Delhi",
    state: "Delhi NCR",
    courseName: "Fellowship in Clinical Diabetology",
    quote: "The complex insulin pump management protocols, continuous glucose monitoring (CGM) analysis, and diabetic foot wound care rotation gave me actionable expertise to run an independent metabolic clinic.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80",
    isFeatured: true,
  },
  {
    id: 6,
    doctorName: "Dr. Arvind Swamy",
    qualification: "MBBS, DVD, FAM",
    hospital: "Fortis Escorts Medical Institute",
    city: "Chennai",
    state: "Tamil Nadu",
    courseName: "Fellowship in Clinical Dermatology & Aesthetics",
    quote: "Mastering fractional CO2 lasers, chemical peels, and trichology procedures under renowned dermatologists boosted our clinic's procedural revenue significantly.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80",
    isFeatured: true,
  },
];

export const facultyMembers: FacultyMember[] = [
  {
    id: 1,
    slug: "dr-k-s-murthy",
    name: "Dr. K. S. Murthy",
    designation: "Chief Director & Senior Interventional Cardiologist",
    qualifications: "MD (Medicine), DM (Cardiology), FACC",
    hospitalAffiliation: "Senior Interventional Consultant, Apollo Heart Institute",
    experienceYears: 24,
    photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
    bio: "Over 24 years of clinical experience in interventional cardiology, complex structural interventions, and cardiac imaging mentorship.",
    isFeatured: true,
  },
  {
    id: 2,
    slug: "dr-meenakshi-singh",
    name: "Dr. Meenakshi Singh",
    designation: "Clinical Director of Critical Care Medicine",
    qualifications: "MD (Anaesthesia), IDCCM, EDIC (UK)",
    hospitalAffiliation: "Head of Critical Care, Fortis Memorial Research Institute",
    experienceYears: 18,
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    bio: "Pioneer in ECMO and septic shock resuscitation protocols with extensive experience training over 1,500 ICU registrars.",
    isFeatured: true,
  },
  {
    id: 3,
    slug: "dr-rahul-bhatnagar",
    name: "Dr. Rahul Bhatnagar",
    designation: "Director of Emergency Medical Sciences",
    qualifications: "MD (Emergency Medicine), MRCEM (UK)",
    hospitalAffiliation: "Director ER, Max Super Speciality Hospital",
    experienceYears: 16,
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    bio: "International instructor for advanced resuscitation, disaster triage, and bedside POCUS in acute care.",
    isFeatured: true,
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "how-to-interpret-complex-ecg-arrhythmias-in-iccu",
    title: "How to Interpret Complex Arrhythmias in the Cardiac ICU: A Practical Guide for Physicians",
    excerpt: "Learn systematic step-by-step ECG analysis for wide-complex tachycardias, differentiating VT from SVT with aberrancy, Brugada patterns, and life-threatening electrolyte disturbances.",
    category: "Clinical Cardiology",
    authorName: "Dr. K. S. Murthy",
    authorDesignation: "DM (Cardiology), Senior ICCU Consultant",
    authorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
    authorBio: "Dr. K. S. Murthy is an Interventional Cardiologist and Academic Director with over 18 years of clinical experience mentoring fellows in bedside echocardiography and acute cardiac emergencies.",
    coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&auto=format&fit=crop&q=80",
    readTimeMinutes: 7,
    publishedAt: "2026-08-10",
    updatedAt: "2026-08-15",
    tags: ["ECG Interpretation", "Cardiology Fellowship", "Arrhythmias", "ICCU Protocols", "Ventricular Tachycardia"],
    metaTitle: "Complex ECG Arrhythmia Interpretation Guide for ICU Doctors | IMC",
    metaDescription: "Master wide-complex tachycardia differentiation, Brugada syndrome, and hyperkalemia ECG patterns with step-by-step algorithms designed by cardiologists.",
    relatedCourseSlug: "fellowship-in-clinical-cardiology",
    relatedCourseTitle: "Fellowship in Clinical Cardiology",
    contentHtml: `
      <h2>1. The Urgent Diagnostic Dilemma: VT vs. SVT with Aberrancy</h2>
      <p>When an unstable patient in the ICCU presents with a regular, wide-complex tachycardia (QRS duration &gt; 120 ms) and a heart rate exceeding 150 bpm, the physician must quickly differentiate between <strong>Ventricular Tachycardia (VT)</strong> (originating below the bundle of His) and <strong>Supraventricular Tachycardia (SVT) with aberrant ventricular conduction</strong> or pre-excitation.</p>
      
      <p><strong>Clinical Gold Standard:</strong> In an acute adult ICU setting, approximately 80% to 85% of wide-complex tachycardias are VT. In patients with pre-existing ischemic heart disease, prior myocardial infarction, or reduced ejection fraction, that probability rises above <strong>95%</strong>. Always treat wide-complex tachycardia as VT until proven otherwise.</p>

      <div class="my-6 p-5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950">
        <h4 class="font-bold text-sm mb-1 text-blue-900 flex items-center gap-1.5">
          <span>🩺 Clinical Pearl: The Brugada 4-Step Diagnostic Algorithm</span>
        </h4>
        <ol class="list-decimal pl-5 space-y-1.5 text-xs text-blue-900 leading-relaxed mt-2">
          <li><strong>Step 1:</strong> Absence of an RS complex in all precordial leads (V1–V6)? If YES ➔ Diagnosis is VT.</li>
          <li><strong>Step 2:</strong> Is the RS interval (onset of R wave to deepest nadir of S wave) &gt; 100 ms in any precordial lead? If YES ➔ Diagnosis is VT.</li>
          <li><strong>Step 3:</strong> Evidence of Atrioventricular (AV) dissociation, capture beats, or fusion beats? If YES ➔ Diagnosis is definitively VT.</li>
          <li><strong>Step 4:</strong> Check morphological criteria for VT in leads V1/V2 and V6. If criteria met in both leads ➔ Diagnosis is VT.</li>
        </ol>
      </div>

      <h2>2. Pathognomonic Clues: Capture Beats, Fusion Beats & AV Dissociation</h2>
      <p>The discovery of independent atrial activity (AV dissociation) remains the single most specific finding for VT. In standard 12-lead ECGs, look closely at lead II, V1, and rhythm strips for P waves that "march through" the wide QRS complexes at a slower, completely dissociated rate.</p>
      
      <ul>
        <li><strong>Capture Beats (Dressler Beats):</strong> A normal sinus impulse momentarily manages to conduct through the AV node, producing a narrow, normal-appearing QRS complex amid the wide-complex tachycardia.</li>
        <li><strong>Fusion Beats:</strong> A supraventricular impulse and a ventricular focus simultaneously depolarize parts of the myocardium, producing a hybrid QRS complex intermediate in morphology and duration.</li>
      </ul>

      <h2>3. The Vereckei aVR Algorithm: Simplified 4-Step Analysis</h2>
      <p>Lead aVR provides a unique window looking directly into the cardiac ventricular cavity from the right shoulder. Dr. András Vereckei’s simplified algorithm evaluates solely lead aVR:</p>

      <div class="overflow-x-auto my-6">
        <table class="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
          <thead class="bg-slate-100 font-bold text-slate-700">
            <tr>
              <th class="p-3">Step</th>
              <th class="p-3">aVR Feature</th>
              <th class="p-3">Interpretation</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr>
              <td class="p-3 font-mono font-bold">1</td>
              <td class="p-3">Presence of an initial R wave in aVR</td>
              <td class="p-3 text-emerald-700 font-bold">VT Confirmed</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold">2</td>
              <td class="p-3">Width of initial r or q wave &gt; 40 ms</td>
              <td class="p-3 text-emerald-700 font-bold">VT Confirmed</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold">3</td>
              <td class="p-3">Notching on initial downstroke of a predominantly negative QRS</td>
              <td class="p-3 text-emerald-700 font-bold">VT Confirmed</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold">4</td>
              <td class="p-3">Ventricular activation velocity ratio (vi/vt) ≤ 1</td>
              <td class="p-3 text-emerald-700 font-bold">VT Confirmed</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>4. Electrolyte Emergencies: The "Great Mimickers" in ICCU</h2>
      <p>Severe hyperkalemia (Serum Potassium &gt; 6.5 mEq/L) can cause progressive conduction delay, manifesting as widening of the QRS complex, loss of P waves, and a classic <em>sine wave pattern</em> that can be easily misdiagnosed as ventricular tachycardia.</p>
      
      <p><strong>Immediate Intervention:</strong> Never administer anti-arrhythmics like Amiodarone or beta-blockers to a patient in sine-wave hyperkalemia. Administer <strong>Intravenous Calcium Gluconate (10% 10-20 mL over 5 minutes)</strong> to stabilize the cardiac membrane immediately, followed by insulin-dextrose shift therapy and nebulized salbutamol.</p>

      <h2>5. Key Summary Checklist for Duty Medical Officers</h2>
      <ol>
        <li>Check hemodynamic stability: If hypotension, altered mentation, or ischemic chest pain ➔ Immediate Synchronized Cardioversion (100J–200J Biphasic).</li>
        <li>Print a full 12-lead ECG and a long rhythm strip in lead II and V1 before pharmacotherapy.</li>
        <li>Review prior baseline ECGs to identify pre-existing bundle branch block or previous MI scars.</li>
        <li>Never administer Verapamil or Diltiazem for an undifferentiated wide-complex tachycardia, as this can precipitate refractory cardiac arrest in VT.</li>
      </ol>
    `
  },
  {
    id: 2,
    slug: "mechanical-ventilation-in-severe-ards-proning-protocols",
    title: "Mechanical Ventilation in Severe ARDS: Step-by-Step Driving Pressure & Proning Protocols",
    excerpt: "Evidence-based guidelines on lung-protective ventilation, driving pressure titration below 15 cmH2O, and patient selection for early prone position ventilation in the ICU.",
    category: "Critical Care",
    authorName: "Dr. Meenakshi Singh",
    authorDesignation: "MD (Anaesthesia), IDCCM, EDIC",
    authorAvatar: "https://images.unsplash.com/photo-1594824813589-3221b6d05f32?w=200&auto=format&fit=crop&q=80",
    authorBio: "Dr. Meenakshi Singh is a Senior Intensivist and Critical Care Specialist with expertise in ECMO, advanced ventilator modes, and hemodynamic line placements.",
    coverImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&auto=format&fit=crop&q=80",
    readTimeMinutes: 9,
    publishedAt: "2026-08-05",
    updatedAt: "2026-08-12",
    tags: ["Critical Care", "Mechanical Ventilation", "ARDS", "ICU Fellowship", "Proning Protocol"],
    metaTitle: "Mechanical Ventilation in Severe ARDS: Driving Pressure & Proning Guide",
    metaDescription: "Master lung-protective ventilation, plateau pressure monitoring, PEEP titration, and prone positioning protocols for severe acute respiratory distress syndrome.",
    relatedCourseSlug: "fellowship-in-critical-care-medicine",
    relatedCourseTitle: "Fellowship in Critical Care Medicine",
    contentHtml: `
      <h2>1. The Berlin Definition & Severity Stratification of ARDS</h2>
      <p>Acute Respiratory Distress Syndrome (ARDS) is an inflammatory lung injury characterized by increased vascular permeability, diffuse alveolar damage, and severe refractory hypoxemia. Severity is classified according to the <strong>PaO2/FiO2 (P/F) ratio</strong> on a minimum PEEP of 5 cmH2O:</p>
      
      <ul>
        <li><strong>Mild ARDS:</strong> 200 mmHg &lt; PaO2/FiO2 ≤ 300 mmHg</li>
        <li><strong>Moderate ARDS:</strong> 100 mmHg &lt; PaO2/FiO2 ≤ 200 mmHg</li>
        <li><strong>Severe ARDS:</strong> PaO2/FiO2 &le; 100 mmHg (associated with ICU mortality &gt; 45%)</li>
      </ul>

      <h2>2. Lung-Protective Ventilation Strategy (The ARMA Protocol)</h2>
      <p>The foundation of ventilatory management in ARDS is the prevention of <strong>Ventilator-Induced Lung Injury (VILI)</strong>, including volutrauma, barotrauma, atelectotrauma, and biotrauma. Tidal volume must be calculated based on <strong>Predicted Body Weight (PBW)</strong>, never actual patient weight:</p>
      
      <div class="my-5 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800">
        <p><strong>Males:</strong> PBW (kg) = 50 + 0.91 × [Height in cm - 152.4]</p>
        <p class="mt-1"><strong>Females:</strong> PBW (kg) = 45.5 + 0.91 × [Height in cm - 152.4]</p>
      </div>

      <p>Target initial tidal volume at <strong>6 mL/kg PBW</strong> (titrating down to 4 mL/kg if plateau pressure exceeds 30 cmH2O). Maintain respiratory rate to achieve acceptable minute ventilation while allowing for <em>permissive hypercapnia</em> (target pH &ge; 7.20).</p>

      <h2>3. Driving Pressure (&Delta;P): The Crucial Prognostic Metric</h2>
      <p>Seminal research by Amato et al. demonstrated that <strong>Driving Pressure (&Delta;P = Pplat - PEEP)</strong> is the single respiratory parameter most strongly correlated with ARDS survival. A driving pressure exceeding <strong>15 cmH2O</strong> is associated with dramatically increased alveolar shear stress and barotrauma risk.</p>

      <div class="my-6 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
        <h4 class="font-bold text-sm mb-1 text-amber-900">⚡ How to Titrate Driving Pressure at the Bedside:</h4>
        <ol class="list-decimal pl-5 space-y-1.5 text-xs text-amber-950 leading-relaxed mt-2">
          <li>Perform an inspiratory hold (0.5 to 1.0 second) on a relaxed, non-breathing patient to measure Plateau Pressure (Pplat).</li>
          <li>Subtract Total PEEP (Intrinsic + Applied PEEP) from Pplat.</li>
          <li>If &Delta;P &gt; 14 cmH2O, decrease tidal volume by 0.5–1.0 mL/kg PBW.</li>
          <li>If patient is dyssynchronous, initiate neuromuscular blockade (e.g., Cisatracurium infusion) during the initial 48 hours of severe ARDS.</li>
        </ol>
      </div>

      <h2>4. Prone Positioning Protocol (PROSEVA Trial Criteria)</h2>
      <p>Prone positioning improves ventilation-perfusion matching by redistributing lung transpulmonary pressure, reducing dorsal alveolar collapse, and enhancing chest wall compliance. Early, prolonged prone positioning (at least <strong>16 consecutive hours per session</strong>) confers a significant 28-day mortality reduction in severe ARDS (P/F ratio &lt; 150 mmHg on FiO2 &ge; 0.6 and PEEP &ge; 10 cmH2O).</p>

      <div class="overflow-x-auto my-6">
        <table class="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
          <thead class="bg-slate-100 font-bold text-slate-700">
            <tr>
              <th class="p-3">Phase</th>
              <th class="p-3">Action Items</th>
              <th class="p-3">Safety Checks</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr>
              <td class="p-3 font-bold">Pre-Prone</td>
              <td class="p-3">Stop enteral feeds 2 hrs prior, aspirate Ryle's tube, pre-oxygenate FiO2 1.0</td>
              <td class="p-3 text-red-600 font-bold">Secure ETT & arterial/central lines</td>
            </tr>
            <tr>
              <td class="p-3 font-bold">Proning Turn</td>
              <td class="p-3">Minimum 4-person coordinated team led by senior intensivist at head of bed</td>
              <td class="p-3 text-emerald-700 font-bold">Confirm ETT position by auscultation</td>
            </tr>
            <tr>
              <td class="p-3 font-bold">Maintenance</td>
              <td class="p-3">Maintain prone for 16–20 hours daily. Alternate arm swimmer position q2h</td>
              <td class="p-3">Eye lubrication, foam pad pressure relief</td>
            </tr>
            <tr>
              <td class="p-3 font-bold">Response Eval</td>
              <td class="p-3">Obtain ABG 4 hours post-prone. Success = P/F ratio increase &gt; 20%</td>
              <td class="p-3 font-bold text-blue-700">Continue daily cycles until P/F &gt; 150</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>5. Clinical Takeaways for Intensivists</h2>
      <ul>
        <li>Calculate tidal volume strictly based on PBW (never actual weight).</li>
        <li>Keep Plateau Pressure &le; 30 cmH2O and Driving Pressure &le; 14 cmH2O.</li>
        <li>Initiate prone positioning early (within first 36 hours) for P/F ratio &lt; 150 mmHg.</li>
        <li>Avoid fluid overload: maintain conservative fluid management strategy once hemodynamic shock is resolved.</li>
      </ul>
    `
  },
  {
    id: 3,
    slug: "first-trimester-fetal-nt-scan-best-practices",
    title: "First Trimester Fetal NT Scan: Overcoming Common Pitfalls in Diagnostic Ultrasound",
    excerpt: "Fetal Medicine Foundation (FMF) quality criteria for true mid-sagittal views, neutral neck alignment, magnification techniques, and distinguishing amnion from nuchal fold.",
    category: "Fetal Medicine & OB-GYN",
    authorName: "Dr. Shalini Deshmukh",
    authorDesignation: "MD (OB-GYN), Fellow in Fetal Medicine (UK)",
    authorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
    authorBio: "Dr. Shalini Deshmukh is a Consultant Perinatologist and FMF UK Accredited Fetal Ultrasound specialist with extensive experience in genetic anomaly screening.",
    coverImage: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&auto=format&fit=crop&q=80",
    readTimeMinutes: 6,
    publishedAt: "2026-07-28",
    updatedAt: "2026-08-01",
    tags: ["Fetal Medicine", "Ultrasound Fellowship", "NT Scan", "Anomaly Scan", "Prenatal Diagnosis"],
    metaTitle: "Fetal NT Scan Ultrasound Best Practices & Pitfalls | IMC",
    metaDescription: "Master Fetal Medicine Foundation (FMF) quality criteria for first-trimester nuchal translucency measurement and nasal bone assessment.",
    relatedCourseSlug: "fellowship-in-fetal-medicine-and-ultrasound",
    relatedCourseTitle: "Fellowship in Fetal Medicine & Ultrasound",
    contentHtml: `
      <h2>1. The Importance of Precise Nuchal Translucency (NT) Measurement</h2>
      <p>First-trimester screening between <strong>11 weeks + 0 days and 13 weeks + 6 days</strong> (corresponding to a Fetal Crown-Rump Length [CRL] of 45 mm to 84 mm) is the cornerstone of non-invasive prenatal screening for chromosomal aneuploidies (Trisomy 21, 18, and 13) as well as major congenital cardiac defects and genetic syndromes.</p>
      
      <p>Because an error of merely <strong>0.1 mm</strong> in NT measurement can alter a patient’s calculated Down syndrome risk assessment by several orders of magnitude, strict adherence to the <strong>Fetal Medicine Foundation (FMF UK)</strong> quality standards is mandatory for all practicing sonologists and obstetricians.</p>

      <h2>2. The FMF Quality Checklist: 6 Golden Rules</h2>
      <div class="my-5 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950">
        <h4 class="font-bold text-sm mb-2 text-emerald-900">📋 The 6 Mandatory FMF Criteria:</h4>
        <ol class="list-decimal pl-5 space-y-2 text-xs text-emerald-950">
          <li><strong>Gestational Age:</strong> Fetal CRL must strictly measure between 45 mm and 84 mm.</li>
          <li><strong>Magnification:</strong> The fetal head and thorax must occupy at least 75% to 80% of the ultrasound monitor display.</li>
          <li><strong>True Mid-Sagittal Plane:</strong> Must clearly visualize the echogenic tip of the nasal bone, the rectangular shape of the palate, the translucent diencephalon posteriorly, and the nuchal membrane.</li>
          <li><strong>Neutral Neck Position:</strong> Fetus must not be hyperextended (falsely increases NT) or hyperflexed (falsely decreases NT). A visible pocket of fluid between chin and chest confirms neutral alignment.</li>
          <li><strong>Distinguish Amnion from Nuchal Skin:</strong> Ensure the translucent pocket measured is between the fetal skin and subcutaneous tissue, rather than the adjacent amniotic membrane.</li>
          <li><strong>Calipers Placement:</strong> Calipers must be placed strictly on the inner-to-inner borders (“On-to-On”) perpendicular to the long axis of the fetal body at the widest point of lucency.</li>
        </ol>
      </div>

      <h2>3. Common Pitfalls & How to Avoid Them</h2>
      
      <h3>Pitfall A: Fetal Cord Around the Neck (Nuchal Cord)</h3>
      <p>In approximately 5% to 10% of cases, the umbilical cord may be wrapped around the fetal neck, resulting in a false doubling of the NT measurement or a "constriction notch".</p>
      <p><strong>Solution:</strong> Apply Color Doppler. Measure the NT both above and below the cord wrap, or average the two measurements.</p>

      <h3>Pitfall B: Confusing the Amniotic Membrane with Fetal Skin</h3>
      <p>Before 14 weeks of gestation, the amnion is not yet fused to the chorion. If the fetus is resting against the amniotic membrane, measuring from the outer amnion will produce a catastrophically elevated false-positive result.</p>
      <p><strong>Solution:</strong> Wait for spontaneous fetal movement or gently tap the maternal abdomen with the probe transducer to observe separation of the fetal body from the amnion.</p>

      <h2>4. Additional First-Trimester Sonographic Markers</h2>
      <ul>
        <li><strong>Nasal Bone:</strong> Absent or hypoplastic in ~60% of fetuses with Trisomy 21.</li>
        <li><strong>Ductus Venosus Doppler:</strong> Reversed or absent 'a-wave' indicates elevated risk of chromosomal abnormalities and congenital heart disease.</li>
        <li><strong>Tricuspid Regurgitation:</strong> Systolic tricuspid regurgitant jet &gt; 60 cm/s is a powerful independent secondary marker.</li>
      </ul>
    `
  },
  {
    id: 4,
    slug: "point-of-care-ultrasound-in-emergency-trauma",
    title: "Point-of-Care Ultrasound (E-FAST) in Emergency Department Polytrauma Resuscitation",
    excerpt: "Master rapid bedside ultrasound protocols for identifying hemoperitoneum, pneumothorax, pericardial tamponade, and hemothorax within 2 minutes in the emergency room.",
    category: "Emergency Medicine",
    authorName: "Dr. Rahul Bhatnagar",
    authorDesignation: "MBBS, MRCEM (UK), Clinical Lead in EM",
    authorAvatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80",
    authorBio: "Dr. Rahul Bhatnagar is an Emergency Medicine Specialist and Resuscitation Instructor training casualty medical officers across major trauma centres.",
    coverImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80",
    readTimeMinutes: 7,
    publishedAt: "2026-07-20",
    updatedAt: "2026-07-25",
    tags: ["Emergency Medicine", "E-FAST Ultrasound", "Trauma Resuscitation", "POCUS", "Critical Care"],
    metaTitle: "E-FAST Ultrasound in Emergency Trauma Resuscitation | IMC",
    metaDescription: "Step-by-step guide to Extended Focused Assessment with Sonography for Trauma (E-FAST) in acute emergency and polytrauma management.",
    relatedCourseSlug: "fellowship-in-critical-care-medicine",
    relatedCourseTitle: "Fellowship in Emergency & Critical Care",
    contentHtml: `
      <h2>1. The Role of E-FAST in ATLS Trauma Resuscitation</h2>
      <p>The <strong>Extended Focused Assessment with Sonography for Trauma (E-FAST)</strong> is a rapid, non-invasive bedside sonographic examination performed during the Primary Survey (C - Circulation and B - Breathing) of Advanced Trauma Life Support (ATLS). Its primary purpose is to identify life-threatening free fluid (blood) in the peritoneal, pericardial, and pleural cavities, as well as detecting pneumothorax in unstable trauma patients.</p>

      <h2>2. The 6 Acoustic Windows of E-FAST</h2>
      <div class="overflow-x-auto my-5">
        <table class="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
          <thead class="bg-slate-100 font-bold text-slate-700">
            <tr>
              <th class="p-3">Window</th>
              <th class="p-3">Anatomical Location</th>
              <th class="p-3">Pathology Detected</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr>
              <td class="p-3 font-bold text-blue-900">1. Hepatorenal (Morison's Pouch)</td>
              <td class="p-3">Right mid-axillary line, 8th–11th intercostal space</td>
              <td class="p-3">Free fluid in subhepatic space (most sensitive peritoneal area)</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-blue-900">2. Splenorenal View</td>
              <td class="p-3">Left posterior axillary line, 6th–9th intercostal space</td>
              <td class="p-3">Perisplenic free fluid & subdiaphragmatic fluid collection</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-blue-900">3. Suprapubic (Pelvic View)</td>
              <td class="p-3">Midline just superior to pubic symphysis (Sagittal & Transverse)</td>
              <td class="p-3">Fluid in rectovesical pouch (males) / pouch of Douglas (females)</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-blue-900">4. Subxiphoid Cardiac View</td>
              <td class="p-3">Subxiphoid angled towards left shoulder (Curvilinear or Phased Array)</td>
              <td class="p-3 text-red-600 font-bold">Pericardial effusion / Cardiac tamponade</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-blue-900">5. Right & Left Pleural (Thoracic)</td>
              <td class="p-3">Posterior axillary line above diaphragm</td>
              <td class="p-3">Hemothorax (fluid above diaphragm displacing mirror image)</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-blue-900">6. Anterior Thoracic (Pneumothorax)</td>
              <td class="p-3">2nd–4th intercostal space, mid-clavicular line (High frequency linear probe)</td>
              <td class="p-3 text-red-600 font-bold">Pneumothorax (Absence of lung sliding, barcode sign on M-mode)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. Lung Ultrasound: Identifying Pneumothorax with Precision</h2>
      <p>Point-of-care ultrasound is significantly more sensitive (92% vs. 52%) than supine anterior-posterior chest radiography in detecting traumatic pneumothorax.</p>
      
      <ul>
        <li><strong>Normal Lung Sliding:</strong> Hyperechoic pleural line glides with respiration, creating the dynamic "ants on a log" appearance on B-mode and the classic "Sea-Shore Sign" on M-mode.</li>
        <li><strong>Pneumothorax:</strong> Air in the pleural space prevents visualization of visceral pleura sliding. On M-mode, this produces horizontal parallel lines known as the <strong>"Stratosphere" or "Barcode Sign"</strong>.</li>
        <li><strong>Lung Point:</strong> The transition boundary between sliding lung and absent sliding lung. <em>100% specific pathognomonic sign</em> for pneumothorax that defines its anatomical extent.</li>
      </ul>

      <h2>4. Clinical Algorithm: Integrating E-FAST into Trauma Decisions</h2>
      <ol>
        <li><strong>Unstable Patient + Positive E-FAST (Hemoperitoneum):</strong> Immediate transfer to Operating Theatre for exploratory laparotomy (no CT scan).</li>
        <li><strong>Unstable Patient + Pericardial Effusion + Tamponade Physiology:</strong> Immediate subxiphoid pericardiocentesis or emergency department thoracotomy.</li>
        <li><strong>Unstable Patient + Absent Lung Sliding (Pneumothorax):</strong> Immediate needle decompression / finger thoracostomy followed by intercostal drain insertion.</li>
        <li><strong>Stable Patient + Positive E-FAST:</strong> Contrast-enhanced CT (CECT) of abdomen/pelvis to grade solid organ injury.</li>
      </ol>
    `
  }
];

export const faqs: FaqItem[] = [
  {
    id: 1,
    category: "Admissions",
    question: "Who is Eligible to Apply for a Fellowship Program?",
    answer: "Eligibility criteria for fellowship programs can vary depending on the specific program. Generally, applicants must have completed a medical or dental degree, postgraduate degree, or equivalent qualification (MBBS, MD, MS, DNB, BDS, MDS, or recognized AYUSH/nursing degrees), and must be registered with the relevant medical council. For IMC online & hybrid fellowship programs, eligibility requirements differ based on the specific program you are interested in. IMC fellowships are designed for medical professionals who want to enhance their knowledge and practical skills in a particular area of healthcare.",
  },
  {
    id: 2,
    category: "General",
    question: "What is a Medical Fellowship Program?",
    answer: "A medical fellowship program is a specialized training course aimed at enhancing skills and providing in-depth education in a specific medical field. These programs, usually taken after completing an MBBS degree or postgraduate medical degree, are typically short-term to medium-term (ranging from 6 months to 1 year) and focus on advanced clinical training in a particular specialty.",
  },
  {
    id: 3,
    category: "Admissions",
    question: "Can I Apply for a Fellowship Without NEET PG?",
    answer: "Yes, absolutely! Healthcare ed-tech platforms like IMC offer fellowship programs for MBBS graduates that do not require the NEET PG entrance exam. You can apply for these fellowships by submitting your CV, medical degree, and registration. While some advanced surgical programs may involve a brief counsellor interview, most do not, making the application process straightforward and hassle-free.",
  },
  {
    id: 4,
    category: "General",
    question: "How Long do Fellowships & PG Diplomas Last?",
    answer: "Fellowship programs typically last anywhere from six months to two years, depending on the specific program and your career goals. Short-term procedural certificate courses last 3 months, 1-year clinical fellowships focus on in-depth hospital attachments and bedside patient cases, and long-term diplomas combine structured curriculum with practical clinical rotations.",
  },
  {
    id: 5,
    category: "Certificates",
    question: "Are Fellowships Recognized by MCI / NMC & International Accreditation Bodies?",
    answer: "Yes, many fellowship programs are structured to meet established quality benchmarks and CPD Standards Office (UK) guidelines. IMC fellowship programs provide high-quality learning, recognized CME credit points, and verified clinical logbooks. Completing an accredited fellowship enhances your employability and provides a competitive advantage in top hospital networks.",
  },
  {
    id: 6,
    category: "General",
    question: "What is the Difference Between a Fellowship and an Internship?",
    answer: "A fellowship primarily focuses on advanced professional development, sub-specialty clinical training, and collaborating with senior specialists in your field (e.g., Cath Lab, Laparoscopy, Fetal Scan Doppler, Critical Care). In contrast, an internship is a mandatory undergraduate rotation providing general, basic exposure across rotating hospital departments.",
  },
  {
    id: 7,
    category: "General",
    question: "What are the Key Benefits of an IMC Fellowship Program?",
    answer: "• Professional Development: Hands-on procedural experience, advanced diagnostic skills, and evidence-based clinical protocols.\n• Hospital Attachments: Bedside training at 50+ tertiary hospital networks (Apollo, Fortis, Max, Medanta).\n• Flexible Hybrid Learning: Modules scheduled around your hospital duty shifts.\n• Zero-Cost EMI Financing: Affordable monthly fee installments with zero-cost financing options.\n• Prestige & Career Growth: Verifiable credentials that elevate your clinical reputation and OPD practice.",
  },
  {
    id: 8,
    category: "Certificates",
    question: "How Can a Fellowship Add Credibility to My Practice?",
    answer: "• Recognition: Earning a fellowship certification signifies specialized competence and dedication to clinical excellence.\n• Validation: Certifications and transcripts serve as endorsements from recognized medical education bodies.\n• Access: Fellows gain access to high-impact study materials and clinical journals from esteemed publishers like McGraw Hill, Wolters Kluwer, and Springer Nature.",
  },
  {
    id: 9,
    category: "Admissions",
    question: "Which Fellowship is Best After MBBS?",
    answer: "High-demand fellowships after MBBS include:\n• Fellowship in Clinical Cardiology: 2D Echo, ECG interpretation, Cath Lab & ICCU protocols.\n• Fellowship in Critical Care Medicine: Mechanical ventilation, arterial lines, and ICU resuscitation.\n• Fellowship in Clinical Dermatology: Dermatosurgery, lasers, chemical peels, and aesthetic medicine.\n• Fellowship in Fetal Medicine & Ultrasound: NT scans, Level-II anomalies, and fetal Doppler.\n• Fellowship in Family Medicine & Emergency Care: Acute triage and broad OPD clinical management.",
  },
  {
    id: 10,
    category: "Admissions",
    question: "How Do I Apply for a Fellowship Program?",
    answer: "Applying is simple and straightforward:\n1. Choose your desired fellowship or PG diploma on our website.\n2. Submit the online application form with your contact details.\n3. An Academic Admissions Counsellor will contact you to evaluate eligibility, explain clinical attachment dates, and assist with 0% EMI enrollment.\n4. Submit your degree and council registration to receive your official admission confirmation letter.",
  },
  {
    id: 11,
    category: "Fees & EMI",
    question: "What are the 0% Interest EMI & Scholarship Options?",
    answer: "We provide 3, 6, 9, and 12-month zero-interest EMI financing through our banking partners with no hidden processing fees. Merit scholarships and early-bird fee waivers of up to 40% are also available based on academic background and counsellor review.",
  },
  {
    id: 12,
    category: "Clinical Rotations",
    question: "How are the Hospital Clinical Rotations Organized?",
    answer: "Clinical attachments take place across our accredited network of 50+ tertiary hospital partners (Apollo, Fortis, Max, Medanta, Manipal, Narayana Health, Cloudnine, Rainbow Children's Hospital). Candidates are scheduled in flexible slots allowing them to complete bedside cases without disrupting their daily practice.",
  },
];
