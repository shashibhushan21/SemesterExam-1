
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface HeroSearchProps {
    universities: string[];
    semesters: string[];
    subjects: string[];
}

export function HeroSearch({ universities, semesters, subjects }: HeroSearchProps) {
  const [university, setUniversity] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (university) query.append('name', university);
    if (semester) query.append('semester', semester);
    if (subject) query.append('subject', subject);
    
    router.push(`/universities?${query.toString()}`);
  };

  return (
    <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select onValueChange={setUniversity}>
                <SelectTrigger className="h-12 bg-white text-black text-base transition-colors focus:bg-gray-200">
                <SelectValue placeholder="Select University" />
                </SelectTrigger>
                <SelectContent>
                {universities.map((uni) => (
                    <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                ))}
                </SelectContent>
            </Select>
            <Select onValueChange={setSemester}>
                <SelectTrigger className="h-12 bg-white text-black text-base transition-colors focus:bg-gray-200">
                <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                {semesters.map((sem) => (
                    <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                ))}
                </SelectContent>
            </Select>
            <Select onValueChange={setSubject}>
                <SelectTrigger className="h-12 bg-white text-black text-base transition-colors focus:bg-gray-200">
                <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                {subjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                ))}
                </SelectContent>
            </Select>
            <Button size="lg" className="h-12 bg-white text-primary hover:bg-gray-200 transition-all duration-300 transform hover:scale-105" onClick={handleSearch}>
                <Search className="mr-2 h-5 w-5" />
                Search
            </Button>
        </div>
    </div>
  );
}
