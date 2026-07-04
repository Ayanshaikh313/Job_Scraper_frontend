import { toast } from 'react-toastify';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  error: (message: string) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  info: (message: string) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  warning: (message: string) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Predefined messages
  loginSuccess: () => showToast.success('Login successful! Redirecting...'),
  registerSuccess: () => showToast.success('Registration successful! Redirecting...'),
  profileUpdated: () => showToast.success('Profile updated successfully!'),
  jobCreated: () => showToast.success('Job created successfully!'),
  jobUpdated: () => showToast.success('Job updated successfully!'),
  jobDeleted: () => showToast.success('Job deleted successfully!'),
  applicationSubmitted: () => showToast.success('Application submitted successfully!'),
  statusUpdated: () => showToast.success('Application status updated!'),
  
  apiError: (message?: string) => showToast.error(message || 'An error occurred. Please try again.'),
  validationError: (message?: string) => showToast.error(message || 'Please check your input and try again.'),
  networkError: () => showToast.error('Network error. Please check your connection.'),
  unauthorized: () => showToast.error('You are not authorized to perform this action.'),
};
