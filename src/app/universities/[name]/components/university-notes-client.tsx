
'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NoteCard } from '@/components/note-card';
import { Note } from '@/lib/types';
import Link from 'next/link';

interface UniversityNotesClientProps {
  notes: Note[];
  semesters: string[];
  branches: string[];
}

export function UniversityNotesClient({ notes, semesters, branches }: UniversityNotesClientProps) {
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');

  const filteredNotes = notes.filter((note) => {
    return (
      (selectedSemester === 'all' || note.semester === selectedSemester) &&
      (selectedBranch === 'all' || note.branch === selectedBranch)
    );
  });
  
  return (
    <>
      <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg w-full max-w-4xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="h-12 bg-white/10 text-white border-2 border-white/20 text-base transition-colors focus:bg-white/20 focus:border-white/40">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch} value={branch}>{branch === 'all' ? 'All Branches' : branch}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
        {filteredNotes.map((note: Note) => (
          <Link key={note._id} href={`/notes/${note._id}`} passHref>
              <NoteCard note={note} />
          </Link>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-16">
          <p className="text-2xl font-semibold">No notes found.</p>
          <p className="text-white/70 mt-2">Try adjusting your filters.</p>
        </div>
      )}
    </>
  );
}
