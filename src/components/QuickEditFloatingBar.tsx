import React from 'react';
import { Save, RotateCcw, Check, Sparkles, AlertCircle, RefreshCw, X } from 'lucide-react';

interface QuickEditFloatingBarProps {
  isEditMode: boolean;
  hasUnsavedChanges: boolean;
  isRecomputing: boolean;
  recomputeNotice: string | null;
  weekNumber: number;
  onSaveChanges: () => void;
  onDiscardChanges: () => void;
  onForceRecompute: () => void;
  onToggleEditMode: () => void;
}

export const QuickEditFloatingBar: React.FC<QuickEditFloatingBarProps> = ({
  isEditMode,
  hasUnsavedChanges,
  isRecomputing,
  recomputeNotice,
  weekNumber,
  onSaveChanges,
  onDiscardChanges,
  onForceRecompute,
  onToggleEditMode,
}) => {
  if (!isEditMode) return null;

  return (
    <aside 
      aria-label="Quick Edit Actions"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[94%] bg-stone-900/95 backdrop-blur-md text-white border border-stone-700 shadow-2xl rounded-2xl p-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* Status & Guidance */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">
              Quick Edit Mode (Week {weekNumber})
            </span>
            {isRecomputing ? (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-900/80 text-blue-200 border border-blue-700 font-medium">
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                <span>Recomputing affected metrics...</span>
              </span>
            ) : recomputeNotice ? (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-700 font-medium animate-in fade-in">
                <Check className="w-2.5 h-2.5" />
                <span>{recomputeNotice}</span>
              </span>
            ) : (
              <span className="text-[10px] text-stone-400">
                Type numbers in any field to auto-recompute totals & %
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-400">
            {hasUnsavedChanges 
              ? 'You have unsaved changes. Click Save to persist to cloud database.' 
              : 'Edit Facebook Evergreen views or other metrics directly in any table or card.'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={onForceRecompute}
          className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
          title="Force immediate recalculation of all formulas"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Recalculate Now</span>
        </button>

        {hasUnsavedChanges && (
          <button
            onClick={onDiscardChanges}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-rose-950/60 hover:text-rose-300 text-stone-300 border border-stone-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
            title="Discard changes and revert to saved report"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Discard</span>
          </button>
        )}

        <button
          id="quick-edit-save-btn"
          onClick={onSaveChanges}
          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>

        <button
          onClick={onToggleEditMode}
          className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          title="Exit Edit Mode"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
