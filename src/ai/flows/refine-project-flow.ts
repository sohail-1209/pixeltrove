
'use server';
/**
 * @fileOverview An AI flow to improvise and refine project details for clarity and professionalism.
 *
 * - refineProject - A function that refines project text content.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const RefineProjectInputSchema = z.object({
  title: z.string().describe('The current title of the project.'),
  description: z.string().describe('The current description of the project.'),
  tags: z.array(z.string()).describe('The list of technologies used in the project.'),
});
type RefineProjectInput = z.infer<typeof RefineProjectInputSchema>;

const RefineProjectOutputSchema = z.object({
  refinedTitle: z.string().describe('The refined title, professionally worded and capitalized.'),
  refinedDescription: z.string().describe('The refined description, professionally worded and capitalized.'),
  refinedTags: z.array(z.string()).describe('The list of tags, with standardized capitalization and duplicates removed.'),
});
type RefineProjectOutput = z.infer<typeof RefineProjectOutputSchema>;

export async function refineProject(input: RefineProjectInput): Promise<RefineProjectOutput> {
  return refineProjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineProjectPrompt',
  input: {schema: RefineProjectInputSchema},
  output: {schema: RefineProjectOutputSchema},
  prompt: `You are an expert copywriter and portfolio consultant. Your task is to improvise and improve the provided project details to make them sound more professional, engaging, and impactful for a tech portfolio.

**Project Details to Improvise:**
- **Current Title:** "{{title}}"
- **Current Description:** "{{description}}"
- **Current Tags:** {{#each tags}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}

**Your Goal:**
1.  **Title:** Rewrite the title to be more compelling and descriptive. It should be concise and grab attention.
2.  **Description:** Rewrite the description to be more professional and clear. Correct any grammatical errors, improve the wording, and highlight the project's value. Ensure it starts with a capital letter.
3.  **Tags:** Review the list of tags. Standardize their capitalization (e.g., 'next.js' becomes 'Next.js'). Remove any duplicates and ensure they accurately represent common technologies.

Return the improved content in the specified output format. Do not change the core meaning, just enhance the presentation.
`,
});

const refineProjectFlow = ai.defineFlow(
  {
    name: 'refineProjectFlow',
    inputSchema: RefineProjectInputSchema,
    outputSchema: RefineProjectOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error("Error in refineProjectFlow:", error);
      if (error instanceof Error && error.message.includes('503')) {
        throw new Error("The AI service is currently busy. Please try again in a moment.");
      }
      throw new Error("An unexpected error occurred while improvising content.");
    }
  }
);
