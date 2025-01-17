import { useState, useCallback } from 'react';
import { set, get, del } from 'idb-keyval';

interface UseFileStorageReturn {
  storeFile: (key: string, file: File) => Promise<void>;
  getFile: (key: string) => Promise<File | null>;
  removeFile: (key: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useFileStorage = (): UseFileStorageReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storeFile = useCallback(async (key: string, file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      await set(key, file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error storing file');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFile = useCallback(async (key: string): Promise<File | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const file = await get(key);
      return file || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error retrieving file');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFile = useCallback(async (key: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await del(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error removing file');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    storeFile,
    getFile,
    removeFile,
    isLoading,
    error
  };
};