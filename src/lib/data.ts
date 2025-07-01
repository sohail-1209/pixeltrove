
import { Github, Linkedin, Mail } from 'lucide-react';

export type Project = {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  aiHint: string;
};

export const projects: Project[] = [
  {
    title: 'Project Alpha',
    description: 'A cutting-edge web application designed to streamline project management and collaboration. Built with a focus on performance and user experience.',
    image: 'https://placehold.co/600x400.png',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    link: '#',
    aiHint: 'abstract technology'
  },
  {
    title: 'Project Beta',
    description: 'An e-commerce platform with a minimalist design, providing a seamless shopping experience. Features include product filtering, and a secure checkout process.',
    image: 'https://placehold.co/600x400.png',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
    link: '#',
    aiHint: 'minimalist shopping'
  },
  {
    title: 'Project Gamma',
    description: 'A data visualization dashboard that presents complex datasets in an intuitive and interactive manner. Users can explore data through dynamic charts and graphs.',
    image: 'https://placehold.co/600x400.png',
    tags: ['D3.js', 'React', 'Firebase', 'GraphQL'],
    link: '#',
    aiHint: 'data dashboard'
  },
  {
    title: 'Project Delta',
    description: 'A mobile-first social networking app for creative professionals to showcase their work and connect with peers. Features real-time chat and a discovery feed.',
    image: 'https://placehold.co/600x400.png',
    tags: ['React Native', 'Firebase', 'Algolia', 'Figma'],
    link: '#',
    aiHint: 'mobile application'
  },
];

export const skills = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'GraphQL', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Figma', 'Firebase'
];

export const socialLinks = [
  {
    name: 'GitHub',
    url: '#',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    url: '#',
    icon: Linkedin,
  },
  {
    name: 'Email',
    url: 'mailto:hello@example.com',
    icon: Mail,
  },
];
