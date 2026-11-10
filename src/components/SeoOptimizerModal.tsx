import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Trophy,
  Copy,
  Check,
  TrendingUp,
  Search,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { ShopeeProduct, generateSeoTags } from '../utils/boosterEngine';

interface SeoOptimizerModalProps {
  product: ShopeeProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SeoOptimizerModal: React.FC<SeoOptimizerModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const tags = generateSeoTags(product.name, product.category);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTag(text);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleCopyAll = () => {
    const all = tags.map((t) => `#${t}`).join(' ');
    navigator.clipboard.writeText(all);
    setCopiedTag('ALL');
    setTimeout(() => setCopiedTag(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-white mb-4 pb-3 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Optimasi Algoritma Peringkat #1 Shopee</h3>
            <p className="text-xs text-slate-400">
              Analisis faktor ranking pencarian dan kata kunci viral Shopee Indonesia.
            </p>
          </div>
        </div>

        {/* Product Preview Card */}
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 flex items-center space-x-3 mb-4">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 font-bold text-sm">
              #{product.currentRank}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-white line-clamp-1">{product.name}</h4>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
              <span>Peringkat saat ini:</span>
              <strong className="text-amber-400">
                {product.currentRank === 1 ? '#1 TERATAS' : `#${product.currentRank}`}
              </strong>
              <span>• Skor SEO:</span>
              <strong className="text-emerald-400">{product.seoScore}%</strong>
            </div>
          </div>
        </div>

        {/* Ranking Algorithm Breakdown */}
        <div className="mb-5">
          <h5 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            Bobot Algoritma Penempatan Teratas (Shopee Indonesia):
          </h5>
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">
                  1. Dorongan Fitur "Naikkan Produk" (Interval 1 Menit)
                </span>
                <span className="text-orange-400 font-bold">40% Bobot</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: '40%' }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Fitur ini memberi lonjakan instan ke halaman pertama feed dan pencarian kategori.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">2. Relevansi Judul & Kata Kunci Trending</span>
                <span className="text-blue-400 font-bold">25% Bobot</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">3. Rasio Klik (CTR) & Minat Pembeli</span>
                <span className="text-emerald-400 font-bold">20% Bobot</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '20%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">4. Performa Toko (Rating {product.rating}★ & Respon Cepat)</span>
                <span className="text-amber-400 font-bold">15% Bobot</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Suggested SEO Hashtags */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Rekomendasi Tag & Keyword Pencarian Viral:
            </span>
            <button
              onClick={handleCopyAll}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-orange-400 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition cursor-pointer"
            >
              {copiedTag === 'ALL' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Salin Semua Tag</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleCopy(`#${tag}`)}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>#{tag}</span>
                {copiedTag === `#${tag}` ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-500" />
                )}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            *Tempel tag ini di akhir deskripsi produk di Seller Centre untuk memperkuat pencarian kata kunci.
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
