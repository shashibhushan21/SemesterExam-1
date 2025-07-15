import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, Info } from 'lucide-react';

const contactDetails = [
  {
    icon: Mail,
    text: 'info@semesterexam.com',
  },
  {
    icon: Phone,
    text: '+91 98765 43210',
  },
  {
    icon: MapPin,
    text: '4th Floor, Tech Tower, Sector V, Salt Lake, Kolkata, WB 700091',
  },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white animate-fade-in-down">Get in Touch</h1>
        <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto animate-fade-in-up">
          Have questions, suggestions, or feedback? We're here to help. Contact us anytime!
        </p>
      </div>

      <Card className="max-w-5xl mx-auto bg-slate-900/50 backdrop-blur-sm border-white/10">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <ul className="space-y-6">
                {contactDetails.map((detail, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-primary/20 border border-primary/30 rounded-lg">
                      <detail.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-lg text-white/90 pt-1">{detail.text}</span>
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-white/10 rounded-lg flex items-start gap-4">
                <Info className="w-5 h-5 text-white/80 mt-1 flex-shrink-0" />
                <p className="text-white/70">
                  We typically respond within 24-48 hours. For urgent matters, please email us directly.
                </p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80">Your Name</Label>
                  <Input id="name" placeholder="Your Name" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">Your Email</Label>
                  <Input id="email" type="email" placeholder="Your Email" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white/80">Subject</Label>
                <Input id="subject" placeholder="Subject" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-white/80">Your Message</Label>
                <Textarea id="message" placeholder="Your Message" rows={5} className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
              </div>
              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/50">
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
