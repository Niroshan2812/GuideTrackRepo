"use client";

import type { FormEvent } from 'react';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Step } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SaveIcon, XIcon } from 'lucide-react';

interface StepFormProps {
  step?: Step;
  onSubmit: (data: Omit<Step, 'id' | 'stepNumber'>) => void;
  onCancel: () => void;
  existingStepCount: number;
}

export default function StepForm({ step, onSubmit, onCancel, existingStepCount }: StepFormProps) {
  const [description, setDescription] = useState('');
  const [hint, setHint] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  // audioUrl can be added similarly if needed

  useEffect(() => {
    if (step) {
      setDescription(step.description);
      setHint(step.hint || '');
      setImageUrl(step.imageUrl || '');
    } else {
      setDescription('');
      setHint('');
      setImageUrl('');
    }
  }, [step]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!description) {
      alert("Step description is required."); // Basic validation
      return;
    }
    // For placeholder images, if URL is empty, assign a default one
    const finalImageUrl = imageUrl || `https://placehold.co/600x400.png?text=Step+${step ? step.stepNumber : existingStepCount + 1}`;
    onSubmit({ description, hint, imageUrl: finalImageUrl });
  };

  return (
    <Card className="my-4 shadow-md">
      <CardHeader>
        <CardTitle>{step ? `Edit Step ${step.stepNumber}` : 'Add New Step'}</CardTitle>
        {!step && <CardDescription>This will be step number {existingStepCount + 1}.</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="step-description">Task Description</Label>
            <Textarea
              id="step-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task for this step"
              required
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="step-hint">Hint (Optional)</Label>
            <Input
              id="step-hint"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="Add an optional hint"
            />
          </div>
          <div>
            <Label htmlFor="step-image-url">Image URL (Optional)</Label>
            <Input
              id="step-image-url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://placehold.co/600x400.png or your image URL"
            />
            {imageUrl && (
                <div className="mt-2">
                    { /* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Preview" className="rounded-md max-h-40 object-contain border" />
                </div>
            )}
          </div>
          {/* Placeholder for audio upload/URL */}
          {/* <div>
            <Label htmlFor="step-audio-url">Audio URL (Optional)</Label>
            <Input id="step-audio-url" placeholder="Enter audio file URL" />
          </div> */}
          <CardFooter className="flex justify-end space-x-2 p-0 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <XIcon className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit">
              <SaveIcon className="mr-2 h-4 w-4" /> {step ? 'Save Changes' : 'Add Step'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
