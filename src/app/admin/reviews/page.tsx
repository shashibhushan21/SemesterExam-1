
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { ReviewsTable } from './components/reviews-table';

export default function ManageReviewsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare /> Manage Reviews
                </CardTitle>
                <CardDescription>
                    View, edit, and delete all user-submitted reviews here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ReviewsTable />
            </CardContent>
        </Card>
    );
}
