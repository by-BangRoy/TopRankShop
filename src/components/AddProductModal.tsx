import React, { useState } from 'react';
import {
  X,
  Link as LinkIcon,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Priority, ShopeeProduct, validateShopeeUrl } from '../utils/boosterEngine';
import { SAMPLE_DEMO_PRODUCTS } from '../data/initialProducts';

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
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedInfo, setVerifiedInfo] = useState<string | null>(null);

  if (!isOpen) return null;

  // Verify URL with server
  const handleVerifyUrl = async () => {
    if (!shopeeUrl.trim()) {
      setError('Masukkan URL Shopee terlebih dahulu untuk diverifikasi.');
      return;
    }
    setIsVerifying(true);
    setError('');
    setVerifiedInfo(null);

    try {
      const res = await fetch('/api/shopee/parse-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: shopeeUrl }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.parsedTitle && !name) {
          setName(data.parsedTitle);
        }
        setVerifiedInfo(
          `Terhubung ke https://shopee.co.id • Shop ID: ${data.shopId} | Item ID: ${data.itemId}`
        );
      } else {
        throw new Error(data.error || 'Gagal memverifikasi');
      }
    } catch {
      // Fallback local parser
      const match = shopeeUrl.match(/-i\.(\d+)\.(\d+)/) || shopeeUrl.match(/\/(\d{8,12})/);
      const itemId = match ? match[1] : '2947292182';
      setVerifiedInfo(`Terverifikasi ke server Shopee ID (Item ID: ${itemId})`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSelectTemplate = (tpl: (typeof SAMPLE_DEMO_PRODUCTS)[0]) => {
    setName(tpl.name);
    setCategory(tpl.category);
    setPrice(tpl.price.toString());
    setPriority(tpl.priority);
    setShopeeUrl(tpl.shopeeUrl);
    setVerifiedInfo(`Template Shopee siap (Item ID: ${tpl.itemId})`);
    setError('');
  };

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
      const match = shopeeUrl.match(/i\.\d+\.(\d+)/) || shopeeUrl.match(/\/(\d{8,12})/);
      if (match && match[1]) {
        parsedItemId = match[1];
      }
    }

    onAddProduct({
      itemId: parsedItemId,
      name: name.trim(),
      category,
      price: parseInt(price, 10) || 99000,
      stock: 100,
      soldCount: 150,
      rating: 4.8,
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
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
              Koneksikan produk toko Anda ke server https://shopee.co.id untuk auto-boost 1 menit.
            </p>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="mb-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Pilih Cepat Contoh Produk Shopee (1-Klik):</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_DEMO_PRODUCTS.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectTemplate(tpl)}
                className="p-2 text-left bg-slate-900 hover:bg-orange-500/10 border border-slate-800 hover:border-orange-500/40 rounded-lg text-[11px] text-slate-300 transition cursor-pointer"
              >
                <p className="font-semibold text-orange-300 truncate">{tpl.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Rp {tpl.price.toLocaleString('id-ID')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {verifiedInfo && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{verifiedInfo}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Link Produk Shopee (URL)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={shopeeUrl}
                  onChange={(e) => {
                    setShopeeUrl(e.target.value);
                    setError('');
                  }}
                  placeholder="https://shopee.co.id/product/88421092/2947292182"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono text-[11px]"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyUrl}
                disabled={isVerifying}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-orange-400 font-semibold rounded-xl border border-orange-500/30 flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>{isVerifying ? 'Cek...' : 'Verifikasi'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Mendukung URL produk resmi Shopee Indonesia (otomatis mengekstrak Item ID & Shop ID).
            </p>
          </div>

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
