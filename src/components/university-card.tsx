import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MoveRight } from 'lucide-react';

interface UniversityCardProps {
  initials: string;
  name: string;
  description: string;
}

export function UniversityCard({ initials, name, description }: UniversityCardProps) {
  return (
    <Link href={`/universities/${encodeURIComponent(name)}`} passHref className="group block relative rounded-xl transition-all duration-500 transform hover:-translate-y-2">
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 blur transition duration-500 group-hover:opacity-75"></div>
        <Card className="relative h-full flex flex-col bg-slate-900/80 backdrop-blur-sm text-white rounded-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-12 w-12 text-lg font-bold bg-gradient-to-r from-pink-500 to-orange-400 text-white">
                <AvatarFallback className="bg-transparent">{initials}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl font-bold leading-tight">{name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
            <CardDescription className="text-white/70 line-clamp-3">{description}</CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
                <div className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-pink-500/50 rounded-md py-2 px-4 text-center">
                    Explore
                    <MoveRight className="ml-2 h-4 w-4 inline transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </Card>
    </Link>
  );
}