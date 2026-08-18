import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Route: Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API Route: Extract Weekly Report from PDF, CSV, Text, or Raw Report Dump
  app.post('/api/extract-report', async (req, res) => {
    try {
      const { text, pdfBase64, customWeekNumber } = req.body;

      if (!text && !pdfBase64) {
        return res.status(400).json({ error: 'PDF file or text content is required for report extraction.' });
      }

      const ai = getAI();
      if (!ai) {
        // Return structured fallback
        return res.status(200).json({
          fallback: true,
          message: 'Gemini API key not detected. Using structured template generator.',
          report: null,
        });
      }

      const targetWeek = customWeekNumber || 5;

      const systemPrompt = `You are an expert social media analytics reporting assistant for Memorialize Art, prepared by MOAE Digitals.
Analyze the provided report document (PDF, CSV, or raw text) for Week ${targetWeek} and extract all weekly performance metrics into a clean, complete, structured JSON object matching the exact schema.

MASTER RULES TO STRICTLY FOLLOW:
1. NO DEMOGRAPHICS: Do not include Top Countries or Top Cities anywhere in the report.
2. Separate the "Evergreen Engine" (overall account-wide views including older circulating videos, profile visits, follower growth, website clicks) from the "New Engine" (performance isolated strictly to videos published during this specific week).
3. Ensure exact metrics for:
   - Posts published per platform (Target is 21/platform, 63 total)
   - Total new views, average views per post, and median views per post
   - Top-performing new post per platform with title/hook, concept, views, likes, shares, watch time
   - Watch times & Retention trackers (total watch time in hours, seconds, avg watch time per post, likes, comments, shares, saves)
   - Quantified Emotional Themes Matrix (Grandparent & Multigenerational Stories, Milestone Gifting & Tributes, Parent-Child Loss & Reunification, Sibling & Family Loss, Wedding Honors, Dad Stories)
   - Operational & Posting Integrity Log (Scheduled target vs Published, Missed days, Delayed posts)
   - Strategic Insights & Forward-Looking Action Plan (Key weekly learnings, Consistencies vs Fluctuations, Action plan for next week, Baseline tracker)
   - Closing signature: "End of Week ${targetWeek} Consolidated Report. Prepared by MOAE Digitals."`;

      let contents: any;

      if (pdfBase64) {
        contents = [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'application/pdf',
                  data: pdfBase64,
                },
              },
              {
                text: `${systemPrompt}\n\nPlease extract all social media report metrics from this uploaded PDF document.`,
              },
            ],
          },
        ];
      } else {
        contents = `${systemPrompt}\n\nREPORT DATA / TEXT TO PARSE:\n${text}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              weekNumber: { type: Type.INTEGER },
              dateRange: { type: Type.STRING },
              clientName: { type: Type.STRING },
              preparedBy: { type: Type.STRING },
              executiveSummary: {
                type: Type.OBJECT,
                properties: {
                  summaryText: { type: Type.STRING },
                  grandCombinedViews: { type: Type.NUMBER },
                  grandCombinedViewsFormatted: { type: Type.STRING },
                  prevWeekCombinedViews: { type: Type.NUMBER },
                  wowChangePercent: { type: Type.NUMBER },
                  keyStrategicShift: { type: Type.STRING },
                  platformViewsComparison: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        platform: { type: Type.STRING },
                        prevWeekViews: { type: Type.NUMBER },
                        currWeekViews: { type: Type.NUMBER },
                        wowChangePercent: { type: Type.NUMBER },
                        source: { type: Type.STRING },
                      },
                      required: ['platform', 'prevWeekViews', 'currWeekViews', 'wowChangePercent'],
                    },
                  },
                },
                required: ['summaryText', 'grandCombinedViews', 'grandCombinedViewsFormatted', 'wowChangePercent', 'platformViewsComparison'],
              },
              evergreenEngine: {
                type: Type.OBJECT,
                properties: {
                  narrative: { type: Type.STRING },
                  totalAccountViews: { type: Type.NUMBER },
                  totalEvergreenViews: { type: Type.NUMBER },
                  evergreenSharePercent: { type: Type.NUMBER },
                  platforms: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        platform: { type: Type.STRING },
                        followers: { type: Type.NUMBER },
                        followerGrowthNet: { type: Type.NUMBER },
                        followerGrowthPercent: { type: Type.NUMBER },
                        profilePageVisits: { type: Type.NUMBER },
                        profileVisitsNote: { type: Type.STRING },
                        websiteClicks: { type: Type.NUMBER },
                        websiteClicksNote: { type: Type.STRING },
                        accountWideViews: { type: Type.NUMBER },
                        accountViewsChangePercent: { type: Type.NUMBER },
                        profileWideInteractions: { type: Type.STRING },
                        evergreenViews: { type: Type.NUMBER },
                        evergreenSharePercent: { type: Type.NUMBER },
                        notes: { type: Type.STRING },
                      },
                      required: ['platform', 'followers', 'accountWideViews'],
                    },
                  },
                  combined: {
                    type: Type.OBJECT,
                    properties: {
                      totalFollowers: { type: Type.NUMBER },
                      totalProfileVisits: { type: Type.NUMBER },
                      totalWebsiteClicks: { type: Type.NUMBER },
                      totalAccountViews: { type: Type.NUMBER },
                      totalEvergreenViews: { type: Type.NUMBER },
                      summaryNotes: { type: Type.STRING },
                    },
                  },
                },
              },
              newEngine: {
                type: Type.OBJECT,
                properties: {
                  narrative: { type: Type.STRING },
                  totalPostsPublished: { type: Type.NUMBER },
                  totalNewViews: { type: Type.NUMBER },
                  viewsWowChangePercent: { type: Type.NUMBER },
                  avgViewsPerPost: { type: Type.NUMBER },
                  avgViewsWowChangePercent: { type: Type.NUMBER },
                  medianViewsPerPost: { type: Type.NUMBER },
                  medianViewsWowChangePercent: { type: Type.NUMBER },
                  totalInteractions: { type: Type.NUMBER },
                  engagementRatePercent: { type: Type.NUMBER },
                  platforms: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        platform: { type: Type.STRING },
                        postsPublished: { type: Type.NUMBER },
                        totalNewViews: { type: Type.NUMBER },
                        avgViewsPerPost: { type: Type.NUMBER },
                        medianViewsPerPost: { type: Type.NUMBER },
                        interactions: { type: Type.NUMBER },
                        engagementRatePercent: { type: Type.NUMBER },
                      },
                    },
                  },
                },
              },
              topPerformingContent: {
                type: Type.OBJECT,
                properties: {
                  highlightSummary: { type: Type.STRING },
                  posts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        platform: { type: Type.STRING },
                        titleOrHook: { type: Type.STRING },
                        conceptDescription: { type: Type.STRING },
                        views: { type: Type.NUMBER },
                        likes: { type: Type.NUMBER },
                        comments: { type: Type.NUMBER },
                        shares: { type: Type.NUMBER },
                        saves: { type: Type.NUMBER },
                        totalWatchTimeFormatted: { type: Type.STRING },
                        avgWatchTimeFormatted: { type: Type.STRING },
                        completionRate: { type: Type.STRING },
                        keyTakeaway: { type: Type.STRING },
                        isCrossPlatformStandout: { type: Type.BOOLEAN },
                      },
                    },
                  },
                },
              },
              engagementAndRetention: {
                type: Type.OBJECT,
                properties: {
                  summary: { type: Type.STRING },
                  totalWatchTimeHours: { type: Type.NUMBER },
                  avgWatchTimeSeconds: { type: Type.NUMBER },
                  totalLikes: { type: Type.NUMBER },
                  totalComments: { type: Type.NUMBER },
                  totalShares: { type: Type.NUMBER },
                  totalSaves: { type: Type.NUMBER },
                  platforms: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        platform: { type: Type.STRING },
                        watchTimeHours: { type: Type.NUMBER },
                        watchTimeSeconds: { type: Type.NUMBER },
                        avgWatchTimePerPostSeconds: { type: Type.NUMBER },
                        likes: { type: Type.NUMBER },
                        comments: { type: Type.NUMBER },
                        shares: { type: Type.NUMBER },
                        savesOrOther: { type: Type.STRING },
                      },
                    },
                  },
                },
              },
              emotionalThemesMatrix: {
                type: Type.OBJECT,
                properties: {
                  narrative: { type: Type.STRING },
                  themes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        themeName: { type: Type.STRING },
                        postVolume: { type: Type.NUMBER },
                        totalViews: { type: Type.NUMBER },
                        shareOfNewViewsPercent: { type: Type.NUMBER },
                        avgViewsPerPost: { type: Type.NUMBER },
                        likes: { type: Type.NUMBER },
                        comments: { type: Type.NUMBER },
                        shares: { type: Type.NUMBER },
                        watchTimeHours: { type: Type.NUMBER },
                        color: { type: Type.STRING },
                      },
                    },
                  },
                  consolidated: {
                    type: Type.OBJECT,
                    properties: {
                      postVolume: { type: Type.NUMBER },
                      totalViews: { type: Type.NUMBER },
                      avgViewsPerPost: { type: Type.NUMBER },
                      likes: { type: Type.NUMBER },
                      comments: { type: Type.NUMBER },
                      shares: { type: Type.NUMBER },
                      watchTimeHours: { type: Type.NUMBER },
                    },
                  },
                },
              },
              operationalIntegrity: {
                type: Type.OBJECT,
                properties: {
                  narrative: { type: Type.STRING },
                  scheduledTargetPerPlatform: { type: Type.NUMBER },
                  totalScheduled: { type: Type.NUMBER },
                  totalPublished: { type: Type.NUMBER },
                  missedDays: { type: Type.NUMBER },
                  delayedPosts: { type: Type.NUMBER },
                  operationalStatus: { type: Type.STRING },
                  transparencyNote: { type: Type.STRING },
                  platforms: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        platform: { type: Type.STRING },
                        scheduled: { type: Type.NUMBER },
                        published: { type: Type.NUMBER },
                        missedDays: { type: Type.NUMBER },
                        delayedPosts: { type: Type.NUMBER },
                        status: { type: Type.STRING },
                      },
                    },
                  },
                },
              },
              strategicInsights: {
                type: Type.OBJECT,
                properties: {
                  keyLearnings: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                      },
                    },
                  },
                  actionPlanNextWeek: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  baselineTracking: {
                    type: Type.OBJECT,
                    properties: {
                      summary: { type: Type.STRING },
                      prevMedianViews: { type: Type.NUMBER },
                      currMedianViews: { type: Type.NUMBER },
                      medianChangePercent: { type: Type.NUMBER },
                      prevAvgViews: { type: Type.NUMBER },
                      currAvgViews: { type: Type.NUMBER },
                      avgChangePercent: { type: Type.NUMBER },
                    },
                  },
                  closingSignOff: { type: Type.STRING },
                },
              },
            },
            required: ['weekNumber', 'dateRange', 'executiveSummary'],
          },
        },
      });

      const extractedJson = JSON.parse(response.text || '{}');
      if (customWeekNumber) {
        extractedJson.weekNumber = Number(customWeekNumber);
      }
      extractedJson.id = `week-${extractedJson.weekNumber || Date.now()}`;

      if (extractedJson.topPerformingContent?.posts) {
        extractedJson.topPerformingContent.posts = extractedJson.topPerformingContent.posts.map((p: any, idx: number) => ({
          ...p,
          id: p.id || `top-post-${idx}`,
        }));
      }
      if (extractedJson.emotionalThemesMatrix?.themes) {
        const defaultPalette = ['#1e293b', '#475569', '#64748b', '#94a3b8', '#cbd5e1'];
        extractedJson.emotionalThemesMatrix.themes = extractedJson.emotionalThemesMatrix.themes.map((t: any, idx: number) => ({
          ...t,
          id: t.id || `theme-${idx}`,
          color: t.color || defaultPalette[idx % defaultPalette.length],
        }));
      }

      return res.json({ success: true, report: extractedJson });
    } catch (err: any) {
      console.error('Extraction Error:', err);
      return res.status(500).json({ error: err.message || 'Failed to extract report data.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Memorialize Weekly Report Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
