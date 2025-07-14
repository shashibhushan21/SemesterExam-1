import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-8">About SemesterExam</h1>
      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            Our mission is to provide students with a centralized platform to access and share high-quality study materials. We believe in the power of collaborative learning and aim to make education more accessible for everyone, everywhere.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
