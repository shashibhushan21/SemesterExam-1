
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { NotesTable } from './components/notes-table';

export default function ManageNotesPage() {
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
                <NotesTable />
            </CardContent>
        </Card>
    );
}
