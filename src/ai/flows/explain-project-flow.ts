'use server';
/**
 * @fileOverview An AI flow to explain a software project based on its website content.
 *
 * - explainProject - A function that generates an explanation for a project.
 * - ExplainProjectInput - The input type for the explainProject function.
 * - ExplainProjectOutput - The return type for the explainProject function.
 */

import {ai} from '@/ai/genkit';
import {scrapeWebsite} from '@/services/web-scraper';
import {z} from 'genkit';

const ExplainProjectInputSchema = z.object({
  projectUrl: z.string().url().describe('The URL of the project website.'),
  title: z.string().describe('The title of the project.'),
  description: z.string().describe('A short description of the project.'),
  tags: z.array(z.string()).describe('A list of technologies used in the project.'),
});
export type ExplainProjectInput = z.infer<typeof ExplainProjectInputSchema>;

const ExplainProjectOutputSchema = z.object({
  summary: z.string().describe("A one-sentence summary of the project's main purpose."),
  features: z.array(z.string()).describe("A list of 3-4 key features or user actions."),
  techStack: z.string().describe("A concluding sentence that highlights the key technologies used, if they can be inferred from the text."),
});
export type ExplainProjectOutput = z.infer<typeof ExplainProjectOutputSchema>;

export async function explainProject(input: ExplainProjectInput): Promise<ExplainProjectOutput> {
  return explainProjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainProjectPrompt',
  input: {schema: z.object({
    title: z.string(),
    websiteContent: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })},
  output: {schema: ExplainProjectOutputSchema},
  prompt: `You are a tech expert and portfolio reviewer.
Your goal is to generate a concise and insightful explanation of a software project, structured into the output format.

{{#if websiteContent}}
You are explaining "{{{title}}}".
Base your explanation primarily on the following text content scraped from its website.
---
{{{websiteContent}}}
---
{{else}}
You are explaining "{{{title}}}".
The project's website could not be automatically read, so you will base your explanation on the following metadata provided by the user.
Description: {{{description}}}
Technologies: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

Based on the information available, please provide:
1. A one-sentence summary of the project's main purpose.
2. A list of 3-4 key features or actions a user can perform.
3. A concluding sentence that highlights the key technologies used. If you cannot determine the technologies from the text, use the provided tags or make a best guess.
`,
});

const explainProjectFlow = ai.defineFlow(
  {
    name: 'explainProjectFlow',
    inputSchema: ExplainProjectInputSchema,
    outputSchema: ExplainProjectOutputSchema,
  },
  async ({projectUrl, title, description, tags}) => {
    const websiteContent = await scrapeWebsite(projectUrl);
    
    const promptData = (websiteContent.startsWith('Error:') || !websiteContent.trim())
      ? {title, description, tags}
      : {title, websiteContent};

    if (promptData.description) {
      console.log(`Scraping failed for ${projectUrl}. Falling back to metadata.`);
    }

    const MAX_RETRIES = 3;
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        const {output} = await prompt(promptData);
        if (!output) {
          throw new Error("AI explanation returned empty output.");
        }
        return output; // Success
      } catch (error) {
        console.error(`Error in explainProjectFlow (Attempt ${attempt + 1}/${MAX_RETRIES}):`, error);
        const isRetriable = error instanceof Error && (error.message.includes('503') || error.message.includes("empty output"));
        
        if (isRetriable && attempt < MAX_RETRIES - 1) {
          attempt++;
          // Exponential backoff: wait 1s, then 2s
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        } else {
          // On last attempt or non-retriable error, re-throw.
          // The client-side (project-card) will catch this and show a toast.
          throw error;
        }
      }
    }
    
    // This should be unreachable, but provides a fallback.
    throw new Error("Failed to get explanation after multiple retries.");
  }
);
