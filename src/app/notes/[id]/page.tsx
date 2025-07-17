
import { allNotes } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { NoteClientPage } from './components/note-client-page';
import type { Note } from '@/lib/types';

export default function NotePage({ params }: { params: { id: string } }) {
  const note: Note | undefined = allNotes.find((n) => n.id === params.id);

  if (!note) {
    notFound();
  }

  return <NoteClientPage note={note} />;
}
