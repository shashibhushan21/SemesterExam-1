import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function ManageUsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users /> Manage Users
        </CardTitle>
        <CardDescription>
          This page is under construction. You will soon be able to view, edit, and manage all registered users here.
        </CardDescription>
      </CardHeader>
       <CardContent>
        <div className="text-center py-16 text-muted-foreground">
            <p>User management interface coming soon!</p>
        </div>
      </CardContent>
    </Card>
  );
}
