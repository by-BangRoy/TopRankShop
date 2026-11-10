import React from 'react';
import {
  Activity,
  Server,
  ShieldCheck,
  RefreshCw,
  Clock,
  Radio,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ServerConfig } from '../utils/boosterEngine';

interface RealTimeConnectionBarProps {
  serverConfig: ServerConfig;
  onPingTest: () => void;
  onRotateProxy: () => void;
  onLoadSampleProducts: () => void;
  isPinging: boolean;
  hasProducts: boolean;
}

export const RealTimeConnectionBar: React.FC<RealTimeConnectionBarProps> = ({
  serverConfig,
  onPingTest,
  onRotateProxy,
  onLoadSampleProducts,
  isPinging,
  hasProducts,
}) => {
  const isLive = serverConfig.realTimeConnected !== false;
  const edgeName = serverConfig.edgeServer || 'SGW (Shopee Gateway Edge ID)';
  const rateLimit = serverConfig.rateLimitRemaining ?? 95;
  const packets = serverConfig.packetsReceived ?? 1;

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Background ambient pulse line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 animate-pulse" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Connection Status & Gateway Information */}
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="relative mt-1 sm:mt-0 shrink-0">
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-emerald-400/40" />
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Terhubung Real-Time ke Server Shopee</span>
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE STREAM AKTIF (SSE)
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono text-slate-300 bg-slate-800 rounded border border-slate-700">
                {edgeName}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                Target Gateway:{' '}
                <strong className="text-orange-400 font-mono">https://shopee.co.id</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Latensi Live:{' '}
                <strong className="font-mono text-emerald-400 font-bold">
                  {serverConfig.latencyMs} ms
                </strong>
              </span>
              <span>•</span>
              <span className="text-slate-300">
                Kuota Rate-Limit:{' '}
                <strong className="text-blue-400 font-mono">{rateLimit}/100</strong> (Aman)
              </span>
              <span>•</span>
              <span className="text-slate-400 text-[11px] font-mono">
                Paket: #{packets}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Actions & Quick Sample Importer */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {!hasProducts && (
            <button
              onClick={onLoadSampleProducts}
              className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              title="Isi 3 contoh produk toko resmi Shopee untuk langsung menguji auto-boost 1 menit"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>+ Muat Contoh Produk Toko (1-Klik)</span>
            </button>
          )}

          {serverConfig.currentProxy && (
            <button
              onClick={onRotateProxy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              title="Ganti IP proxy rotasi sekarang"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Proxy:</span>
              <span className="font-mono text-orange-300 text-[11px]">
                {serverConfig.currentProxy.ip}
              </span>
              <RefreshCw className="w-3 h-3 text-slate-400" />
            </button>
          )}

          <button
            onClick={onPingTest}
            disabled={isPinging}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-500/30 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            title="Ping ulang server shopee.co.id"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-orange-400' : ''}`} />
            <span>{isPinging ? 'Pinging...' : 'Sync Live'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
