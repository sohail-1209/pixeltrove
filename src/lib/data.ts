
import { Github, Linkedin, Mail } from 'lucide-react';

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
