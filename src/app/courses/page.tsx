import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Note } from '@/lib/types';

async function getNotes() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch notes');
    }
    const data = await res.json();
    return data.notes as Note[];
}


export default async function CoursesPage() {
    const notes = await getNotes();
    const subjects = [...new Set(notes.map((note) => note.subject))];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white animate-fade-in-down">Available Courses</h1>
        <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto animate-fade-in-up">
          Explore our collection of notes, organized by subject for your convenience.
        </p>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((subject) => (
           <Link href="/universities" key={subject} className="group block">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-white/10 h-full transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{subject}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/80">Browse notes and resources for {subject}.</CardDescription>
                 <div className="text-primary font-semibold mt-4 flex items-center gap-2 transition-all duration-300 group-hover:gap-3">
                    View Notes <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
