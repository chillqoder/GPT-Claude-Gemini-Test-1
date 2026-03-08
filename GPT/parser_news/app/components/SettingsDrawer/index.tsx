"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, PanelsTopLeft, Settings2, Trash2, X } from "lucide-react";

import type { FontSize, ThemeMode, TimeRange } from "@/lib/types";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  fontSize: FontSize;
  theme: ThemeMode;
  refreshInterval: number;
  timeRange: TimeRange;
  articleLimit: number;
  defaultKeywordPresets: string[];
  onSetFontSize: (value: FontSize) => void;
  onSetTheme: (value: ThemeMode) => void;
  onSetRefreshInterval: (value: number) => void;
  onSetTimeRange: (value: TimeRange) => void;
  onSetArticleLimit: (value: number) => void;
  onSetDefaultKeywordPresets: (value: string[]) => void;
  onClearCache: () => void;
  onExportJson: () => void;
  onExportCsv: () => void;
}

export function SettingsDrawer({
  open,
  onClose,
  fontSize,
  theme,
  refreshInterval,
  timeRange,
  articleLimit,
  defaultKeywordPresets,
  onSetFontSize,
  onSetTheme,
  onSetRefreshInterval,
  onSetTimeRange,
  onSetArticleLimit,
  onSetDefaultKeywordPresets,
  onClearCache,
  onExportJson,
  onExportCsv,
}: SettingsDrawerProps) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close settings drawer"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-md border-l border-line/80 bg-background/95 p-5 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                  Workspace
                </p>
                <h2 className="mt-2 font-headline text-3xl text-text">Settings</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 space-y-7 overflow-y-auto pb-10 text-sm" style={{ maxHeight: "calc(100vh - 140px)" }}>
              <section className="surface-panel rounded-[28px] p-5">
                <div className="flex items-center gap-2">
                  <PanelsTopLeft className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-text">Reader defaults</h3>
                </div>
                <div className="mt-4 grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-muted">Default time range</span>
                    <select
                      value={timeRange}
                      onChange={(event) => onSetTimeRange(event.target.value as TimeRange)}
                      className="rounded-2xl border bg-white/5 px-4 py-3"
                    >
                      <option value="1h">Last 1h</option>
                      <option value="6h">Last 6h</option>
                      <option value="today">Today</option>
                      <option value="7d">Last 7 days</option>
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-muted">Default article limit</span>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={articleLimit}
                      onChange={(event) => onSetArticleLimit(Number(event.target.value))}
                    />
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                      {articleLimit} articles
                    </span>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-muted">Keyword presets</span>
                    <textarea
                      rows={4}
                      defaultValue={defaultKeywordPresets.join(", ")}
                      onBlur={(event) =>
                        onSetDefaultKeywordPresets(event.target.value.split(","))
                      }
                      className="rounded-2xl border bg-white/5 px-4 py-3"
                      placeholder="ai, earnings, inflation"
                    />
                  </label>
                </div>
              </section>

              <section className="surface-panel rounded-[28px] p-5">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-accent" />
                  <h3 className="font-medium text-text">Appearance & refresh</h3>
                </div>
                <div className="mt-4 grid gap-4">
                  <div>
                    <span className="text-muted">Theme</span>
                    <div className="mt-2 flex gap-2">
                      {(["dark", "light"] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => onSetTheme(value)}
                          className="chip"
                          data-active={theme === value}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-muted">Font size</span>
                    <div className="mt-2 flex gap-2">
                      {(["sm", "md", "lg"] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => onSetFontSize(value)}
                          className="chip"
                          data-active={fontSize === value}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="grid gap-2">
                    <span className="text-muted">Auto refresh</span>
                    <select
                      value={refreshInterval}
                      onChange={(event) => onSetRefreshInterval(Number(event.target.value))}
                      className="rounded-2xl border bg-white/5 px-4 py-3"
                    >
                      <option value={0}>Off</option>
                      <option value={5}>5 min</option>
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className="surface-panel rounded-[28px] p-5">
                <h3 className="font-medium text-text">Data controls</h3>
                <div className="mt-4 grid gap-3">
                  <button
                    type="button"
                    onClick={onExportJson}
                    className="inline-flex items-center justify-between rounded-2xl border bg-white/5 px-4 py-3"
                  >
                    Export current results as JSON
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onExportCsv}
                    className="inline-flex items-center justify-between rounded-2xl border bg-white/5 px-4 py-3"
                  >
                    Export current results as CSV
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onClearCache}
                    className="inline-flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-200"
                  >
                    Clear cached data
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </section>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
