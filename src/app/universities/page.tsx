import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { allNotes } from '@/lib/mock-data';

export default function UniversitiesPage() {
  const universities = [...new Set(allNotes.map((note) => note.university))];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-8">Supported Universities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {universities.map((uni) => (
          <Card key={uni}>
            <CardHeader>
              <CardTitle>{uni}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Explore notes from {uni}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
