import React from 'react';
import { ActiveTab, WeeklyReport } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  UploadCloud, 
  Printer, 
  Calendar, 
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  reports: WeeklyReport[];
  selectedReportId: string;
  onSelectReport: (id: string) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenUploadModal: () => void;
  onOpenEditorModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
  activeTab,
  onTabChange,
  onOpenUploadModal,
  onOpenEditorModal,
}) => {
  const currentReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  return (
    <header id="main-header" className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-30 shadow-sm">
      {/* Top Brand & Metadata Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-inner text-stone-950 font-bold text-lg tracking-tight">
              M
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold tracking-tight text-white">
                  Memorialize Art
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium">
                  Social Media Intelligence
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1.5">
                <span>Weekly Consolidated Performance</span>
                <span className="text-stone-600">•</span>
                <span>Prepared for <strong className="text-stone-300 font-normal">Ahmed</strong> by <strong className="text-amber-400 font-medium">MOAE Digitals</strong></span>
              </p>
            </div>
          </div>

          {/* Action buttons & Week Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-stone-800/90 rounded-lg p-1 border border-stone-700">
              {reports.map((report) => {
                const isSelected = report.id === selectedReportId;
                return (
                  <button
                    key={report.id}
                    id={`week-btn-${report.id}`}
                    onClick={() => onSelectReport(report.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 shadow-sm font-semibold'
                        : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                    }`}
                  >
                    Week {report.weekNumber}
                  </button>
                );
              })}
            </div>

            <button
              id="upload-report-header-btn"
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium transition-colors cursor-pointer"
              title="Upload New Report or Raw Analytics"
            >
              <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
              <span>Import Data</span>
            </button>

            <button
              id="edit-report-header-btn"
              onClick={onOpenEditorModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-medium transition-colors cursor-pointer"
              title="Edit Current Week's Data Points"
            >
              <span>Edit Metrics</span>
            </button>
          </div>
        </div>

        {/* Current Selected Week Quick Info Banner */}
        {currentReport && (
          <div className="mt-3 pt-3 border-t border-stone-800/80 flex flex-wrap items-center justify-between text-xs text-stone-400 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-stone-300">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-white">Week {currentReport.weekNumber}</span> ({currentReport.dateRange})
              </span>
              <span className="text-stone-600">|</span>
              <span className="flex items-center gap-1 text-stone-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {currentReport.operationalIntegrity.operationalStatus} ({currentReport.operationalIntegrity.totalPublished}/{currentReport.operationalIntegrity.totalScheduled} posts)
              </span>
            </div>

            <div className="flex items-center gap-3 text-stone-400">
              <span>Account Views: <strong className="text-stone-100 font-semibold">{currentReport.executiveSummary.grandCombinedViewsFormatted}</strong></span>
              <span className="text-stone-600">•</span>
              <span>New Content Views: <strong className="text-amber-400 font-semibold">{currentReport.newEngine.totalNewViews.toLocaleString()}</strong></span>
              <span className="text-stone-600">•</span>
              <span>Median Baseline: <strong className="text-emerald-400 font-semibold">{currentReport.newEngine.medianViewsPerPost.toLocaleString()}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-stone-950/80 border-t border-stone-800/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex space-x-1 overflow-x-auto py-1.5 scrollbar-none">
          <button
            id="tab-dashboard"
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-stone-800 text-amber-400 font-semibold shadow-inner'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Weekly Dashboard</span>
          </button>

          <button
            id="tab-comparison"
            onClick={() => onTabChange('comparison')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-stone-800 text-amber-400 font-semibold shadow-inner'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Growth & WoW Comparison</span>
          </button>

          <button
            id="tab-themes"
            onClick={() => onTabChange('themes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'themes'
                ? 'bg-stone-800 text-amber-400 font-semibold shadow-inner'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Emotional Themes Matrix</span>
          </button>

          <button
            id="tab-upload"
            onClick={() => onTabChange('upload')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-stone-800 text-amber-400 font-semibold shadow-inner'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload & Import Data</span>
          </button>

          <button
            id="tab-export"
            onClick={() => onTabChange('export')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'export'
                ? 'bg-stone-800 text-amber-400 font-semibold shadow-inner'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export & PDF View</span>
          </button>
        </div>
      </div>
    </header>
  );
};
