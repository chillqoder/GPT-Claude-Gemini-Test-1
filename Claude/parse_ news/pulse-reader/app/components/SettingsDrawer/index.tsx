'use client';

import { X, Moon, Sun, Download, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore, FontSize } from '../../store/searchStore';
import { clearCache } from '../../lib/cache';

const FONT_SIZES: { label: string; value: FontSize }[] = [
  { label: 'S', value: 'small' },
  { label: 'M', value: 'medium' },
  { label: 'L', value: 'large' },
];

export default function SettingsDrawer() {
  const {
    settingsOpen, setSettingsOpen,
    darkMode, setDarkMode,
    fontSize, setFontSize,
    articles,
  } = useSearchStore();

  const exportResults = (format: 'json' | 'csv') => {
    if (articles.length === 0) return;

    let content: string;
    let mimeType: string;
    let ext: string;

    if (format === 'json') {
      content = JSON.stringify(articles.map(a => ({
        title: a.title,
        excerpt: a.excerpt,
        url: a.url,
        source: a.source.name,
        publishedAt: a.publishedAt.toISOString(),
        keywords: a.keywords,
      })), null, 2);
      mimeType = 'application/json';
      ext = 'json';
    } else {
      const headers = 'Title,Source,URL,Published At,Keywords';
      const rows = articles.map(a =>
        `"${a.title.replace(/"/g, '""')}","${a.source.name}","${a.url}","${a.publishedAt.toISOString()}","${a.keywords.join(';')}"`
      );
      content = [headers, ...rows].join('\n');
      mimeType = 'text/csv';
      ext = 'csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulse-reader-export.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearCache = () => {
    clearCache();
    localStorage.removeItem('pr_history');
    localStorage.removeItem('pr_layout');
    localStorage.removeItem('pr_fontSize');
  };

  return (
    <AnimatePresence>
      {settingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSettingsOpen(false)}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-80 bg-[#0F1117] border-l border-[#2D3748] z-50 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#F1F5F9]">Settings</h2>
              <button onClick={() => setSettingsOpen(false)} className="text-[#64748B] hover:text-[#F1F5F9]">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#F1F5F9]">Theme</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1D27] border border-[#2D3748] rounded-lg text-sm text-[#64748B] hover:text-[#F1F5F9]"
                >
                  {darkMode ? <Moon size={14} /> : <Sun size={14} />}
                  {darkMode ? 'Dark' : 'Light'}
                </button>
              </div>

              {/* Font Size */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#F1F5F9]">Font Size</span>
                <div className="flex bg-[#1A1D27] rounded-lg border border-[#2D3748] overflow-hidden">
                  {FONT_SIZES.map(fs => (
                    <button
                      key={fs.value}
                      onClick={() => setFontSize(fs.value)}
                      className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                        fontSize === fs.value
                          ? 'bg-[#3B82F6] text-white'
                          : 'text-[#64748B] hover:text-[#F1F5F9]'
                      }`}
                    >
                      {fs.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Export */}
              <div>
                <span className="text-sm text-[#F1F5F9] block mb-2">Export Results</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => exportResults('json')}
                    disabled={articles.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1D27] border border-[#2D3748] rounded-lg text-xs text-[#64748B] hover:text-[#F1F5F9] disabled:opacity-40"
                  >
                    <Download size={12} />
                    JSON
                  </button>
                  <button
                    onClick={() => exportResults('csv')}
                    disabled={articles.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1D27] border border-[#2D3748] rounded-lg text-xs text-[#64748B] hover:text-[#F1F5F9] disabled:opacity-40"
                  >
                    <Download size={12} />
                    CSV
                  </button>
                </div>
              </div>

              {/* Clear Cache */}
              <button
                onClick={handleClearCache}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 border border-red-400/20 rounded-lg hover:bg-red-400/10 transition-colors w-full"
              >
                <Trash2 size={14} />
                Clear All Cached Data
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
