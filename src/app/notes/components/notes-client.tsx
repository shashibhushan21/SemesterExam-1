
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NoteCard } from '@/components/note-card';
import { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface NotesClientProps {
    notes: Note[];
    universities: string[];
    subjects: string[];
    branches: string[];
}

export function NotesClient({ notes, universities, subjects, branches }: NotesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');

  const semesters = ['all', '1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const searchTermMatch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
      const universityMatch = selectedUniversity === 'all' || note.university === selectedUniversity;
      const subjectMatch = selectedSubject === 'all' || note.subject === selectedSubject;
      const semesterMatch = selectedSemester === 'all' || note.semester === selectedSemester;
      const branchMatch = selectedBranch === 'all' || note.branch === selectedBranch;

      return searchTermMatch && universityMatch && subjectMatch && semesterMatch && branchMatch;
    });
  }, [notes, searchTerm, selectedUniversity, selectedSubject, selectedSemester, selectedBranch]);
  
  return (
    <>
      <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg w-full mb-12 space-y-4">
        <div className="relative">
            <Input
                type="search"
                placeholder="Search notes by title..."
                className="w-full h-12 bg-white/10 text-white border-2 border-white/20 rounded-lg pl-12 pr-4 text-base focus:bg-white/20 focus:border-white/40 focus:ring-0 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/60" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
            <SelectTrigger className="h-12 bg-white/10 text-white border-2 border-white/20 text-base transition-colors focus:bg-white/20 focus:border-white/40">
              <SelectValue placeholder="Select University" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Universities</SelectItem>
              {universities.map((uni) => (
                <SelectItem key={uni} value={uni}>{uni}</SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="h-12 bg-white/10 text-white border-2 border-white/20 text-base transition-colors focus:bg-white/20 focus:border-white/40">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((sub) => (
                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch} value={branch}>{branch}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredNotes.length > 0 ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {filteredNotes.map((note: Note) => (
              <Link key={note._id} href={`/notes/${note._id}`} passHref>
                  <NoteCard note={note} />
              </Link>
            ))}
        </div>
      ) : (
         <div className="text-center py-16">
          <p className="text-2xl font-semibold">No notes found.</p>
          <p className="text-white/70 mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </>
  );
}
