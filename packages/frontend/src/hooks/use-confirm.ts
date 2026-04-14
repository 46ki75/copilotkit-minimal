import { useCallback, useRef, useState } from "react";

type ConfirmState = {
  message: string;
} | null;

export const useConfirm = () => {
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);

  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setConfirmState({ message });
    });
  }, []);

  const handleResponse = useCallback((approved: boolean) => {
    resolveRef.current?.(approved);
    resolveRef.current = null;
    setConfirmState(null);
  }, []); // stable — no deps

  return { showConfirm, confirmState, handleResponse };
};
