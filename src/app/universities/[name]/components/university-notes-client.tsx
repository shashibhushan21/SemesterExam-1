
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { NoteCard } from '@/components/note-card';
import { Note } from '@/lib/types';
import Link from 'next/link';

interface UniversityNotesClientProps {
  notes: Note[];
  semesters: string[];
  subjects: string[];
}

export function UniversityNotesClient({ notes, semesters, subjects }: UniversityNotesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const filteredNotes = notes.filter((note) => {
    return (
      (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.summary.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSemester === 'all' || note.semester === selectedSemester) &&
      (selectedSubject === 'all' || note.subject === selectedSubject)
    );
  });
  
  return (
    <>
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
            <SelectTrigger className="h-12 bg-white/10 text-white border-2 border-white/20 text-base transition-colors focus:bg-white/20 focus:border-white/40">
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((sem) => (
                <SelectItem key={sem} value={sem}>{sem === 'all' ? 'All Semesters' : sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="h-12 bg-white/10 text-white border-2 border-white/20 text-base transition-colors focus:bg-white/20 focus:border-white/40">
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
    </>
  );
}
