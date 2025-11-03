import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Client, Category } from '@/types';
import { scheduleNotification } from '@/utils/notifications';

const STORAGE_KEYS = {
  CLIENTS: '@subscription_monitor_clients',
  CATEGORIES: '@subscription_monitor_categories',
} as const;

export const [AppProvider, useApp] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const clientsQuery = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CLIENTS);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const saveClientsMutation = useMutation({
    mutationFn: async (updatedClients: Client[]) => {
      await AsyncStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updatedClients));
      return updatedClients;
    },
    onSuccess: (data) => {
      setClients(data);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const { mutate: saveClients } = saveClientsMutation;

  const saveCategoriesMutation = useMutation({
    mutationFn: async (updatedCategories: Category[]) => {
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updatedCategories));
      return updatedCategories;
    },
    onSuccess: (data) => {
      setCategories(data);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const { mutate: saveCategories } = saveCategoriesMutation;

  useEffect(() => {
    if (clientsQuery.data) {
      setClients(clientsQuery.data);
    }
  }, [clientsQuery.data]);

  useEffect(() => {
    if (categoriesQuery.data) {
      setCategories(categoriesQuery.data);
    }
  }, [categoriesQuery.data]);

  const addClient = useCallback(async (client: Client) => {
    console.log('Adding client:', client);
    await scheduleNotification(client);
    const updated = [...clients, client];
    saveClients(updated);
  }, [clients, saveClients]);

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    console.log('Updating client:', id, updates);
    const updated = clients.map(c => c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c);
    saveClients(updated);
  }, [clients, saveClients]);

  const deleteClient = useCallback((id: string) => {
    console.log('Deleting client:', id);
    const updated = clients.filter(c => c.id !== id);
    saveClients(updated);
  }, [clients, saveClients]);

  const addCategory = useCallback((category: Category) => {
    console.log('Adding category:', category);
    const updated = [...categories, category];
    saveCategories(updated);
  }, [categories, saveCategories]);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    console.log('Updating category:', id, updates);
    const updated = categories.map(c => c.id === id ? { ...c, ...updates } : c);
    saveCategories(updated);
  }, [categories, saveCategories]);

  const deleteCategory = useCallback((id: string) => {
    console.log('Deleting category:', id);
    const updated = categories.filter(c => c.id !== id);
    saveCategories(updated);
  }, [categories, saveCategories]);

  const getCategoryById = useCallback((id: string) => {
    return categories.find(c => c.id === id);
  }, [categories]);

  const getClientById = useCallback((id: string) => {
    return clients.find(c => c.id === id);
  }, [clients]);

  return useMemo(() => ({
    clients,
    categories,
    addClient,
    updateClient,
    deleteClient,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getClientById,
    isLoading: clientsQuery.isLoading || categoriesQuery.isLoading,
    isSaving: saveClientsMutation.isPending || saveCategoriesMutation.isPending,
  }), [clients, categories, addClient, updateClient, deleteClient, addCategory, updateCategory, deleteCategory, getCategoryById, getClientById, clientsQuery.isLoading, categoriesQuery.isLoading, saveClientsMutation.isPending, saveCategoriesMutation.isPending]);
});
