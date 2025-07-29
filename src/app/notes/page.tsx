
import { Suspense } from 'react';
import { Note, University } from '@/lib/types';
import { connectToDatabase } from '@/lib/db';
import UniversityModel from '@/models/university';
import NoteModel from '@/models/note';
import { NotesClient } from './components/notes-client';
import { Skeleton } from '@/components/ui/skeleton';
import Subject from '@/models/subject';
import Branch from '@/models/branch';

async function getNotesData() {
    try {
        await connectToDatabase();
        const [notes, universities, subjects, branches] = await Promise.all([
             NoteModel.find({}).populate('author', 'name avatar').sort({ createdAt: -1 }).lean(),
             UniversityModel.find({}).sort({ name: 1 }).lean(),
             Subject.find({}).sort({ name: 1 }).lean(),
             Branch.find({}).sort({ name: 1 }).lean(),
        ]);
        
        return {
            notes: JSON.parse(JSON.stringify(notes)),
            universities: JSON.parse(JSON.stringify(universities.map(u => u.name))),
            subjects: JSON.parse(JSON.stringify(subjects.map(s => s.name))),
            branches: JSON.parse(JSON.stringify(branches.map(b => b.name))),
        };

    } catch (error) {
        console.error("Failed to fetch notes data:", error);
        return { notes: [], universities: [], subjects: [], branches: [] };
    }
}


function NotesLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-80 w-full" />
      ))}
    </div>
  );
}

function PageContent({ notes, universities, subjects, branches }: { notes: Note[], universities: string[], subjects: string[], branches: string[] }) {
  return <NotesClient notes={notes} universities={universities} subjects={subjects} branches={branches} />;
}


export default async function NotesPage() {
  const { notes, universities, subjects, branches } = await getNotesData();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="text-center mb-12 animate-fade-in-down">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Browse All Notes</h1>
        <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
          Find your B.Tech notes from all universities. Use the filters to narrow down your search.
        </p>
      </div>

      <Suspense fallback={<NotesLoading />}>
        <PageContent notes={notes} universities={universities} subjects={subjects} branches={branches} />
      </Suspense>

    </div>
  );
}
