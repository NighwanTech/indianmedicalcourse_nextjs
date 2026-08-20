export type CourseType = 'FELLOWSHIP' | 'PG_DIPLOMA' | 'ADVANCED_CERTIFICATE' | 'MASTERCLASS';
export type DeliveryMode = 'HYBRID_CLINICAL' | 'ONLINE_LIVE' | 'HOSPITAL_ATTACHMENT' | 'SELF_PACED';
export type DoctorQualification = 'MBBS' | 'MD_MS' | 'DNB' | 'BDS_MDS' | 'BAMS_BHMS' | 'BSc_MSc_NURSING' | 'OTHER_HEALTHCARE';
export type LeadSource = 'WEBSITE_FORM' | 'HERO_FORM' | 'BROCHURE_DOWNLOAD' | 'COURSE_PAGE_MODAL' | 'EXIT_INTENT' | 'WHATSAPP_CLICK' | 'PHONE_CLICK' | 'SCHOLARSHIP_CALC' | 'LANDING_PAGE';
export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'IN_COUNSELLING' | 'APPLICATION_SUBMITTED' | 'ADMITTED' | 'NOT_ELIGIBLE' | 'LOST' | 'MERGED';

export interface MediaAsset {
  id: number;
  uuid: string;
  originalName: string;
  fileName: string;
  fileType: 'IMAGE' | 'VIDEO' | 'PDF' | 'DOCUMENT' | 'ICON';
  mimeType: string;
  fileSizeBytes: number;
  url: string;
  webpUrl?: string;
  thumbnailUrl?: string;
  altText?: string;
  seoTitle?: string;
  width?: number;
  height?: number;
}

export interface MenuItem {
  id: number;
  label: string;
  url: string;
  target?: '_self' | '_blank';
  badgeText?: string;
  badgeColor?: string;
  iconName?: string;
  children?: MenuItem[];
}

export interface DynamicMenu {
  id: number;
  slug: string;
  name: string;
  items: MenuItem[];
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  subtitle?: string;
  description?: string;
  iconName?: string;
  badgeText?: string;
  courseCount: number;
  isFeatured?: boolean;
}

export interface Course {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  categoryId: number;
  categoryName: string;
  category?: string;
  shortDescription?: string;
  description?: string;
  courseType: CourseType;
  deliveryMode: DeliveryMode;
  duration: string;
  clinicalHours: number;
  eligibility: string;
  feeINR: number;
  feeUSD: number;
  emiStartingINR: number;
  ratingVal: number;
  ratingCount: number;
  totalEnrolled: number;
  nextBatchDate: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  isAdmissionOpen?: boolean;
  isPublished?: boolean;
  priority?: 1 | 2 | 3;
  heroImage: string;
  brochureUrl?: string;
  curriculum: {
    moduleNumber: number;
    title: string;
    topics: string[];
  }[];
  careerOpportunities: string[];
  skillsCovered: string[];
  clinicalHospitals: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface FacultyMember {
  id: number;
  slug: string;
  name: string;
  designation: string;
  qualifications: string;
  hospitalAffiliation: string;
  experienceYears: number;
  photoUrl: string;
  bio?: string;
  isFeatured?: boolean;
}

export interface Testimonial {
  id: number;
  doctorName: string;
  qualification: string;
  hospital: string;
  city: string;
  state: string;
  courseName: string;
  quote: string;
  detailedReview?: string;
  rating: number;
  avatarUrl: string;
  videoUrl?: string;
  isVideoTestimonial?: boolean;
  isFeatured?: boolean;
}

export interface HospitalPartner {
  id: number;
  name: string;
  logoUrl: string;
  partnerType: string;
  location?: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml?: string;
  category: string;
  authorName: string;
  authorDesignation: string;
  authorAvatar?: string;
  authorBio?: string;
  coverImage: string;
  readTimeMinutes: number;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  relatedCourseSlug?: string;
  relatedCourseTitle?: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface SiteSettings {
  brandName: string;
  supportEmail: string;
  admissionsEmail: string;
  hotlinePhone: string;
  whatsappNumber: string;
  registeredAddress: string;
  googleRating: string;
  reviewsCount: number;
  announcementText: string;
  announcementExpiry: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };
  googleAdsConversionId?: string;
  metaPixelId?: string;
}

export interface VisitorAttribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landingPage?: string;
}

export interface LeadSubmissionPayload {
  name: string;
  mobile: string;
  email: string;
  qualification: DoctorQualification;
  currentProfession?: string;
  experienceYears?: string;
  interestedCourseId?: number;
  interestedCourseName?: string;
  state?: string;
  city?: string;
  message?: string;
  preferredCounsellingTime?: string;
  leadSource?: LeadSource;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  landingPageUrl?: string;
}
