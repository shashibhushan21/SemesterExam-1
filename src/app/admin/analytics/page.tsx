import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart /> Site Analytics
        </CardTitle>
        <CardDescription>
          This page is under construction. You will soon be able to see detailed analytics about your site's performance here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-16 text-muted-foreground">
            <p>Analytics dashboard coming soon!</p>
        </div>
      </CardContent>
    </Card>
  );
}
