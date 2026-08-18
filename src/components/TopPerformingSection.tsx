import React from 'react';
import { WeeklyReport } from '../types';
import { Award, Clock, ThumbsUp, Share2, Bookmark, Flame, Video } from 'lucide-react';
import { formatNumber, getPlatformBadgeColor } from '../utils/formatters';

interface Props {
  report: WeeklyReport;
}

export const TopPerformingSection: React.FC<Props> = ({ report }) => {
  const { topPerformingContent } = report;

  return (
    <section id="section-top-content" className="bg-white rounded-xl border border-stone-200/80 p-5 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <h2 className="text-base font-semibold text-stone-900 tracking-tight flex items-center gap-2">
              <span>4. Top-Performing New Content Highlights</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 font-medium">
                Standout Creative
              </span>
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Strongest new pieces of creative globally and per platform from this week
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium border border-stone-200">
            {topPerformingContent.posts.length} Standout Posts Highlighted
          </span>
        </div>
      </div>

      {/* Summary Narrative Banner */}
      <div className="my-4 p-4 rounded-lg bg-amber-50/60 border border-amber-200/80 text-xs text-amber-950 leading-relaxed flex items-start gap-3">
        <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-stone-900 mb-0.5">Weekly Creative Standout</div>
          <p>{topPerformingContent.highlightSummary}</p>
        </div>
      </div>

      {/* Standout Posts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {topPerformingContent.posts.map((post) => {
          const badge = getPlatformBadgeColor(post.platform);
          return (
            <div
              key={post.id}
              id={`top-post-card-${post.id}`}
              className="rounded-xl border border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs transition-all p-4 flex flex-col justify-between"
            >
              <div>
                {/* Header: Platform & Standout Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {post.platform}
                  </span>
                  {post.isCrossPlatformStandout && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                      <Flame className="w-3 h-3 text-amber-600" />
                      Cross-Platform Hit
                    </span>
                  )}
                </div>

                {/* Hook / Title */}
                <h4 className="text-xs font-semibold text-stone-900 line-clamp-2 leading-snug">
                  {post.titleOrHook}
                </h4>

                {/* Concept Narrative */}
                <p className="text-[11px] text-stone-600 mt-1.5 leading-relaxed">
                  {post.conceptDescription}
                </p>

                {/* Key Metrics Pill Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-100 text-xs">
                  <div className="bg-stone-50 p-2 rounded border border-stone-200/80">
                    <span className="text-[10px] text-stone-500 block uppercase font-medium">Views</span>
                    <span className="text-sm font-bold text-stone-900">{formatNumber(post.views)}</span>
                  </div>

                  <div className="bg-stone-50 p-2 rounded border border-stone-200/80">
                    <span className="text-[10px] text-stone-500 block uppercase font-medium">Likes</span>
                    <span className="text-sm font-bold text-stone-900">{post.likes.toLocaleString()}</span>
                  </div>
                </div>

                {/* Secondary Engagement Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-stone-600">
                  {post.shares !== undefined && (
                    <span className="inline-flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-stone-400" /> {post.shares} shares
                    </span>
                  )}
                  {post.saves !== undefined && (
                    <span className="inline-flex items-center gap-1">
                      <Bookmark className="w-3 h-3 text-stone-400" /> {post.saves} saves
                    </span>
                  )}
                  {post.actions !== undefined && post.actions > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                      {post.actions} actions
                    </span>
                  )}
                </div>

                {/* Watch Time & Retention Metrics */}
                <div className="mt-3.5 pt-3 border-t border-stone-100 bg-stone-50/50 p-2.5 rounded-lg">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-800 mb-1">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>Watch Time & Retention:</span>
                  </div>
                  <div className="text-[11px] text-stone-700 space-y-0.5">
                    <div>Total Watched: <strong>{post.totalWatchTimeFormatted}</strong></div>
                    <div>Avg Watch Time: <strong>{post.avgWatchTimeFormatted}</strong></div>
                    {post.completionRate && (
                      <div className="text-amber-800 font-medium">{post.completionRate}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Key Takeaway */}
              <div className="mt-4 pt-2.5 border-t border-stone-100 text-[11px] text-stone-600 font-medium">
                💡 <span className="text-stone-800 font-semibold">Takeaway:</span> {post.keyTakeaway}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
