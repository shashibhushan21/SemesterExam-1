'use server';

/**
 * @fileOverview An AI agent for answering questions about a given text.
 *
 * - askQuestionAboutNote - A function that answers a question based on note content.
 * - QnaInput - The input type for the askQuestionAboutNote function.
 * - QnaOutput - The return type for the askQuestion-about-note function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QnaInputSchema = z.object({
  noteContent: z
    .string()
    .describe('The content of the notes to be queried.'),
  question: z.string().describe('The question being asked about the notes.'),
});
export type QnaInput = z.infer<typeof QnaInputSchema>;

const QnaOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, based on the provided notes.'),
});
export type QnaOutput = z.infer<typeof QnaOutputSchema>;

export async function askQuestionAboutNote(input: QnaInput): Promise<QnaOutput> {
  return qnaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'qnaPrompt',
  input: {schema: QnaInputSchema},
  output: {schema: QnaOutputSchema},
  prompt: `You are an expert academic assistant. Your task is to answer the user's question based *only* on the provided notes content. Do not use any external knowledge. If the answer cannot be found in the text, state that clearly.

  Notes Content:
  ---
  {{{noteContent}}}
  ---

  User's Question: "{{question}}"
  `,
});

const qnaFlow = ai.defineFlow(
  {
    name: 'qnaFlow',
    inputSchema: QnaInputSchema,
    outputSchema: QnaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
