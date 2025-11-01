import { google } from 'googleapis';

export interface GoogleDocsConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken?: string;
}

export class GoogleDocsManager {
  private oauth2Client: any;
  private docs: any;
  private drive: any;

  constructor(config: GoogleDocsConfig) {
    this.oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );

    if (config.refreshToken) {
      this.oauth2Client.setCredentials({
        refresh_token: config.refreshToken,
      });
    }

    this.docs = google.docs({ version: 'v1', auth: this.oauth2Client });
    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  async createDocument(title: string): Promise<string> {
    try {
      const response = await this.docs.documents.create({
        requestBody: {
          title: title,
        },
      });
      return response.data.documentId;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  async appendToDocument(documentId: string, content: string): Promise<void> {
    try {
      await this.docs.documents.batchUpdate({
        documentId: documentId,
        requestBody: {
          requests: [
            {
              insertText: {
                location: {
                  index: 1,
                },
                text: content + '\n\n',
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error appending to document:', error);
      throw error;
    }
  }

  async logVideoData(documentId: string, videoData: any): Promise<void> {
    const timestamp = new Date().toISOString();
    const content = `
[${timestamp}]
Title: ${videoData.title}
Category: ${videoData.category}
Views: ${videoData.views}
Prompt Generated: ${videoData.prompt}
Status: ${videoData.status}
${videoData.youtubeUrl ? `YouTube URL: ${videoData.youtubeUrl}` : 'Not uploaded yet'}
-------------------------------------------
`;
    await this.appendToDocument(documentId, content);
  }

  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/youtube.upload',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  async getTokenFromCode(code: string): Promise<any> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }
}
