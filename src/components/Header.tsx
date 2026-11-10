import React from 'react';
import { Server, Activity, ShieldCheck, Settings, HelpCircle, Store, Flame, RefreshCw, Shield } from 'lucide-react';
import { ServerConfig } from '../utils/boosterEngine';

interface HeaderProps {
  serverConfig: ServerConfig;
  onOpenConfig: () => void;
  onOpenGuide: () => void;
  onPingTest: () => void;
  onRotateProxy?: () => void;
  isPinging: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  serverConfig,
  onOpenConfig,
  onOpenGuide,
  onPingTest,
  onRotateProxy,
  isPinging,
}) => {
  const isOnline = serverConfig.status === 'connected';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-md shadow-orange-500/20 ring-1 ring-orange-400/30">
              <Flame className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
                  <span className="text-orange-500">Shopee</span>
                  <span>Top-Rank Booster</span>
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full">
                  1-MENIT PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Store className="w-3 h-3 text-slate-400" />
                <span>{serverConfig.shopName}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">ID: {serverConfig.shopId}</span>
              </p>
            </div>
          </div>

          {/* Center / Server Status Pill with Rotating Proxy */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={onPingTest}
              disabled={isPinging}
              title="Klik untuk uji koneksi server shopee.co.id"
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                isOnline
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`}
              />
              <Server className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono text-slate-300">https://shopee.co.id</span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {isPinging ? 'Pinging...' : `${serverConfig.latencyMs} ms`}
              </span>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded uppercase font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE REAL-TIME
              </span>
            </button>

            {/* Rotating Proxy Badge */}
            {serverConfig.currentProxy && (
              <div
                onClick={onRotateProxy}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border bg-slate-950/80 border-slate-700/80 text-slate-300 hover:border-orange-500/40 transition cursor-pointer"
                title="Proxy Rotasi Aktif. Klik untuk ganti IP / lokasi proxy sekarang."
              >
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-slate-400">Proxy:</span>
                <span className="font-mono text-slate-200 truncate max-w-[140px]">
                  {serverConfig.currentProxy.name.replace(' Gateway', '')}
                </span>
                <span className="text-slate-600">|</span>
                <span className="font-mono text-orange-400 text-[11px]">
                  {serverConfig.currentProxy.ip}
                </span>
                <RefreshCw className="w-3 h-3 text-slate-400 hover:text-orange-400 ml-1" />
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenConfig}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition cursor-pointer"
              aria-label="Konfigurasi Server Shopee"
            >
              <Settings className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Server & Proxy</span>
            </button>

            <button
              onClick={onOpenGuide}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition cursor-pointer"
              aria-label="Panduan Seller"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Panduan</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
