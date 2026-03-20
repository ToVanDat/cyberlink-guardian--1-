import React from 'react';
import { AnalysisResult, SafetyStatus } from '../types';
import { ShieldCheckIcon, AlertTriangleIcon, InfoIcon, LoaderIcon, ShareIcon } from './icons';

interface ResultDisplayProps {
  isLoading: boolean;
  result: AnalysisResult | null;
  error: string | null;
  url: string | null;
}

const getStatusStyles = (status: SafetyStatus) => {
  switch (status) {
    case SafetyStatus.SAFE:
      return {
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        textColor: 'text-green-400',
        icon: <ShieldCheckIcon className="w-8 h-8" />,
        title: 'Safe to Visit',
      };
    case SafetyStatus.UNSAFE:
      return {
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-400',
        icon: <AlertTriangleIcon className="w-8 h-8" />,
        title: 'Potentially Unsafe',
      };
    case SafetyStatus.UNKNOWN:
    default:
      return {
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        textColor: 'text-yellow-400',
        icon: <InfoIcon className="w-8 h-8" />,
        title: 'Analysis Inconclusive',
      };
  }
};

const InitialState: React.FC = () => (
    <div className="text-center text-gray-400 p-8 border-2 border-dashed border-gray-700 rounded-lg">
        <InfoIcon className="w-10 h-10 mx-auto mb-3 text-gray-500" />
        <h3 className="font-semibold text-lg text-gray-300">Ready to Scan</h3>
        <p className="text-sm">Enter a URL above to check its safety profile.</p>
    </div>
);

const LoadingState: React.FC = () => (
    <div className="text-center text-cyan-400 p-8 border-2 border-dashed border-cyan-500/30 rounded-lg animate-pulse">
        <LoaderIcon className="w-10 h-10 mx-auto mb-3 animate-spin" />
        <h3 className="font-semibold text-lg text-cyan-300">Analyzing Link...</h3>
        <p className="text-sm">Our AI is inspecting the URL for potential threats.</p>
    </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
    <div className="text-center text-red-400 p-8 border-2 border-solid border-red-500/30 rounded-lg bg-red-500/10">
        <AlertTriangleIcon className="w-10 h-10 mx-auto mb-3" />
        <h3 className="font-semibold text-lg text-red-300">Analysis Failed</h3>
        <p className="text-sm">{error}</p>
    </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, result, error, url }) => {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!result) return <InitialState />;

  const { safetyStatus, reason, threats } = result;
  const styles = getStatusStyles(safetyStatus);
  
  const handleShare = async () => {
    if (!result || !url) return;

    const shareData = {
      title: 'CyberLink Guardian Scan Result',
      text: `CyberLink Guardian Scan:\nURL: ${url}\nStatus: ${result.safetyStatus}\nReason: ${result.reason}`,
      url: url,
    };

    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing analysis:', err);
    }
  };


  return (
    <div className={`relative p-6 rounded-lg border ${styles.borderColor} ${styles.bgColor} transition-all duration-300`}>
      {navigator.share && url && (
        <button
          onClick={handleShare}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors duration-200"
          aria-label="Share result"
        >
          <ShareIcon className="w-5 h-5" />
        </button>
      )}
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 ${styles.textColor} animate-pop-in`}>
          {styles.icon}
        </div>
        <div className="flex-grow">
          <h2 className={`text-xl font-bold ${styles.textColor}`}>
            {styles.title}
          </h2>
          <p className="mt-1 text-gray-300">{reason}</p>
          
          {safetyStatus === SafetyStatus.UNKNOWN && (
            <div className="mt-4 text-sm text-gray-400 space-y-2 p-3 bg-gray-900/50 rounded-md ring-1 ring-gray-700">
                <p className="font-semibold text-gray-300">This can happen if:</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                    <li>The website is new or has very little public information.</li>
                    <li>Access to the page is restricted (e.g., requires a login).</li>
                    <li>The content is ambiguous and lacks clear threat indicators.</li>
                </ul>
                <p className="pt-2 font-bold text-yellow-300">Recommendation: Proceed with caution. Do not enter personal information unless you are certain the source is trustworthy.</p>
            </div>
          )}
        </div>
      </div>

      {threats && threats.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Detected Threats
          </h3>
          <ul className="space-y-3">
            {threats.map((threat, index) => (
              <li key={index} className="p-3 bg-gray-900/50 rounded-md ring-1 ring-gray-700">
                <p className="font-semibold text-red-300">{threat.type}</p>
                <p className="mt-1 text-sm text-gray-400">{threat.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};