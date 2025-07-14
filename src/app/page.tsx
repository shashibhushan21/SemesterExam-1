import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { NoteCard } from '@/components/note-card';
import { allNotes } from '@/lib/mock-data';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function Home() {
  const universities = [...new Set(allNotes.map((note) => note.university))];
  const subjects = [...new Set(allNotes.map((note) => note.subject))];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
          Find Your Study Material
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Access a vast library of notes from universities worldwide. Filter by university, subject, or semester to get exactly what you need.
        </p>
      </div>

      <div className="p-4 bg-card rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for notes, subjects, or topics..."
              className="pl-10 h-12"
            />
          </div>
          <Select>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select University" />
            </SelectTrigger>
            <SelectContent>
              {universities.map((uni) => (
                <SelectItem key={uni} value={uni}>{uni}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((sub) => (
                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end mt-4">
          <Button size="lg">Search Notes</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight font-headline">Recently Added Notes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
          {allNotes.map((note) => (
            <Link href={`/notes/${note.id}`} key={note.id}>
              <NoteCard note={note} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
