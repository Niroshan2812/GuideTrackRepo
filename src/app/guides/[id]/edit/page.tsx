"use client";

import { useParams, useRouter } from 'next/navigation';
import type { ReactNode} from 'react';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import GuideForm from '@/components/guides/GuideForm';
import StepForm from '@/components/guides/StepForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon, Trash2Icon, ArrowUpIcon, ArrowDownIcon, FilePenIcon, EyeIcon, AlertTriangleIcon } from 'lucide-react';
import type { Guide, Step } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
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

export default function EditGuidePage() {
  const router = useRouter();
  const params = useParams();
  const guideId = params.id as string;
  const { guides, categories, getGuideById, updateGuide, deleteGuide, addStep, updateStep, deleteStep, reorderSteps, isLoading } = useAppContext();
  const { toast } = useToast();

  const [guide, setGuide] = useState<Guide | undefined>(undefined);
  const [isEditingStep, setIsEditingStep] = useState<Step | null>(null);
  const [showAddStepForm, setShowAddStepForm] = useState(false);

  useEffect(() => {
    if (guideId) {
      const currentGuide = getGuideById(guideId);
      setGuide(currentGuide);
    }
  }, [guideId, getGuideById, guides]); // depend on guides to refresh when context updates

  if (isLoading) return <div className="container mx-auto py-8 text-center">Loading guide details...</div>;
  if (!guide) return <div className="container mx-auto py-8 text-center">Guide not found. <Link href="/" className="text-primary underline">Go to Home</Link></div>;

  const handleGuideSubmit = (data: Omit<Guide, 'id' | 'steps' | 'createdAt' | 'updatedAt'>) => {
    updateGuide(guide.id, data);
    toast({ title: "Guide Updated", description: `"${data.title}" has been updated.` });
  };

  const handleAddStep = (stepData: Omit<Step, 'id' | 'stepNumber'>) => {
    addStep(guide.id, stepData);
    setShowAddStepForm(false);
    toast({ title: "Step Added", description: "New step added to the guide." });
  };

  const handleUpdateStep = (stepData: Omit<Step, 'id' | 'stepNumber'>) => {
    if (isEditingStep) {
      updateStep(guide.id, isEditingStep.id, stepData);
      setIsEditingStep(null);
      toast({ title: "Step Updated", description: `Step ${isEditingStep.stepNumber} has been updated.` });
    }
  };
  
  const handleDeleteGuide = () => {
    deleteGuide(guide.id);
    toast({ title: "Guide Deleted", description: `"${guide.title}" has been deleted.`, variant: "destructive" });
    router.push('/');
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Edit Guide</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/guides/${guide.id}`}>
              <EyeIcon className="mr-2 h-4 w-4" /> View Guide
            </Link>
          </Button>
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2Icon className="mr-2 h-4 w-4" /> Delete Guide
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the guide "{guide.title}" and all its steps.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteGuide}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <GuideForm guide={guide} categories={categories} onSubmit={handleGuideSubmit} submitButtonText="Save Changes" />

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Steps</CardTitle>
            <Dialog open={showAddStepForm} onOpenChange={setShowAddStepForm}>
              <DialogTrigger asChild>
                <Button onClick={() => { setIsEditingStep(null); setShowAddStepForm(true); }}>
                  <PlusIcon className="mr-2 h-4 w-4" /> Add Step
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Add New Step</DialogTitle>
                </DialogHeader>
                <StepForm 
                  onSubmit={handleAddStep} 
                  onCancel={() => setShowAddStepForm(false)}
                  existingStepCount={guide.steps.length}
                />
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>Manage the steps for this guide. Current steps: {guide.steps.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {guide.steps.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No steps yet. Click "Add Step" to get started.</p>
          ) : (
            <ul className="space-y-4">
              {guide.steps.sort((a, b) => a.stepNumber - b.stepNumber).map((step, index) => (
                <li key={step.id} className="border p-4 rounded-md shadow-sm bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex-grow mb-4 sm:mb-0">
                    <div className="flex items-center mb-2">
                      <span className="text-lg font-semibold mr-3 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">{step.stepNumber}</span>
                      <h3 className="text-lg font-semibold truncate flex-1">{step.description}</h3>
                    </div>
                    {step.hint && <p className="text-sm text-muted-foreground ml-11 mb-2"><em>Hint: {step.hint}</em></p>}
                    {step.imageUrl && (
                       <div className="ml-11 mt-2 max-w-xs">
                        <Image src={step.imageUrl} alt={`Step ${step.stepNumber}`} width={150} height={100} className="rounded-md object-cover aspect-video" data-ai-hint="instruction illustration" />
                       </div>
                    )}
                  </div>
                  <div className="flex space-x-2 self-end sm:self-center">
                    <Button variant="ghost" size="icon" onClick={() => reorderSteps(guide.id, step.id, 'up')} disabled={index === 0} aria-label="Move step up">
                      <ArrowUpIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => reorderSteps(guide.id, step.id, 'down')} disabled={index === guide.steps.length - 1} aria-label="Move step down">
                      <ArrowDownIcon className="h-5 w-5" />
                    </Button>
                     <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setIsEditingStep(step)} aria-label="Edit step">
                          <FilePenIcon className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      {isEditingStep && isEditingStep.id === step.id && ( // ensure dialog content matches current step
                        <DialogContent className="sm:max-w-[625px]">
                           <DialogHeader>
                            <DialogTitle>Edit Step {isEditingStep.stepNumber}</DialogTitle>
                          </DialogHeader>
                          <StepForm
                            step={isEditingStep}
                            onSubmit={handleUpdateStep}
                            onCancel={() => setIsEditingStep(null)}
                            existingStepCount={guide.steps.length}
                          />
                        </DialogContent>
                      )}
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" aria-label="Delete step">
                          <Trash2Icon className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Step {step.stepNumber}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this step? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => {
                            deleteStep(guide.id, step.id);
                            toast({ title: "Step Deleted", description: `Step ${step.stepNumber} has been deleted.`, variant: "destructive" });
                          }}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
