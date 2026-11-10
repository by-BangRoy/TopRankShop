import React from 'react';
import { Zap, Clock, ShieldCheck, Trophy, Sparkles, PlusCircle } from 'lucide-react';
import { BoostSlot, ShopeeProduct, formatCountdown } from '../utils/boosterEngine';

interface SlotMonitorProps {
  slots: BoostSlot[];
  products: ShopeeProduct[];
  onOpenProductModal: () => void;
  onInstantSlotFill: (slotIndex: number) => void;
}

export const SlotMonitor: React.FC<SlotMonitorProps> = ({
  slots,
  products,
  onOpenProductModal,
  onInstantSlotFill,
}) => {
  const getProductForSlot = (productId: string | null) => {
    if (!productId) return null;
    return products.find((p) => p.id === productId) || null;
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span>Monitor 5 Slot Resmi Naikkan Produk Shopee</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Shopee menyediakan 5 slot dorongan simultan (durasi 4 jam). Mesin otomatis mengisi slot kosong setiap 1 menit.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg">
            Rotasi Otomatis: AKTIF
          </span>
        </div>
      </div>

      {/* Grid of 5 Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
        {slots.map((slot) => {
          const product = getProductForSlot(slot.productId);
          const isActive = slot.status === 'active' && product;
          const secondsRemaining = slot.expiresAt
            ? Math.max(0, Math.floor((slot.expiresAt - Date.now()) / 1000))
            : 0;

          return (
            <div
              key={slot.slotIndex}
              className={`rounded-xl border p-3 flex flex-col justify-between transition relative overflow-hidden ${
                isActive
                  ? 'bg-slate-950/70 border-orange-500/40 shadow-sm shadow-orange-500/5'
                  : 'bg-slate-950/30 border-dashed border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Slot Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 tracking-wider">
                  SLOT #{slot.slotIndex}
                </span>
                {isActive ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    #1 TERATAS
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">
                    KOSONG
                  </span>
                )}
              </div>

              {/* Slot Content */}
              {isActive && product ? (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-center space-x-2 my-1">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 font-bold text-xs">
                        #{slot.slotIndex}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white line-clamp-2 leading-tight">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-orange-400 font-medium mt-0.5">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Sisa waktu:
                      </span>
                      <span className="font-mono font-bold text-amber-300">
                        {formatCountdown(secondsRemaining)}
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-orange-500 h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(5, (secondsRemaining / (4 * 3600)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-2">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Slot Tersedia</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Akan diisi otomatis pada pengecekan 1 menit
                  </p>
                  <button
                    onClick={() => {
                      if (products.length === 0) {
                        onOpenProductModal();
                      } else {
                        onInstantSlotFill(slot.slotIndex);
                      }
                    }}
                    className="mt-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-orange-400 text-[11px] font-semibold rounded-md transition cursor-pointer"
                  >
                    {products.length === 0 ? '+ Tambah Produk' : '+ Isi Sekarang'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
