
import React, { useState, useCallback, useEffect } from 'react';
import { UrlInputForm } from './components/UrlInputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryList } from './components/HistoryList';
import { NewsFeed } from './components/NewsFeed';
import { ShieldCheckIcon } from './components/icons';
import { checkLinkSafety, getCybersecurityNews } from './services/geminiService';
import { AnalysisResult, HistoryItem, NewsItem } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [urlToRecheck, setUrlToRecheck] = useState<string>('');
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState<boolean>(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('scanHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load history from localStorage', error);
      setHistory([]);
    }

    const fetchNews = async () => {
      try {
        setIsNewsLoading(true);
        setNewsError(null);
        const newsItems = await getCybersecurityNews();
        setNews(newsItems);
      } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setNewsError(`Failed to fetch cybersecurity news. ${errorMessage}`);
      } finally {
        setIsNewsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleCheckUrl = useCallback(async (url: string) => {
    if (!url) {
      setError('Please enter a URL.');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    setError(null);
    setScannedUrl(null);
    setUrlToRecheck(''); // Clear recheck URL after submit

    try {
      const analysisResult = await checkLinkSafety(url);
      setResult(analysisResult);
      setScannedUrl(url);

      setHistory(prevHistory => {
        const newHistoryItem: HistoryItem = {
          timestamp: Date.now(),
          url,
          result: analysisResult,
        };
        const updatedHistory = [newHistoryItem, ...prevHistory.filter(item => item.url !== url)].slice(0, 20);
        localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.';
      setError(`Failed to analyze URL. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('scanHistory');
  };

  const handleRecheck = (historyUrl: string) => {
    setUrlToRecheck(historyUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto my-8">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-2">
            <ShieldCheckIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold tracking-tight text-white">
              CyberLink Guardian
            </h1>
          </div>
          <p className="text-gray-400">
            Your AI-powered shield against malicious links.
          </p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 border border-gray-700">
          <UrlInputForm onSubmit={handleCheckUrl} isLoading={isLoading} initialUrl={urlToRecheck} />
          <div className="mt-6">
            <ResultDisplay isLoading={isLoading} result={result} error={error} url={scannedUrl} />
          </div>
        </main>
        
        <HistoryList history={history} onClear={handleClearHistory} onRecheck={handleRecheck} />

        <NewsFeed news={news} isLoading={isNewsLoading} error={newsError} />

        <footer className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Powered by Gemini API. Analysis may not be 100% accurate. Always exercise caution.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
