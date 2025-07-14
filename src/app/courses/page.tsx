import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { allNotes } from '@/lib/mock-data';

export default function CoursesPage() {
    const subjects = [...new Set(allNotes.map((note) => note.subject))];
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-8">Available Courses</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((subject) => (
          <Card key={subject}>
            <CardHeader>
              <CardTitle>{subject}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Browse notes for {subject}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
