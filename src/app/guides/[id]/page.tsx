"use client";

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftIcon, ArrowRightIcon, FilePenIcon, HomeIcon, ListChecksIcon } from 'lucide-react';
import type { Guide, Step } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";

export default function ViewGuidePage() {
  const router = useRouter();
  const params = useParams();
  const guideId = params.id as string;
  
  const { getGuideById, isLoading: appContextIsLoading, categories } = useAppContext();
  const [guide, setGuide] = useState<Guide | undefined>(undefined);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!appContextIsLoading && guideId) {
      const fetchedGuide = getGuideById(guideId);
      if (fetchedGuide) {
        // Ensure steps are sorted by stepNumber
        const sortedSteps = [...fetchedGuide.steps].sort((a, b) => a.stepNumber - b.stepNumber);
        setGuide({ ...fetchedGuide, steps: sortedSteps });
      } else {
        setGuide(undefined);
      }
      setIsLoading(false);
    }
  }, [guideId, getGuideById, appContextIsLoading]);


  if (isLoading || appContextIsLoading) return <div className="container mx-auto py-8 text-center">Loading guide...</div>;
  if (!guide) return <div className="container mx-auto py-8 text-center">Guide not found. <Link href="/" className="text-primary underline">Go to Home</Link></div>;

  const currentStep: Step | undefined = guide.steps[currentStepIndex];
  const totalSteps = guide.steps.length;
  const progressPercentage = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Uncategorized';
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card className="shadow-xl">
        <CardHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl mb-1">{guide.title}</CardTitle>
              <CardDescription className="text-base">
                Category: {getCategoryName(guide.categoryId)} | Steps: {totalSteps}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/guides/${guide.id}/edit`}>
                <FilePenIcon className="mr-2 h-4 w-4" /> Edit Guide
              </Link>
            </Button>
          </div>
          {totalSteps > 0 && (
             <div className="pt-4">
                <Progress value={progressPercentage} className="w-full h-2" />
                <p className="text-sm text-muted-foreground mt-1 text-right">Step {currentStepIndex + 1} of {totalSteps}</p>
            </div>
          )}
        </CardHeader>

        {totalSteps === 0 ? (
          <CardContent className="py-10 text-center">
            <ListChecksIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">This guide has no steps yet.</p>
            <Button asChild className="mt-4">
              <Link href={`/guides/${guide.id}/edit`}>Add Steps</Link>
            </Button>
          </CardContent>
        ) : currentStep ? (
          <CardContent className="py-6">
            <div className="mb-6 text-center">
              <span className="text-2xl font-semibold bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                {currentStep.stepNumber}
              </span>
              <h2 className="text-2xl font-semibold">{currentStep.description}</h2>
              {currentStep.hint && (
                <p className="text-md text-muted-foreground mt-2"><em>Hint: {currentStep.hint}</em></p>
              )}
            </div>

            {currentStep.imageUrl && (
              <div className="my-6 aspect-video w-full max-w-lg mx-auto bg-muted rounded-lg overflow-hidden shadow-md">
                <Image
                  src={currentStep.imageUrl}
                  alt={`Step ${currentStep.stepNumber}: ${currentStep.description}`}
                  width={600}
                  height={400}
                  className="object-contain w-full h-full"
                  data-ai-hint="guide step image"
                />
              </div>
            )}
            
            {/* Placeholder for audio player if currentStep.audioUrl exists */}
            {/* {currentStep.audioUrl && (
              <div className="my-6 text-center">
                <p className="text-sm text-muted-foreground">Audio: {currentStep.audioUrl}</p>
                <Button variant="outline" size="sm">Play Audio</Button>
              </div>
            )} */}

          </CardContent>
        ) : (
           <CardContent className="py-10 text-center">
            <p className="text-lg text-muted-foreground">Error: Could not load step.</p>
          </CardContent>
        )}
        
        {totalSteps > 0 && (
          <CardFooter className="flex justify-between items-center border-t pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" /> Previous
            </Button>
            {currentStepIndex === totalSteps - 1 ? (
              <Button onClick={() => router.push('/')} variant="default">
                <HomeIcon className="mr-2 h-4 w-4" /> Finish & Go Home
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentStepIndex(prev => Math.min(totalSteps - 1, prev + 1))}
                disabled={currentStepIndex === totalSteps - 1}
              >
                Next <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
