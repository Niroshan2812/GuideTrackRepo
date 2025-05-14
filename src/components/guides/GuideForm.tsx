"use client";

import type { FormEvent} from 'react';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Guide, Category } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SaveIcon } from 'lucide-react';

interface GuideFormProps {
  guide?: Guide;
  categories: Category[];
  onSubmit: (data: Omit<Guide, 'id' | 'steps' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  submitButtonText?: string;
}

export default function GuideForm({ guide, categories, onSubmit, onCancel, submitButtonText = "Save Guide" }: GuideFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (guide) {
      setTitle(guide.title);
      setDescription(guide.description);
      setCategoryId(guide.categoryId);
    } else {
      // Set default category if available and no guide is being edited
      if (categories.length > 0) {
        setCategoryId(categories[0].id);
      }
    }
  }, [guide, categories]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !categoryId) {
      // Basic validation, ideally use react-hook-form and zod
      alert("Title and Category are required.");
      return;
    }
    onSubmit({ title, description, categoryId });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>{guide ? 'Edit Guide' : 'Create New Guide'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter guide title"
              required
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter guide description"
              rows={4}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            {categories.length > 0 ? (
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger id="category" className="text-base">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-base">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">No categories available. Please <a href="/categories" className="underline text-primary">add a category</a> first.</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={categories.length === 0 && !guide?.categoryId}>
              <SaveIcon className="mr-2 h-4 w-4" />
              {submitButtonText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
