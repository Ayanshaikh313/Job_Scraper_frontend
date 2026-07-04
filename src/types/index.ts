// User Types
export type UserRole = 'student' | 'hiring_manager';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

// Job Types
export interface ScreeningQuestion {
  question: string;
  required: boolean;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  employmentType: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  screeningQuestions?: ScreeningQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface ExternalJob {
  title: string;
  company: string;
  location: string;
  applyUrl: string;
  source: 'RemoteOK' | 'Arbeitnow';
}

export interface JobsResponse {
  success: boolean;
  message: string;
  data: Job[];
  pagination?: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export interface ExternalJobsResponse {
  success: boolean;
  message: string;
  data: ExternalJob[];
  count: number;
}

// Application Types
export type ApplicationStatus = 'Applied' | 'Reviewing' | 'Rejected' | 'Accepted';

export interface ApplicationAnswer {
  question: string;
  answer: string;
}

export interface SkillCategories {
  frontend: string[];
  backend: string[];
  database: string[];
  cloud: string[];
  tools: string[];
  all: string[];
}

export interface KeywordAnalysis {
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordMatchPercentage: number;
}

export interface ExperienceAnalysis {
  requiredYears: number;
  candidateYears: number;
  experienceMatchPercentage: number;
}

export interface EducationAnalysis {
  requiredEducation: string;
  candidateEducation: string;
  educationMatchPercentage: number;
}

export interface AtsScoreBreakdown {
  keywordMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  resumeQuality: number;
}

export interface ResumeMetadata {
  wordCount: number;
  characterCount: number;
  pageCount: number;
  parsedAt?: string;
}

export interface AtsEvaluation {
  totalScore: number;
  recommendation: 'Strong Match' | 'Medium Match' | 'Weak Match';
  matchedSkills: string[];
  missingSkills: string[];
  jobSkills: SkillCategories;
  keywordAnalysis: KeywordAnalysis;
  experienceAnalysis: ExperienceAnalysis;
  educationAnalysis: EducationAnalysis;
  resumeQualityScore: number;
  scoreBreakdown: AtsScoreBreakdown;
  evaluatedAt?: string;
}

export interface Application {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
  } | null;
  jobId: {
    _id: string;
    title: string;
    company: string;
    location: string;
    description?: string;
    salary: string;
    employmentType: string;
    screeningQuestions?: ScreeningQuestion[];
  } | null;
  status: ApplicationStatus;
  resumeUrl?: string;
  resumeText?: string;
  resumeMetadata?: ResumeMetadata;
  extractedSkills?: SkillCategories;
  atsEvaluation?: AtsEvaluation;
  answers?: ApplicationAnswer[];
  rank?: number;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationsResponse {
  success: boolean;
  message: string;
  data: Application[];
  pagination?: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export interface AtsSummary {
  totalApplicants: number;
  averageAtsScore: number;
  strongMatches: number;
  mediumMatches: number;
  weakMatches: number;
}

export interface RankedApplicationsResponse {
  success: boolean;
  message: string;
  data: Application[];
  summary: AtsSummary;
}

export interface HiringManagerDashboardData {
  totalJobs: number;
  totalApplicants: number;
  averageAtsScore: number;
  strongMatches: number;
  mediumMatches: number;
  weakMatches: number;
  applicantsByStatus: {
    applied: number;
    reviewing: number;
    accepted: number;
    rejected: number;
  };
  topCandidates: Application[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isStudent: boolean;
  isHiringManager: boolean;
}
