
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home } from 'lucide-react';
import { FeaturesTable } from './components/features-table';
import { TestimonialsTable } from './components/testimonials-table';
import { FaqsTable } from './components/faqs-table';

export default function HomepageSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home /> Homepage Settings
        </CardTitle>
        <CardDescription>
          Manage the content displayed on your homepage sections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>
          <TabsContent value="features">
            <FeaturesTable />
          </TabsContent>
          <TabsContent value="testimonials">
            <TestimonialsTable />
          </TabsContent>
           <TabsContent value="faqs">
            <FaqsTable />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
