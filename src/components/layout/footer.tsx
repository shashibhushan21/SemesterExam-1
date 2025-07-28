
'use client';

import Link from 'next/link';
import { Logo } from '../logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Facebook, Instagram, Mail, Send, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Footer() {
  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/universities', label: 'Universities' },
    { href: '/courses', label: 'Semesters' },
    { href: '/upload', label: 'Updates' },
  ];

  const supportLinks = [
    { href: '/contact', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
    { href: '/contact', label: 'Terms of Use' },
    { href: '/contact', label: 'Privacy Policy' },
  ];

  const socialLinks = [
    { icon: Mail, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Facebook, href: '#' },
  ];

  return (
    <footer className="bg-slate-900/80 backdrop-blur-sm mt-auto text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="md:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-bold tracking-tight text-white">SemesterExam.com</h2>
            <p className="mt-4 text-white/70">
              Trusted by thousands of students for fast, reliable B.Tech notes. Save time, boost scores, and stay exam-ready with our regularly updated content.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="mt-4 space-y-2">
              {supportLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Subscribe</h3>
            <p className="mt-4 text-white/70">Get updates on new notes and upcoming exams.</p>
             <form className="mt-4 flex gap-2" suppressHydrationWarning>
                <Input type="email" placeholder="Your email" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                <Button type="submit" size="icon" className="bg-pink-600 hover:bg-pink-700 flex-shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            <div className="flex mt-4 space-x-4">
              {socialLinks.map((social, index) => (
                <Link key={index} href={social.href} className="text-white/70 hover:text-white transition-colors">
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/20 pt-8 text-center text-white/50">
          <p>&copy; {new Date().getFullYear()} SemesterExam.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
