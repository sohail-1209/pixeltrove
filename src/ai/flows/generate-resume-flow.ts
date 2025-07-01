
'use server';
/**
 * @fileOverview An AI flow to generate a professional resume in HTML format.
 *
 * - generateResume - A function that generates resume content.
 * - GenerateResumeOutput - The return type for the generateResume function (string).
 */

import { ai } from '@/ai/genkit';
import { getProfileData } from '@/services/data';
import { socialLinks } from '@/lib/data';
import { z } from 'zod';

const GenerateResumeOutputSchema = z.string().describe("The full resume content in HTML format, enclosed in a single <div>.");
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
  prompt: `You are an expert resume writer. Your task is to generate a polished, one-page resume in HTML format for a developer named {{name}}, using only the information provided.
Your entire response MUST be the raw HTML content of a single \`<div>\` element with the class "resume-container".
Do NOT include the \`<html>\`, \`<head>\`, or \`<body>\` tags. Do NOT wrap the output in Markdown code fences (like \`\`\`html). Your output should begin directly with \`<div class="resume-container">\`.

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

**HTML Structure to fill:**

<div class="resume-container">
    <header class="resume-header">
        <h1>{{name}}</h1>
        <h2>{{title}}</h2>
        <div class="contact-info">
            <p>
                <span>{{email}}</span> &bull; <span>{{phone}}</span> &bull; <span>{{location}}</span>
            </p>
            <p>
                <a href="{{github}}">{{github}}</a> &bull; <a href="{{linkedin}}">LinkedIn</a> &bull; <a href="{{website}}">Portfolio</a>
            </p>
        </div>
    </header>

    <section class="resume-section">
        <h3>PROFESSIONAL SUMMARY</h3>
        <p>{{{summary}}}</p>
    </section>

    <section class="resume-section">
        <h3>SKILLS</h3>
        <ul class="skills-list">
            {{#each skills}}
            <li>{{this}}</li>
            {{/each}}
        </ul>
    </section>
    
    <section class="resume-section">
        <h3>PROJECTS / EXPERIENCE</h3>
        {{#each projects}}
        <div class="item">
            <h4>{{title}}</h4>
            <p>{{{description}}} (<strong>Tech:</strong> {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}) &mdash; <a href="{{link}}">View Project</a></p>
        </div>
        {{/each}}
    </section>

    <section class="resume-section">
        <h3>EDUCATION</h3>
        <div class="item">
            <h4>{{education.college}}</h4>
            <p><strong>{{education.degree}}</strong> | {{education.duration}}</p>
            <p><strong>CGPA:</strong> {{education.cgpa}}</p>
            <ul>
            {{#each education.notes}}
                <li>{{this}}</li>
            {{/each}}
            </ul>
        </div>
    </section>
    
    <section class="resume-section">
        <h3>LANGUAGES</h3>
        <p class="languages-list">
            {{#each languages}}
            <span><strong>{{language}}</strong> ({{proficiency}})</span>
            {{/each}}
        </p>
    </section>

    <section class="resume-section">
        <h3>INTERESTS</h3>
         <p>
            {{#each interests}}
            {{this}}{{#unless @last}}, {{/unless}}
            {{/each}}
        </p>
    </section>
</div>
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
        email: "sohailpashe@gmail.com",
        phone: "9553081586",
        location: "Hyderabad, Telangana",
        github: githubUrl,
        linkedin: "https://www.linkedin.com/in/sohail-pashe/",
        website: "https://github.com/sohail-1209",
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

    const MAX_RETRIES = 3;
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
        try {
            const response = await prompt(resumeData);
            let output = response.text;

            if (!output) {
                // This is a model failure, not a service error.
                // Let's retry as it might be a transient issue.
                throw new Error("Resume generation returned empty output.");
            }
            
            // Defensive cleanup to remove Markdown code fences if the model adds them
            output = output.trim().replace(/^```html\s*/, '').replace(/\s*```$/, '').trim();
            return output; // Success, exit loop

        } catch (error) {
            console.error(`Error in generateResumeFlow (Attempt ${attempt + 1}/${MAX_RETRIES}):`, error);
            const isRetriable = error instanceof Error && (error.message.includes('503') || error.message.includes("empty output"));
            
            if (isRetriable && attempt < MAX_RETRIES - 1) {
                attempt++;
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // wait 1s, 2s
            } else {
                // This was the last attempt or a non-retriable error
                if (error instanceof Error && error.message.includes('503')) {
                     return "<h2>Error: Service Unavailable</h2><p>The AI service is currently busy or overloaded. Please try again in a moment.</p>";
                }
                return "<h2>Error: Resume Generation Failed</h2><p>An unexpected error occurred while generating the resume. Please check the server logs for more details.</p>";
            }
        }
    }
    
    // This part should be unreachable if the loop logic is correct, but as a fallback:
    return "<h2>Error: Resume Generation Failed</h2><p>An unexpected error occurred after multiple retries. Please try again later.</p>";
  }
);
