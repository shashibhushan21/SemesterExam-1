import { BookOpenCheck } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="text-2xl font-bold tracking-tight text-white">
        SemesterExam
      </span>
    </Link>
  );
}
