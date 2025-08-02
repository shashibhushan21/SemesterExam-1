
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { askQuestionAboutNote } from '@/ai/flows/qna-flow';

const qnaSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters.'),
});

type QnaFormValues = z.infer<typeof qnaSchema>;

interface NoteQnaProps {
  noteContent: string;
}

export function NoteQna({ noteContent }: NoteQnaProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAnswering, setIsAnswering] = useState(false);
  const [answer, setAnswer] = useState('');

  const form = useForm<QnaFormValues>({
    resolver: zodResolver(qnaSchema),
  });

  const onSubmit = async (data: QnaFormValues) => {
    if (!user) {
        toast({ title: 'Authentication Required', description: 'You must be logged in to ask a question.', variant: 'destructive' });
        return;
    }
    setIsAnswering(true);
    setAnswer('');
    try {
      const result = await askQuestionAboutNote({
        noteContent: noteContent,
        question: data.question,
      });
      setAnswer(result.answer);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not get an answer at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-headline flex items-center gap-2">
          <Lightbulb /> Ask the AI
        </CardTitle>
        <CardDescription>
          Have a question about these notes? Ask the AI to find the answer for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Your Question</Label>
            <Textarea
              id="question"
              {...form.register('question')}
              placeholder="e.g., 'What is the main principle of...' or 'Summarize the section on...'"
            />
            {form.formState.errors.question && <p className="text-sm text-destructive">{form.formState.errors.question.message}</p>}
          </div>
          <Button type="submit" disabled={isAnswering}>
            {isAnswering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {isAnswering ? 'Thinking...' : 'Get Answer'}
          </Button>
        </form>

        {(isAnswering || answer) && (
            <div className="mt-6 p-4 border rounded-lg bg-secondary/50">
                {isAnswering ? (
                     <div className="text-center text-muted-foreground">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                        <p className="mt-2">Searching for the answer in the document...</p>
                    </div>
                ) : (
                    <p className="text-foreground/90 leading-relaxed">{answer}</p>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
