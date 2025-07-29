
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { connectToDatabase } from '@/lib/db';
import Feature from '@/models/feature';
import About from '@/models/about';
import * as LucideIcons from 'lucide-react';

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

async function getAboutPageData() {
    try {
        await connectToDatabase();
        const about = await About.findOne().lean();
        const features = await Feature.find({}).limit(3).lean(); // Assuming we show 3 features
        return { 
            about: JSON.parse(JSON.stringify(about)),
            features: JSON.parse(JSON.stringify(features)) 
        };
    } catch (error) {
        console.error("Failed to fetch about page data", error);
        return { about: null, features: [] };
    }
}


export default async function AboutPage() {
  const { about, features } = await getAboutPageData();

  if (!about) {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white text-center">
            <h1 className="text-4xl font-bold">About Page Not Configured</h1>
            <p className="mt-4 text-lg">Please visit the admin panel to set up the content for this page.</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="text-center mb-16 animate-fade-in-down">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          {about.title}
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-white/80">
          {about.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {features.map((feature: any, index: number) => {
            const Icon = (LucideIcons as any)[feature.icon] || CheckCircle2;
            return <FeatureCard key={index} {...feature} icon={Icon} />;
        })}
      </div>

      <div className="max-w-4xl mx-auto mb-20">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-white/10 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold">{about.missionTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg md:text-xl text-center text-white/80 leading-relaxed">
              {about.missionContent}
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

    