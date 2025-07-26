
import { University } from '@/lib/types';
import { connectToDatabase } from '@/lib/db';
import UniversityModel from '@/models/university';
import { UniversitiesClient } from './components/universities-client';

async function getUniversities(): Promise<University[]> {
    try {
        await connectToDatabase();
        const universities = await UniversityModel.find({}).sort({ name: 1 }).lean();
        return JSON.parse(JSON.stringify(universities));
    } catch (error) {
        console.error("Failed to fetch universities:", error);
        return [];
    }
}

export default async function UniversitiesPage() {
  const universities = await getUniversities();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="text-center mb-12 animate-fade-in-down">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Explore Universities</h1>
        <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
          Find your university and access curated B.Tech notes aligned to the syllabus.
        </p>
      </div>

      <UniversitiesClient universities={universities} />

    </div>
  );
}
