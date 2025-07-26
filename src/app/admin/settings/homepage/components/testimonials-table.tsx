
'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Edit, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { TestimonialFormDialog } from './testimonial-form-dialog';

interface Testimonial {
    _id: string;
    quote: string;
    author: string;
}

export function TestimonialsTable() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/homepage/testimonials');
            if (!res.ok) throw new Error('Failed to fetch data');
            const data = await res.json();
            setTestimonials(data.testimonials);
        } catch (error) {
            toast({ title: 'Error', description: 'Could not fetch testimonials.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/homepage/testimonials/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            toast({ title: 'Success', description: 'Testimonial deleted successfully.' });
            fetchItems();
        } catch (error) {
            toast({ title: 'Error', description: 'Could not delete the testimonial.', variant: 'destructive' });
        }
    };
    
    return (
        <div className="mt-6">
             <div className="flex justify-end mb-4">
                <TestimonialFormDialog onFinished={fetchItems}>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial</Button>
                </TestimonialFormDialog>
            </div>
             {loading ? (
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
             ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Quote</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {testimonials.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium line-clamp-2">{item.quote}</TableCell>
                                    <TableCell>{item.author}</TableCell>
                                    <TableCell className="text-right">
                                       <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <TestimonialFormDialog item={item} onFinished={fetchItems} >
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                </TestimonialFormDialog>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete the testimonial.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(item._id)} className="bg-destructive">Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
             )}
        </div>
    );
}
