"use client";

import type { FormEvent } from 'react';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Category } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SaveIcon, XIcon } from 'lucide-react';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: Omit<Category, 'id'>) => void;
  onCancel: () => void;
}

export default function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName('');
    }
  }, [category]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert("Category name is required."); // Basic validation
      return;
    }
    onSubmit({ name });
    setName(''); // Reset form after submit for new category
  };

  return (
    <Card className="w-full max-w-md shadow">
      <CardHeader>
        <CardTitle>{category ? 'Edit Category' : 'Add New Category'}</CardTitle>
        {!category && <CardDescription>Create a new category for your guides.</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Software Tutorials"
              required
            />
          </div>
          <CardFooter className="flex justify-end space-x-2 p-0 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
               <XIcon className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit">
              <SaveIcon className="mr-2 h-4 w-4" /> {category ? 'Save Changes' : 'Add Category'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
