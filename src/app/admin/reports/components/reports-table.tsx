
'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, CheckCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface Report {
    _id: string;
    reason: string;
    status: 'pending' | 'resolved';
    user: { name: string; email: string };
    note: { _id: string, title: string };
    createdAt: string;
}

export function ReportsTable() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/reports');
            if (!res.ok) throw new Error('Failed to fetch reports');
            const data = await res.json();
            setReports(data.reports);
        } catch (error) {
            toast({ title: 'Error', description: 'Could not fetch reports.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleUpdateStatus = async (reportId: string, status: 'resolved') => {
        try {
            const res = await fetch(`/api/admin/reports/${reportId}`, { 
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (!res.ok) throw new Error('Failed to update report status');
            
            toast({ title: 'Success', description: 'Report status updated.' });
            fetchReports(); // Refresh list
        } catch (error) {
            toast({ title: 'Error', description: 'Could not update report status.', variant: 'destructive' });
        }
    };

    const handleDeleteReport = async (reportId: string) => {
        try {
            const res = await fetch(`/api/admin/reports/${reportId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete report');
            
            toast({ title: 'Success', description: 'Report deleted successfully.' });
            fetchReports(); // Refresh list
        } catch (error) {
            toast({ title: 'Error', description: 'Could not delete the report.', variant: 'destructive' });
        }
    };

    return (
        <>
            {loading ? (
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            ) : (
                <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Note</TableHead>
                            <TableHead>Reported By</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report._id}>
                                <TableCell className="font-medium max-w-sm truncate" title={report.reason}>{report.reason}</TableCell>
                                <TableCell><Badge variant={report.status === 'pending' ? 'destructive' : 'secondary'}>{report.status}</Badge></TableCell>
                                <TableCell>
                                    <Link href={`/notes/${report.note?._id}`} className="hover:underline" target="_blank">
                                        {report.note?.title || 'N/A'} <Eye className="inline ml-1 h-4 w-4" />
                                    </Link>
                                </TableCell>
                                <TableCell>{report.user?.name || 'N/A'}</TableCell>
                                <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {report.status === 'pending' && (
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(report._id, 'resolved')}>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Mark as Resolved
                                                </DropdownMenuItem>
                                            )}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                     <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the report.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteReport(report._id)} className="bg-destructive hover:bg-destructive/90">
                                                            Delete
                                                        </AlertDialogAction>
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
             {reports.length === 0 && !loading && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>No reports found.</p>
                </div>
            )}
        </>
    );
}
