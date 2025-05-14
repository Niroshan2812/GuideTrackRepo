"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { Guide, Step, Category } from '@/lib/types';
import { loadState, saveState } from '@/lib/localStorage';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed: npm install uuid @types/uuid

interface AppContextType {
  guides: Guide[];
  categories: Category[];
  addGuide: (guideData: Omit<Guide, 'id' | 'steps' | 'createdAt' | 'updatedAt'>) => Guide;
  updateGuide: (guideId: string, updates: Partial<Omit<Guide, 'id' | 'steps'>>) => void;
  deleteGuide: (guideId: string) => void;
  getGuideById: (guideId: string) => Guide | undefined;
  addStep: (guideId: string, stepData: Omit<Step, 'id' | 'stepNumber'>) => Step | undefined;
  updateStep: (guideId: string, stepId: string, updates: Partial<Omit<Step, 'id' | 'stepNumber'>>) => void;
  deleteStep: (guideId: string, stepId: string) => void;
  reorderSteps: (guideId: string, stepId: string, direction: 'up' | 'down') => void;
  addCategory: (categoryData: Omit<Category, 'id'>) => Category;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  getCategoryById: (categoryId: string) => Category | undefined;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialCategories: Category[] = [
  { id: 'cat1', name: 'Cooking' },
  { id: 'cat2', name: 'DIY Projects' },
  { id: 'cat3', name: 'Tech Setup' },
];

const initialGuides: Guide[] = [
  {
    id: 'guide1',
    title: 'Bake a Cake',
    description: 'A simple guide to baking a delicious vanilla cake.',
    categoryId: 'cat1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      { id: 'step1-1', stepNumber: 1, description: 'Preheat oven to 350°F (175°C). Grease and flour a 9x9 inch pan.', imageUrl: 'https://placehold.co/600x400.png?text=Oven+Preheat', 'data-ai-hint': 'oven kitchen' },
      { id: 'step1-2', stepNumber: 2, description: 'In a medium bowl, cream together the sugar and butter.', imageUrl: 'https://placehold.co/600x400.png?text=Mixing+Ingredients', 'data-ai-hint': 'mixing bowl' },
      { id: 'step1-3', stepNumber: 3, description: 'Beat in the eggs, one at a time, then stir in the vanilla.', hint: 'Ensure eggs are fully incorporated.', imageUrl: 'https://placehold.co/600x400.png?text=Adding+Eggs', 'data-ai-hint': 'eggs cooking' },
    ],
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedGuides = loadState<Guide[]>('guides');
    const storedCategories = loadState<Category[]>('categories');
    
    setCategories(storedCategories || initialCategories);
    setGuides(storedGuides || initialGuides);
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveState('guides', guides);
    }
  }, [guides, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveState('categories', categories);
    }
  }, [categories, isLoading]);

  const addGuide = useCallback((guideData: Omit<Guide, 'id' | 'steps' | 'createdAt' | 'updatedAt'>): Guide => {
    const newGuide: Guide = {
      ...guideData,
      id: uuidv4(),
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGuides((prev) => [newGuide, ...prev]);
    return newGuide;
  }, []);

  const updateGuide = useCallback((guideId: string, updates: Partial<Omit<Guide, 'id' | 'steps'>>) => {
    setGuides((prev) =>
      prev.map((g) =>
        g.id === guideId ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
      )
    );
  }, []);

  const deleteGuide = useCallback((guideId: string) => {
    setGuides((prev) => prev.filter((g) => g.id !== guideId));
  }, []);

  const getGuideById = useCallback((guideId: string) => {
    return guides.find((g) => g.id === guideId);
  }, [guides]);

  const addStep = useCallback((guideId: string, stepData: Omit<Step, 'id' | 'stepNumber'>): Step | undefined => {
    const newStep: Step = {
      ...stepData,
      id: uuidv4(),
      stepNumber: 0, // Will be set correctly below
    };
    let createdStep: Step | undefined;
    setGuides((prevGuides) =>
      prevGuides.map((guide) => {
        if (guide.id === guideId) {
          const newStepNumber = guide.steps.length > 0 ? Math.max(...guide.steps.map(s => s.stepNumber)) + 1 : 1;
          createdStep = { ...newStep, stepNumber: newStepNumber };
          // Ensure 'data-ai-hint' is carried over if present in stepData
          if (stepData['data-ai-hint']) {
            createdStep['data-ai-hint'] = stepData['data-ai-hint'];
          }
          return {
            ...guide,
            steps: [...guide.steps, createdStep],
            updatedAt: new Date().toISOString(),
          };
        }
        return guide;
      })
    );
    return createdStep;
  }, []);

  const updateStep = useCallback((guideId: string, stepId: string, updates: Partial<Omit<Step, 'id' | 'stepNumber'>>) => {
    setGuides((prevGuides) =>
      prevGuides.map((guide) => {
        if (guide.id === guideId) {
          return {
            ...guide,
            steps: guide.steps.map((step) =>
              step.id === stepId ? { ...step, ...updates } : step
            ),
            updatedAt: new Date().toISOString(),
          };
        }
        return guide;
      })
    );
  }, []);

  const deleteStep = useCallback((guideId: string, stepId: string) => {
    setGuides((prevGuides) =>
      prevGuides.map((guide) => {
        if (guide.id === guideId) {
          const updatedSteps = guide.steps.filter((step) => step.id !== stepId);
          // Re-number steps
          const renumberedSteps = updatedSteps.map((step, index) => ({
            ...step,
            stepNumber: index + 1,
          }));
          return { ...guide, steps: renumberedSteps, updatedAt: new Date().toISOString() };
        }
        return guide;
      })
    );
  }, []);
  
  const reorderSteps = useCallback((guideId: string, stepId: string, direction: 'up' | 'down') => {
    setGuides(prevGuides => 
      prevGuides.map(guide => {
        if (guide.id === guideId) {
          const steps = [...guide.steps];
          const index = steps.findIndex(s => s.id === stepId);
          if (index === -1) return guide;

          if (direction === 'up' && index > 0) {
            [steps[index - 1], steps[index]] = [steps[index], steps[index - 1]];
          } else if (direction === 'down' && index < steps.length - 1) {
            [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]];
          } else {
            return guide; // No change possible
          }
          
          // Re-assign step numbers
          const renumberedSteps = steps.map((step, idx) => ({ ...step, stepNumber: idx + 1 }));
          return { ...guide, steps: renumberedSteps, updatedAt: new Date().toISOString() };
        }
        return guide;
      })
    );
  }, []);

  const addCategory = useCallback((categoryData: Omit<Category, 'id'>): Category => {
    const newCategory: Category = { ...categoryData, id: uuidv4() };
    setCategories((prev) => [newCategory, ...prev]);
    return newCategory;
  }, []);

  const updateCategory = useCallback((categoryId: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    // Optional: Check if category is used by any guide and prevent deletion or reassign guides
    const isUsed = guides.some(guide => guide.categoryId === categoryId);
    if (isUsed) {
      alert("Cannot delete category: It is currently assigned to one or more guides."); // Simple alert, ideally use a toast
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  }, [guides]);

  const getCategoryById = useCallback((categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  }, [categories]);
  

  return (
    <AppContext.Provider
      value={{
        guides,
        categories,
        addGuide,
        updateGuide,
        deleteGuide,
        getGuideById,
        addStep,
        updateStep,
        deleteStep,
        reorderSteps,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
