
import { allUniversities } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { UniversityNotesClient } from './components/university-notes-client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { University as UniversityIcon, ArrowLeft } from 'lucide-react';
import { Note, University } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GET as getAllNotes } from '../../api/notes/route';

async function getNotes() {
    // Directly call the API route handler logic
    const response = await getAllNotes();
    if (!response.ok) {
        throw new Error('Failed to fetch notes');
    }
    const data = await response.json();
    return data.notes as Note[];
}

export default async function UniversityDetailPage({ params }: { params: { name: string } }) {
  const universityName = decodeURIComponent(params.name);

  const universityDetails = allUniversities.find(
    (uni) => uni.name.toLowerCase() === universityName.toLowerCase()
  );

  if (!universityDetails) {
    notFound();
  }
  
  const allNotes = await getNotes();
  const universityNotes: Note[] = allNotes.filter(
    (note) => note.university.toLowerCase() === universityName.toLowerCase()
  );

  const semesters = ['all', ...new Set(universityNotes.map((note) => note.semester))];
  const branches = ['all', ...new Set(universityNotes.map((note) => note.branch))];

  return (
    <div className="text-white">
      <div className="flex items-center gap-4 mb-8">
            <Link href="/universities" passHref>
                <Button variant="outline" className="group transition-all duration-300 hover:bg-accent/80 hover:text-accent-foreground hover:shadow-lg hover:-translate-y-1">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to All Universities
                </Button>
            </Link>
        </div>
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
        branches={branches}
      />

    </div>
  );
}
