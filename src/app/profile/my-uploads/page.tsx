
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, Star, Eye, ArrowLeft, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Note } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyUploadsPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/profile/my-notes');
            if (!res.ok) throw new Error('Failed to fetch your notes');
            const data = await res.json();
            setNotes(data.notes);
        } catch (error) {
            toast({ title: 'Error', description: 'Could not fetch your uploaded notes.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleDeleteNote = async (noteId: string) => {
        // Implement delete functionality if needed
        toast({ title: 'Note Deletion', description: 'Delete functionality is not yet implemented.', variant: 'default' });
    };

    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText /> My Uploads
                    </CardTitle>
                    <CardDescription>
                        A list of all the notes you have contributed.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                        </div>
                    ) : (
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>University</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Uploaded</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {notes.length > 0 ? notes.map((note) => (
                                        <TableRow key={note._id}>
                                            <TableCell className="font-medium">{note.title}</TableCell>
                                            <TableCell>{note.university}</TableCell>
                                            <TableCell><Badge variant="outline">{note.subject}</Badge></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                                                    {note.rating.toFixed(1)}
                                                </div>
                                            </TableCell>
                                            <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                 <Link href={`/notes/${note._id}`} passHref>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                 </Link>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                You haven't uploaded any notes yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
