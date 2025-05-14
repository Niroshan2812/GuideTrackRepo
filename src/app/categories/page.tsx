"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import CategoryForm from '@/components/categories/CategoryForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon, Trash2Icon, FilePenIcon, TagsIcon } from 'lucide-react';
import type { Category } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, isLoading } = useAppContext();
  const { toast } = useToast();

  const [isEditingCategory, setIsEditingCategory] = useState<Category | null>(null);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);

  const handleAddCategory = (data: Omit<Category, 'id'>) => {
    addCategory(data);
    setShowAddCategoryDialog(false);
    toast({ title: "Category Added", description: `Category "${data.name}" created.` });
  };

  const handleUpdateCategory = (data: Omit<Category, 'id'>) => {
    if (isEditingCategory) {
      updateCategory(isEditingCategory.id, data);
      setIsEditingCategory(null);
      toast({ title: "Category Updated", description: `Category "${data.name}" updated.` });
    }
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    try {
      deleteCategory(categoryId); // This might show an alert if category is in use
      toast({ title: "Category Deleted", description: `Category "${categoryName}" deleted.`, variant: "destructive" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8 text-center">Loading categories...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Manage Categories</h1>
        <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <CategoryForm 
              onSubmit={handleAddCategory}
              onCancel={() => setShowAddCategoryDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <Card className="text-center py-12 shadow">
          <CardHeader>
            <TagsIcon className="mx-auto h-16 w-16 text-muted-foreground" />
            <CardTitle className="mt-4 text-xl font-semibold">No Categories Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mt-2 text-muted-foreground">Create categories to organize your guides.</p>
            <Button onClick={() => setShowAddCategoryDialog(true)} className="mt-6">
              Add Your First Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
            <CardDescription>View, edit, or delete your guide categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id} className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors">
                  <span className="text-md font-medium">{category.name}</span>
                  <div className="flex space-x-2">
                    <Dialog open={isEditingCategory?.id === category.id} onOpenChange={(isOpen) => !isOpen && setIsEditingCategory(null)}>
                       <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setIsEditingCategory(category)} aria-label="Edit category">
                          <FilePenIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      {isEditingCategory?.id === category.id && (
                         <DialogContent className="sm:max-w-md">
                          <CategoryForm
                            category={isEditingCategory}
                            onSubmit={handleUpdateCategory}
                            onCancel={() => setIsEditingCategory(null)}
                          />
                        </DialogContent>
                      )}
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" aria-label="Delete category">
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category "{category.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Deleting this category will not delete guides using it, but they will become uncategorized (or you might implement a check to prevent deletion if in use).
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCategory(category.id, category.name)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
