
'use client';

import type { Note, Rating } from '@/lib/types';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, Flag, Star, Wand2, Loader2, ArrowLeft, Lock, MessageSquare, Edit } from 'lucide-react';
import { summarizeNotes } from '@/ai/flows/summarize-notes';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { NoteReviewDialog } from './note-review-dialog';

const PdfViewer = dynamic(() => import('./pdf-viewer').then(mod => mod.PdfViewer), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
    </div>
  ),
});

export function NoteClientPage({ note, formattedDate, initialUserRating, reviews: initialReviews }: { note: Note, formattedDate: string, initialUserRating: Rating | null, reviews: Rating[] }) {
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [currentRating, setCurrentRating] = useState(note.rating);
  const [reviews, setReviews] = useState(initialReviews);
  const [userRating, setUserRating] = useState(initialUserRating);


  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  
  const handleSummarize = async () => {
    if (!user) return handleProtectedAction();
    setIsSummarizing(true);
    try {
      const result = await summarizeNotes({ notesContent: note.content });
      setSummary(result.summary);
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

  const handleProtectedAction = () => {
     if (!user) {
        toast({
            title: 'Authentication Required',
            description: `You need to be logged in to perform this action.`,
            variant: 'destructive',
        });
        router.push(`/auth?redirect=${pathname}`);
     }
  };
  
  const refreshReviews = async () => {
     try {
        const res = await fetch(`/api/notes/${note._id}`);
        const data = await res.json();
        setCurrentRating(data.note.rating);
        
        const reviewsRes = await fetch(`/api/notes/${note._id}/reviews`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews);
        const currentUserReview = reviewsData.reviews.find((r: Rating) => r.user._id === user?.id);
        setUserRating(currentUserReview || null);

    } catch (error) {
        toast({ title: 'Error', description: 'Could not refresh reviews.', variant: 'destructive' });
    }
  }
  
  return (
    <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => router.back()} className="group transition-all duration-300 hover:bg-accent/80 hover:text-accent-foreground hover:shadow-lg hover:-translate-y-1">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Notes
            </Button>
        </div>
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
               <div className="relative w-full h-[75vh] rounded-lg overflow-hidden border bg-secondary">
                  <PdfViewer url={note.pdfUrl} />
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
              {isSummarizing && !summary ? (
                <div className="text-center text-muted-foreground py-8">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  <p className="mt-2">Generating summary...</p>
                </div>
              ) : summary ? (
                <p className="text-foreground/90 leading-relaxed">{summary}</p>
              ) : (
                 <div className="text-center text-muted-foreground py-8">
                    {note.summary ? (
                        <p>{note.summary}</p>
                    ) : (
                        <p>Click the button above to generate a summary of this note using AI.</p>
                    )}
                </div>
              )}
            </CardContent>
          </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold font-headline">Community Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review._id} className="flex gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={review.user.avatar} alt={review.user.name} />
                                    <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">{review.user.name}</p>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-4 w-4 ${review.rating > i ? 'text-yellow-500 fill-yellow-400' : 'text-gray-500'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    <p className="mt-2 text-foreground/90">{review.review}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-4">No reviews yet. Be the first to leave one!</p>
                    )}
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center gap-4">
               {user ? (
                 <a href={note.pdfUrl} download className="w-full">
                    <Button size="lg" className="w-full">
                      <Download className="mr-2 h-5 w-5" /> Download Note
                    </Button>
                  </a>
               ) : (
                  <Button size="lg" className="w-full" onClick={handleProtectedAction}>
                    <Lock className="mr-2 h-5 w-5" /> Login to Download
                  </Button>
               )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                   <Button variant="outline" className="w-full" onClick={user ? undefined : handleProtectedAction} disabled={!user}>
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
                <AvatarImage src={note.author.avatar} alt={note.author.name} />
                <AvatarFallback>{note.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{note.author.name}</p>
                {formattedDate && (
                   <p className="text-muted-foreground">Uploaded on {formattedDate}</p>
                )}
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
                    <span className="text-3xl font-bold">{currentRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">/ 5.0</span>
                </div>
                 <div className="mt-4">
                    {user && user.role === 'user' ? (
                       <NoteReviewDialog noteId={note._id} userRating={userRating} onReviewSubmit={refreshReviews}>
                         <Button variant="outline" className="w-full">
                            {userRating ? <Edit className="mr-2 h-4 w-4" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                            {userRating ? 'Edit Your Review' : 'Leave a Review'}
                         </Button>
                        </NoteReviewDialog>
                    ) : (
                         <Button variant="outline" className="w-full" onClick={handleProtectedAction} disabled={user?.role === 'admin'}>
                             <Lock className="mr-2 h-4 w-4" />
                             Log in to review
                         </Button>
                    )}
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

    