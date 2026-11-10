import React from 'react';
import { Timer, Zap, Trophy, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { BoostSlot, ShopeeProduct } from '../utils/boosterEngine';

interface DashboardStatsProps {
  isAutoPilot: boolean;
  intervalMinutes: number;
  countdownSeconds: number;
  slots: BoostSlot[];
  products: ShopeeProduct[];
  totalCyclesCompleted: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  isAutoPilot,
  intervalMinutes,
  countdownSeconds,
  slots,
  products,
  totalCyclesCompleted,
}) => {
  const activeSlotsCount = slots.filter((s) => s.status === 'active').length;
  const rankOneProductsCount = products.filter((p) => p.currentRank === 1).length;

  const totalImpressions = products.reduce((acc, p) => acc + p.impressions, 0);
  const totalClicks = products.reduce((acc, p) => acc + p.clicks, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Status Auto-Boost 1 Menit */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-sm relative overflow-hidden group hover:border-orange-500/40 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Siklus Otomatis</span>
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isAutoPilot ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-500'
            }`}
          >
            <Timer className={`w-4 h-4 ${isAutoPilot ? 'animate-spin' : ''}`} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              {isAutoPilot ? `${intervalMinutes} Menit Sekali` : 'Nonaktif'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isAutoPilot ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
              }`}
            />
            {isAutoPilot ? (
              <span>
                Cek berikutnya: <strong className="text-orange-400">{countdownSeconds}s</strong>
              </span>
            ) : (
              'Aktifkan untuk mulai otomatis'
            )}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 2. Slot Naikkan Produk (Official Shopee 5 Slots) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-sm relative overflow-hidden group hover:border-blue-500/40 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Slot Naikkan Produk</span>
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              {activeSlotsCount} / 5
            </span>
            <span className="text-xs font-medium text-emerald-400">
              {5 - activeSlotsCount} Tersedia
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(activeSlotsCount / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Produk Peringkat #1 */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Peringkat #1 Shopee</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold tracking-tight text-amber-300">
              {rankOneProductsCount} Produk
            </span>
            <span className="text-xs text-slate-400">di Posisi 1</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
            <span>Optimal algoritma pencarian</span>
          </p>
        </div>
      </div>

      {/* 4. Total Impresi & Trafik Toko */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Estimasi Impresi & Klik</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              {totalImpressions > 0 ? `${(totalImpressions / 1000).toFixed(1)}k` : '0'}
            </span>
            <span className="text-xs font-medium text-emerald-400">
              {products.length > 0
                ? `+${Math.min(999, totalCyclesCompleted * 18 + 42)}% Trafik`
                : 'Siap Pantau'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {products.length > 0
              ? `${totalClicks.toLocaleString('id-ID')} klik dari hasil pencarian`
              : 'Menunggu produk ditambahkan'}
          </p>
        </div>
      </div>
    </div>
  );
};
