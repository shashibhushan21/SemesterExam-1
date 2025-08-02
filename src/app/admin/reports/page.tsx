
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flag } from 'lucide-react';
import { ReportsTable } from './components/reports-table';

export default function ManageReportsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Flag /> Manage Reports
                </CardTitle>
                <CardDescription>
                    Review and resolve user-submitted reports on notes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ReportsTable />
            </CardContent>
        </Card>
    );
}
