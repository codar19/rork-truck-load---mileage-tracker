import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '@/types/auth';

const STORAGE_KEY = 'auth_user';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);

  const userQuery = useQuery({
    queryKey: ['auth_user'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (userData: User | null) => {
      if (userData) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
      return userData;
    }
  });

  const { mutate } = saveMutation;

  useEffect(() => {
    if (userQuery.data !== undefined) {
      setUser(userQuery.data);
    }
  }, [userQuery.data]);

  const login = useCallback((userData: User) => {
    setUser(userData);
    mutate(userData);
  }, [mutate]);

  const logout = useCallback(() => {
    setUser(null);
    mutate(null);
  }, [mutate]);

  return useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading: userQuery.isLoading,
  }), [user, login, logout, userQuery.isLoading]);
});
