import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Share2, Bookmark } from 'lucide-react';
import { Article } from '@/lib/parsers/normalize';
import { cn, getDomainColor } from '@/lib/utils';
import { useSearchStore } from '@/store/searchStore';
import { useState } from 'react';

export default function ArticleCard({ article }: { article: Article }) {
  const layout = useSearchStore((state) => state.layout);
  const [imgError, setImgError] = useState(false);

  const isList = layout === 'list';
  const isFocus = layout === 'focus';

  return (
    <article 
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
        isList && "flex-row h-32 sm:h-40",
        isFocus && "max-w-3xl mx-auto my-6 border-none bg-transparent hover:shadow-none hover:border-transparent"
      )}
    >
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10">
        <span className="sr-only">Read article {article.title}</span>
      </a>

      {(!isFocus || article.imageUrl) && (
        <div 
          className={cn(
            "relative shrink-0 bg-background/50",
            isList ? "w-32 sm:w-48 h-full" : "w-full aspect-video",
            isFocus && "aspect-[21/9] rounded-2xl overflow-hidden mb-6"
          )}
        >
          {article.imageUrl && !imgError ? (
            <img 
              src={article.imageUrl} 
              alt={article.title}
              onError={() => setImgError(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <span className="font-mono text-2xl font-bold text-border">
                {article.source.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}

      <div className={cn("flex flex-1 flex-col p-4", isFocus && "p-0")}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: getDomainColor(article.source.domain) }}
            />
            <span className="font-mono text-[10px] tracking-wider text-textMuted uppercase">
              {article.source.name}
            </span>
          </div>
          <time 
            className="font-mono text-[10px] text-textMuted"
            title={article.publishedAt.toISOString()}
          >
            {formatDistanceToNow(article.publishedAt, { addSuffix: true })}
          </time>
        </div>

        <h3 className={cn(
          "font-headline font-semibold text-textPrimary leading-snug mb-2",
          isList ? "text-base line-clamp-2" : "text-lg",
          isFocus && "text-3xl md:text-4xl leading-tight mb-4"
        )}>
          {article.title}
        </h3>

        {(!isList || isFocus) && article.excerpt && (
          <p className={cn(
            "text-sm text-textMuted line-clamp-3 mb-4 flex-1",
            isFocus && "text-base md:text-lg leading-relaxed line-clamp-none"
          )}>
            {article.excerpt}
          </p>
        )}

        <div className={cn("mt-auto flex items-center justify-between pt-4 border-t border-border/50", isFocus && "border-none pt-0 mt-6")}>
          <div className="flex gap-1 overflow-hidden">
            {article.keywords.map(kw => (
              <span key={kw} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-[9px] uppercase">
                {kw}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-3 z-20">
            <button className="text-textMuted hover:text-textPrimary transition-colors" title="Save">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="text-textMuted hover:text-textPrimary transition-colors" title="Share">
              <Share2 className="w-4 h-4" />
            </button>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:text-primary/80 font-mono text-xs font-semibold ml-2 transition-colors"
            >
              READ <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
