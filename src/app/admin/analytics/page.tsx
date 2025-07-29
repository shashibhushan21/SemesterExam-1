
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Star, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { OverviewChart } from './components/overview-chart';
import { DistributionChart } from './components/distribution-chart';

interface AnalyticsData {
  totalUsers: number;
  totalNotes: number;
  averageRating: number;
  dailyActivity: { date: string; users: number; notes: number }[];
  universityDistribution: { name: string; count: number }[];
  subjectDistribution: { name: string; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/analytics');
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const analyticsData = await res.json();
        setData(analyticsData);
      } catch (error) {
        console.error("Error fetching admin analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-80 w-full" />
            <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
            </div>
        </div>
    );
  }

  if (!data) {
    return <p>Could not load analytics data.</p>;
  }

  return (
    <div className="space-y-6">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="w-8 h-8"/> Site Analytics
        </CardTitle>
        <CardDescription>
          An overview of your platform's activity and content.
        </CardDescription>
      </CardHeader>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Total registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalNotes}</div>
            <p className="text-xs text-muted-foreground">Total notes uploaded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageRating.toFixed(2)} / 5.0</div>
            <p className="text-xs text-muted-foreground">Average rating across all notes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>New users and notes uploaded in the last 30 days.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <OverviewChart data={data.dailyActivity} />
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Notes by University</CardTitle>
                <CardDescription>Distribution of notes across different universities.</CardDescription>
            </CardHeader>
            <CardContent>
                <DistributionChart data={data.universityDistribution} />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Notes by Subject</CardTitle>
                <CardDescription>Distribution of notes across different subjects.</CardDescription>
            </CardHeader>
            <CardContent>
                <DistributionChart data={data.subjectDistribution} />
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
