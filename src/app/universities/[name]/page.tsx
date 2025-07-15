
import { allNotes, allUniversities } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { UniversityNotesClient } from './components/university-notes-client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { University as UniversityIcon } from 'lucide-react';
import { Note, University } from '@/lib/types';

export default function UniversityDetailPage({ params }: { params: { name: string } }) {
  const universityName = decodeURIComponent(params.name);

  const universityDetails = allUniversities.find(
    (uni) => uni.name.toLowerCase() === universityName.toLowerCase()
  );

  if (!universityDetails) {
    notFound();
  }
  
  const universityNotes: Note[] = allNotes.filter(
    (note) => note.university.toLowerCase() === universityName.toLowerCase()
  );

  const semesters = ['all', ...new Set(universityNotes.map((note) => note.semester))];
  const subjects = ['all', ...new Set(universityNotes.map((note) => note.subject))];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-white">
      <Card className="mb-12 bg-slate-900/50 backdrop-blur-sm border-white/10 overflow-hidden">
        <div className="relative h-48 w-full">
            <Image src={universityDetails.bannerUrl} alt={`${universityDetails.name} banner`} fill className="object-cover" data-ai-hint="university campus" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        </div>
        <CardContent className="p-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 border border-primary/30 rounded-lg">
                    <UniversityIcon className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{universityDetails.name}</h1>
                    <p className="mt-1 text-white/70">{universityDetails.location}</p>
                </div>
            </div>
             <p className="mt-4 text-lg text-white/80 max-w-4xl">
                {universityDetails.description}
            </p>
        </CardContent>
      </Card>
      
      <UniversityNotesClient
        notes={universityNotes}
        semesters={semesters}
        subjects={subjects}
      />

    </div>
  );
}
