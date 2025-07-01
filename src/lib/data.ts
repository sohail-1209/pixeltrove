
import { Github, Instagram, Mail } from 'lucide-react';

export type Project = {
  id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  aiHint: string;
};

export const skills = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'GraphQL', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Figma', 'Firebase'
];

export const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/sohail-1209',
    icon: Github,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/_sohail_beast',
    icon: Instagram,
  },
  {
    name: 'Email',
    url: 'mailto:sohailpashe@gmail.com',
    icon: Mail,
  },
];
