import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  quote: string;
  author: string;
  color: string;
}

export function TestimonialCard({ quote, author, color }: TestimonialCardProps) {
  return (
    <Card className={cn(
      "relative flex flex-col items-center justify-center text-center p-8 rounded-2xl text-white border-0 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl",
      "bg-slate-900/50 backdrop-blur-sm"
    )}>
      <div className={cn("absolute inset-0 opacity-50 transition-opacity duration-300 group-hover:opacity-75 bg-gradient-to-br", color)}></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <CardContent className="relative z-10 p-0">
        <div className="mb-4">
          <Quote className="w-12 h-12 text-white/80 mx-auto" />
        </div>
        <blockquote className="text-xl font-medium">
          “{quote}”
        </blockquote>
        <p className="mt-4 text-white/70">— {author}</p>
      </CardContent>
    </Card>
  );
}
