import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Expense, ExpenseSummary, ExpenseCategory } from '@/types/expense';

const STORAGE_KEY = 'expenses';

export const [ExpenseProvider, useExpenses] = createContextHook(() => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const expensesQuery = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      console.log('[ExpenseContext] Loading expenses from AsyncStorage');
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const loadedExpenses = stored ? JSON.parse(stored) : [];
      console.log('[ExpenseContext] Loaded expenses:', loadedExpenses.length);
      return loadedExpenses;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (updatedExpenses: Expense[]) => {
      console.log('[ExpenseContext] Saving expenses to AsyncStorage:', updatedExpenses.length);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedExpenses));
      return updatedExpenses;
    }
  });

  const { mutate } = saveMutation;

  useEffect(() => {
    if (expensesQuery.data) {
      setExpenses(expensesQuery.data);
    }
  }, [expensesQuery.data]);

  const saveExpenses = useCallback((updatedExpenses: Expense[]) => {
    setExpenses(updatedExpenses);
    mutate(updatedExpenses);
  }, [mutate]);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    console.log('[ExpenseContext] Adding new expense:', expense.category, expense.amount);
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newExpense, ...expenses];
    saveExpenses(updated);
    console.log('[ExpenseContext] Expense added with ID:', newExpense.id);
    return newExpense.id;
  }, [expenses, saveExpenses]);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    console.log('[ExpenseContext] Updating expense:', id, 'with updates:', Object.keys(updates));
    const updated = expenses.map(expense =>
      expense.id === id ? { ...expense, ...updates } : expense
    );
    saveExpenses(updated);
  }, [expenses, saveExpenses]);

  const deleteExpense = useCallback((id: string) => {
    console.log('[ExpenseContext] Deleting expense:', id);
    const updated = expenses.filter(expense => expense.id !== id);
    saveExpenses(updated);
  }, [expenses, saveExpenses]);

  const getExpense = useCallback((id: string) => {
    return expenses.find(expense => expense.id === id);
  }, [expenses]);

  const getExpensesByDriver = useCallback((driverId: string) => {
    return expenses.filter(expense => expense.driverId === driverId);
  }, [expenses]);

  const getExpensesByLoad = useCallback((loadId: string) => {
    return expenses.filter(expense => expense.loadId === loadId);
  }, [expenses]);

  const getExpensesByCategory = useCallback((category: ExpenseCategory) => {
    return expenses.filter(expense => expense.category === category);
  }, [expenses]);

  const getExpensesByDateRange = useCallback((startDate: string, endDate: string) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    });
  }, [expenses]);

  const calculateSummary = useCallback((filteredExpenses?: Expense[]): ExpenseSummary => {
    const expensesToCalculate = filteredExpenses || expenses;
    
    console.log('[ExpenseContext] Calculating summary for expenses:', expensesToCalculate.length);
    
    const byCategory: Record<ExpenseCategory, number> = {
      fuel: 0,
      tolls: 0,
      maintenance: 0,
      food: 0,
      lodging: 0,
      parking: 0,
      scales: 0,
      truck_wash: 0,
      supplies: 0,
      other: 0,
    };

    let totalExpenses = 0;
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    expensesToCalculate.forEach(expense => {
      totalExpenses += expense.amount;
      byCategory[expense.category] += expense.amount;
      
      if (expense.status === 'pending') pending += expense.amount;
      else if (expense.status === 'approved') approved += expense.amount;
      else if (expense.status === 'rejected') rejected += expense.amount;
    });

    return {
      totalExpenses,
      byCategory,
      pending,
      approved,
      rejected,
    };
  }, [expenses]);

  const approveExpense = useCallback((id: string, approvedBy: string) => {
    console.log('[ExpenseContext] Approving expense:', id, 'by:', approvedBy);
    updateExpense(id, {
      status: 'approved',
      approvedBy,
      approvedAt: new Date().toISOString(),
    });
  }, [updateExpense]);

  const rejectExpense = useCallback((id: string, approvedBy: string, notes?: string) => {
    console.log('[ExpenseContext] Rejecting expense:', id, 'by:', approvedBy);
    updateExpense(id, {
      status: 'rejected',
      approvedBy,
      approvedAt: new Date().toISOString(),
      notes: notes || undefined,
    });
  }, [updateExpense]);

  const getPendingExpenses = useCallback(() => {
    return expenses.filter(expense => expense.status === 'pending');
  }, [expenses]);

  return useMemo(() => ({
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpense,
    getExpensesByDriver,
    getExpensesByLoad,
    getExpensesByCategory,
    getExpensesByDateRange,
    calculateSummary,
    approveExpense,
    rejectExpense,
    getPendingExpenses,
    isLoading: expensesQuery.isLoading,
  }), [
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpense,
    getExpensesByDriver,
    getExpensesByLoad,
    getExpensesByCategory,
    getExpensesByDateRange,
    calculateSummary,
    approveExpense,
    rejectExpense,
    getPendingExpenses,
    expensesQuery.isLoading,
  ]);
});
