const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Make API request with token
 */
export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> => {
  const { token, ...init } = options;

  const headers: any = {
    'Content-Type': 'application/json',
    ...init.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// ============ AUTH SERVICES ============

export const authService = {
  /**
   * Login user
   */
  login: async (email: string, password: string) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Register user
   */
  register: async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'student' | 'hiring_manager';
  }) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get user profile
   */
  getProfile: async (token: string) => {
    return apiCall('/auth/profile', {
      token,
    });
  },

  /**
   * Update user profile
   */
  updateProfile: async (token: string, data: { name?: string; email?: string }) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
  },
};

// ============ JOB SERVICES ============

export const jobService = {
  /**
   * Get all internal jobs
   */
  getJobs: async (token: string, params?: { search?: string; location?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.location) query.append('location', params.location);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString();
    const endpoint = `/jobs${queryString ? `?${queryString}` : ''}`;

    return apiCall(endpoint, {
      token,
    });
  },

  /**
   * Get external jobs from RemoteOK and Arbeitnow
   */
  getExternalJobs: async (token: string, params?: { search?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString();
    const endpoint = `/jobs/external${queryString ? `?${queryString}` : ''}`;

    return apiCall(endpoint, {
      token,
    });
  },

  /**
   * Get single job by ID
   */
  getJobById: async (token: string, jobId: string) => {
    return apiCall(`/jobs/${jobId}`, {
      token,
    });
  },

  /**
   * Create new job (Hiring Managers only)
   */
  createJob: async (token: string, data: any) => {
    return apiCall('/jobs', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    });
  },

  /**
   * Update job (Hiring Managers only)
   */
  updateJob: async (token: string, jobId: string, data: any) => {
    return apiCall(`/jobs/${jobId}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete job (Hiring Managers only)
   */
  deleteJob: async (token: string, jobId: string) => {
    return apiCall(`/jobs/${jobId}`, {
      method: 'DELETE',
      token,
    });
  },
};

// ============ APPLICATION SERVICES ============

export const applicationService = {
  /**
   * Apply to a job with resume and screening answers (Students only)
   * Content-Type: multipart/form-data
   */
  applyToJob: async (token: string, jobId: string, resume: File, answers: Array<{ question: string; answer: string }>) => {
    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('resume', resume);
    formData.append('answers', JSON.stringify(answers));

    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Application submission failed');
    }

    return response.json();
  },

  /**
   * Get student's applications (Students only)
   */
  getMyApplications: async (token: string, params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString();
    const endpoint = `/applications/my${queryString ? `?${queryString}` : ''}`;

    return apiCall(endpoint, {
      token,
    });
  },

  /**
   * Get applicants for a job (Hiring Managers only)
   */
  getJobApplicants: async (token: string, jobId: string, params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString();
    const endpoint = `/applications/job/${jobId}${queryString ? `?${queryString}` : ''}`;

    return apiCall(endpoint, {
      token,
    });
  },

  /**
   * Get ranked applicants for a job (Hiring Managers only)
   */
  getRankedApplicants: async (token: string, jobId: string) => {
    return apiCall(`/applications/job/${jobId}/ranking`, {
      token,
    });
  },

  /**
   * Get ATS dashboard stats for hiring manager
   */
  getHiringManagerDashboard: async (token: string) => {
    return apiCall('/applications/dashboard/hiring-manager', {
      token,
    });
  },

  /**
   * Get ATS details for a single application
   */
  getApplicationDetails: async (token: string, jobId: string, applicationId: string) => {
    return apiCall(`/applications/job/${jobId}/${applicationId}`, {
      token,
    });
  },

  /**
   * Get ATS details for a single application by application ID (fallback)
   */
  getApplicationDetailsById: async (token: string, applicationId: string) => {
    return apiCall(`/applications/details/${applicationId}`, {
      token,
    });
  },

  /**
   * Download ATS evaluation report for a single application
   */
  downloadApplicationReport: async (token: string, applicationId: string) => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/report`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to download ATS report');
    }

    return response.blob();
  },

  /**
   * Update application status (Hiring Managers only)
   */
  updateApplicationStatus: async (token: string, applicationId: string, status: string) => {
    return apiCall(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ status }),
    });
  },
};
