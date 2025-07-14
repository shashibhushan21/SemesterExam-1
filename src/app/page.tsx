
'use client';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, MoveRight } from 'lucide-react';
import { allNotes } from '@/lib/mock-data';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { UniversityCard } from '@/components/university-card';


export default function Home() {
  const universities = [...new Set(allNotes.map((note) => note.university))];
  const semesters = [...new Set(allNotes.map((note) => note.semester))];
  const subjects = [...new Set(allNotes.map((note) => note.subject))];

  const featuredUniversities = [
    {
      initials: 'MA',
      name: 'West Bengal University of Technology',
      description: 'MAKAUT offers a comprehensive range of technical and professional courses, with a strong emphasis on quality education and research.',
    },
    {
      initials: 'AK',
      name: 'Dr. A.P.J. Abdul Kalam Technical University',
      description: 'AKTU is one of the largest technical universities in India, with over 800 affiliated institutions spread across the state.',
    },
    {
      initials: 'VT',
      name: 'Visvesvaraya Technological University',
      description: 'VTU offers advanced technical education and promotes innovation through its extensive research facilities and academic structure.',
    },
    {
      initials: 'BP',
      name: 'Biju Patnaik University of Technology',
      description: 'BPUT governs the technical education system in Odisha and ensures standard academic performance across all its colleges.',
    },
    {
      initials: 'BE',
      name: 'Bihar Engineering University',
      description: 'BEU coordinates engineering education in Bihar and is responsible for overseeing academic quality and new curriculum development.',
    },
    {
      initials: 'XY',
      name: 'XYZ University',
      description: 'XYZ University is known for its innovative approach to education and research, offering a wide range of undergraduate and postgraduate programs.',
    }
  ];


  return (
    <>
      <section className="relative w-full h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <Carousel
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
            className="w-full max-w-5xl"
            opts={{ loop: true }}
          >
            <CarouselContent>
              <CarouselItem>
                <div className="flex flex-col items-center justify-center p-4">
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in-down">
                    Find Notes by Semester & Subject
                  </h1>
                  <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl animate-fade-in-up">
                    Access organized PDFs with smart filters and fast downloads.
                  </p>
                </div>
              </CarouselItem>
              <CarouselItem>
                 <div className="flex flex-col items-center justify-center p-4">
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in-down">
                    Explore Thousands of Notes
                  </h1>
                  <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl animate-fade-in-up">
                    Contributed by students from top universities.
                  </p>
                </div>
              </CarouselItem>
              <CarouselItem>
                 <div className="flex flex-col items-center justify-center p-4">
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in-down">
                    Upload and Share
                  </h1>
                  <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl animate-fade-in-up">
                    Help other students by sharing your study materials.
                  </p>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/30 border-none" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/30 border-none" />
          </Carousel>


          <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <Select>
                <SelectTrigger className="h-12 bg-white text-black text-base transition-colors">
                  <SelectValue placeholder="Select University" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((uni) => (
                    <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="h-12 bg-white text-black text-base transition-colors">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <Select>
                <SelectTrigger className="h-12 bg-white text-black text-base transition-colors">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="lg" className="h-12 bg-white text-primary hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/universities">
               <Button size="lg" className="group bg-white text-primary rounded-full px-8 py-6 text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                Explore Universities
                <MoveRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredUniversities.map((uni, index) => (
              <UniversityCard key={index} {...uni} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
