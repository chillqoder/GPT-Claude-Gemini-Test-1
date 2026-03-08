'use client';

import { AlertTriangle, SearchX, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchStore } from '../../store/searchStore';
import SourceStatusGrid from '../SourceStatusGrid';

export function AllFailedState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8"
    >
      <WifiOff size={48} className="text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2">All Sources Failed</h3>
      <p className="text-sm text-[#64748B] text-center mb-6 max-w-md">
        Unable to reach any news sources. Check your internet connection, try different keywords, or broaden your search terms.
      </p>
      <SourceStatusGrid />
    </motion.div>
  );
}

export function NoResultsState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8"
    >
      <SearchX size={48} className="text-[#64748B] mb-4" />
      <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2">No Results Found</h3>
      <p className="text-sm text-[#64748B] text-center max-w-md">
        Try broader keywords, a longer time range, or enable more sources.
      </p>
    </motion.div>
  );
}

export function PartialFailureToast({ failedCount, totalCount }: { failedCount: number; totalCount: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg text-sm text-[#F59E0B]"
    >
      <AlertTriangle size={16} />
      {failedCount}/{totalCount} sources unreachable. Results may be incomplete.
    </motion.div>
  );
}

export function OfflineBanner() {
  return (
    <div className="w-full px-4 py-2 bg-[#F59E0B]/10 border-b border-[#F59E0B]/30 text-center">
      <span className="text-xs font-mono text-[#F59E0B]">
        OFFLINE — Showing cached results
      </span>
    </div>
  );
}
