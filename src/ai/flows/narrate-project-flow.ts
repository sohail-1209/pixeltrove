'use server';
/**
 * @fileOverview An AI flow to generate voice narration for a project description.
 *
 * - narrateProject - A function that generates an audio narration.
 * - NarrateProjectInput - The input type for the narrateProject function.
 * - NarrateProjectOutput - The return type for the narrateProject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit/zod';
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
  }
);
