import { UploadForm } from './components/upload-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { connectToDatabase } from '@/lib/db';
import University from '@/models/university';
import Subject from '@/models/subject';
import Branch from '@/models/branch';

async function getSettingsData() {
    try {
        await connectToDatabase();
        const [universities, subjects, branches] = await Promise.all([
            University.find({}).sort({ name: 1 }).lean(),
            Subject.find({}).sort({ name: 1 }).lean(),
            Branch.find({}).sort({ name: 1 }).lean(),
        ]);
        return {
            universities: JSON.parse(JSON.stringify(universities)),
            subjects: JSON.parse(JSON.stringify(subjects)),
            branches: JSON.parse(JSON.stringify(branches)),
        };
    } catch (error) {
        console.error("Failed to fetch settings for upload form", error);
        // Return empty arrays on error to prevent crashing the page
        return { universities: [], subjects: [], branches: [] };
    }
}


export default async function UploadPage() {
  const settingsData = await getSettingsData();

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Upload Your Notes</CardTitle>
          <CardDescription>Share your knowledge with the community. Fill out the details below to upload your study material.</CardDescription>
        </CardHeader>
        <CardContent>
          <UploadForm settings={settingsData} />
        </CardContent>
      </Card>
    </div>
  );
}
