
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { suggestTags } from '@/ai/flows/suggest-tags';
import { Wand2, Loader2 } from 'lucide-react';
import { Note } from '@/lib/types';
import { allUniversities } from '@/lib/mock-data';

const uploadSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  university: z.string().min(3, 'University is required'),
  subject: z.string().min(3, 'Subject is required'),
  semester: z.string().min(3, 'Semester is required'),
  branch: z.string().min(1, 'Branch is required'),
  noteContent: z.string().optional(),
  file: z.any().refine((files) => files?.length === 1, 'File is required.'),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export function UploadForm() {
  const { toast } = useToast();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch('/api/notes');
        const data = await res.json();
        setNotes(data.notes);
      } catch (error) {
        console.error("Failed to fetch notes for form", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, []);

  const subjects = [...new Set(notes.map((note) => note.subject))];
  const branches = [...new Set(notes.map(note => note.branch).filter(b => b !== 'All Branches'))];


  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
  });
  const noteContent = watch('noteContent');

  const handleSuggestTags = async () => {
    if (!noteContent) {
      toast({
        title: 'Content needed',
        description: 'Please paste some of your note content to get AI suggestions.',
        variant: 'destructive'
      });
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await suggestTags({ noteContent });
      setValue('university', result.university, { shouldValidate: true });
      setValue('subject', result.subject, { shouldValidate: true });
      setValue('semester', result.semester, { shouldValidate: true });
      toast({
        title: 'Tags Suggested!',
        description: 'AI has filled in the university, subject, and semester for you.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not suggest tags at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSubmit = async (data: UploadFormValues) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', data.file[0]);
      formData.append('title', data.title);
      formData.append('university', data.university);
      formData.append('subject', data.subject);
      formData.append('semester', data.semester);
      formData.append('branch', data.branch);
      if (data.noteContent) {
        formData.append('noteContent', data.noteContent);
      }

      const res = await fetch('/api/notes/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Upload failed');
      
      toast({
        title: 'Upload Successful!',
        description: 'Your note has been uploaded and is now available.',
      });
      reset();
    } catch (error: any) {
       toast({
        title: 'Upload Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Note Title</Label>
          <Input id="title" {...register('title')} placeholder="e.g., Quantum Physics Midterm Review" />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="file">Note File (PDF)</Label>
          <Input id="file" type="file" accept=".pdf" {...register('file')} />
          {errors.file && <p className="text-sm text-destructive">{errors.file.message?.toString()}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="noteContent">Note Summary (for AI & Display)</Label>
        <Textarea
          id="noteContent"
          {...register('noteContent')}
          placeholder="Paste a snippet or summary of your notes here to get AI-powered tag suggestions and for display on the note page."
          rows={5}
        />
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={handleSuggestTags} disabled={isSuggesting || isUploading}>
          {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
          {isSuggesting ? 'Thinking...' : 'Suggest Tags with AI'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <Label>University</Label>
          <Controller
            control={control}
            name="university"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} disabled={isUploading || loading}>
                <SelectTrigger><SelectValue placeholder="Select University" /></SelectTrigger>
                <SelectContent>
                  {allUniversities.map(u => <SelectItem key={u.name} value={u.name}>{u.name}</SelectItem>)}
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
              <Select onValueChange={field.onChange} value={field.value} disabled={isUploading || loading}>
                <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                <SelectContent>
                   {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
              <Select onValueChange={field.onChange} value={field.value} disabled={isUploading || loading}>
                <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                <SelectContent>
                   {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
          {errors.branch && <p className="text-sm text-destructive">{errors.branch.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <Input id="semester" {...register('semester')} placeholder="e.g., 5th Semester" disabled={isUploading} />
          {errors.semester && <p className="text-sm text-destructive">{errors.semester.message}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" disabled={isUploading || loading}>
          {(isUploading || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload Note
        </Button>
      </div>
    </form>
  );
}
