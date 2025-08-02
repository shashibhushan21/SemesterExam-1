
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Flag, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Report {
    _id: string;
    note: { _id: string, title: string };
    reason: string;
    status: 'pending' | 'resolved';
    createdAt: string;
}

export default function MyReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/profile/my-reports');
            if (!res.ok) throw new Error('Failed to fetch your reports');
            const data = await res.json();
            setReports(data.reports);
        } catch (error) {
            toast({ title: 'Error', description: 'Could not fetch your submitted reports.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Flag /> My Reports
                    </CardTitle>
                    <CardDescription>
                        A list of all the content you have reported and its status.
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
                                        <TableHead>Note Title</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Reported On</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports.length > 0 ? reports.map((report) => (
                                        <TableRow key={report._id}>
                                            <TableCell className="font-medium">
                                                <Link href={`/notes/${report.note._id}`} className="hover:underline">
                                                    {report.note?.title || 'Note not found'}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="max-w-sm truncate" title={report.reason}>
                                                {report.reason}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={report.status === 'pending' ? 'destructive' : 'secondary'}>
                                                    {report.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                You haven't reported any notes yet.
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
