
'use client';

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function HeroCarousel() {
  return (
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
  );
}
