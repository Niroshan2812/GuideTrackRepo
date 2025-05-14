"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/hooks/useAppContext';
import { PlusIcon, FileTextIcon } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { guides, categories, isLoading } = useAppContext();

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Uncategorized';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Guides</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Guides</h1>
        <Link href="/guides/new" passHref className="fab hidden md:flex">
            <PlusIcon className="h-7 w-7" />
            <span className="sr-only">Add New Guide</span>
        </Link>
      </div>

      {guides.length === 0 ? (
        <div className="text-center py-12">
          <FileTextIcon className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No Guides Yet</h2>
          <p className="mt-2 text-muted-foreground">Start by creating your first guide.</p>
          <Button asChild className="mt-6">
            <Link href="/guides/new">Create Guide</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Card key={guide.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="truncate">{guide.title}</CardTitle>
                <CardDescription>{getCategoryName(guide.categoryId)}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <Link href={`/guides/${guide.id}`} className="block">
                  <div className="aspect-video w-full bg-muted rounded-md overflow-hidden mb-4">
                    <Image
                      src={guide.steps[0]?.imageUrl || 'https://placehold.co/600x400.png?text=Guide+Preview'}
                      alt={guide.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-full"
                      data-ai-hint={guide.steps[0]?.['data-ai-hint'] || 'abstract pattern'}
                    />
                  </div>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-3">{guide.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/guides/${guide.id}`}>View Guide</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {/* FAB for mobile */}
      <Link href="/guides/new" passHref className="fab md:hidden">
          <PlusIcon className="h-7 w-7" />
          <span className="sr-only">Add New Guide</span>
      </Link>
    </div>
  );
}
