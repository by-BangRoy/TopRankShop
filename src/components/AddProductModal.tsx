import React, { useState } from 'react';
import { X, Plus, Link as LinkIcon, ShoppingBag, AlertCircle } from 'lucide-react';
import { Priority, ShopeeProduct, validateShopeeUrl } from '../utils/boosterEngine';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Omit<ShopeeProduct, 'id'>) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState('');
  const [shopeeUrl, setShopeeUrl] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [price, setPrice] = useState('149000');
  const [priority, setPriority] = useState<Priority>('high');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama produk wajib diisi.');
      return;
    }

    let parsedItemId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    if (shopeeUrl) {
      if (!validateShopeeUrl(shopeeUrl)) {
        setError('URL harus berupa alamat Shopee yang valid (contoh: https://shopee.co.id/...)');
        return;
      }
      // Extract item id from url if possible
      const match = shopeeUrl.match(/i\.\d+\.(\d+)/) || shopeeUrl.match(/\/(\d{8,12})/);
      if (match && match[1]) {
        parsedItemId = match[1];
      }
    }

    const defaultImg =
      imageUrl.trim() ||
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80';

    onAddProduct({
      itemId: parsedItemId,
      name: name.trim(),
      category,
      price: parseInt(price, 10) || 99000,
      stock: 100,
      soldCount: 150,
      rating: 4.8,
      imageUrl: defaultImg,
      priority,
      currentRank: 12,
      previousRank: 15,
      isBoosted: false,
      boostedAt: null,
      cooldownUntil: null,
      impressions: 1200,
      clicks: 140,
      seoScore: 88,
      shopeeUrl: shopeeUrl || `https://shopee.co.id/product/88421092/${parsedItemId}`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-white mb-4">
          <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Tambah Produk Shopee ke Antrean</h3>
            <p className="text-xs text-slate-400">
              Masukkan detail produk atau link Shopee untuk dinaikkan secara otomatis.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Nama Produk Shopee <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Contoh: Kemeja Flanel Pria Lengan Panjang Katun Premium"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Link Produk Shopee (URL)
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={shopeeUrl}
                onChange={(e) => {
                  setShopeeUrl(e.target.value);
                  setError('');
                }}
                placeholder="https://shopee.co.id/product/88421092/12345678"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Sistem akan otomatis menghubungkan item ID dengan server Shopee.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="Fashion">Fashion</option>
                <option value="Kecantikan">Kecantikan & Perawatan</option>
                <option value="Elektronik">Elektronik & Gadget</option>
                <option value="Makanan">Makanan & Minuman</option>
                <option value="Rumah">Perlengkapan Rumah</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Harga (Rp)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="149000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Prioritas Boost</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="high">Tinggi (High Priority) ★</option>
              <option value="medium">Sedang (Medium)</option>
              <option value="low">Rendah (Low)</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              Produk dengan prioritas tinggi akan otomatis dipilih pertama kali saat slot kosong tersedia.
            </p>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl transition shadow-md shadow-orange-500/20 cursor-pointer"
            >
              Simpan & Masukkan Antrean
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
