
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UniversitiesTable } from './components/universities-table';
import { SubjectsTable } from './components/subjects-table';
import { BranchesTable } from './components/branches-table';
import { Settings } from 'lucide-react';

export default function SiteSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings /> Site Settings
        </CardTitle>
        <CardDescription>
          Manage the core data for your application, such as universities, subjects, and branches.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="universities" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="universities">Universities</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
          </TabsList>
          <TabsContent value="universities">
            <UniversitiesTable />
          </TabsContent>
          <TabsContent value="subjects">
            <SubjectsTable />
          </TabsContent>
          <TabsContent value="branches">
            <BranchesTable />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
