import { useToast } from './useToast';

export function useApiOperation() {
  const { showToast } = useToast();

  const handleOperation = async (
    operation: () => Promise<boolean>,
    successMessage: string,
    onSuccess?: () => void
  ) => {
    try {
      const success = await operation();
      if (success) {
        showToast(successMessage, 'success');
        onSuccess?.();
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : '작업 중 오류가 발생했습니다.', 'error');
    }
  };

  return {
    handleOperation,
  };
} 