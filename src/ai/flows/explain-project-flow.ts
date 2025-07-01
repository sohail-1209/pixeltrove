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
    websiteContent: z.string(),
  })},
  output: {schema: ExplainProjectOutputSchema},
  prompt: `You are a tech expert and portfolio reviewer.
Based on the following project title and the text content from its website, generate a concise and insightful explanation structured into the output format.

You are explaining "{{{title}}}".
Here is the raw text content scraped from its website:
---
{{{websiteContent}}}
---

Based on this, please provide:
1. A one-sentence summary of the project's main purpose.
2. A list of 3-4 key features or actions a user can perform.
3. A concluding sentence that highlights the key technologies used. If you cannot determine the technologies, make a best guess or state that it's unclear from the provided text.
`,
});

const explainProjectFlow = ai.defineFlow(
  {
    name: 'explainProjectFlow',
    inputSchema: ExplainProjectInputSchema,
    outputSchema: ExplainProjectOutputSchema,
  },
  async ({projectUrl, title}) => {
    const websiteContent = await scrapeWebsite(projectUrl);
    
    // If the scraper returns an error OR returns no content, handle it gracefully.
    if (websiteContent.startsWith('Error:') || !websiteContent.trim()) {
      const isError = websiteContent.startsWith('Error:');
      const reason = isError 
        ? websiteContent 
        : "The scraper found no readable text on the page. This can happen with single-page applications that render their content with client-side JavaScript.";

      return {
        summary: `Could not analyze the project "${title}".`,
        features: [`The scraper was unable to retrieve content from ${projectUrl}.`, `Reason: ${reason}`],
        techStack: "Tech stack could not be determined."
      }
    }

    const {output} = await prompt({title, websiteContent});
    return output!;
  }
);
