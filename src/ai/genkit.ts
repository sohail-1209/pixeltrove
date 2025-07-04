import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: 'AIzaSyDcl9uB2-4EgWiL_PT4C0QO-LHgUqoPJZs'})],
  model: 'googleai/gemini-1.5-flash',
});
