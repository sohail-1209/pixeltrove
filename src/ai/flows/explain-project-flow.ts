'use server';
/**
 * @fileOverview An AI flow to explain a software project based on its details.
 *
 * - explainProject - A function that generates an explanation for a project.
 * - ExplainProjectInput - The input type for the explainProject function.
 * - ExplainProjectOutput - The return type for the explainProject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainProjectInputSchema = z.object({
  title: z.string().describe('The title of the project.'),
  description: z.string().describe('A brief description of the project.'),
  tags: z.array(z.string()).describe('A list of technologies or tags associated with the project.'),
});
export type ExplainProjectInput = z.infer<typeof ExplainProjectInputSchema>;

const ExplainProjectOutputSchema = z.object({
  summary: z.string().describe("A one-sentence summary of the project's main purpose."),
  features: z.array(z.string()).describe("A list of 3-4 key features or user actions."),
  techStack: z.string().describe("A concluding sentence that highlights the key technologies used."),
});
export type ExplainProjectOutput = z.infer<typeof ExplainProjectOutputSchema>;

export async function explainProject(input: ExplainProjectInput): Promise<ExplainProjectOutput> {
  return explainProjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainProjectPrompt',
  input: {schema: ExplainProjectInputSchema},
  output: {schema: ExplainProjectOutputSchema},
  prompt: `You are a tech expert and portfolio reviewer.
Based on the following project details, generate a concise and insightful explanation structured into the output format.

You are explaining "{{{title}}}".
The project is described as: "{{{description}}}".
It uses the following technologies: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.

Based on this, please provide:
1. A one-sentence summary of the project's main purpose.
2. A list of 3-4 key features or actions a user can perform.
3. A concluding sentence that highlights the key technologies used.
`,
});

const explainProjectFlow = ai.defineFlow(
  {
    name: 'explainProjectFlow',
    inputSchema: ExplainProjectInputSchema,
    outputSchema: ExplainProjectOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
