"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock3, PanelLeftClose, Star, Trash2 } from "lucide-react";

import type { SearchHistoryEntry, SearchPreset } from "@/lib/types";

interface HistorySidebarProps {
  open: boolean;
  history: SearchHistoryEntry[];
  savedPresets: SearchPreset[];
  onClose: () => void;
  onApplyPreset: (preset: SearchPreset) => void;
  onRemovePreset: (presetId: string) => void;
}

function PresetRow({
  label,
  meta,
  onClick,
  onRemove,
}: {
  label: string;
  meta: string;
  onClick: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="surface-panel flex items-start justify-between gap-4 rounded-[24px] px-4 py-4 transition hover:-translate-y-0.5">
      <button type="button" onClick={onClick} className="flex-1 text-left">
        <p className="text-sm font-medium text-text">{label}</p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          {meta}
        </p>
      </button>
      {onRemove ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white/5"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export function HistorySidebar({
  open,
  history,
  savedPresets,
  onClose,
  onApplyPreset,
  onRemovePreset,
}: HistorySidebarProps) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close history sidebar"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="fixed left-0 top-0 z-50 h-screen w-full max-w-sm border-r border-line/80 bg-background/95 p-5 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                  Search memory
                </p>
                <h2 className="mt-2 font-headline text-3xl text-text">History</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white/5"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 space-y-8 overflow-y-auto pb-10" style={{ maxHeight: "calc(100vh - 140px)" }}>
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent" />
                  <h3 className="font-medium text-text">Saved presets</h3>
                </div>
                <div className="space-y-3">
                  {savedPresets.length === 0 ? (
                    <p className="text-sm text-muted">
                      Save your current search to pin it here.
                    </p>
                  ) : (
                    savedPresets.map((preset) => (
                      <PresetRow
                        key={preset.id}
                        label={preset.label}
                        meta={`${preset.timeRange} · ${preset.articleLimit} articles`}
                        onClick={() => onApplyPreset(preset)}
                        onRemove={() => onRemovePreset(preset.id)}
                      />
                    ))
                  )}
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-text">Recent searches</h3>
                </div>
                <div className="space-y-3">
                  {history.length === 0 ? (
                    <p className="text-sm text-muted">No recent searches yet.</p>
                  ) : (
                    history.map((entry) => (
                      <PresetRow
                        key={entry.id}
                        label={entry.label}
                        meta={new Date(entry.lastUsedAt).toLocaleString()}
                        onClick={() => onApplyPreset(entry.preset)}
                      />
                    ))
                  )}
                </div>
              </section>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
