
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, MoreHorizontal, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Note {
    _id: string;
    title: string;
    university: string;
    subject: string;
    author: { name: string };
    createdAt: string;
}

export default function ManageNotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/notes');
            if (!res.ok) throw new Error('Failed to fetch notes');
            const data = await res.json();
            setNotes(data.notes);
        } catch (error) {
            toast({ title: 'Error', description: 'Could not fetch notes.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleDeleteNote = async (noteId: string) => {
        try {
            const res = await fetch(`/api/admin/notes/${noteId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete note');
            
            toast({ title: 'Success', description: 'Note deleted successfully.' });
            fetchNotes(); // Refresh list
        } catch (error) {
            toast({ title: 'Error', description: 'Could not delete the note.', variant: 'destructive' });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText /> Manage Notes
                </CardTitle>
                <CardDescription>
                    View, edit, and delete all uploaded notes here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>University</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Uploaded</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {notes.map((note) => (
                                <TableRow key={note._id}>
                                    <TableCell className="font-medium">{note.title}</TableCell>
                                    <TableCell>{note.author?.name || 'N/A'}</TableCell>
                                    <TableCell>{note.university}</TableCell>
                                    <TableCell><Badge variant="outline">{note.subject}</Badge></TableCell>
                                    <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the note.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteNote(note._id)} className="bg-destructive hover:bg-destructive/90">
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                 {notes.length === 0 && !loading && (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>No notes found.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
