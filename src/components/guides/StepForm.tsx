"use client";

import type { ChangeEvent, FormEvent } from 'react';
import React, { useState, useEffect, use } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Step } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SaveIcon, XIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { set } from 'date-fns';

interface StepFormProps {
  step?: Step;
  onSubmit: (data: Omit<Step, 'id' | 'stepNumber'>) => void;
  onCancel: () => void;
  existingStepCount: number;
}

export default function StepForm({ step, onSubmit, onCancel, existingStepCount }: StepFormProps) {
  const {toast}= useToast();
  const [description, setDescription] = useState('');
  const [hint, setHint] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dataAIHint,setDataAiHint] = useState('');
 
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError]= useState<string | null>(null);

  useEffect(() => {
    if (step) {
      setDescription(step.description);
      setHint(step.hint || '');
      setImageUrl(step.imageUrl || '');
      setDataAiHint(step['data-ai-hint'] || '');
    } else {
      setDescription('');
      setHint('');
      setImageUrl('');
      setDataAiHint('');
    }
    setCaptureError(null);
  }, [step]);

  const handleUserURLchange = (e:ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setImageUrl(newUrl);
    if(newUrl && !newUrl.startsWith('data')){
      setDataAiHint('custom image');
    }else if(!newUrl){
      setDataAiHint('');
    }
  }
  const handleScreenCapture = async ()=>{
    setIsCapturing(true);
    setCaptureError(null);

    if(!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      const errorMsg = "Screen capture is not supported by your browser.";
      setCaptureError(errorMsg);
      toast({ variant: "destructive", title: "Unsupported Feature", description: errorMsg });
      setIsCapturing(false);
      return;
    }
    try{
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" } as MediaTrackConstraints, // cursor is an experimental hint
        audio: false,
      });

      const videoTrack = stream.getVideoTracks()[0];
      if(!videoTrack) {
       stream.getTracks().forEach(track => track.stop());
       throw new Error("No Video track found in the stream. Capture callseled or failed. ");
      }
      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;

      await new Promise<void>((resolve,reject)=>{
        let resolved = false;
        const timeoutId = setTimeout(() => {
          if(!resolved){
            reject(new Error("Screen capture timed out."));
          }
        }, 7000); 
        video.onloadedmetadata =()=>{
          video.play().then(() => {
            // Check dimensions after a short delay to ensure they are populated
            setTimeout(() => {
                if (video.videoWidth === 0 || video.videoHeight === 0) {
                    reject(new Error("Video dimensions not available after play. Selected source might be invalid or protected."));
                } else {
                    resolved = true;
                    clearTimeout(timeoutId);
                    resolve();
                }
            }, 300);
          }).catch(err =>{
            clearTimeout(timeoutId);
            reject(new Error(`Error playing video stream: ${err.message}`));
          });
        }
        video.onerror=(e)=>{
          clearTimeout(timeoutId);
          reject(new Error(`Video element error during screencaprute setup. Event: ${e}`));
        };
      });
      if(video.videoWidth ===0 || video.videoHeight === 0){
        stream.getTracks().forEach(track =>track.stop());
        throw new Error("Video dimensions not available. Selected source might be invalid or protected.");
      }
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if((!ctx)){
        stream.getTracks().forEach(track => track.stop());
        throw new Error("Could not get 2D canvas context for image capture.");
      }
      ctx.drawImage(video,0,0,canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');

      stream.getTracks().forEach(track => track.stop());
      setImageUrl(dataUrl);
      setDataAiHint('Screen Capture');
      toast({ title: "Screen Capture", description: "Image captured successfully."});
    }catch(err:any){
      console.error("Error capturing screen:", err);
      let message = "Failed to capture screen. please try again.";
      if(err.name === "NotAllowedError"){
        message = "Screen capture permission was denied. Please allow access and try again.";
      }else if(err.message){
        if(err.message.includes("Video dimensions not available") || err.message.includes("timed out")){
          message = "Could not capture the selected screen. It might be protected, too slow to load, or you might have cancelled the selection. Please try a different window or screen."
        }else if(err.message.includes("No video track")){
           message = "Capture was cancelled or no video source was selected."
        } else{
          message = `Error capturing screen: ${err.message}`;
        }
      }
      setCaptureError(message);
      toast({ variant: "destructive", title: "Capture Error", description: message });
    }finally{
      setIsCapturing(false);
    }
  };
  

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
