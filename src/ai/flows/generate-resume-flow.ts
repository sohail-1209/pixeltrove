'use server';
/**
 * @fileOverview An AI flow to generate a professional resume in Markdown format.
 *
 * - generateResume - A function that generates resume content.
 * - GenerateResumeOutput - The return type for the generateResume function (string).
 */

import { ai } from '@/ai/genkit';
import { getProfileData } from '@/services/data';
import { socialLinks } from '@/lib/data';
import { z } from 'zod';

const GenerateResumeOutputSchema = z.string().describe("The full resume content in Markdown format.");
export type GenerateResumeOutput = z.infer<typeof GenerateResumeOutputSchema>;

export async function generateResume(): Promise<GenerateResumeOutput> {
  return generateResumeFlow();
}

const GenerateResumeInputSchema = z.object({
    name: z.string(),
    title: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    github: z.string(),
    linkedin: z.string(),
    website: z.string(),
    summary: z.string(),
    education: z.object({
        degree: z.string(),
        college: z.string(),
        duration: z.string(),
        cgpa: z.string(),
        notes: z.array(z.string()),
    }),
    languages: z.array(z.object({
        language: z.string(),
        proficiency: z.string(),
    })),
    interests: z.array(z.string()),
    skills: z.array(z.string()),
    projects: z.array(z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        link: z.string(),
    })),
});


const prompt = ai.definePrompt({
  name: 'generateResumePrompt',
  input: { schema: GenerateResumeInputSchema },
  // By removing the output schema, we can handle cases where the model returns null
  // or non-string data without causing a validation error.
  prompt: `You are a professional resume writer. Generate a polished, one-page resume in Markdown format for a developer named {{name}}, using only the information provided below.

The resume must include these sections in this order:
1.  **Header**: Name, Title, and all contact information (Email, Phone, Location, GitHub, LinkedIn, Portfolio Website).
2.  **Professional Summary**: Use the summary provided.
3.  **Skills**: List of key technical skills.
4.  **Projects / Experience**: List of projects. For each project, include the title, a brief description, the technologies used (tags), and a link.
5.  **Education**: Details of their degree, college, and academic performance.
6.  **Languages**: List of known languages and their proficiency.
7.  **Interests**: List of personal interests.

---
**Resume Information:**

**Personal Details:**
- **Name**: {{name}}
- **Title**: {{title}}
- **Email**: {{email}}
- **Phone**: {{phone}}
- **Location**: {{location}}
- **GitHub**: {{github}}
- **LinkedIn**: {{linkedin}}
- **Portfolio Website**: {{website}}

**Professional Summary:**
{{{summary}}}

**Education:**
- **Degree**: {{education.degree}}
- **College**: {{education.college}}
- **Duration**: {{education.duration}}
- **CGPA**: {{education.cgpa}}
- **Notes**:
{{#each education.notes}}
  - {{this}}
{{/each}}

**Skills:**
{{#each skills}}
- {{this}}
{{/each}}

**Projects:**
{{#each projects}}
- **{{title}}**: {{description}} (Tech: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}) - [View Project]({{link}})
{{/each}}

**Languages:**
{{#each languages}}
- {{language}} ({{proficiency}})
{{/each}}

**Interests:**
{{#each interests}}
- {{this}}
{{/each}}
---

Now, generate the complete resume in well-formatted, professional Markdown. Do not add any information not provided above.
`,
});

const generateResumeFlow = ai.defineFlow(
  {
    name: 'generateResumeFlow',
    inputSchema: z.void(),
    outputSchema: GenerateResumeOutputSchema,
  },
  async () => {
    const { skills, projects } = await getProfileData();
    const githubUrl = socialLinks.find(l => l.name === 'GitHub')?.url || 'https://github.com/sohail-1209';

    const resumeData = {
        name: "Mohammad Sohail Pashe",
        title: "Front-end Developer",
        email: "SohelPashe@gmail.com",
        phone: "9553081586",
        location: "Hyderabad, Telangana",
        github: githubUrl,
        linkedin: "[To be updated]",
        website: "https://github.com/sohail-1209", // Placeholder
        summary: "Frontend Developer passionate about crafting responsive, user-friendly interfaces using React, HTML, CSS, and Firebase. Eager to contribute to innovative web applications and constantly improve through learning.",
        education: {
            degree: "B.Tech in CST (AI & ML)",
            college: "Shadan College of Engineering and Technology",
            duration: "2023 – 2027",
            cgpa: "9.0",
            notes: ["Participated in multiple hackathons"],
        },
        languages: [
            { language: "English", proficiency: "Fluent" },
            { language: "Telugu", proficiency: "Fluent" },
            { language: "Hindi", proficiency: "Fluent" },
            { language: "Urdu", proficiency: "Basic" },
        ],
        interests: ["UI Design", "Gaming"],
        skills,
        projects: projects.map(({title, description, tags, link}) => ({title, description, tags, link})),
    };

    const response = await prompt(resumeData);

    const output = response.text;

    if (!output) {
        console.error("Resume generation failed: AI returned null or empty output.");
        return "## Error: Resume Generation Failed\n\nThe AI was unable to generate the resume content at this time. This could be due to a temporary service issue. Please try again later.";
    }

    return output;
  }
);
