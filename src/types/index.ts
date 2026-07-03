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

export interface Application {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  jobId: {
    _id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    employmentType: string;
  };
  status: ApplicationStatus;
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
