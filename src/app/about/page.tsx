import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Sparkles, GraduationCap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard = ({ icon: Icon, title, description, gradient }: FeatureCardProps) => (
  <div className={`relative rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-r ${gradient}`}>
    <Card className="bg-transparent border-0 text-white h-full">
      <CardHeader className="items-center text-center">
        <div className="p-4 bg-white/20 rounded-full mb-4">
          <Icon className="w-8 h-8" />
        </div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-white/80">
        <p>{description}</p>
      </CardContent>
    </Card>
  </div>
);

export default function AboutPage() {
  const features: FeatureCardProps[] = [
    {
      icon: CheckCircle2,
      title: "Trusted by Thousands",
      description: "Students across India rely on our notes and content.",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      icon: Sparkles,
      title: "Updated & Verified",
      description: "We keep our notes up-to-date with university curricula.",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      icon: GraduationCap,
      title: "Smart & Simple",
      description: "Easy access, beautiful UI, and effective learning tools.",
      gradient: "from-pink-600 to-orange-500",
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

      <div className="max-w-4xl mx-auto">
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
    </div>
  );
}
