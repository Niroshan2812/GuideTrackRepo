"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Card className="max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="mr-3 h-6 w-6 text-primary" />
            Application Settings
          </CardTitle>
          <CardDescription>
            This is a placeholder for application settings. Future options like theme preferences, data export/import, or account management could be here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Dark Mode</h3>
            <p className="text-sm text-muted-foreground">Theme switching is typically handled by the OS preference or a dedicated toggle (not implemented here).</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Data Management</h3>
            <p className="text-sm text-muted-foreground">Options to backup or clear local data could be added.</p>
          </div>
           <div className="text-center pt-4">
             <p className="text-xs text-muted-foreground">GuideFlow v1.0.0</p>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
