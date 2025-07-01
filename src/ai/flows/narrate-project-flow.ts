
'use server';
/**
 * @fileOverview An AI flow to generate voice narration for a project description.
 *
 * - narrateProject - A function that generates an audio narration.
 * - NarrateProjectInput - The input type for the narrateProject function.
 * - NarrateProjectOutput - The return type for the narrateProject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';

const NarrateProjectInputSchema = z.string().describe('The text to be narrated.');
export type NarrateProjectInput = z.infer<typeof NarrateProjectInputSchema>;

const NarrateProjectOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI in WAV format. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type NarrateProjectOutput = z.infer<typeof NarrateProjectOutputSchema>;

export async function narrateProject(input: NarrateProjectInput): Promise<NarrateProjectOutput> {
  return narrateProjectFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const narrateProjectFlow = ai.defineFlow(
  {
    name: 'narrateProjectFlow',
    inputSchema: NarrateProjectInputSchema,
    outputSchema: NarrateProjectOutputSchema,
  },
  async (textToNarrate) => {
    const MAX_RETRIES = 3;
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        const { media } = await ai.generate({
            model: googleAI.model('gemini-2.5-flash-preview-tts'),
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Algenib' },
                    },
                },
            },
            prompt: textToNarrate,
        });

        if (!media) {
            throw new Error('No audio media was returned from the TTS model.');
        }
        
        const audioBuffer = Buffer.from(
            media.url.substring(media.url.indexOf(',') + 1),
            'base64'
        );

        const wavBase64 = await toWav(audioBuffer);
        
        return {
            audioDataUri: `data:audio/wav;base64,${wavBase64}`,
        };
      } catch (error) {
          console.error(`Error in narrateProjectFlow (Attempt ${attempt + 1}/${MAX_RETRIES}):`, error);
          const isRetriable = error instanceof Error && (error.message.includes('503') || error.message.includes("No audio media"));

          if (isRetriable && attempt < MAX_RETRIES - 1) {
              attempt++;
              await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          } else {
              // Re-throw the error on the last attempt or for non-retriable errors.
              // The client-side will catch this and show a toast.
              throw error;
          }
      }
    }
    // Fallback if loop finishes.
    throw new Error('Failed to generate narration after multiple retries.');
  }
);
