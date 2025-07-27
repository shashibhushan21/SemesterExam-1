
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const editNoteSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  university: z.string().min(3, 'University is required'),
  subject: z.string().min(3, 'Subject is required'),
  semester: z.string().min(1, 'Semester is required'),
  branch: z.string().min(1, 'Branch is required'),
});

type EditNoteFormValues = z.infer<typeof editNoteSchema>;

interface SettingsData {
  universities: { _id: string; name: string }[];
  subjects: { _id: string; name: string }[];
  branches: { _id: string; name: string }[];
}

interface Note {
    _id: string;
    title: string;
    university: string;
    subject: string;
    semester: string;
    branch: string;
}

interface EditNoteDialogProps {
    children: React.ReactNode;
    note: Note;
    onNoteUpdate: () => void;
}

export function EditNoteDialog({ children, note, onNoteUpdate }: EditNoteDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({ universities: [], subjects: [], branches: [] });
  const [loadingSettings, setLoadingSettings] = useState(true);

  const { register, handleSubmit, control, formState: { errors } } = useForm<EditNoteFormValues>({
    resolver: zodResolver(editNoteSchema),
    defaultValues: {
      title: note.title,
      university: note.university,
      subject: note.subject,
      semester: note.semester,
      branch: note.branch,
    },
  });
  
   useEffect(() => {
    async function fetchSettingsData() {
        if (open) {
            setLoadingSettings(true);
            try {
                const [universitiesRes, subjectsRes, branchesRes] = await Promise.all([
                    fetch('/api/admin/settings/universities'),
                    fetch('/api/admin/settings/subjects'),
                    fetch('/api/admin/settings/branches'),
                ]);

                if (!universitiesRes.ok || !subjectsRes.ok || !branchesRes.ok) {
                    throw new Error('Failed to fetch settings data');
                }

                const universitiesData = await universitiesRes.json();
                const subjectsData = await subjectsRes.json();
                const branchesData = await branchesRes.json();

                setSettings({
                    universities: universitiesData.universities,
                    subjects: subjectsData.subjects,
                    branches: branchesData.branches,
                });

            } catch (error) {
                 toast({ title: 'Error', description: 'Could not load settings for editing.', variant: 'destructive' });
            } finally {
                setLoadingSettings(false);
            }
        }
    }
    fetchSettingsData();
  }, [open, toast]);

  const onSubmit = async (data: EditNoteFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/notes/${note._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Something went wrong');
      
      toast({ title: 'Success!', description: 'Note updated successfully.' });
      onNoteUpdate();
      setOpen(false);

    } catch (error: any) {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>
            Make changes to the note details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Note Title</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label>University</Label>
                  <Controller
                    control={control}
                    name="university"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting || loadingSettings}>
                        <SelectTrigger><SelectValue placeholder="Select University" /></SelectTrigger>
                        <SelectContent>
                          {settings.universities.map(u => <SelectItem key={u._id} value={u.name}>{u.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.university && <p className="text-sm text-destructive">{errors.university.message}</p>}
                </div>
                 <div className="space-y-2">
                  <Label>Subject</Label>
                  <Controller
                    control={control}
                    name="subject"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting || loadingSettings}>
                        <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                        <SelectContent>
                           {settings.subjects.map(s => <SelectItem key={s._id} value={s.name}>{s.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
                </div>
                 <div className="space-y-2">
                  <Label>Branch</Label>
                  <Controller
                    control={control}
                    name="branch"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting || loadingSettings}>
                        <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                        <SelectContent>
                           {settings.branches.map(b => <SelectItem key={b._id} value={b.name}>{b.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.branch && <p className="text-sm text-destructive">{errors.branch.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Controller
                    control={control}
                    name="semester"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting || loadingSettings}>
                        <SelectTrigger><SelectValue placeholder="Select Semester" /></SelectTrigger>
                        <SelectContent>
                           {['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.semester && <p className="text-sm text-destructive">{errors.semester.message}</p>}
                </div>
            </div>

            <DialogFooter>
                <Button type="submit" disabled={isSubmitting || loadingSettings}>
                    {(isSubmitting || loadingSettings) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
