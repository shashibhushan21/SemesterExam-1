
import { notFound } from 'next/navigation';
import { NoteClientPage } from './components/note-client-page';
import type { Note } from '@/lib/types';

async function getNote(id: string): Promise<Note | null> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes/${id}`, { cache: 'no-store' });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch note');
    }
    const data = await res.json();
    return data.note;
}


export default async function NotePage({ params }: { params: { id: string } }) {
  const note = await getNote(params.id);

  if (!note) {
    notFound();
  }

  return <NoteClientPage note={note} />;
}
