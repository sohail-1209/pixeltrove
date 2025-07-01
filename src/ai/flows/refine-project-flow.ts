
'use server';
/**
 * @fileOverview An AI flow to refine project details for clarity and professionalism.
 *
 * - refineProject - A function that refines project text content.
 * - RefineProjectInput - The input type for the refineProject function.
 * - RefineProjectOutput - The return type for the refineProject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const RefineProjectInputSchema = z.object({
  title: z.string().describe('The current title of the project.'),
  description: z.string().describe('The current description of the project.'),
  tags: z.array(z.string()).describe('The list of technologies used in the project.'),
});
export type RefineProjectInput = z.infer<typeof RefineProjectInputSchema>;

const RefineProjectOutputSchema = z.object({
  refinedTitle: z.string().describe('The refined title with the first letter capitalized.'),
  refinedDescription: z.string().describe('The refined description, professionally worded with the first letter capitalized.'),
  refinedTags: z.array(z.string()).describe('The list of tags, with the first letter of each tag capitalized and duplicates removed.'),
});
export type RefineProjectOutput = z.infer<typeof RefineProjectOutputSchema>;

export async function refineProject(input: RefineProjectInput): Promise<RefineProjectOutput> {
  return refineProjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineProjectPrompt',
  input: {schema: RefineProjectInputSchema},
  output: {schema: RefineProjectOutputSchema},
  prompt: `You are an expert copy editor for a developer portfolio.
Your task is to review the provided project details and refine them for clarity, professionalism, and consistency.

Follow these instructions precisely:
1.  **Title:** Review the title "{{title}}". Ensure it starts with a capital letter. Make it concise and impactful.
2.  **Description:** Review the description "{{description}}". Correct any grammar or spelling mistakes. Ensure it is written in a professional tone and starts with a capital letter.
3.  **Tags:** Review the list of tags: {{#each tags}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}. For each tag, ensure it starts with a capital letter. Remove any duplicate tags.

Return the refined content in the specified output format.
`,
});

const refineProjectFlow = ai.defineFlow(
  {
    name: 'refineProjectFlow',
    inputSchema: RefineProjectInputSchema,
    outputSchema: RefineProjectOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
