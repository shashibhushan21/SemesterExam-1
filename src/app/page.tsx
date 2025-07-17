
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, MoveRight } from 'lucide-react';
import { allNotes, allUniversities } from '@/lib/mock-data';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { UniversityCard } from '@/components/university-card';
import { FeatureCard } from '@/components/feature-card';
import { BookOpen, University, RefreshCw, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TestimonialCard } from '@/components/testimonial-card';
import { Skeleton } from '@/components/ui/skeleton';

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
};


export default function Home() {
  const universities = [...new Set(allNotes.map((note) => note.university))];
  const semesters = [...new Set(allNotes.map((note) => note.semester))];
  const subjects = [...new Set(allNotes.map((note) => note.subject))];

  const features = [
    {
      icon: BookOpen,
      title: 'All Semesters',
      description: 'From 1st to 8th semester – find notes sorted by semester and subject.',
      color: 'from-blue-500 to-purple-600',
    },
    {
      icon: University,
      title: 'University-Wise',
      description: 'Tailored to your syllabus, based on your university’s official curriculum.',
      color: 'from-purple-600 to-pink-600',
    },
    {
      icon: RefreshCw,
      title: 'Free & Regular Updates',
      description: '100% free and updated often to reflect the most current content.',
      color: 'from-pink-600 to-orange-500',
    },
  ];
  
  const testimonials = [
    {
      quote: "Best platform for quick exam prep!",
      author: "B.Tech Student",
    },
    {
      quote: "Notes are clean and to the point.",
      author: "B.Tech Student",
    },
    {
      quote: "It saved my semester!",
      author: "B.Tech Student",
    },
  ];

  const faqs = [
    {
      question: "Is this platform really free?",
      answer: "Yes, it's 100% free for all students."
    },
    {
      question: "Can I upload my own notes?",
      answer: "Absolutely! We encourage students to contribute their study materials to help the community. Just head over to the 'Upload' page."
    },
    {
      question: "How often are the notes updated?",
      answer: "Notes are updated regularly by our community of students and educators. We strive to provide the most current and relevant content."
    }
  ];

  return (
    <>
      <section className="relative w-full h-auto min-h-[calc(100vh-10rem)] flex items-center justify-center py-10 md:py-0">
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 w-full">
          <ClientOnly>
            <Carousel
              plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
              className="w-full max-w-5xl"
              opts={{ loop: true }}
            >
              <CarouselContent>
                <CarouselItem>
                  <div className="flex flex-col items-center justify-center p-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-down">
                      Find Notes by Semester & Subject
                    </h1>
                    <p className="mt-4 text-base sm:text-lg md:text-xl text-white/80 max-w-2xl animate-fade-in-up">
                      Access organized PDFs with smart filters and fast downloads.
                    </p>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex flex-col items-center justify-center p-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-down">
                      Thousands of Notes from Top Universities
                    </h1>
                    <p className="mt-4 text-base sm:text-lg md:text-xl text-white/80 max-w-2xl animate-fade-in-up">
                      Contributed by students just like you.
                    </p>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex flex-col items-center justify-center p-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-down">
                      Upload and Share
                    </h1>
                    <p className="mt-4 text-base sm:text-lg md:text-xl text-white/80 max-w-2xl animate-fade-in-up">
                      Help other students by sharing your study materials.
                    </p>
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </ClientOnly>

          <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ClientOnly>
                <Select>
                  <SelectTrigger className="h-12 bg-white text-black text-base transition-colors focus:bg-gray-200">
                    <SelectValue placeholder="Select University" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((uni) => (
                      <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="h-12 bg-white text-black text-base transition-colors focus:bg-gray-200">
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="h-12 bg-white text-black text-base transition-colors focus:bg-gray-200">
                    <SelectValue placeholder="Select Subject" />
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
              </ClientOnly>
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
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 animate-fade-in-up">
            Top Universities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allUniversities.map((uni, index) => (
              <UniversityCard key={index} {...uni} initials={getInitials(uni.name)} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4 animate-fade-in-up">
            Why Choose ExamNotes?
          </h2>
          <p className="text-center text-white/80 max-w-3xl mx-auto mb-12 animate-fade-in-up">
            Curated notes for every subject, categorized by semester and university, built to save your time and boost your exam preparation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 animate-fade-in-up">
            What Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ClientOnly>
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </ClientOnly>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 animate-fade-in-up">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <ClientOnly>
                <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="bg-gradient-to-r from-blue-800/20 via-purple-700/20 to-pink-600/20 border-white/10 rounded-xl shadow-lg transition-all duration-300 hover:bg-white/5">
                    <AccordionTrigger className="p-6 text-lg font-semibold text-white text-left hover:no-underline">
                        <div className="flex items-center gap-4">
                        <HelpCircle className="w-6 h-6 text-white/80" />
                        <span>{faq.question}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white/80">
                        {faq.answer}
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </ClientOnly>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-pink-600 via-purple-700 to-blue-800 rounded-2xl p-8 md:p-12 text-center text-white shadow-lg animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Join 10,000+ students using SemesterExam.com!</h2>
            <p className="mt-4 text-base md:text-lg text-white/80">Stay updated, study smarter, and score better in your exams.</p>
            <div className="mt-8">
              <Link href="/auth">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-200 rounded-full px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
