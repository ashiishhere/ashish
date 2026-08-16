import toast from 'react-hot-toast';

// Thin wrapper so components import from one place and styling stays consistent.
export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
  };
}
