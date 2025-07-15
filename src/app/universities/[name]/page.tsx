'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { allNotes } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { NoteCard } from '@/components/note-card';
import { Note } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UniversityDetailPage() {
  const params = useParams();
  const universityName = decodeURIComponent(params.name as string);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const universityNotes = allNotes.filter(
    (note) => note.university.toLowerCase() === universityName.toLowerCase()
  );

  const semesters = ['all', ...new Set(universityNotes.map((note) => note.semester))];
  const subjects = ['all', ...new Set(universityNotes.map((note) => note.subject))];

  const filteredNotes = universityNotes.filter((note) => {
    return (
      (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.summary.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSemester === 'all' || note.semester === selectedSemester) &&
      (selectedSubject === 'all' || note.subject === selectedSubject)
    );
  });
  
  if (universityNotes.length === 0) {
    return (
      <div className="text-center py-16 text-white">
          <h1 className="text-4xl font-bold mb-4">University Not Found</h1>
          <p className="text-xl text-white/80 mb-8">We couldn't find any notes for &quot;{universityName}&quot;.</p>
          <Link href="/universities">
            <Button>Back to Universities</Button>
          </Link>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="text-center mb-12 animate-fade-in-down">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{universityName}</h1>
        <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
          Explore B.Tech notes for {universityName}. Use the filters below to find what you need.
        </p>
      </div>

      <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg w-full max-w-4xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-1">
            <Input
              type="search"
              placeholder="Search notes..."
              className="w-full h-12 bg-white/10 text-white placeholder:text-white/60 border-2 border-white/20 rounded-lg pl-10 pr-4 text-base focus:bg-white/20 focus:border-white/40 focus:ring-0 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
          </div>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="h-12 bg-white/10 text-white border-2 border-white/20 text-base transition-colors focus:bg-gray-200">
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((sem) => (
                <SelectItem key={sem} value={sem}>{sem === 'all' ? 'All Semesters' : sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="h-12 bg-white/10 text-white border-2 border-white/20 text-base transition-colors focus:bg-gray-200">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((sub) => (
                <SelectItem key={sub} value={sub}>{sub === 'all' ? 'All Subjects' : sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
        {filteredNotes.map((note: Note) => (
          <Link key={note.id} href={`/notes/${note.id}`} passHref>
              <NoteCard note={note} />
          </Link>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-16">
          <p className="text-2xl font-semibold">No notes found.</p>
          <p className="text-white/70 mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
