import React, { useState } from 'react';
import {
  Search,
  Plus,
  Flame,
  ExternalLink,
  Sparkles,
  Trophy,
  Star,
  Trash2,
  PackageOpen,
  ShoppingBag,
} from 'lucide-react';
import { ShopeeProduct, Priority } from '../utils/boosterEngine';

interface ProductListProps {
  products: ShopeeProduct[];
  onBoostSingle: (product: ShopeeProduct) => void;
  onChangePriority: (productId: string, priority: Priority) => void;
  onOpenAddModal: () => void;
  onOpenSeoModal: (product: ShopeeProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onClearAllProducts: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onBoostSingle,
  onChangePriority,
  onOpenAddModal,
  onOpenSeoModal,
  onDeleteProduct,
  onClearAllProducts,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Fashion', 'Kecantikan', 'Elektronik', 'Makanan', 'Rumah'];

  const filteredProducts = products.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.itemId.includes(searchQuery);
    const matchesCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  const [showConfirmClear, setShowConfirmClear] = useState(false);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-sm mb-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Katalog Produk & Antrean Peringkat Shopee</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar produk manual untuk dinaikkan ke barisan teratas pencarian Shopee secara otomatis setiap 1 menit.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          {products.length > 0 && (
            showConfirmClear ? (
              <div className="flex items-center space-x-1.5 bg-red-950/70 border border-red-500/40 rounded-xl px-2.5 py-1 text-xs">
                <span className="text-red-300 text-[11px] font-medium">Kosongkan semua?</span>
                <button
                  onClick={() => {
                    onClearAllProducts();
                    setShowConfirmClear(false);
                  }}
                  className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded font-bold text-[10px] cursor-pointer"
                >
                  Ya
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-2 py-0.5 bg-slate-800 text-slate-300 hover:text-white rounded text-[10px] cursor-pointer"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="px-3 py-2 bg-slate-800 hover:bg-red-950/50 hover:text-red-400 text-slate-400 text-xs font-semibold rounded-xl border border-slate-700/80 flex items-center space-x-1.5 transition cursor-pointer"
                title="Kosongkan seluruh produk dari antrean"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Kosongkan Semua</span>
              </button>
            )
          )}

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition shadow-sm shadow-orange-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Produk Manual</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar (only show if products exist) */}
      {products.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama produk atau ID..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-slate-950 text-slate-400 border border-slate-800/80 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State when no products exist */}
      {products.length === 0 ? (
        <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4 shadow-inner">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Daftar Produk Masih Kosong
          </h3>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
            Semua produk telah dikosongkan. Silakan isi produk toko Shopee Anda secara manual untuk mulai menaikkan peringkat ke barisan #1 teratas setiap 1 menit sekali.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Produk Shopee Sekarang (Manual)</span>
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-xs">
          Tidak ada produk yang cocok dengan pencarian "{searchQuery}".
        </div>
      ) : (
        /* Table / List */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Produk & ID Shopee</th>
                <th className="py-2.5 px-3">Kategori & Harga</th>
                <th className="py-2.5 px-3">Peringkat Shopee</th>
                <th className="py-2.5 px-3">Prioritas Antrean</th>
                <th className="py-2.5 px-3">Status Boost</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredProducts.map((prod) => {
                const isRankOne = prod.currentRank === 1;

                return (
                  <tr
                    key={prod.id}
                    className="hover:bg-slate-800/30 transition group"
                  >
                    {/* Product Info (Tanpa Foto) */}
                    <td className="py-3 px-3">
                      <div className="min-w-0 max-w-sm sm:max-w-md">
                        <p className="font-semibold text-slate-200 line-clamp-2 group-hover:text-orange-400 transition leading-snug">
                          {prod.name}
                        </p>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1">
                          <span className="font-mono text-slate-400">ID: {prod.itemId}</span>
                          <span className="text-slate-400">•</span>
                          <span className="flex items-center text-amber-400">
                            <Star className="w-3 h-3 fill-current inline mr-0.5" />
                            {prod.rating || 4.8}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span>{prod.soldCount.toLocaleString('id-ID')} terjual</span>
                        </div>
                      </div>
                    </td>

                    {/* Kategori & Harga */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px]">
                        {prod.category}
                      </span>
                      <p className="font-bold text-slate-200 mt-1">
                        Rp {prod.price.toLocaleString('id-ID')}
                      </p>
                    </td>

                    {/* Peringkat Shopee */}
                    <td className="py-3 px-3">
                      {isRankOne ? (
                        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 rounded-lg font-bold">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          <span>#1 TERATAS</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md font-semibold">
                          <span>Peringkat #{prod.currentRank}</span>
                          <span className="text-[10px] text-emerald-400 ml-1">↑ Naik</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                        <span>Skor SEO:</span>
                        <strong className="text-emerald-400">{prod.seoScore}%</strong>
                      </div>
                    </td>

                    {/* Prioritas Antrean */}
                    <td className="py-3 px-3">
                      <select
                        value={prod.priority}
                        onChange={(e) =>
                          onChangePriority(prod.id, e.target.value as Priority)
                        }
                        className={`px-2 py-1 rounded-lg text-xs font-semibold border bg-slate-950 focus:outline-none cursor-pointer ${
                          prod.priority === 'high'
                            ? 'border-red-500/40 text-red-400'
                            : prod.priority === 'medium'
                            ? 'border-amber-500/40 text-amber-400'
                            : 'border-slate-700 text-slate-400'
                        }`}
                      >
                        <option value="high">Tinggi (High) ★</option>
                        <option value="medium">Sedang (Medium)</option>
                        <option value="low">Rendah (Low)</option>
                      </select>
                    </td>

                    {/* Status Boost */}
                    <td className="py-3 px-3">
                      {prod.isBoosted ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold rounded-md border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Sedang Didorong
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 text-slate-400 text-[11px] rounded-md">
                          Antrean Standby
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onBoostSingle(prod)}
                          className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-xs flex items-center space-x-1 transition shadow-sm shadow-orange-500/20 cursor-pointer"
                          title="Naikkan produk ini sekarang ke server Shopee"
                        >
                          <Flame className="w-3 h-3" />
                          <span>Naikkan</span>
                        </button>

                        <button
                          onClick={() => onOpenSeoModal(prod)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
                          title="Analisis Kata Kunci & SEO Peringkat #1"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        </button>

                        <a
                          href={prod.shopeeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                          title="Buka Halaman Shopee"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => onDeleteProduct(prod.id)}
                          className="p-1.5 bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 rounded-lg transition cursor-pointer"
                          title="Hapus Produk dari Daftar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
