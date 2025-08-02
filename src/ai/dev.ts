import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-notes.ts';
import '@/ai/flows/suggest-tags.ts';
import '@/ai/flows/qna-flow.ts';
