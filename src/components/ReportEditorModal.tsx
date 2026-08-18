import React, { useState, useEffect } from 'react';
import { WeeklyReport } from '../types';
import { X, Save, RefreshCw, Sparkles, Check, Layers, Compass, Eye, ExternalLink } from 'lucide-react';
import { recomputeReport } from '../utils/recomputeReport';

interface Props {
  report: WeeklyReport;
  onSave: (updated: WeeklyReport) => void;
  onClose: () => void;
}

export const ReportEditorModal: React.FC<Props> = ({ report, onSave, onClose }) => {
  const [formData, setFormData] = useState<WeeklyReport>(JSON.parse(JSON.stringify(report)));
  const [activeSubTab, setActiveSubTab] = useState<'evergreen' | 'new_engine' | 'summary' | 'retention' | 'integrity'>('evergreen');
  const [autoRecomputedNotice, setAutoRecomputedNotice] = useState<boolean>(false);

  // Debounced auto-recomputation when inputs change
  const triggerAutoRecompute = (draft: WeeklyReport) => {
    const recomputed = recomputeReport(draft);
    setFormData(recomputed);
    setAutoRecomputedNotice(true);
    setTimeout(() => setAutoRecomputedNotice(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReport = recomputeReport(formData);
    onSave(finalReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-stone-300 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Edit Week {formData.weekNumber} Metrics & Missing Fields
              </h3>
              {autoRecomputedNotice ? (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-700 font-semibold animate-in fade-in">
                  <Check className="w-2.5 h-2.5" />
                  <span>Auto-recomputed affected totals</span>
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                  ⚡ Auto-recomputes on change
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Quickly edit Facebook Evergreen Views, platform totals, or metrics. All affected totals & % sync automatically.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Subtabs */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 py-1.5 flex space-x-1 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveSubTab('evergreen')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'evergreen'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/80'
            }`}
          >
            1. Evergreen Engine (FB Views)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('new_engine')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'new_engine'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/80'
            }`}
          >
            2. New Batch Engine
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('summary')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'summary'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/80'
            }`}
          >
            3. Summary & Strategic Shift
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('retention')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'retention'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/80'
            }`}
          >
            4. Retention & Attention
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('integrity')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'integrity'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/80'
            }`}
          >
            5. Cadence & Sign-off
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Subtab 1: Evergreen Engine & Facebook Views */}
          {activeSubTab === 'evergreen' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  <strong>Evergreen Engine & Facebook Views:</strong> If the PDF report omitted or zeroed out Facebook Evergreen Views, enter the correct number below. The system automatically recalculates the total evergreen views, evergreen share %, grand combined views, and WoW growth!
                </p>
              </div>

              <div className="space-y-3">
                {formData.evergreenEngine.platforms.map((platform, idx) => (
                  <div key={platform.platform} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm">
                        {platform.platform} Performance
                      </span>
                      <span className="text-[11px] font-semibold text-stone-600">
                        Share: {platform.evergreenSharePercent}% Evergreen
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                          Evergreen Views (Circulating)
                        </label>
                        <input
                          type="number"
                          value={platform.evergreenViews}
                          onChange={(e) => {
                            const newPlatforms = [...formData.evergreenEngine.platforms];
                            newPlatforms[idx] = {
                              ...newPlatforms[idx],
                              evergreenViews: Number(e.target.value) || 0,
                            };
                            triggerAutoRecompute({
                              ...formData,
                              evergreenEngine: {
                                ...formData.evergreenEngine,
                                platforms: newPlatforms,
                              },
                            });
                          }}
                          className="w-full p-2 bg-white border-2 border-amber-400 rounded-lg font-bold text-stone-900 focus:outline-none focus:border-amber-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 mb-1">
                          Account-Wide Views
                        </label>
                        <input
                          type="number"
                          value={platform.accountWideViews}
                          onChange={(e) => {
                            const newPlatforms = [...formData.evergreenEngine.platforms];
                            newPlatforms[idx] = {
                              ...newPlatforms[idx],
                              accountWideViews: Number(e.target.value) || 0,
                            };
                            triggerAutoRecompute({
                              ...formData,
                              evergreenEngine: {
                                ...formData.evergreenEngine,
                                platforms: newPlatforms,
                              },
                            });
                          }}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 mb-1">
                          Followers
                        </label>
                        <input
                          type="number"
                          value={platform.followers}
                          onChange={(e) => {
                            const newPlatforms = [...formData.evergreenEngine.platforms];
                            newPlatforms[idx] = {
                              ...newPlatforms[idx],
                              followers: Number(e.target.value) || 0,
                            };
                            triggerAutoRecompute({
                              ...formData,
                              evergreenEngine: {
                                ...formData.evergreenEngine,
                                platforms: newPlatforms,
                              },
                            });
                          }}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 mb-1">
                          Net Follower Growth (+/-)
                        </label>
                        <input
                          type="number"
                          value={platform.followerGrowthNet}
                          onChange={(e) => {
                            const newPlatforms = [...formData.evergreenEngine.platforms];
                            newPlatforms[idx] = {
                              ...newPlatforms[idx],
                              followerGrowthNet: Number(e.target.value) || 0,
                            };
                            triggerAutoRecompute({
                              ...formData,
                              evergreenEngine: {
                                ...formData.evergreenEngine,
                                platforms: newPlatforms,
                              },
                            });
                          }}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 mb-1">
                          Profile / Page Visits
                        </label>
                        <input
                          type="number"
                          value={platform.profilePageVisits}
                          onChange={(e) => {
                            const newPlatforms = [...formData.evergreenEngine.platforms];
                            newPlatforms[idx] = {
                              ...newPlatforms[idx],
                              profilePageVisits: Number(e.target.value) || 0,
                            };
                            triggerAutoRecompute({
                              ...formData,
                              evergreenEngine: {
                                ...formData.evergreenEngine,
                                platforms: newPlatforms,
                              },
                            });
                          }}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 mb-1">
                          Website Clicks
                        </label>
                        <input
                          type="number"
                          value={platform.websiteClicks || 0}
                          onChange={(e) => {
                            const newPlatforms = [...formData.evergreenEngine.platforms];
                            newPlatforms[idx] = {
                              ...newPlatforms[idx],
                              websiteClicks: Number(e.target.value) || 0,
                            };
                            triggerAutoRecompute({
                              ...formData,
                              evergreenEngine: {
                                ...formData.evergreenEngine,
                                platforms: newPlatforms,
                              },
                            });
                          }}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[10px] font-semibold text-stone-500 mb-1">
                          Platform Context / Notes
                        </label>
                        <input
                          type="text"
                          value={platform.notes || ''}
                          onChange={(e) => {
                            const newPlatforms = [...formData.evergreenEngine.platforms];
                            newPlatforms[idx] = {
                              ...newPlatforms[idx],
                              notes: e.target.value,
                            };
                            setFormData({
                              ...formData,
                              evergreenEngine: {
                                ...formData.evergreenEngine,
                                platforms: newPlatforms,
                              },
                            });
                          }}
                          placeholder="e.g. Profile visits +40.4% WoW"
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Evergreen Narrative Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.evergreenEngine.narrative}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      evergreenEngine: {
                        ...formData.evergreenEngine,
                        narrative: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>
          )}

          {/* Subtab 2: New Batch Engine */}
          {activeSubTab === 'new_engine' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {formData.newEngine.platforms.map((platform, idx) => (
                  <div key={platform.platform} className="p-3 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                    <div className="font-bold text-stone-900 text-xs">
                      {platform.platform} (New Batch)
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 mb-0.5">Posts Published</label>
                      <input
                        type="number"
                        value={platform.postsPublished}
                        onChange={(e) => {
                          const newP = [...formData.newEngine.platforms];
                          newP[idx] = { ...newP[idx], postsPublished: Number(e.target.value) || 0 };
                          triggerAutoRecompute({
                            ...formData,
                            newEngine: { ...formData.newEngine, platforms: newP },
                          });
                        }}
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 mb-0.5">Total New Views</label>
                      <input
                        type="number"
                        value={platform.totalNewViews}
                        onChange={(e) => {
                          const newP = [...formData.newEngine.platforms];
                          newP[idx] = { ...newP[idx], totalNewViews: Number(e.target.value) || 0 };
                          triggerAutoRecompute({
                            ...formData,
                            newEngine: { ...formData.newEngine, platforms: newP },
                          });
                        }}
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-lg font-semibold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 mb-0.5">Median Views / Post</label>
                      <input
                        type="number"
                        value={platform.medianViewsPerPost}
                        onChange={(e) => {
                          const newP = [...formData.newEngine.platforms];
                          newP[idx] = { ...newP[idx], medianViewsPerPost: Number(e.target.value) || 0 };
                          triggerAutoRecompute({
                            ...formData,
                            newEngine: { ...formData.newEngine, platforms: newP },
                          });
                        }}
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-lg font-bold text-stone-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 mb-0.5">Interactions</label>
                      <input
                        type="number"
                        value={platform.interactions}
                        onChange={(e) => {
                          const newP = [...formData.newEngine.platforms];
                          newP[idx] = { ...newP[idx], interactions: Number(e.target.value) || 0 };
                          triggerAutoRecompute({
                            ...formData,
                            newEngine: { ...formData.newEngine, platforms: newP },
                          });
                        }}
                        className="w-full p-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  New Engine Narrative Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.newEngine.narrative}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newEngine: { ...formData.newEngine, narrative: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>
          )}

          {/* Subtab 3: Summary & Strategic Shift */}
          {activeSubTab === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">Week #</label>
                  <input
                    type="number"
                    value={formData.weekNumber}
                    onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) || 1 })}
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">Date Range</label>
                  <input
                    type="text"
                    value={formData.dateRange}
                    onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">Prepared By</label>
                  <input
                    type="text"
                    value={formData.preparedBy}
                    onChange={(e) => setFormData({ ...formData, preparedBy: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  Executive Summary Paragraph
                </label>
                <textarea
                  rows={3}
                  value={formData.executiveSummary.summaryText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      executiveSummary: { ...formData.executiveSummary, summaryText: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  Key Strategic Shift
                </label>
                <textarea
                  rows={3}
                  value={formData.executiveSummary.keyStrategicShift}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      executiveSummary: { ...formData.executiveSummary, keyStrategicShift: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>
          )}

          {/* Subtab 4: Retention & Attention */}
          {activeSubTab === 'retention' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Total Watch Hours</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.engagementAndRetention.totalWatchTimeHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        engagementAndRetention: {
                          ...formData.engagementAndRetention,
                          totalWatchTimeHours: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Avg Watch Time (sec)</label>
                  <input
                    type="number"
                    value={formData.engagementAndRetention.avgWatchTimeSeconds}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        engagementAndRetention: {
                          ...formData.engagementAndRetention,
                          avgWatchTimeSeconds: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Total Likes</label>
                  <input
                    type="number"
                    value={formData.engagementAndRetention.breakdown.likes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        engagementAndRetention: {
                          ...formData.engagementAndRetention,
                          breakdown: {
                            ...formData.engagementAndRetention.breakdown,
                            likes: parseInt(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Total Shares</label>
                  <input
                    type="number"
                    value={formData.engagementAndRetention.breakdown.shares}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        engagementAndRetention: {
                          ...formData.engagementAndRetention,
                          breakdown: {
                            ...formData.engagementAndRetention.breakdown,
                            shares: parseInt(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Subtab 5: Cadence & Sign-off */}
          {activeSubTab === 'integrity' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-stone-600 mb-1">Scheduled Target</label>
                  <input
                    type="number"
                    value={formData.operationalIntegrity.totalScheduled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        operationalIntegrity: {
                          ...formData.operationalIntegrity,
                          totalScheduled: parseInt(e.target.value) || 63,
                        },
                      })
                    }
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-600 mb-1">Published Posts</label>
                  <input
                    type="number"
                    value={formData.operationalIntegrity.totalPublished}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        operationalIntegrity: {
                          ...formData.operationalIntegrity,
                          totalPublished: parseInt(e.target.value) || 63,
                        },
                      })
                    }
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-600 mb-1">Operational Status</label>
                  <input
                    type="text"
                    value={formData.operationalIntegrity.operationalStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        operationalIntegrity: {
                          ...formData.operationalIntegrity,
                          operationalStatus: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  Closing Mandatory Sign-Off
                </label>
                <input
                  type="text"
                  value={formData.strategicInsights.closingSignOff}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      strategicInsights: {
                        ...formData.strategicInsights,
                        closingSignOff: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border border-stone-300 rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => triggerAutoRecompute(formData)}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Force recalculate derived metrics"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Force Recalculate Now</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
