import React from 'react';
import { WeeklyReport } from '../types';
import { Clock, Eye, Heart, MessageSquare, Share2, Bookmark, BarChart } from 'lucide-react';
import { formatNumber, getPlatformBadgeColor } from '../utils/formatters';

interface Props {
  report: WeeklyReport;
}

export const RetentionTrackerSection: React.FC<Props> = ({ report }) => {
  const { engagementAndRetention } = report;

  return (
    <section id="section-retention-trackers" className="bg-white rounded-xl border border-stone-200/80 p-5 md:p-6 shadow-sm scroll-mt-48">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            <h2 className="text-base font-semibold text-stone-900 tracking-tight flex items-center gap-2">
              <span>5. Deep Engagement & Retention Trackers</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-medium">
                Audience Hook & Attention
              </span>
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Watch times, completion rates, and active interaction breakdown across all 21 posts per platform
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-900 font-medium border border-purple-200">
            {engagementAndRetention.totalWatchTimeHours} Total Hours Watched
          </span>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="my-4 p-3.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed flex items-start gap-2.5">
        <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <p>{engagementAndRetention.summary}</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            <span>Total Watch Hours</span>
          </div>
          <div className="mt-1.5 text-lg font-bold text-stone-900">
            {engagementAndRetention.totalWatchTimeHours} hrs
          </div>
          <div className="text-[11px] text-stone-500">Across FB, IG, TikTok</div>
        </div>

        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Avg Watch Time / Post</span>
          </div>
          <div className="mt-1.5 text-lg font-bold text-stone-900">
            {engagementAndRetention.avgWatchTimeSeconds} seconds
          </div>
          <div className="text-[11px] text-stone-500">Hook retention baseline</div>
        </div>

        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            <span>Total Likes</span>
          </div>
          <div className="mt-1.5 text-lg font-bold text-stone-900">
            {engagementAndRetention.totalLikes.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500">Active affirmations</div>
        </div>

        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Shares & Saves</span>
          </div>
          <div className="mt-1.5 text-lg font-bold text-stone-900">
            {engagementAndRetention.totalShares + engagementAndRetention.totalSaves}
          </div>
          <div className="text-[11px] text-stone-500">Deep intent signals</div>
        </div>
      </div>

      {/* Granular Retention Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100 text-stone-600 font-semibold border-y border-stone-200">
              <th className="py-2.5 px-3">Platform (Full 21 Posts)</th>
              <th className="py-2.5 px-3">Total Watch Time</th>
              <th className="py-2.5 px-3">Avg Watch Time / Post</th>
              <th className="py-2.5 px-3">Likes</th>
              <th className="py-2.5 px-3">Comments</th>
              <th className="py-2.5 px-3">Shares</th>
              <th className="py-2.5 px-3">Saves / Completion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {engagementAndRetention.platforms.map((p) => {
              const badge = getPlatformBadgeColor(p.platform);
              return (
                <tr key={p.platform} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <span className={`inline-block font-semibold px-2 py-0.5 rounded border text-[11px] ${badge.bg} ${badge.text} ${badge.border}`}>
                      {p.platform}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-semibold text-stone-900">
                    <div>{p.watchTimeHours} Hours</div>
                    <div className="text-[10px] text-stone-400 font-normal">
                      ({p.watchTimeSeconds.toLocaleString()} secs)
                    </div>
                  </td>

                  <td className="py-3 px-3 font-medium text-stone-800">
                    {p.avgWatchTimePerPostSeconds} Seconds
                  </td>

                  <td className="py-3 px-3 font-medium text-stone-800">
                    {p.likes.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 font-medium text-stone-800">
                    {p.comments}
                  </td>

                  <td className="py-3 px-3 font-medium text-stone-800">
                    {p.shares}
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                      {p.savesOrOther}
                    </span>
                  </td>
                </tr>
              );
            })}
            {/* Consolidated row */}
            <tr className="bg-stone-50 font-semibold border-t-2 border-stone-200 text-stone-900">
              <td className="py-3 px-3">Consolidated Total</td>
              <td className="py-3 px-3">{engagementAndRetention.totalWatchTimeHours} Hours</td>
              <td className="py-3 px-3">{engagementAndRetention.avgWatchTimeSeconds} Seconds</td>
              <td className="py-3 px-3">{engagementAndRetention.totalLikes.toLocaleString()}</td>
              <td className="py-3 px-3">{engagementAndRetention.totalComments}</td>
              <td className="py-3 px-3">{engagementAndRetention.totalShares}</td>
              <td className="py-3 px-3 text-purple-900 font-bold">Highly Engaged</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
