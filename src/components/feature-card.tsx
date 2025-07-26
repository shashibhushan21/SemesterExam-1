import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  const color = "from-blue-500 to-purple-600";
  return (
    <div className="group relative rounded-xl transition-all duration-500 transform hover:-translate-y-2">
       <div className={cn(
        "absolute -inset-0.5 rounded-xl bg-gradient-to-r opacity-0 blur transition duration-500 group-hover:opacity-75",
        color
      )}></div>
      <Card className="relative h-full flex flex-col items-center text-center bg-slate-900/80 backdrop-blur-sm text-white rounded-xl transition-all duration-300 p-6">
        <div className={cn(
          "flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r mb-6",
          color
        )}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <CardHeader className="p-0">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-2">
          <CardDescription className="text-white/70">{description}</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
