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

const prompt = ai.definePrompt({
  name: 'generateResumePrompt',
  input: { schema: z.object({
      name: z.string(),
      email: z.string(),
      github: z.string(),
      instagram: z.string(),
      skills: z.array(z.string()),
      projects: z.array(z.object({
          title: z.string(),
          description: z.string(),
          tags: z.array(z.string()),
          link: z.string(),
      })),
  })},
  output: { schema: GenerateResumeOutputSchema },
  prompt: `You are a professional resume writer for a creative developer named {{name}}.
Generate a concise, professional, one-page resume in Markdown format based on the provided information.

The resume should have the following sections:
1.  **Header**: Name, email, and links to GitHub and Instagram.
2.  **Summary**: A 2-3 sentence professional summary highlighting their passion for building beautiful and functional web applications.
3.  **Skills**: A list of their key technical skills.
4.  **Projects / Experience**: A list of their projects. For each project, include the title, a brief description, the technologies used (tags), and a link to view the project.
5.  **Contact**: Reiterate the contact information.

---
**Resume Information:**
- **Name**: {{name}}
- **Email**: {{email}}
- **GitHub**: {{github}}
- **Instagram**: {{instagram}}

**Skills:**
{{#each skills}}
- {{this}}
{{/each}}

**Projects:**
{{#each projects}}
- **{{title}}**: {{description}} (Tech: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}) - [View Project]({{link}})
{{/each}}
---

Now, generate the complete resume in well-formatted Markdown.
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

    const email = socialLinks.find(l => l.name === 'Email')?.url.replace('mailto:', '') || '';
    const github = socialLinks.find(l => l.name === 'GitHub')?.url || '';
    const instagram = socialLinks.find(l => l.name === 'Instagram')?.url || '';

    const { output } = await prompt({
        name: "Sohail",
        email,
        github,
        instagram,
        skills,
        projects: projects.map(({title, description, tags, link}) => ({title, description, tags, link})),
    });

    if (!output) {
        console.error("Resume generation failed: AI returned null output.");
        return "## Error: Resume Generation Failed\n\nThe AI was unable to generate the resume content at this time. This could be due to a temporary service issue. Please try again later.";
    }

    return output;
  }
);
