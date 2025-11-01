import axios from 'axios';
import * as cheerio from 'cheerio';

export interface TrendingVideo {
  title: string;
  channel: string;
  views: string;
  url: string;
  description: string;
  category: string;
}

export async function scrapeTrendingVideos(): Promise<TrendingVideo[]> {
  try {
    // Simulated trending video data (in production, use YouTube Data API)
    const trendingVideos: TrendingVideo[] = [
      {
        title: "AI Revolution: How Machine Learning is Changing Everything",
        channel: "Tech Insider",
        views: "2.5M",
        url: "https://youtube.com/watch?v=example1",
        description: "Exploring the latest breakthroughs in artificial intelligence and machine learning",
        category: "Technology"
      },
      {
        title: "10 Productivity Hacks That Actually Work",
        channel: "ProductivityPro",
        views: "1.8M",
        url: "https://youtube.com/watch?v=example2",
        description: "Science-backed productivity techniques to boost your efficiency",
        category: "Education"
      },
      {
        title: "Future of Space Exploration in 2025",
        channel: "Space News",
        views: "3.2M",
        url: "https://youtube.com/watch?v=example3",
        description: "Latest updates on space missions and discoveries",
        category: "Science"
      },
      {
        title: "Cooking Made Easy: 5-Minute Recipes",
        channel: "Quick Chef",
        views: "4.1M",
        url: "https://youtube.com/watch?v=example4",
        description: "Simple and delicious recipes for busy people",
        category: "Lifestyle"
      },
      {
        title: "Fitness Transformation: Beginner's Guide",
        channel: "FitLife",
        views: "2.9M",
        url: "https://youtube.com/watch?v=example5",
        description: "Complete workout and nutrition plan for beginners",
        category: "Health"
      }
    ];

    return trendingVideos;
  } catch (error) {
    console.error('Error scraping videos:', error);
    return [];
  }
}

export async function analyzeVideoTrends(videos: TrendingVideo[]): Promise<string> {
  const categories = videos.reduce((acc, video) => {
    acc[video.category] = (acc[video.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)[0][0];

  return topCategory;
}
