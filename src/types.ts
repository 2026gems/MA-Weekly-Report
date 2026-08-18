export interface PlatformComparison {
  platform: string;
  prevWeekViews: number;
  currWeekViews: number;
  wowChangePercent: number;
  source: string;
}

export interface EvergreenPlatformData {
  platform: string;
  followers: number;
  followerGrowthNet: number;
  followerGrowthPercent: number;
  profilePageVisits: number;
  profileVisitsNote?: string;
  websiteClicks?: number;
  websiteClicksNote?: string;
  accountWideViews: number;
  accountViewsChangePercent: number;
  profileWideInteractions: string;
  evergreenViews: number;
  evergreenSharePercent: number;
  notes?: string;
}

export interface NewEnginePlatformData {
  platform: string;
  postsPublished: number;
  totalNewViews: number;
  avgViewsPerPost: number;
  medianViewsPerPost: number;
  interactions: number;
  engagementRatePercent: number;
}

export interface TopPostHighlight {
  id: string;
  platform: string;
  titleOrHook: string;
  conceptDescription: string;
  views: number;
  likes: number;
  comments?: number;
  shares?: number;
  saves?: number;
  actions?: number;
  totalWatchTimeFormatted: string;
  avgWatchTimeFormatted: string;
  completionRate?: string;
  keyTakeaway: string;
  isCrossPlatformStandout?: boolean;
}

export interface RetentionPlatformData {
  platform: string;
  watchTimeHours: number;
  watchTimeSeconds: number;
  avgWatchTimePerPostSeconds: number;
  likes: number;
  comments: number;
  shares: number;
  savesOrOther: string;
}

export interface EmotionalThemeItem {
  id: string;
  themeName: string;
  postVolume: number;
  totalViews: number;
  shareOfNewViewsPercent: number;
  avgViewsPerPost: number;
  likes: number;
  comments: number;
  shares: number;
  watchTimeHours: number;
  color?: string;
}

export interface OperationalPlatformLog {
  platform: string;
  scheduled: number;
  published: number;
  missedDays: number;
  delayedPosts: number;
  status: string;
}

export interface StrategicLearning {
  title: string;
  description: string;
}

export interface WeeklyReport {
  id: string;
  weekNumber: number;
  dateRange: string;
  clientName: string;
  preparedBy: string;
  
  // Section 1: Executive Summary
  executiveSummary: {
    summaryText: string;
    grandCombinedViews: number;
    grandCombinedViewsFormatted: string;
    prevWeekCombinedViews: number;
    wowChangePercent: number;
    keyStrategicShift: string;
    platformViewsComparison: PlatformComparison[];
  };

  // Section 2: Evergreen Engine
  evergreenEngine: {
    narrative: string;
    totalAccountViews: number;
    totalEvergreenViews: number;
    evergreenSharePercent: number;
    platforms: EvergreenPlatformData[];
    combined: {
      totalFollowers: number;
      totalProfileVisits: number;
      totalWebsiteClicks: number;
      totalAccountViews: number;
      totalEvergreenViews: number;
      summaryNotes: string;
    };
  };

  // Section 3: New Engine
  newEngine: {
    narrative: string;
    totalPostsPublished: number;
    totalNewViews: number;
    viewsWowChangePercent: number;
    avgViewsPerPost: number;
    avgViewsWowChangePercent: number;
    medianViewsPerPost: number;
    medianViewsWowChangePercent: number;
    totalInteractions: number;
    engagementRatePercent: number;
    platforms: NewEnginePlatformData[];
  };

  // Section 4: Top-Performing Content
  topPerformingContent: {
    highlightSummary: string;
    posts: TopPostHighlight[];
  };

  // Section 5: Engagement & Retention
  engagementAndRetention: {
    summary: string;
    totalWatchTimeHours: number;
    avgWatchTimeSeconds: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalSaves: number;
    platforms: RetentionPlatformData[];
  };

  // Section 6: Quantified Emotional Themes Matrix
  emotionalThemesMatrix: {
    narrative: string;
    themes: EmotionalThemeItem[];
    consolidated: {
      postVolume: number;
      totalViews: number;
      avgViewsPerPost: number;
      likes: number;
      comments: number;
      shares: number;
      watchTimeHours: number;
    };
  };

  // Section 7: Operational & Posting Integrity Log
  operationalIntegrity: {
    narrative: string;
    scheduledTargetPerPlatform: number;
    totalScheduled: number;
    totalPublished: number;
    missedDays: number;
    delayedPosts: number;
    operationalStatus: string;
    transparencyNote: string;
    platforms: OperationalPlatformLog[];
  };

  // Section 8: Strategic Insights & Action Plan
  strategicInsights: {
    keyLearnings: StrategicLearning[];
    actionPlanNextWeek: string[];
    baselineTracking: {
      summary: string;
      prevMedianViews: number;
      currMedianViews: number;
      medianChangePercent: number;
      prevAvgViews: number;
      currAvgViews: number;
      avgChangePercent: number;
    };
    closingSignOff: string;
  };
}

export type ActiveTab = 'dashboard' | 'comparison' | 'upload' | 'themes' | 'export';
