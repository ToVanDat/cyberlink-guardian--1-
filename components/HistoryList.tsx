
import React from 'react';
import { HistoryItem, SafetyStatus } from '../types';
import { HistoryIcon, TrashIcon, ShieldCheckIcon, AlertTriangleIcon, InfoIcon } from './icons';

interface HistoryListProps {
  history: HistoryItem[];
  onClear: () => void;
  onRecheck: (url: string) => void;
}

const StatusIcon: React.FC<{ status: SafetyStatus }> = ({ status }) => {
  switch (status) {
    case SafetyStatus.SAFE:
      return <ShieldCheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />;
    case SafetyStatus.UNSAFE:
      return <AlertTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />;
    default:
      return <InfoIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" />;
  }
};

export const HistoryList: React.FC<HistoryListProps> = ({ history, onClear, onRecheck }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-white">Scan History</h2>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-800 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
          aria-label="Clear scan history"
        >
          <TrashIcon className="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 max-h-60 overflow-y-auto">
        <ul className="divide-y divide-gray-700">
          {history.map((item) => (
            <li key={item.timestamp}>
              <button
                onClick={() => onRecheck(item.url)}
                className="w-full flex items-center gap-4 p-3 text-left hover:bg-gray-700/50 transition-colors duration-200"
              >
                <StatusIcon status={item.result.safetyStatus} />
                <div className="flex-grow overflow-hidden">
                  <p className="text-sm font-medium text-gray-200 truncate">{item.url}</p>
                  <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
