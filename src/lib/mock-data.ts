import type { Note, University } from './types';

export const allUniversities: University[] = [
  {
    name: 'West Bengal University of Technology',
    location: 'West Bengal, India',
    description: 'MAKAUT offers a comprehensive range of technical and professional courses, with a strong emphasis on quality education and research.',
    bannerUrl: 'https://placehold.co/1200x300.png'
  },
  {
    name: 'Dr. A.P.J. Abdul Kalam Technical University',
    location: 'Uttar Pradesh, India',
    description: 'AKTU is one of the largest technical universities in India, with over 800 affiliated institutions spread across the state.',
    bannerUrl: 'https://placehold.co/1200x300.png'
  },
  {
    name: 'Visvesvaraya Technological University',
    location: 'Karnataka, India',
    description: 'VTU offers advanced technical education and promotes innovation through its extensive research facilities and academic structure.',
    bannerUrl: 'https://placehold.co/1200x300.png'
  },
  {
    name: 'Biju Patnaik University of Technology',
    location: 'Odisha, India',
    description: 'BPUT governs the technical education system in Odisha and ensures standard academic performance across all its colleges.',
    bannerUrl: 'https://placehold.co/1200x300.png'
  },
  {
    name: 'Bihar Engineering University',
    location: 'Bihar, India',
    description: 'BEU coordinates engineering education in Bihar and is responsible for overseeing academic quality and new curriculum development.',
    bannerUrl: 'https://placehold.co/1200x300.png'
  },
  {
    name: 'XYZ University',
    location: 'Anytown, USA',
    description: 'XYZ University is known for its innovative approach to education and research, offering a wide range of undergraduate and postgraduate programs.',
    bannerUrl: 'https://placehold.co/1200x300.png'
  }
];

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
    pdfUrl: 'https://pdfobject.com/pdf/sample.pdf',
    content: 'In mathematics, a differential equation is an equation that relates one or more unknown functions and their derivatives. In applications, the functions generally represent physical quantities, the derivatives represent their rates of change, and the differential equation defines a relationship between the two. Such relations are common; therefore, differential equations play a prominent role in many disciplines including engineering, physics, economics, and biology.',
    branch: 'Science'
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
    pdfUrl: 'https://pdfobject.com/pdf/sample.pdf',
    content: 'Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science.',
    branch: 'Science'
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
    pdfUrl: 'https://pdfobject.com/pdf/sample.pdf',
    content: 'In computer science, a data structure is a data organization, management, and storage format that is usually chosen for efficient access to data. More precisely, a data structure is a collection of data values, the relationships among them, and the functions or operations that can be applied to the data.',
    branch: 'Computer Science'
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
    pdfUrl: 'https://pdfobject.com/pdf/sample.pdf',
    content: 'Organic chemistry is a subdiscipline within chemistry that involves the scientific study of the structure, properties, and reactions of organic compounds and organic materials, i.e., matter in its various forms that contain carbon atoms. Study of structure determines their structural formula. Study of properties includes physical and chemical properties, and evaluation of chemical reactivity to understand their behavior.',
    branch: 'Chemistry'
  },
  {
    id: '5',
    title: 'General Engineering Syllabus (All Universities)',
    university: 'All Universities',
    subject: 'General',
    semester: 'All Semesters',
    author: 'ExamNotes Team',
    authorAvatar: 'https://placehold.co/100x100.png',
    uploadDate: '2024-05-20',
    summary: 'A comprehensive, generalized syllabus for first-year engineering students, applicable across multiple universities.',
    rating: 4.5,
    thumbnailUrl: 'https://placehold.co/400x300.png',
    pdfUrl: 'https://pdfobject.com/pdf/sample.pdf',
    content: 'This document provides a generalized overview of the typical first-year engineering curriculum. It covers fundamental subjects like Mathematics, Physics, Chemistry, and basic programming concepts. This syllabus is intended as a guide and may not perfectly match the curriculum of your specific university.',
    branch: 'All Branches'
  },
  {
    id: '6',
    title: 'Theory of Automata & Formal Languages',
    university: 'Dr. A.P.J. Abdul Kalam Technical University',
    subject: 'Computer Science',
    semester: '5th Semester',
    author: 'AKTU Student',
    authorAvatar: 'https://placehold.co/100x100.png',
    uploadDate: '2024-06-10',
    summary: 'Notes on automata theory, regular expressions, context-free grammars, and Turing machines for AKTU students.',
    rating: 4.8,
    thumbnailUrl: 'https://placehold.co/400x300.png',
    pdfUrl: 'https://pdfobject.com/pdf/sample.pdf',
    content: 'This course introduces the fundamental concepts of automata theory and formal languages including grammar, finite automaton, regular expression, formal language, pushdown automaton, and Turing machine. Not only do they form basic models of computation, they are also the foundation of many branches of computer science, e.g. compilers, software engineering, concurrent systems, etc.',
    branch: 'CSE'
  }
];
