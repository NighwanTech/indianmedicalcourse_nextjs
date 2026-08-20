export interface RedirectRule {
  id: string;
  sourcePath: string;
  targetPath: string;
  statusCode: 301 | 302;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

export const DEFAULT_301_REDIRECTS: RedirectRule[] = [
  {
    id: "red_1",
    sourcePath: "/fellowships",
    targetPath: "/courses",
    statusCode: 301,
    isActive: true,
    notes: "Legacy Fellowships archive to new Courses Master",
    createdAt: "2026-01-01",
  },
  {
    id: "red_2",
    sourcePath: "/pg-diplomas",
    targetPath: "/courses?category=PG+Diploma",
    statusCode: 301,
    isActive: true,
    notes: "Legacy PG diplomas archive",
    createdAt: "2026-01-01",
  },
  {
    id: "red_3",
    sourcePath: "/cardiology-fellowship",
    targetPath: "/courses/fellowship-in-clinical-cardiology",
    statusCode: 301,
    isActive: true,
    notes: "Direct high-traffic legacy Cardiology URL",
    createdAt: "2026-01-01",
  },
  {
    id: "red_4",
    sourcePath: "/critical-care-fellowship",
    targetPath: "/courses/fellowship-in-critical-care-medicine",
    statusCode: 301,
    isActive: true,
    notes: "Direct legacy Critical Care URL",
    createdAt: "2026-01-01",
  },
  {
    id: "red_5",
    sourcePath: "/admissions",
    targetPath: "/admission-process",
    statusCode: 301,
    isActive: true,
    notes: "Old admissions page redirect",
    createdAt: "2026-01-01",
  },
  {
    id: "red_6",
    sourcePath: "/partners",
    targetPath: "/placement-partners",
    statusCode: 301,
    isActive: true,
    notes: "Old hospital partners page redirect",
    createdAt: "2026-01-01",
  },
];

export const REDIRECTS_STORAGE_KEY = "imc_custom_301_redirects";

export function getActiveRedirect(pathname: string): RedirectRule | null {
  const normalized = pathname.toLowerCase().trim();
  
  // Check default 301 redirects
  const foundDefault = DEFAULT_301_REDIRECTS.find(
    (r) => r.isActive && r.sourcePath.toLowerCase() === normalized
  );
  if (foundDefault) return foundDefault;

  return null;
}
