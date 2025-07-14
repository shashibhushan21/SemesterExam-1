import { BookOpenCheck } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <BookOpenCheck className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold tracking-tight text-foreground font-headline">
        ExamNotes
      </span>
    </div>
  );
}
