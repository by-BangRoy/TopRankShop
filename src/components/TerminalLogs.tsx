import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  Trash2,
  Download,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { LogEntry } from '../utils/boosterEngine';

interface TerminalLogsProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({ logs, onClearLogs }) => {
  const [filter, setFilter] = useState<'all' | 'success' | 'info' | 'error'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `shopee-boost-logs-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden mb-6">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          {/* Traffic light dots */}
          <div className="flex items-center space-x-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <Terminal className="w-4 h-4 text-orange-400" />
          <span className="font-mono text-xs font-bold text-slate-200">
            Console Eksekusi & Audit Log Server (https://shopee.co.id)
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
            {logs.length} Log
          </span>
        </div>

        {/* Filter & Actions */}
        <div className="flex items-center space-x-2 text-xs">
          {/* Filter pills */}
          <div className="flex items-center space-x-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            {(['all', 'success', 'info', 'error'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                  filter === type
                    ? 'bg-orange-500/20 text-orange-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'all' ? 'Semua' : type.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              autoScroll
                ? 'bg-slate-800 border-slate-700 text-orange-400'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
            title={autoScroll ? 'Auto-scroll Aktif' : 'Auto-scroll Nonaktif'}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleExportLogs}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer"
            title="Download Log JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClearLogs}
            className="p-1.5 bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700 transition cursor-pointer"
            title="Bersihkan Log"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="p-4 font-mono text-xs max-h-72 overflow-y-auto space-y-2 select-text">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-600 italic py-6 text-center">
            Belum ada aktivitas boost yang tercatat. Aktifkan auto-boost atau klik "Naikkan Sekarang".
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isSuccess = log.type === 'success';
            const isError = log.type === 'error';
            const isWarning = log.type === 'warning';

            return (
              <div
                key={log.id}
                className="flex items-start space-x-2.5 py-1 px-2 rounded-lg hover:bg-slate-900/60 transition group text-[11px]"
              >
                {/* Timestamp */}
                <span className="text-slate-400 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {log.timestamp}
                </span>

                {/* Status code pill */}
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                    isSuccess
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isError
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : isWarning
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {log.statusCode === 200 ? 'HTTP 200' : `CODE ${log.statusCode}`}
                </span>

                {/* Target URL */}
                <span className="text-slate-400 truncate max-w-[200px] shrink-0 hidden sm:inline">
                  [{log.targetUrl.replace('https://', '')}]
                </span>

                {/* Message */}
                <span
                  className={`flex-1 break-words ${
                    isSuccess
                      ? 'text-emerald-300'
                      : isError
                      ? 'text-red-300'
                      : isWarning
                      ? 'text-amber-300'
                      : 'text-slate-300'
                  }`}
                >
                  {log.message}
                </span>

                {/* Latency */}
                {log.responseTimeMs > 0 && (
                  <span className="text-slate-400 text-[10px] shrink-0 font-mono">
                    {log.responseTimeMs}ms
                  </span>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
