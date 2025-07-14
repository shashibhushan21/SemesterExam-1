'use server';

/**
 * @fileOverview AI-powered tag suggestion for uploaded notes.
 *
 * - suggestTags - A function that suggests tags (university, semester, subject) based on the content of the notes.
 * - SuggestTagsInput - The input type for the suggestTags function.
 * - SuggestTagsOutput - The return type for the suggestTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  noteContent: z
    .string()
    .describe('The textual content of the notes to suggest tags for.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  university: z.string().describe('The suggested university tag.'),
  semester: z.string().describe('The suggested semester tag.'),
  subject: z.string().describe('The suggested subject tag.'),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsInputSchema},
  output: {schema: SuggestTagsOutputSchema},
  prompt: `You are an AI assistant that suggests tags for university notes.

  Given the content of the notes, suggest a university, semester, and subject tag.

  Notes content: {{{noteContent}}}
  `,
});

const suggestTagsFlow = ai.defineFlow(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
