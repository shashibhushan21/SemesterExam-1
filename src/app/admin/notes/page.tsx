import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function ManageNotesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText /> Manage Notes
        </CardTitle>
        <CardDescription>
         This page is under construction. You will soon be able to view, edit, and delete all uploaded notes here.
        </CardDescription>
      </CardHeader>
       <CardContent>
        <div className="text-center py-16 text-muted-foreground">
            <p>Note management interface coming soon!</p>
        </div>
      </CardContent>
    </Card>
  );
}
