'use client';

import { useState } from 'react';
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
import { Wand2 } from 'lucide-react';
import { allNotes } from '@/lib/mock-data';

const uploadSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  university: z.string().min(3, 'University is required'),
  subject: z.string().min(3, 'Subject is required'),
  semester: z.string().min(3, 'Semester is required'),
  noteContent: z.string().optional(),
  file: z.any().refine((files) => files?.length === 1, 'File is required.'),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

const universities = [...new Set(allNotes.map((note) => note.university))];
const subjects = [...new Set(allNotes.map((note) => note.subject))];

export function UploadForm() {
  const { toast } = useToast();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<UploadFormValues>({
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

  const onSubmit = (data: UploadFormValues) => {
    console.log(data);
    toast({
      title: 'Upload Successful!',
      description: 'Your note has been uploaded and is pending review.',
      className: 'bg-accent text-accent-foreground'
    });
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
          <Label htmlFor="file">Note File</Label>
          <Input id="file" type="file" {...register('file')} />
          {errors.file && <p className="text-sm text-destructive">{errors.file.message?.toString()}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="noteContent">Note Content (for AI suggestions)</Label>
        <Textarea
          id="noteContent"
          {...register('noteContent')}
          placeholder="Paste a snippet of your notes here to get AI-powered tag suggestions..."
          rows={5}
        />
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={handleSuggestTags} disabled={isSuggesting}>
          <Wand2 className="mr-2 h-4 w-4" />
          {isSuggesting ? 'Thinking...' : 'Suggest Tags with AI'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>University</Label>
          <Controller
            control={control}
            name="university"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select University" /></SelectTrigger>
                <SelectContent>
                  {universities.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
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
              <Select onValueChange={field.onChange} value={field.value}>
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
          <Label>Semester</Label>
          <Input id="semester" {...register('semester')} placeholder="e.g., Fall 2024" />
          {errors.semester && <p className="text-sm text-destructive">{errors.semester.message}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg">Upload Note</Button>
      </div>
    </form>
  );
}
