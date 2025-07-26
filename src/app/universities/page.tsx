
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UniversityCard } from '@/components/university-card';
import { University } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
};

async function getUniversities(): Promise<University[]> {
    const res = await fetch('/api/universities', { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch universities');
    }
    const data = await res.json();
    return data.universities;
}

export default function UniversitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUniversities().then(data => {
      setUniversities(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredUniversities = useMemo(() => {
     if (!searchTerm) {
      return universities;
    }
    return universities.filter((uni) =>
      uni.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, universities]);


  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="text-center mb-12 animate-fade-in-down">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Explore Universities</h1>
        <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
          Find your university and access curated B.Tech notes aligned to the syllabus.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search Universities..."
            className="w-full h-14 bg-white/10 text-white placeholder:text-white/60 border-2 border-white/20 rounded-full pl-14 pr-4 text-lg focus:bg-white/20 focus:border-white/40 focus:ring-0 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-white/60" />
        </div>
      </div>

       {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
        </div>
       ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {filteredUniversities.map((uni: University) => (
                <UniversityCard
                    key={uni.name}
                    initials={getInitials(uni.name)}
                    name={uni.name}
                    description={uni.description}
                />
                ))}
            </div>
            
            {filteredUniversities.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-2xl font-semibold">No universities found for &quot;{searchTerm}&quot;</p>
                    <p className="text-white/70 mt-2">Try a different search term.</p>
                </div>
            )}
          </>
       )}


      <div className="text-center bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 animate-fade-in-up">
        <h2 className="text-3xl font-bold">Can&apos;t find your university?</h2>
        <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
          We&apos;re constantly adding more universities. Let us know and we&apos;ll prioritize adding it to our platform.
        </p>
        <div className="mt-8">
            <Link href="/contact">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-200 rounded-full px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105">
                Contact Us
            </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
