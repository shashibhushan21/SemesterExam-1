import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Sparkles, GraduationCap, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <Card className="bg-slate-900/50 backdrop-blur-sm border-white/10 shadow-lg transition-all duration-300 transform hover:-translate-y-2 h-full">
    <CardHeader className="items-center text-center">
      <div className="p-4 bg-primary/20 rounded-full mb-4 border border-primary/30">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-center text-white/80">
      <p>{description}</p>
    </CardContent>
  </Card>
);

export default function AboutPage() {
  const features: FeatureCardProps[] = [
    {
      icon: CheckCircle2,
      title: "Trusted by Thousands",
      description: "Students across India rely on our notes and content.",
    },
    {
      icon: Sparkles,
      title: "Updated & Verified",
      description: "We keep our notes up-to-date with university curricula.",
    },
    {
      icon: GraduationCap,
      title: "Smart & Simple",
      description: "Easy access, beautiful UI, and effective learning tools.",
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="text-center mb-16 animate-fade-in-down">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Empowering Students Through Smart Learning
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-white/80">
          At SemesterExam, we provide high-quality academic resources designed to help students across
          universities succeed with ease and confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>

      <div className="max-w-4xl mx-auto mb-20">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-white/10 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg md:text-xl text-center text-white/80 leading-relaxed">
              Our mission is to provide students with a centralized platform to access and share high-quality study materials. We believe in the power of collaborative learning and aim to make education more accessible for everyone, everywhere.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Card className="bg-gradient-to-r from-pink-600 via-purple-700 to-blue-800 p-8 md:p-12 rounded-2xl shadow-lg">
            <CardContent className="p-0">
                <h2 className="text-3xl font-bold text-white mb-4">Have Questions?</h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                    We're here to help! If you have any questions or need support, don't hesitate to reach out.
                </p>
                <Link href="/contact">
                  <Button size="lg" className="group bg-white text-primary rounded-full px-8 py-6 text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                    Contact Us
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
