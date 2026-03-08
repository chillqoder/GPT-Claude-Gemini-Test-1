'use client';

import { useState } from 'react';
import { ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Article } from '../../lib/parsers/normalize';
import { domainColor, relativeTime } from '../../lib/utils';
import { LayoutMode } from '../../store/searchStore';

interface ArticleCardProps {
  article: Article;
  layout: LayoutMode;
  isNew: boolean;
  isStale: boolean;
  index: number;
}

function PlaceholderImage({ name }: { name: string }) {
  const initials = name
    .split(/[\s.]+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('');
  return (
    <div className="w-full h-full bg-[#2D3748] flex items-center justify-center">
      <span className="text-2xl font-bold text-[#64748B]">{initials}</span>
    </div>
  );
}

export default function ArticleCard({ article, layout, isNew, isStale, index }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);
  const [saved, setSaved] = useState(false);
  const color = domainColor(article.source.domain);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: article.title, url: article.url });
    } else {
      await navigator.clipboard.writeText(article.url);
    }
  };

  if (layout === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isStale ? 0.4 : 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        className="flex gap-4 bg-[#1A1D27] border border-[#2D3748] rounded-lg overflow-hidden hover:border-[#3B82F6]/50 transition-colors"
      >
        {/* Image */}
        <div className="w-[120px] h-[90px] shrink-0 relative">
          {article.imageUrl && !imgError ? (
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <PlaceholderImage name={article.source.name} />
          )}
          {isNew && (
            <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#22C55E] text-[#0F1117] text-[10px] font-bold rounded animate-pulse">
              NEW
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 py-2 pr-3 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-mono text-[#64748B] truncate">{article.source.name}</span>
            <span className="text-[10px] font-mono text-[#64748B] ml-auto shrink-0" title={article.publishedAt.toISOString()}>
              {relativeTime(article.publishedAt)}
            </span>
          </div>
          <h3 className="text-sm font-serif text-[#F1F5F9] line-clamp-1 mb-1 leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-[#64748B] line-clamp-1">{article.excerpt}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pr-3 shrink-0">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[#64748B] hover:text-[#3B82F6]">
            <ExternalLink size={14} />
          </a>
          <button onClick={() => setSaved(!saved)} className={`p-1.5 ${saved ? 'text-[#F59E0B]' : 'text-[#64748B] hover:text-[#F1F5F9]'}`}>
            <Bookmark size={14} fill={saved ? '#F59E0B' : 'none'} />
          </button>
        </div>
      </motion.article>
    );
  }

  // Grid or Focus layout
  const isFocus = layout === 'focus';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isStale ? 0.4 : 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-[#1A1D27] border border-[#2D3748] rounded-lg overflow-hidden hover:border-[#3B82F6]/50 transition-colors flex flex-col ${
        isFocus ? 'max-w-2xl mx-auto' : ''
      }`}
    >
      {/* Image */}
      <div className="relative aspect-video">
        {article.imageUrl && !imgError ? (
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <PlaceholderImage name={article.source.name} />
        )}
        {isNew && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#22C55E] text-[#0F1117] text-[10px] font-bold rounded animate-pulse">
            NEW
          </span>
        )}
      </div>

      {/* Content */}
      <div className={`p-4 flex flex-col flex-1 ${isFocus ? 'p-6' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wide">{article.source.name}</span>
          <span className="text-[10px] font-mono text-[#64748B] ml-auto" title={article.publishedAt.toISOString()}>
            {relativeTime(article.publishedAt)}
          </span>
        </div>

        <h3 className={`font-serif text-[#F1F5F9] line-clamp-2 mb-2 leading-snug ${isFocus ? 'text-xl' : 'text-base'}`}>
          {article.title}
        </h3>

        <p className={`text-[#64748B] line-clamp-3 flex-1 ${isFocus ? 'text-[15px] leading-relaxed' : 'text-sm'}`}>
          {article.excerpt}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2D3748]">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
          >
            <ExternalLink size={13} />
            READ ORIGINAL
          </a>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSaved(!saved)}
              className={`p-1.5 rounded transition-colors ${saved ? 'text-[#F59E0B]' : 'text-[#64748B] hover:text-[#F1F5F9]'}`}
            >
              <Bookmark size={15} fill={saved ? '#F59E0B' : 'none'} />
            </button>
            <button onClick={handleShare} className="p-1.5 text-[#64748B] hover:text-[#F1F5F9] rounded transition-colors">
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
