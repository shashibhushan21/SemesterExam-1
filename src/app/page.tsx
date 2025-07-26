
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button, buttonVariants } from '@/components/ui/button';
import { Search, MoveRight } from 'lucide-react';
import { UniversityCard } from '@/components/university-card';
import { FeatureCard } from '@/components/feature-card';
import { BookOpen } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TestimonialCard } from '@/components/testimonial-card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Note, University, Feature, Testimonial, Faq } from '@/lib/types';
import { connectToDatabase } from '@/lib/db';
import NoteModel from '@/models/note';
import UniversityModel from '@/models/university';
import FeatureModel from '@/models/feature';
import TestimonialModel from '@/models/testimonial';
import FaqModel from '@/models/faq';
import { AuthButton } from '@/components/auth-button';
import { ClientOnly } from '@/components/client-only';
import { HeroCarousel } from '@/components/hero-carousel';


const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
};

async function getHomepageData() {
    try {
        await connectToDatabase();
        const [notes, universities, features, testimonials, faqs] = await Promise.all([
            NoteModel.find({}).sort({ createdAt: -1 }).limit(10).lean(),
            UniversityModel.find({}).limit(3).lean(),
            FeatureModel.find({}).lean(),
            TestimonialModel.find({}).lean(),
            FaqModel.find({}).lean(),
        ]);

        return {
            notes: JSON.parse(JSON.stringify(notes)),
            universities: JSON.parse(JSON.stringify(universities)),
            features: JSON.parse(JSON.stringify(features)),
            testimonials: JSON.parse(JSON.stringify(testimonials)),
            faqs: JSON.parse(JSON.stringify(faqs)),
        };
    } catch (error) {
        console.error("Failed to fetch homepage data", error);
        return { notes: [], universities: [], features: [], testimonials: [], faqs: [] };
    }
}


export default async function Home() {
  const { notes, universities, features, testimonials, faqs } = await getHomepageData();

  const availableUniversities = [...new Set(notes.map((note: Note) => note.university))];
  const semesters = [...new Set(notes.map((note: Note) => note.semester))];
  const subjects = [...new Set(notes.map((note: Note) => note.subject))];

  return (
    <>
      <section className="relative w-full h-auto min-h-[calc(100vh-10rem)] flex items-center justify-center py-10 md:py-0">
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 w-full">
          
           <HeroCarousel />
          
          <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
                <>
                  <Select>
                    <SelectTrigger className="h-12 bg-white text-black text-base transition-colors focus:bg-gray-200">
                      <SelectValue placeholder="Select University" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUniversities.map((uni) => (
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
                </>
              
            </div>
          </div>

          <div className="mt-8">
             <Link
              href="/universities"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'group bg-white text-primary rounded-full px-8 py-6 text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105'
              )}
            >
              Explore Universities
              <MoveRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
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
              {universities.map((uni, index) => (
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
            {features.map((feature: Feature, index) => {
                const Icon = (LucideIcons as any)[feature.icon] || BookOpen;
                return <FeatureCard key={index} {...feature} icon={Icon} />;
            })}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 animate-fade-in-up">
            What Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial: Testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 animate-fade-in-up">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq: Faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-gradient-to-r from-blue-800/20 via-purple-700/20 to-pink-600/20 border-white/10 rounded-xl shadow-lg transition-all duration-300 hover:bg-white/5">
                <AccordionTrigger className="p-6 text-lg font-semibold text-white text-left hover:no-underline">
                    <div className="flex items-center gap-4">
                      <span>{faq.question}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-white/80">
                    {faq.answer}
                </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-pink-600 via-purple-700 to-blue-800 rounded-2xl p-8 md:p-12 text-center text-white shadow-lg animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Join 10,000+ students using SemesterExam.com!</h2>
            <p className="mt-4 text-base md:text-lg text-white/80">Stay updated, study smarter, and score better in your exams.</p>
            <div className="mt-8">
              <ClientOnly>
                <AuthButton />
              </ClientOnly>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
