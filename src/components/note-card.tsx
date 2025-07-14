import Image from 'next/image';
import type { Note } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <Image
          src={note.thumbnailUrl}
          alt={note.title}
          width={400}
          height={200}
          className="object-cover w-full h-40"
          data-ai-hint="note document"
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2">{note.subject}</Badge>
        <h3 className="text-lg font-semibold line-clamp-2 font-headline">{note.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{note.university}</p>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{note.summary}</p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={note.authorAvatar} alt={note.author} />
              <AvatarFallback>{note.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{note.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            <span className="text-sm font-medium">{note.rating}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
