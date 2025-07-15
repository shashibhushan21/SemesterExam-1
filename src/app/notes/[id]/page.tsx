
'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { allNotes } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, Flag, Star, Wand2, Loader2, ArrowLeft } from 'lucide-react';
import { summarizeNotes } from '@/ai/flows/summarize-notes';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function NotePage({ params: { id } }: { params: { id: string } }) {
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const note = allNotes.find((n) => n.id === id);

  if (!note) {
    notFound();
  }

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const result = await summarizeNotes({ notesContent: note.content });
      setSummary(result.summary);
      toast({
        title: 'Summary Generated!',
        description: 'The AI summary is now available.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not generate summary at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
       <Button variant="outline" onClick={() => router.back()} className="mb-8 group transition-all duration-300 hover:bg-accent/80 hover:text-accent-foreground hover:shadow-lg hover:-translate-y-1">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to notes
        </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">{note.subject}</Badge>
              <CardTitle className="text-4xl font-bold font-headline">{note.title}</CardTitle>
              <div className="flex items-center gap-4 text-muted-foreground pt-2">
                <span>{note.university}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>{note.semester}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-[65vh] rounded-lg overflow-hidden border bg-secondary">
                <iframe
                  src={note.pdfUrl}
                  className="w-full h-full"
                  title={note.title}
                />
              </div>
               <p className="mt-6 text-foreground/80">{note.content}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold font-headline">AI Summary</CardTitle>
              <Button onClick={handleSummarize} disabled={isSummarizing}>
                {isSummarizing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {summary ? 'Regenerate' : 'Generate'} Summary
              </Button>
            </CardHeader>
            <CardContent>
              {summary ? (
                <p className="text-foreground/90 leading-relaxed">{summary}</p>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>Click the button above to generate a summary of this note using AI.</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center gap-4">
              <a href={note.pdfUrl} download className="w-full">
                <Button size="lg" className="w-full">
                  <Download className="mr-2 h-5 w-5" /> Download Note
                </Button>
              </a>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Flag className="mr-2 h-5 w-5" /> Report Note
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Report this note</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please provide a reason for reporting this note. Your report will be reviewed by our team.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="message">Reason for reporting</Label>
                    <Textarea placeholder="Type your message here." id="message" />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Submit Report</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Author</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={note.authorAvatar} alt={note.author} />
                <AvatarFallback>{note.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{note.author}</p>
                <p className="text-muted-foreground">Uploaded on {note.uploadDate}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-400" />
                <span className="text-3xl font-bold">{note.rating}</span>
                <span className="text-muted-foreground">/ 5.0</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Based on community feedback.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
