import React from 'react';
import { NewsItem } from '../types';
import { NewspaperIcon, LoaderIcon, AlertTriangleIcon } from './icons';

interface NewsFeedProps {
  news: NewsItem[];
  isLoading: boolean;
  error: string | null;
}

const NewsLoadingState: React.FC = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-800/50 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-full mb-3"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
        ))}
    </div>
);

const NewsErrorState: React.FC<{ error: string }> = ({ error }) => (
    <div className="text-center text-red-400 p-4 border border-solid border-red-500/30 rounded-lg bg-red-500/10">
        <AlertTriangleIcon className="w-8 h-8 mx-auto mb-2" />
        <h3 className="font-semibold text-md text-red-300">Could not load news</h3>
        <p className="text-xs">{error}</p>
    </div>
);

export const NewsFeed: React.FC<NewsFeedProps> = ({ news, isLoading, error }) => {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <NewspaperIcon className="w-6 h-6 text-gray-400" />
        <h2 className="text-xl font-semibold text-white">Cybersecurity News</h2>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
        {isLoading && <NewsLoadingState />}
        {error && <NewsErrorState error={error} />}
        {!isLoading && !error && (
          <ul className="space-y-4">
            {news.map((item, index) => (
              <li key={index} className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                <h3 className="font-semibold text-cyan-400">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-300">{item.summary}</p>
                <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                  <span>Source: {item.source}</span>
                  <span>{item.publishedDate}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
