import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, University, GraduationCap, Star, Shield, Zap, GitBranch } from "lucide-react";

const mockUser = {
  fullName: "Shashi Bhushan Kumar",
  avatar: "https://i.pravatar.cc/150?img=5",
  email: "shashi@example.com",
  phone: "+91 9876543210",
  university: "West Bengal University of Technology",
  branch: "Computer Science",
  semester: "6th",
};

const featureCards = [
  {
    icon: Star,
    title: "Premium Access",
    description: "Unlock exclusive notes, summaries, and more.",
    cta: "Upgrade Now",
  },
  {
    icon: Shield,
    title: "Account Security",
    description: "Manage your password and secure your account.",
    cta: "Manage Settings",
  },
  {
    icon: Zap,
    title: "Boost Productivity",
    description: "Get AI-powered tools to accelerate your learning.",
    cta: "Explore Tools",
  },
];


export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24 border-4 border-primary">
          <AvatarImage src={mockUser.avatar} alt={mockUser.fullName} />
          <AvatarFallback className="text-3xl">{mockUser.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold font-headline">{mockUser.fullName}</h1>
          <p className="text-muted-foreground text-lg">Your personal dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <CardHeader>
              <CardTitle className="font-headline">Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{mockUser.email}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{mockUser.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <University className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{mockUser.university}</span>
              </div>
              <div className="flex items-center gap-4">
                <GitBranch className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{mockUser.branch}</span>
              </div>
               <div className="flex items-center gap-4">
                <GraduationCap className="w-5 h-5 text-muted-foreground" />
                <Badge variant="secondary">{mockUser.semester} Semester</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
           {featureCards.map((feature, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-xl hover:scale-105">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="p-2 bg-accent/50 rounded-full">
                  <feature.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <Button variant="outline" className="w-full">{feature.cta}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
