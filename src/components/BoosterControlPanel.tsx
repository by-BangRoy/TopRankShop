import React from 'react';
import {
  Play,
  Pause,
  RotateCw,
  Clock,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { ShopeeProduct, formatCountdown } from '../utils/boosterEngine';

interface BoosterControlPanelProps {
  isAutoPilot: boolean;
  onToggleAutoPilot: () => void;
  intervalMinutes: number;
  onChangeInterval: (mins: number) => void;
  countdownSeconds: number;
  nextProduct: ShopeeProduct | null;
  onManualBoostNow: () => void;
  isBoosting: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const BoosterControlPanel: React.FC<BoosterControlPanelProps> = ({
  isAutoPilot,
  onToggleAutoPilot,
  intervalMinutes,
  onChangeInterval,
  countdownSeconds,
  nextProduct,
  onManualBoostNow,
  isBoosting,
  soundEnabled,
  onToggleSound,
}) => {
  const totalSecondsInInterval = intervalMinutes * 60;
  const progressPercent = Math.max(
    0,
    Math.min(100, ((totalSecondsInInterval - countdownSeconds) / totalSecondsInInterval) * 100)
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden mb-6">
      {/* Background ambient glow */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          isAutoPilot ? 'bg-orange-600/20 opacity-100' : 'bg-slate-700/10 opacity-30'
        }`}
      />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-slate-800/80">
          {/* Main Action & Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleAutoPilot}
              className={`relative group px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center space-x-3 cursor-pointer ${
                isAutoPilot
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-orange-600/30 ring-2 ring-orange-500/50 hover:brightness-110'
                  : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-orange-500/30 hover:from-orange-600 hover:to-amber-700'
              }`}
              aria-label={isAutoPilot ? 'Hentikan Auto-Boost' : 'Aktifkan Auto-Boost 1 Menit'}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  isAutoPilot ? 'bg-white animate-ping' : 'bg-white/80'
                }`}
              />
              <span className="flex items-center gap-2">
                {isAutoPilot ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>HENTIKAN AUTO-BOOST</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>MULAI AUTO-BOOST 1 MENIT</span>
                  </>
                )}
              </span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  {isAutoPilot ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Auto-Pilot Aktif (Setiap {intervalMinutes} Menit)
                    </span>
                  ) : (
                    <span className="text-slate-400">Mesin Siaga (Standby)</span>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Secara berkala memverifikasi ketersediaan slot di server Shopee & memposisikan produk ke ranking #1.
              </p>
            </div>
          </div>

          {/* Quick Manual Boost + Sound Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onManualBoostNow}
              disabled={isBoosting}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-orange-400 hover:text-orange-300 font-semibold text-xs rounded-xl border border-orange-500/30 flex items-center space-x-2 transition shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Paksa naikkan produk prioritas sekarang tanpa menunggu timer"
            >
              <Zap className={`w-3.5 h-3.5 ${isBoosting ? 'animate-bounce text-yellow-400' : ''}`} />
              <span>{isBoosting ? 'Sedang Menaikkan...' : '⚡ Naikkan Sekarang (Manual)'}</span>
            </button>

            <button
              onClick={onToggleSound}
              className={`p-2.5 rounded-xl border transition text-xs flex items-center justify-center cursor-pointer ${
                soundEnabled
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title={soundEnabled ? 'Notifikasi Suara Aktif' : 'Notifikasi Suara Mati'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Sub-panel: Interval Selector & Live Countdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Interval Selector */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                Interval Eksekusi:
              </span>
              <span className="text-[11px] text-orange-400 font-bold">
                {intervalMinutes} Menit Sekali
              </span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 5].map((mins) => (
                <button
                  key={mins}
                  onClick={() => onChangeInterval(mins)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    intervalMinutes === mins
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {mins === 1 ? '1 Mnt ★' : `${mins} Mnt`}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">
              *Rekomendasi pengguna: 1 menit sekali untuk merotasi slot kadaluarsa tercepat.
            </p>
          </div>

          {/* Countdown & Visual Progress */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <RotateCw
                  className={`w-3 h-3 text-orange-400 ${isAutoPilot ? 'animate-spin' : ''}`}
                />
                Pengecekan Siklus:
              </span>
              <span className="font-mono text-sm font-bold text-white">
                {isAutoPilot ? formatCountdown(countdownSeconds) : '--:--'}
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${isAutoPilot ? progressPercent : 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Siklus 0:00</span>
              <span>Target: {intervalMinutes}:00</span>
            </div>
          </div>

          {/* Antrean Produk Berikutnya */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Prioritas Eksekusi Berikutnya:
            </span>
            {nextProduct ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 font-bold text-xs">
                  #{nextProduct.currentRank}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-200 truncate">
                    {nextProduct.name}
                  </p>
                  <p className="text-[10px] text-orange-400 font-semibold flex items-center gap-1">
                    Prioritas {nextProduct.priority.toUpperCase()} • Peringkat saat ini: #{nextProduct.currentRank}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Belum ada produk di antrean (tambahkan produk secara manual)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
