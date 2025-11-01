import OpenAI from 'openai';

export interface VideoPromptRequest {
  trendingTitle: string;
  category: string;
  description: string;
  targetAudience?: string;
}

export interface GeneratedPrompt {
  videoPrompt: string;
  title: string;
  description: string;
  tags: string[];
  duration: string;
}

export class PromptGenerator {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateVideoPrompt(request: VideoPromptRequest): Promise<GeneratedPrompt> {
    const systemPrompt = `You are an expert video content creator and prompt engineer.
Generate detailed video prompts for AI video generation tools like Veo3 or Sora.
The prompts should be cinematic, detailed, and include camera movements, lighting, and atmosphere.`;

    const userPrompt = `Based on this trending video concept:
Title: ${request.trendingTitle}
Category: ${request.category}
Description: ${request.description}

Create a unique video idea inspired by this trend, and generate:
1. A detailed video generation prompt (for AI tools like Veo3/Sora)
2. An engaging title
3. A compelling description
4. 5-10 relevant tags

Format your response as JSON with keys: videoPrompt, title, description, tags (array), duration`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content generated');

      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating prompt:', error);
      throw error;
    }
  }

  async generateMultiplePrompts(requests: VideoPromptRequest[]): Promise<GeneratedPrompt[]> {
    const promises = requests.map(req => this.generateVideoPrompt(req));
    return Promise.all(promises);
  }
}
