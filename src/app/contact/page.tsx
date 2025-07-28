
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, Info, Handshake, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactDetailsData {
    email: string;
    phone: string;
    address: string;
}

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [contactDetails, setContactDetails] = useState<ContactDetailsData | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    async function fetchContactDetails() {
      try {
        setLoadingDetails(true);
        const res = await fetch('/api/admin/settings/contact');
        if (!res.ok) throw new Error('Failed to load contact info.');
        const data = await res.json();
        setContactDetails(data.contactDetails);
      } catch (error) {
        toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
      } finally {
        setLoadingDetails(false);
      }
    }
    fetchContactDetails();
  }, [toast]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      toast({
        title: 'Message Sent!',
        description: "We've received your message and will get back to you shortly.",
      });
      reset();

    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const detailsList = [
    { icon: Mail, text: contactDetails?.email },
    { icon: Phone, text: contactDetails?.phone },
    { icon: MapPin, text: contactDetails?.address },
  ];

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
                {loadingDetails ? (
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-12 w-2/3" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : (
                  <ul className="space-y-6">
                    {detailsList.map((detail, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="p-2 bg-primary/20 border border-primary/30 rounded-lg">
                          <detail.icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-lg text-white/90 pt-1">{detail.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              <div className="p-4 bg-white/10 rounded-lg flex items-start gap-4">
                <Info className="w-5 h-5 text-white/80 mt-1 flex-shrink-0" />
                <p className="text-white/70">
                  We typically respond within 24-48 hours. For urgent matters, please email us directly.
                </p>
              </div>
            </div>

            {isMounted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/80">Your Name</Label>
                    <Input id="name" placeholder="Your Name" {...register('name')} className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/80">Your Email</Label>
                    <Input id="email" type="email" placeholder="Your Email" {...register('email')} className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-white/80">Subject</Label>
                  <Input id="subject" placeholder="Subject" {...register('subject')} className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                  {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white/80">Your Message</Label>
                  <Textarea id="message" placeholder="Your Message" rows={5} {...register('message')} className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                  {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                </div>
                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/50">
                  {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            ) : (
               <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-16 text-center">
        <Card className="max-w-3xl mx-auto bg-slate-900/50 backdrop-blur-sm border-white/10 p-8">
            <CardContent className="p-0">
                <div className="flex justify-center mb-4">
                    <Handshake className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Want to partner or collaborate?</h2>
                <p className="text-white/70 mb-6 max-w-xl mx-auto">
                    We're open to working with universities, educators, and developers who share our passion for accessible education.
                </p>
                <Link href={`mailto:${contactDetails?.email || 'collab@semesterexam.com'}`} className="font-semibold text-primary hover:text-primary/80 transition-colors text-lg">
                    {contactDetails?.email || 'collab@semesterexam.com'}
                </Link>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
