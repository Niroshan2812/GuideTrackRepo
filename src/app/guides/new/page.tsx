"use client";

import { useRouter } from 'next/navigation';
import GuideForm from '@/components/guides/GuideForm';
import { useAppContext } from '@/hooks/useAppContext';
import type { Guide } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function NewGuidePage() {
  const router = useRouter();
  const { categories, addGuide } = useAppContext();
  const { toast } = useToast();

  const handleSubmit = (data: Omit<Guide, 'id' | 'steps' | 'createdAt' | 'updatedAt'>) => {
    const newGuide = addGuide(data);
    toast({
      title: "Guide Created",
      description: `Successfully created "${newGuide.title}".`,
    });
    router.push(`/guides/${newGuide.id}/edit`); // Navigate to edit page to add steps
  };

  return (
    <div className="container mx-auto py-8">
      <GuideForm categories={categories} onSubmit={handleSubmit} onCancel={() => router.push('/')} />
    </div>
  );
}
