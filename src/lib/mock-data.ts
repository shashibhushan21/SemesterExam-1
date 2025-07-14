import type { Note } from './types';

export const allNotes: Note[] = [
  {
    id: '1',
    title: 'Advanced Calculus Lecture Notes',
    university: 'Stanford University',
    subject: 'Mathematics',
    semester: 'Fall 2023',
    author: 'Dr. Emily Carter',
    authorAvatar: 'https://placehold.co/100x100.png',
    uploadDate: '2023-10-15',
    summary: 'Comprehensive lecture notes covering multivariable calculus, vector analysis, and differential equations.',
    rating: 4.8,
    thumbnailUrl: 'https://placehold.co/400x300.png',
    content: 'In mathematics, a differential equation is an equation that relates one or more unknown functions and their derivatives. In applications, the functions generally represent physical quantities, the derivatives represent their rates of change, and the differential equation defines a relationship between the two. Such relations are common; therefore, differential equations play a prominent role in many disciplines including engineering, physics, economics, and biology.'
  },
  {
    id: '2',
    title: 'Intro to Quantum Physics',
    university: 'MIT',
    subject: 'Physics',
    semester: 'Spring 2024',
    author: 'Prof. David Griffith',
    authorAvatar: 'https://placehold.co/100x100.png',
    uploadDate: '2024-03-22',
    summary: 'An introductory course on quantum mechanics, covering wave-particle duality, the Schrödinger equation, and quantum tunneling.',
    rating: 4.9,
    thumbnailUrl: 'https://placehold.co/400x300.png',
    content: 'Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science.'
  },
  {
    id: '3',
    title: 'Data Structures & Algorithms',
    university: 'UC Berkeley',
    subject: 'Computer Science',
    semester: 'Fall 2023',
    author: 'Jane Doe',
    authorAvatar: 'https://placehold.co/100x100.png',
    uploadDate: '2023-11-05',
    summary: 'A complete guide to common data structures and algorithms, with examples in Python.',
    rating: 4.7,
    thumbnailUrl: 'https://placehold.co/400x300.png',
    content: 'In computer science, a data structure is a data organization, management, and storage format that is usually chosen for efficient access to data. More precisely, a data structure is a collection of data values, the relationships among them, and the functions or operations that can be applied to the data.'
  },
  {
    id: '4',
    title: 'Organic Chemistry Reactions',
    university: 'Harvard University',
    subject: 'Chemistry',
    semester: 'Spring 2024',
    author: 'John Smith',
    authorAvatar: 'https://placehold.co/100x100.png',
    uploadDate: '2024-04-01',
    summary: 'A summary of key organic chemistry reactions, mechanisms, and synthesis pathways.',
    rating: 4.6,
    thumbnailUrl: 'https://placehold.co/400x300.png',
    content: 'Organic chemistry is a subdiscipline within chemistry that involves the scientific study of the structure, properties, and reactions of organic compounds and organic materials, i.e., matter in its various forms that contain carbon atoms. Study of structure determines their structural formula. Study of properties includes physical and chemical properties, and evaluation of chemical reactivity to understand their behavior.'
  },
];
