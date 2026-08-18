import React from 'react';
import { WeeklyReport, EvergreenPlatformData } from '../types';
import { RefreshCw, Users, ExternalLink, Activity, Sparkles, Layers, Edit3, Check } from 'lucide-react';
import { formatNumber, formatPercent, getPlatformBadgeColor } from '../utils/formatters';

interface Props {
  report: WeeklyReport;
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
  onUpdateEvergreenPlatform?: (index: number, updatedFields: Partial<EvergreenPlatformData>) => void;
  onUpdateNarrative?: (narrative: string) => void;
}

export const EvergreenEngineSection: React.FC<Props> = ({ 
  report, 
  isEditMode = false,
  onToggleEditMode,
  onUpdateEvergreenPlatform,
  onUpdateNarrative
}) => {
  const { evergreenEngine } = report;

  return (
    <section id="section-evergreen-engine" className={`bg-white rounded-xl border p-5 md:p-6 shadow-sm scroll-mt-48 transition-all ${
      isEditMode ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-stone-200/80'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-900"></span>
            <h2 className="text-base font-semibold text-stone-900 tracking-tight flex items-center gap-2">
              <span>2. Consolidated Account-Wide Performance</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200 font-medium">
                The "Evergreen" Engine
              </span>
              {isEditMode && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold border border-amber-300 animate-pulse">
                  ✏️ Editing Evergreen Fields
                </span>
              )}
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Overall profile-wide performance combining new posts and circulating legacy content
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium border border-stone-200">
            Total Evergreen Views: <strong>{formatNumber(evergreenEngine.totalEvergreenViews)}</strong> ({evergreenEngine.evergreenSharePercent}% of total)
          </span>
        </div>
      </div>

      {/* Narrative block */}
      <div className="my-4 p-3.5 rounded-lg bg-stone-50 border border-stone-200/90 text-xs text-stone-700 leading-relaxed flex items-start gap-2.5">
        <RefreshCw className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
        {isEditMode && onUpdateNarrative ? (
          <div className="w-full">
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
              Evergreen Engine Narrative Summary:
            </label>
            <textarea
              rows={2}
              value={evergreenEngine.narrative}
              onChange={(e) => onUpdateNarrative(e.target.value)}
              className="w-full p-2 bg-white border border-stone-300 rounded-md text-xs focus:ring-1 focus:ring-stone-500 focus:outline-none"
            />
          </div>
        ) : (
          <p>{evergreenEngine.narrative}</p>
        )}
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
            <Layers className="w-3.5 h-3.5 text-stone-600" />
            <span>Evergreen Share</span>
          </div>
          <div className="mt-1.5 text-lg font-bold text-stone-900">
            {evergreenEngine.evergreenSharePercent}%
          </div>
          <div className="text-[11px] text-stone-500">Auto-calculated share of views</div>
        </div>
      </div>

      {/* Platform Detailed Metrics Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100 text-stone-600 font-semibold border-y border-stone-200">
              <th className="py-2.5 px-3">Platform</th>
              <th className="py-2.5 px-3">Followers & Net Growth</th>
              <th className="py-2.5 px-3">Profile / Page Visits</th>
              <th className="py-2.5 px-3">Website Clicks</th>
              <th className="py-2.5 px-3">Account-Wide Total Views</th>
              <th className="py-2.5 px-3">Interactions / Actions</th>
              <th className="py-2.5 px-3 bg-amber-50/70 border-l border-amber-200 font-bold text-stone-900">
                Evergreen Views (Circulating)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {evergreenEngine.platforms.map((p, idx) => {
              const badge = getPlatformBadgeColor(p.platform);
              return (
                <tr key={p.platform} className={isEditMode ? 'bg-amber-50/20 hover:bg-amber-50/40 transition-colors' : 'hover:bg-stone-50/80 transition-colors'}>
                  {/* Platform */}
                  <td className="py-3 px-3">
                    <span className={`inline-block font-semibold px-2 py-0.5 rounded border text-[11px] ${badge.bg} ${badge.text} ${badge.border}`}>
                      {p.platform}
                    </span>
                    {isEditMode && onUpdateEvergreenPlatform ? (
                      <input
                        type="text"
                        placeholder="Platform note / context..."
                        value={p.notes || ''}
                        onChange={(e) => onUpdateEvergreenPlatform(idx, { notes: e.target.value })}
                        className="text-[10px] text-stone-600 mt-1 w-full p-1 bg-white border border-stone-200 rounded"
                      />
                    ) : (
                      p.notes && (
                        <p className="text-[10px] text-stone-500 mt-1 max-w-[200px] leading-tight">
                          {p.notes}
                        </p>
                      )
                    )}
                  </td>

                  {/* Followers & Growth */}
                  <td className="py-3 px-3">
                    {isEditMode && onUpdateEvergreenPlatform ? (
                      <div className="space-y-1">
                        <div>
                          <label className="text-[9px] text-stone-400 block">Followers</label>
                          <input
                            type="number"
                            value={p.followers}
                            onChange={(e) => onUpdateEvergreenPlatform(idx, { followers: Number(e.target.value) || 0 })}
                            className="w-24 p-1 bg-white border border-stone-300 rounded font-semibold text-stone-900"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-stone-400 block">Net Growth (+/-)</label>
                          <input
                            type="number"
                            value={p.followerGrowthNet}
                            onChange={(e) => onUpdateEvergreenPlatform(idx, { followerGrowthNet: Number(e.target.value) || 0 })}
                            className="w-20 p-1 bg-white border border-stone-300 rounded text-[11px]"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="font-semibold text-stone-900">{p.followers.toLocaleString()}</div>
                        <div className={`text-[11px] font-medium ${p.followerGrowthNet >= 0 ? 'text-emerald-700' : 'text-stone-500'}`}>
                          {p.followerGrowthNet >= 0 ? `+${p.followerGrowthNet}` : p.followerGrowthNet} ({formatPercent(p.followerGrowthPercent)})
                        </div>
                      </>
                    )}
                  </td>

                  {/* Profile Visits */}
                  <td className="py-3 px-3">
                    {isEditMode && onUpdateEvergreenPlatform ? (
                      <div className="space-y-1">
                        <input
                          type="number"
                          value={p.profilePageVisits}
                          onChange={(e) => onUpdateEvergreenPlatform(idx, { profilePageVisits: Number(e.target.value) || 0 })}
                          className="w-24 p-1 bg-white border border-stone-300 rounded font-semibold text-stone-900"
                        />
                        <input
                          type="text"
                          placeholder="Note (e.g. +40.4% WoW)"
                          value={p.profileVisitsNote || ''}
                          onChange={(e) => onUpdateEvergreenPlatform(idx, { profileVisitsNote: e.target.value })}
                          className="text-[10px] w-full p-1 bg-white border border-stone-200 rounded"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="font-semibold text-stone-900">{p.profilePageVisits.toLocaleString()}</div>
                        {p.profileVisitsNote && (
                          <div className="text-[10px] text-stone-500">{p.profileVisitsNote}</div>
                        )}
                      </>
                    )}
                  </td>

                  {/* Website Clicks */}
                  <td className="py-3 px-3">
                    {isEditMode && onUpdateEvergreenPlatform ? (
                      <div className="space-y-1">
                        <input
                          type="number"
                          placeholder="Clicks"
                          value={p.websiteClicks || 0}
                          onChange={(e) => onUpdateEvergreenPlatform(idx, { websiteClicks: Number(e.target.value) || 0 })}
                          className="w-20 p-1 bg-white border border-stone-300 rounded font-semibold text-stone-900"
                        />
                        <input
                          type="text"
                          placeholder="Clicks Note"
                          value={p.websiteClicksNote || ''}
                          onChange={(e) => onUpdateEvergreenPlatform(idx, { websiteClicksNote: e.target.value })}
                          className="text-[10px] w-full p-1 bg-white border border-stone-200 rounded"
                        />
                      </div>
                    ) : (
                      p.websiteClicks !== undefined && p.websiteClicks > 0 ? (
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
                      )
                    )}
                  </td>

                  {/* Account Wide Views */}
                  <td className="py-3 px-3">
                    {isEditMode && onUpdateEvergreenPlatform ? (
                      <div className="space-y-1">
                        <input
                          type="number"
                          value={p.accountWideViews}
                          onChange={(e) => onUpdateEvergreenPlatform(idx, { accountWideViews: Number(e.target.value) || 0 })}
                          className="w-28 p-1 bg-white border border-stone-300 rounded font-bold text-stone-900"
                        />
                        <div className="text-[10px] text-stone-500">
                          {formatPercent(p.accountViewsChangePercent)} WoW
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="font-semibold text-stone-900">{formatNumber(p.accountWideViews)}</div>
                        <div className={`text-[11px] font-medium ${p.accountViewsChangePercent >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {formatPercent(p.accountViewsChangePercent)} WoW
                        </div>
                      </>
                    )}
                  </td>

                  {/* Profile Interactions */}
                  <td className="py-3 px-3">
                    {isEditMode && onUpdateEvergreenPlatform ? (
                      <input
                        type="text"
                        value={p.profileWideInteractions || ''}
                        onChange={(e) => onUpdateEvergreenPlatform(idx, { profileWideInteractions: e.target.value })}
                        className="w-24 p-1 bg-white border border-stone-300 rounded text-stone-800"
                      />
                    ) : (
                      <div className="font-medium text-stone-800">{p.profileWideInteractions}</div>
                    )}
                  </td>

                  {/* Evergreen Views (The primary requested field!) */}
                  <td className="py-3 px-3 bg-amber-50/60 border-l border-amber-200">
                    {isEditMode && onUpdateEvergreenPlatform ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={p.evergreenViews}
                            onChange={(e) => onUpdateEvergreenPlatform(idx, { evergreenViews: Number(e.target.value) || 0 })}
                            className="w-32 p-1.5 bg-white border-2 border-amber-500 rounded font-black text-stone-950 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Enter views..."
                          />
                        </div>
                        <div className="text-[10px] text-amber-900 font-semibold flex items-center gap-1">
                          <span>⚡ {p.evergreenSharePercent}% of platform</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="font-bold text-stone-900 text-sm">{formatNumber(p.evergreenViews)}</div>
                        <div className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-800 inline-block font-medium mt-0.5 border border-stone-200">
                          {p.evergreenSharePercent}% evergreen
                        </div>
                      </>
                    )}
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

