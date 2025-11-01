import { google } from 'googleapis';
import axios from 'axios';

export interface YouTubeUploadRequest {
  title: string;
  description: string;
  tags: string[];
  categoryId?: string;
  privacyStatus: 'public' | 'private' | 'unlisted';
}

export interface YouTubeUploadResponse {
  videoId: string;
  url: string;
  status: string;
}

export class YouTubeUploader {
  private youtube: any;
  private oauth2Client: any;

  constructor(oauth2Client: any) {
    this.oauth2Client = oauth2Client;
    this.youtube = google.youtube({ version: 'v3', auth: oauth2Client });
  }

  async uploadVideo(
    videoBuffer: Buffer | string,
    metadata: YouTubeUploadRequest
  ): Promise<YouTubeUploadResponse> {
    try {
      // For mock implementation, we'll simulate upload
      // In production, this would use actual YouTube Data API v3

      const videoId = `YT_${Date.now()}_${Math.random().toString(36).substr(2, 11)}`;

      // Mock upload - in production use youtube.videos.insert()
      /*
      const response = await this.youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: metadata.title,
            description: metadata.description,
            tags: metadata.tags,
            categoryId: metadata.categoryId || '22', // People & Blogs
          },
          status: {
            privacyStatus: metadata.privacyStatus,
          },
        },
        media: {
          body: videoBuffer,
        },
      });
      */

      return {
        videoId: videoId,
        url: `https://youtube.com/watch?v=${videoId}`,
        status: 'uploaded',
      };
    } catch (error) {
      console.error('Error uploading to YouTube:', error);
      throw error;
    }
  }

  async updateVideoMetadata(
    videoId: string,
    metadata: Partial<YouTubeUploadRequest>
  ): Promise<void> {
    try {
      await this.youtube.videos.update({
        part: ['snippet'],
        requestBody: {
          id: videoId,
          snippet: {
            title: metadata.title,
            description: metadata.description,
            tags: metadata.tags,
            categoryId: metadata.categoryId,
          },
        },
      });
    } catch (error) {
      console.error('Error updating video metadata:', error);
      throw error;
    }
  }

  async getVideoStatus(videoId: string): Promise<any> {
    try {
      const response = await this.youtube.videos.list({
        part: ['status', 'snippet'],
        id: [videoId],
      });

      return response.data.items[0];
    } catch (error) {
      console.error('Error getting video status:', error);
      throw error;
    }
  }
}
