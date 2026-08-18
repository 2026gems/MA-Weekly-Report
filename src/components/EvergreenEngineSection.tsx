import React from 'react';
import { WeeklyReport } from '../types';
import { RefreshCw, Users, ExternalLink, Activity, Sparkles, Flame } from 'lucide-react';
import { formatNumber, formatPercent, getPlatformBadgeColor } from '../utils/formatters';

interface Props {
  report: WeeklyReport;
}

export const EvergreenEngineSection: React.FC<Props> = ({ report }) => {
  const { evergreenEngine, newEngine } = report;

  return (
    <section id="section-evergreen-engine" className="bg-white rounded-xl border border-stone-200/80 p-5 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <h2 className="text-base font-semibold text-stone-900 tracking-tight flex items-center gap-2">
              <span>2. Consolidated Account-Wide Performance</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium">
                The "Evergreen" Engine
              </span>
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Overall profile-wide performance combining new posts and circulating legacy content
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium border border-stone-200">
            Total Evergreen Views: {formatNumber(evergreenEngine.totalEvergreenViews)} ({evergreenEngine.evergreenSharePercent}% of total)
          </span>
        </div>
      </div>

      {/* Narrative block */}
      <div className="my-4 p-3.5 rounded-lg bg-stone-50 border border-stone-200/90 text-xs text-stone-700 leading-relaxed flex items-start gap-2.5">
        <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p>{evergreenEngine.narrative}</p>
      </div>

      {/* Combined Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-stone-600" />
            <span>Total Followers</span>
          </div>
          <div className="mt-1.5 text-lg font-bold text-stone-900">
            {evergreenEngine.combined.totalFollowers.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500">Across FB, IG, TikTok</div>
        </div>

        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-stone-600" />
            <span>Profile / Page Visits</span>
          </div>
          <div className="mt-1.5 text-lg font-bold text-stone-900">
            {evergreenEngine.combined.totalProfileVisits.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500">High intent visitors</div>
        </div>

        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
            <span>Website Link Clicks</span>
          </div>
          <div className="mt-1.5 text-lg font-bold text-stone-900">
            {evergreenEngine.combined.totalWebsiteClicks} clicks
          </div>
          <div className="text-[11px] text-stone-500">Qualified MBS traffic</div>
        </div>

        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Evergreen Share</span>
          </div>
          <div className="mt-1.5 text-lg font-bold text-emerald-700">
            {evergreenEngine.evergreenSharePercent}%
          </div>
          <div className="text-[11px] text-stone-500">Long-term algorithmic lift</div>
        </div>
      </div>

      {/* Platform Detailed Metrics Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100 text-stone-600 font-semibold border-y border-stone-200">
              <th className="py-2.5 px-3">Platform</th>
              <th className="py-2.5 px-3">Follower Growth</th>
              <th className="py-2.5 px-3">Profile / Page Visits</th>
              <th className="py-2.5 px-3">Website Clicks</th>
              <th className="py-2.5 px-3">Account-Wide Views</th>
              <th className="py-2.5 px-3">Profile Interactions</th>
              <th className="py-2.5 px-3">Evergreen Views</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {evergreenEngine.platforms.map((p) => {
              const badge = getPlatformBadgeColor(p.platform);
              return (
                <tr key={p.platform} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <span className={`inline-block font-semibold px-2 py-0.5 rounded border text-[11px] ${badge.bg} ${badge.text} ${badge.border}`}>
                      {p.platform}
                    </span>
                    {p.notes && (
                      <p className="text-[10px] text-stone-500 mt-1 max-w-[200px] leading-tight">
                        {p.notes}
                      </p>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-stone-900">{p.followers.toLocaleString()}</div>
                    <div className={`text-[11px] font-medium ${p.followerGrowthNet >= 0 ? 'text-emerald-700' : 'text-stone-500'}`}>
                      {p.followerGrowthNet >= 0 ? `+${p.followerGrowthNet}` : p.followerGrowthNet} ({formatPercent(p.followerGrowthPercent)})
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-stone-900">{p.profilePageVisits.toLocaleString()}</div>
                    {p.profileVisitsNote && (
                      <div className="text-[10px] text-stone-500">{p.profileVisitsNote}</div>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    {p.websiteClicks !== undefined && p.websiteClicks > 0 ? (
                      <div>
                        <div className="font-semibold text-stone-900">{p.websiteClicks} clicks</div>
                        {p.websiteClicksNote && (
                          <div className="text-[10px] text-stone-500">{p.websiteClicksNote}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-stone-400">
                        {p.websiteClicksNote || 'N/A (Omitted per guidelines)'}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-stone-900">{formatNumber(p.accountWideViews)}</div>
                    <div className={`text-[11px] font-medium ${p.accountViewsChangePercent >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {formatPercent(p.accountViewsChangePercent)} WoW
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-medium text-stone-800">{p.profileWideInteractions}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-stone-900">{formatNumber(p.evergreenViews)}</div>
                    <div className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 inline-block font-medium mt-0.5 border border-emerald-200">
                      {p.evergreenSharePercent}% evergreen
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
