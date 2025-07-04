import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: 'YOUR_GOOGLE_AI_API_KEY_HERE'})],
  model: 'googleai/gemini-1.5-flash',
});
