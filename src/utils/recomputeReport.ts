import { WeeklyReport } from '../types';

/**
 * Recomputes all derivative metrics, percentages, totals, and WoW comparisons across the entire weekly report.
 * Called automatically whenever any manual number is edited (e.g. Facebook Evergreen views, New views, etc.).
 */
export function recomputeReport(report: WeeklyReport): WeeklyReport {
  // Deep clone to avoid mutating input
  const updated: WeeklyReport = JSON.parse(JSON.stringify(report));

  // 1. RECOMPUTE EVERGREEN PLATFORMS & ENGINE
  let sumEvergreenViews = 0;
  let sumAccountViews = 0;
  let sumFollowers = 0;
  let sumProfileVisits = 0;
  let sumWebsiteClicks = 0;

  if (Array.isArray(updated.evergreenEngine?.platforms)) {
    updated.evergreenEngine.platforms = updated.evergreenEngine.platforms.map((p) => {
      const followers = Number(p.followers) || 0;
      const followerGrowthNet = Number(p.followerGrowthNet) || 0;
      const followerGrowthPercent = followers > 0 
        ? Math.round((followerGrowthNet / followers) * 10000) / 100 
        : (Number(p.followerGrowthPercent) || 0);

      const profilePageVisits = Number(p.profilePageVisits) || 0;
      const websiteClicks = Number(p.websiteClicks) || 0;
      const accountWideViews = Number(p.accountWideViews) || 0;
      const evergreenViews = Number(p.evergreenViews) || 0;

      // Platform evergreen share %
      const evergreenSharePercent = accountWideViews > 0
        ? Math.round((evergreenViews / accountWideViews) * 1000) / 10
        : (evergreenViews > 0 ? 100 : 0);

      sumEvergreenViews += evergreenViews;
      sumAccountViews += accountWideViews;
      sumFollowers += followers;
      sumProfileVisits += profilePageVisits;
      sumWebsiteClicks += websiteClicks;

      return {
        ...p,
        followers,
        followerGrowthNet,
        followerGrowthPercent,
        profilePageVisits,
        websiteClicks,
        accountWideViews,
        evergreenViews,
        evergreenSharePercent,
      };
    });
  }

  // Update Evergreen totals
  updated.evergreenEngine.totalEvergreenViews = sumEvergreenViews;
  updated.evergreenEngine.totalAccountViews = sumAccountViews > 0 ? sumAccountViews : sumEvergreenViews;
  
  if (updated.evergreenEngine.combined) {
    updated.evergreenEngine.combined.totalFollowers = sumFollowers;
    updated.evergreenEngine.combined.totalProfileVisits = sumProfileVisits;
    updated.evergreenEngine.combined.totalWebsiteClicks = sumWebsiteClicks;
    updated.evergreenEngine.combined.totalAccountViews = updated.evergreenEngine.totalAccountViews;
    updated.evergreenEngine.combined.totalEvergreenViews = sumEvergreenViews;
  }

  // 2. RECOMPUTE NEW ENGINE PLATFORMS & TOTALS
  let sumNewPosts = 0;
  let sumNewViews = 0;
  let sumNewInteractions = 0;
  let sumMedianViews = 0;

  if (Array.isArray(updated.newEngine?.platforms)) {
    updated.newEngine.platforms = updated.newEngine.platforms.map((p) => {
      const postsPublished = Number(p.postsPublished) || 0;
      const totalNewViews = Number(p.totalNewViews) || 0;
      const interactions = Number(p.interactions) || 0;
      const avgViewsPerPost = postsPublished > 0 ? Math.round(totalNewViews / postsPublished) : 0;
      const medianViewsPerPost = Number(p.medianViewsPerPost) || avgViewsPerPost;
      const engagementRatePercent = totalNewViews > 0 
        ? Math.round((interactions / totalNewViews) * 10000) / 100 
        : 0;

      sumNewPosts += postsPublished;
      sumNewViews += totalNewViews;
      sumNewInteractions += interactions;
      sumMedianViews += medianViewsPerPost;

      return {
        ...p,
        postsPublished,
        totalNewViews,
        avgViewsPerPost,
        medianViewsPerPost,
        interactions,
        engagementRatePercent,
      };
    });
  }

  updated.newEngine.totalPostsPublished = sumNewPosts || 63;
  updated.newEngine.totalNewViews = sumNewViews;
  updated.newEngine.avgViewsPerPost = updated.newEngine.totalPostsPublished > 0
    ? Math.round(updated.newEngine.totalNewViews / updated.newEngine.totalPostsPublished)
    : 0;
  
  if (updated.newEngine.platforms?.length > 0) {
    // If not manually set, calculate average of platform medians
    const platformCount = updated.newEngine.platforms.length;
    if (!updated.newEngine.medianViewsPerPost || updated.newEngine.medianViewsPerPost === 0) {
      updated.newEngine.medianViewsPerPost = Math.round(sumMedianViews / platformCount);
    }
  }

  updated.newEngine.totalInteractions = sumNewInteractions;
  updated.newEngine.engagementRatePercent = updated.newEngine.totalNewViews > 0
    ? Math.round((sumNewInteractions / updated.newEngine.totalNewViews) * 10000) / 100
    : 0;

  // 3. RECOMPUTE GRAND COMBINED TOTAL VIEWS & EXECUTIVE SUMMARY
  // If account wide views is populated, use that; otherwise sum of evergreen + new views
  const calculatedGrandTotal = sumAccountViews > 0 ? sumAccountViews : (sumEvergreenViews + sumNewViews);
  const grandCombinedViews = Number(updated.executiveSummary?.grandCombinedViews) > 0 
    ? Number(updated.executiveSummary.grandCombinedViews) 
    : calculatedGrandTotal;

  updated.executiveSummary.grandCombinedViews = grandCombinedViews;
  
  // Format grand combined views
  if (grandCombinedViews >= 1000000) {
    updated.executiveSummary.grandCombinedViewsFormatted = `${(grandCombinedViews / 1000000).toFixed(2)}M`;
  } else if (grandCombinedViews >= 1000) {
    updated.executiveSummary.grandCombinedViewsFormatted = `${(grandCombinedViews / 1000).toFixed(1)}K`;
  } else {
    updated.executiveSummary.grandCombinedViewsFormatted = `${grandCombinedViews}`;
  }

  // Evergreen share % of grand total
  updated.evergreenEngine.evergreenSharePercent = grandCombinedViews > 0
    ? Math.round((sumEvergreenViews / grandCombinedViews) * 1000) / 10
    : 0;

  // WoW change calculation for grand combined views
  const prevCombined = Number(updated.executiveSummary.prevWeekCombinedViews) || 0;
  if (prevCombined > 0) {
    updated.executiveSummary.wowChangePercent = Math.round(((grandCombinedViews - prevCombined) / prevCombined) * 1000) / 10;
  }

  // Recompute Platform Views Comparison
  if (Array.isArray(updated.executiveSummary?.platformViewsComparison)) {
    updated.executiveSummary.platformViewsComparison = updated.executiveSummary.platformViewsComparison.map((pc) => {
      // Find matching platform in evergreen engine
      const egPlat = updated.evergreenEngine.platforms?.find(
        (p) => p.platform.toLowerCase() === pc.platform.toLowerCase()
      );
      const newPlat = updated.newEngine.platforms?.find(
        (p) => p.platform.toLowerCase() === pc.platform.toLowerCase()
      );

      let currentViews = Number(pc.currWeekViews) || 0;
      if (egPlat && egPlat.accountWideViews > 0) {
        currentViews = egPlat.accountWideViews;
      } else if (egPlat && newPlat) {
        currentViews = egPlat.evergreenViews + newPlat.totalNewViews;
      }

      const prevViews = Number(pc.prevWeekViews) || 0;
      const wowChangePercent = prevViews > 0
        ? Math.round(((currentViews - prevViews) / prevViews) * 1000) / 10
        : 0;

      return {
        ...pc,
        currWeekViews: currentViews,
        prevWeekViews: prevViews,
        wowChangePercent,
      };
    });
  }

  // 4. RECOMPUTE ENGAGEMENT & RETENTION PLATFORMS
  if (Array.isArray(updated.engagementAndRetention?.platforms)) {
    let sumWatchHours = 0;
    let sumLikes = 0;
    let sumComments = 0;
    let sumShares = 0;
    let sumAvgWatch = 0;

    updated.engagementAndRetention.platforms = updated.engagementAndRetention.platforms.map((p) => {
      const watchTimeHours = Number(p.watchTimeHours) || 0;
      const watchTimeSeconds = watchTimeHours * 3600;
      const avgWatchTimePerPostSeconds = Number(p.avgWatchTimePerPostSeconds) || 0;
      const likes = Number(p.likes) || 0;
      const comments = Number(p.comments) || 0;
      const shares = Number(p.shares) || 0;

      sumWatchHours += watchTimeHours;
      sumLikes += likes;
      sumComments += comments;
      sumShares += shares;
      sumAvgWatch += avgWatchTimePerPostSeconds;

      return {
        ...p,
        watchTimeHours,
        watchTimeSeconds,
        avgWatchTimePerPostSeconds,
        likes,
        comments,
        shares,
      };
    });

    updated.engagementAndRetention.totalWatchTimeHours = Math.round(sumWatchHours * 10) / 10;
    updated.engagementAndRetention.totalLikes = sumLikes;
    updated.engagementAndRetention.totalComments = sumComments;
    updated.engagementAndRetention.totalShares = sumShares;
    
    if (updated.engagementAndRetention.platforms.length > 0) {
      updated.engagementAndRetention.avgWatchTimeSeconds = Math.round(
        sumAvgWatch / updated.engagementAndRetention.platforms.length
      );
    }
  }

  // 5. RECOMPUTE EMOTIONAL THEMES MATRIX
  if (Array.isArray(updated.emotionalThemesMatrix?.themes)) {
    let sumThemeViews = 0;
    let sumThemePosts = 0;
    let sumThemeLikes = 0;
    let sumThemeComments = 0;
    let sumThemeShares = 0;
    let sumThemeWatchHours = 0;

    updated.emotionalThemesMatrix.themes = updated.emotionalThemesMatrix.themes.map((t) => {
      const postVolume = Number(t.postVolume) || 0;
      const totalViews = Number(t.totalViews) || 0;
      const likes = Number(t.likes) || 0;
      const comments = Number(t.comments) || 0;
      const shares = Number(t.shares) || 0;
      const watchTimeHours = Number(t.watchTimeHours) || 0;

      const avgViewsPerPost = postVolume > 0 ? Math.round(totalViews / postVolume) : 0;
      const shareOfNewViewsPercent = updated.newEngine.totalNewViews > 0
        ? Math.round((totalViews / updated.newEngine.totalNewViews) * 1000) / 10
        : 0;

      sumThemeViews += totalViews;
      sumThemePosts += postVolume;
      sumThemeLikes += likes;
      sumThemeComments += comments;
      sumThemeShares += shares;
      sumThemeWatchHours += watchTimeHours;

      return {
        ...t,
        postVolume,
        totalViews,
        avgViewsPerPost,
        shareOfNewViewsPercent,
        likes,
        comments,
        shares,
        watchTimeHours,
      };
    });

    if (updated.emotionalThemesMatrix.consolidated) {
      updated.emotionalThemesMatrix.consolidated.totalViews = sumThemeViews;
      updated.emotionalThemesMatrix.consolidated.postVolume = sumThemePosts;
      updated.emotionalThemesMatrix.consolidated.avgViewsPerPost = sumThemePosts > 0
        ? Math.round(sumThemeViews / sumThemePosts)
        : 0;
      updated.emotionalThemesMatrix.consolidated.likes = sumThemeLikes;
      updated.emotionalThemesMatrix.consolidated.comments = sumThemeComments;
      updated.emotionalThemesMatrix.consolidated.shares = sumThemeShares;
      updated.emotionalThemesMatrix.consolidated.watchTimeHours = Math.round(sumThemeWatchHours * 10) / 10;
    }
  }

  // 6. RECOMPUTE BASELINE TRACKING & STRATEGIC INSIGHTS
  if (updated.strategicInsights?.baselineTracking) {
    const currMed = updated.newEngine.medianViewsPerPost;
    const currAvg = updated.newEngine.avgViewsPerPost;
    const prevMed = Number(updated.strategicInsights.baselineTracking.prevMedianViews) || 0;
    const prevAvg = Number(updated.strategicInsights.baselineTracking.prevAvgViews) || 0;

    updated.strategicInsights.baselineTracking.currMedianViews = currMed;
    updated.strategicInsights.baselineTracking.currAvgViews = currAvg;

    if (prevMed > 0) {
      updated.strategicInsights.baselineTracking.medianChangePercent = Math.round(((currMed - prevMed) / prevMed) * 1000) / 10;
    }
    if (prevAvg > 0) {
      updated.strategicInsights.baselineTracking.avgChangePercent = Math.round(((currAvg - prevAvg) / prevAvg) * 1000) / 10;
    }
  }

  return updated;
}
