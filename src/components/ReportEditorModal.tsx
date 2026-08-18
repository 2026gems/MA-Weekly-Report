import React, { useState } from 'react';
import { WeeklyReport } from '../types';
import { X, Save } from 'lucide-react';

interface Props {
  report: WeeklyReport;
  onSave: (updated: WeeklyReport) => void;
  onClose: () => void;
}

export const ReportEditorModal: React.FC<Props> = ({ report, onSave, onClose }) => {
  const [formData, setFormData] = useState<WeeklyReport>(JSON.parse(JSON.stringify(report)));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Edit Week {formData.weekNumber} Metrics & Data Points
            </h3>
            <p className="text-xs text-stone-500">
              Adjust any extracted field or add missing data for Memorialize Art
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Basic Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">Week #</label>
              <input
                type="number"
                value={formData.weekNumber}
                onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) || 1 })}
                className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">Date Range</label>
              <input
                type="text"
                value={formData.dateRange}
                onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">Prepared By</label>
              <input
                type="text"
                value={formData.preparedBy}
                onChange={(e) => setFormData({ ...formData, preparedBy: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>

          {/* Section 1 & 2: Views & Baseline */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
              Key Metrics & Baselining
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-stone-600 mb-1">Total Account Views</label>
                <input
                  type="number"
                  value={formData.executiveSummary.grandCombinedViews}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      executiveSummary: {
                        ...formData.executiveSummary,
                        grandCombinedViews: val,
                        grandCombinedViewsFormatted: `${(val / 1000).toFixed(1)}K`,
                      },
                    });
                  }}
                  className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">New Content Views</label>
                <input
                  type="number"
                  value={formData.newEngine.totalNewViews}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newEngine: { ...formData.newEngine, totalNewViews: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-800 font-semibold mb-1">Median Views / Post</label>
                <input
                  type="number"
                  value={formData.newEngine.medianViewsPerPost}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newEngine: { ...formData.newEngine, medianViewsPerPost: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full p-2 border border-stone-400 rounded-lg bg-white font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">Total Watch Hours</label>
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
                  className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* Key Strategic Shift */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
              Key Strategic Shift / Summary
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

          {/* Operational Integrity */}
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

          {/* Closing Sign-off */}
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

          {/* Footer actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
