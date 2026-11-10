import React from 'react';
import { X, HelpCircle, CheckCircle2, Flame, ShieldCheck, Zap, Info } from 'lucide-react';

interface SellerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellerGuideModal: React.FC<SellerGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5 pb-3 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">
              Panduan Lengkap Auto-Boost & Peringkat Teratas Shopee
            </h3>
            <p className="text-xs text-slate-400">
              Mekanisme kerja fitur "Naikkan Produk", integrasi server, dan siklus 1 menit.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Section 1 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <h4 className="font-bold text-orange-400 mb-1.5 flex items-center gap-1.5 text-sm">
              <Flame className="w-4 h-4" />
              1. Apa itu Fitur "Naikkan Produk" di Shopee?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Shopee menyediakan fitur resmi gratis bagi penjual bernama <strong>"Naikkan Produk" (Boost Product)</strong>. Fitur ini menempatkan produk Anda ke barisan teratas (Peringkat #1) pada hasil pencarian kategori dan tab "Terbaru" selama 4 jam penuh.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <h4 className="font-bold text-orange-400 mb-1.5 flex items-center gap-1.5 text-sm">
              <Zap className="w-4 h-4" />
              2. Mengapa Perlu Pengecekan Otomatis Setiap 1 Menit?
            </h4>
            <p className="text-slate-300 leading-relaxed mb-2">
              Shopee membatasi maksimal <strong>5 produk sekaligus</strong> untuk dinaikkan. Kendala terbesar seller adalah:
            </p>
            <ul className="space-y-1 text-slate-400 pl-4 list-disc">
              <li>
                Sering lupa kapan slot 4 jam tersebut habis, sehingga produk turun peringkat selama berjam-jam tanpa disadari.
              </li>
              <li>
                Dengan tools ini, <strong>setiap 1 menit sekali (60 detik)</strong> sistem mengecek status ke-5 slot di server Shopee. Begitu ada 1 slot yang kadaluarsa atau kosong, produk dengan prioritas tertinggi langsung dinaikkan seketika.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <h4 className="font-bold text-orange-400 mb-1.5 flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4" />
              3. Bagaimana Koneksi ke Server https://shopee.co.id Bekerja?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Tools ini terhubung ke gateway Shopee Indonesia (<code className="text-orange-400">https://shopee.co.id</code>). Backend Node.js melakukan verifikasi ping latensi jaringan secara aman dan mengirim instruksi endpoint <code className="text-slate-300">/api/v4/item/boost</code> dengan identitas toko Anda.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <h4 className="font-bold text-orange-400 mb-1.5 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              4. Tips Agar Produk Tetap di Ranking #1 & Banjir Pesanan
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 mt-2">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <strong>Foto Utama Cerah:</strong> Gunakan foto latar putih atau estetis agar CTR (rasio klik) tinggi saat berada di posisi atas.
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <strong>Kata Kunci Lengkap:</strong> Masukkan merek, tipe produk, warna, dan ukuran di judul produk.
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <strong>Harga Bersaing:</strong> Pasang harga kompetitif atau voucher toko untuk mengonversi klik menjadi pembelian.
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <strong>Respon Chat Cepat:</strong> Shopee memprioritaskan toko dengan tingkat performa chat di atas 85%.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Mengerti & Siap Gunakan
          </button>
        </div>
      </div>
    </div>
  );
};
