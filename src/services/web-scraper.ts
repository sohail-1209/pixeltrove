'use server';

import {parse} from 'node-html-parser';

/**
 * Fetches a URL and returns the text content of its body.
 * @param url The URL to scrape.
 * @returns The text content of the page body, or an error message.
 */
export async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });

    if (!response.ok) {
      return `Error: Failed to fetch the page. Status: ${response.status}`;
    }

    const html = await response.text();
    const root = parse(html);
    const body = root.querySelector('body');

    if (!body) {
      return 'Error: Could not find a body element on the page.';
    }

    // Heuristic to remove script and style content
    body.querySelectorAll('script').forEach(s => s.remove());
    body.querySelectorAll('style').forEach(s => s.remove());
    
    // Limit content size to avoid overly large payloads to the LLM
    const MAX_LENGTH = 15000;
    const textContent = body.textContent.replace(/\s\s+/g, ' ').trim();

    if (textContent.length > MAX_LENGTH) {
      return textContent.substring(0, MAX_LENGTH) + '... (content truncated)';
    }

    return textContent;
  } catch (error) {
    console.error(`Error scraping website ${url}:`, error);
    if (error instanceof Error) {
        return `Error: An exception occurred while trying to fetch the page: ${error.message}`;
    }
    return 'Error: An unknown error occurred while trying to fetch the page.';
  }
}
