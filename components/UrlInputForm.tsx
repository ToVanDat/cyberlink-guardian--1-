
import React, { useState, useEffect } from 'react';
import { SearchIcon, LoaderIcon } from './icons';

interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  initialUrl?: string;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ onSubmit, isLoading, initialUrl = '' }) => {
  const [url, setUrl] = useState<string>(initialUrl);

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-grow">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          disabled={isLoading}
          className="w-full pl-4 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 disabled:opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-all duration-300 disabled:bg-cyan-800 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <LoaderIcon className="w-5 h-5 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <SearchIcon className="w-5 h-5" />
            <span>Check Link</span>
          </>
        )}
      </button>
    </form>
  );
};
