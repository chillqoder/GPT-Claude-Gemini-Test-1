'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { useSearchStore, RefreshInterval } from '../../store/searchStore';

const INTERVALS: { label: string; value: RefreshInterval }[] = [
  { label: 'Off', value: 0 },
  { label: '5m', value: 5 },
  { label: '15m', value: 15 },
  { label: '30m', value: 30 },
];

interface RefreshEngineProps {
  onRefresh: () => void;
}

export default function RefreshEngine({ onRefresh }: RefreshEngineProps) {
  const { refreshInterval, setRefreshInterval, isLoading } = useSearchStore();
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    timerRef.current = null;
    countdownRef.current = null;
  }, []);

  useEffect(() => {
    clearTimers();
    if (refreshInterval === 0) {
      setCountdown(0);
      return;
    }

    const totalSeconds = refreshInterval * 60;
    setCountdown(totalSeconds);

    countdownRef.current = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : totalSeconds));
    }, 1000);

    timerRef.current = setInterval(() => {
      onRefresh();
      setCountdown(totalSeconds);
    }, totalSeconds * 1000);

    return clearTimers;
  }, [refreshInterval, onRefresh, clearTimers]);

  const progress = refreshInterval > 0 ? countdown / (refreshInterval * 60) : 0;
  const circumference = 2 * Math.PI * 10;
  const offset = circumference * (1 - progress);

  return (
    <div className="flex items-center gap-2">
      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="p-2 text-[#64748B] hover:text-[#3B82F6] transition-colors disabled:opacity-40"
        title="Refresh"
      >
        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
      </button>

      {/* Countdown Ring */}
      {refreshInterval > 0 && (
        <div className="relative w-7 h-7">
          <svg className="w-7 h-7 -rotate-90" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="#2D3748" strokeWidth="2" />
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-[#64748B]">
            {Math.floor(countdown / 60)}m
          </span>
        </div>
      )}

      {/* Interval Selector */}
      <div className="flex bg-[#1A1D27] rounded border border-[#2D3748] overflow-hidden">
        {INTERVALS.map(int => (
          <button
            key={int.value}
            onClick={() => setRefreshInterval(int.value)}
            className={`px-2 py-1 text-[10px] font-mono transition-colors ${
              refreshInterval === int.value
                ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                : 'text-[#64748B] hover:text-[#F1F5F9]'
            }`}
          >
            {int.label}
          </button>
        ))}
      </div>
    </div>
  );
}
