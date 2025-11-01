import { scrapeTrendingVideos, TrendingVideo } from './youtube-scraper';
import { GoogleDocsManager } from './google-docs';
import { PromptGenerator, GeneratedPrompt } from './prompt-generator';
import { VideoGenerator } from './video-generator';
import { YouTubeUploader } from './youtube-uploader';

export interface AgentConfig {
  googleDocs: GoogleDocsManager;
  promptGenerator: PromptGenerator;
  videoGenerator: VideoGenerator;
  youtubeUploader: YouTubeUploader;
  documentId: string;
}

export interface AgentResult {
  trendingVideo: TrendingVideo;
  generatedPrompt: GeneratedPrompt;
  videoUrl?: string;
  youtubeUrl?: string;
  status: 'success' | 'partial' | 'failed';
  error?: string;
}

export class AutomationAgent {
  private config: AgentConfig;
  private isRunning: boolean = false;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  async runFullPipeline(limit: number = 3): Promise<AgentResult[]> {
    if (this.isRunning) {
      throw new Error('Agent is already running');
    }

    this.isRunning = true;
    const results: AgentResult[] = [];

    try {
      console.log('Step 1: Scanning trending videos...');
      const trendingVideos = await scrapeTrendingVideos();
      const selectedVideos = trendingVideos.slice(0, limit);

      console.log(`Found ${selectedVideos.length} trending videos`);

      for (const video of selectedVideos) {
        const result: AgentResult = {
          trendingVideo: video,
          generatedPrompt: {} as GeneratedPrompt,
          status: 'failed',
        };

        try {
          // Step 2: Generate prompt
          console.log(`Generating prompt for: ${video.title}`);
          const prompt = await this.config.promptGenerator.generateVideoPrompt({
            trendingTitle: video.title,
            category: video.category,
            description: video.description,
          });

          result.generatedPrompt = prompt;

          // Step 3: Log to Google Docs
          await this.config.googleDocs.logVideoData(this.config.documentId, {
            title: video.title,
            category: video.category,
            views: video.views,
            prompt: prompt.videoPrompt,
            status: 'Prompt Generated',
          });

          // Step 4: Generate video
          console.log('Generating video with AI...');
          const videoResult = await this.config.videoGenerator.generateVideo({
            prompt: prompt.videoPrompt,
            duration: 30,
            aspectRatio: '16:9',
          });

          if (videoResult.status === 'completed' && videoResult.videoUrl) {
            result.videoUrl = videoResult.videoUrl;

            // Step 5: Upload to YouTube
            console.log('Uploading to YouTube...');
            const uploadResult = await this.config.youtubeUploader.uploadVideo(
              videoResult.videoUrl,
              {
                title: prompt.title,
                description: prompt.description,
                tags: prompt.tags,
                privacyStatus: 'public',
              }
            );

            result.youtubeUrl = uploadResult.url;
            result.status = 'success';

            // Step 6: Update Google Docs with YouTube URL
            await this.config.googleDocs.logVideoData(this.config.documentId, {
              title: video.title,
              category: video.category,
              views: video.views,
              prompt: prompt.videoPrompt,
              status: 'Uploaded to YouTube',
              youtubeUrl: uploadResult.url,
            });

            console.log(`✓ Successfully processed: ${video.title}`);
          } else {
            result.status = 'partial';
            result.error = 'Video generation incomplete';
          }
        } catch (error) {
          result.error = error instanceof Error ? error.message : 'Unknown error';
          console.error(`✗ Error processing ${video.title}:`, error);
        }

        results.push(result);
      }
    } finally {
      this.isRunning = false;
    }

    return results;
  }

  async processSingleVideo(videoIndex: number = 0): Promise<AgentResult> {
    const results = await this.runFullPipeline(videoIndex + 1);
    return results[videoIndex];
  }

  getStatus(): { isRunning: boolean } {
    return { isRunning: this.isRunning };
  }
}
