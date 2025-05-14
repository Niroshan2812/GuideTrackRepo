
export interface Category {
  id: string;
  name: string;
}

export interface Step {
  id: string;
  stepNumber: number;
  description: string;
  hint?: string;
  imageUrl?: string; // URL to placeholder or uploaded image
  audioUrl?: string; // Placeholder for audio file name/URL
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  steps: Step[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
