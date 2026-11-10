import { ShopeeProduct } from '../utils/boosterEngine';

/**
 * Daftar produk awal dikosongkan secara default agar pengguna dapat mengisi produk manual.
 */
export const INITIAL_PRODUCTS: ShopeeProduct[] = [];

/**
 * Contoh produk toko Shopee siap pakai untuk mempermudah pengujian 1-klik bagi pengguna.
 */
export const SAMPLE_DEMO_PRODUCTS: Omit<ShopeeProduct, 'id'>[] = [
  {
    itemId: '2947292182',
    name: 'Kemeja Flanel Pria Lengan Panjang Katun Premium Slimfit Casual',
    category: 'Fashion',
    price: 139000,
    currentRank: 14,
    previousRank: 18,
    isBoosted: false,
    priority: 'high',
    boostedAt: null,
    cooldownUntil: null,
    seoScore: 92,
    impressions: 1420,
    clicks: 168,
    shopeeUrl: 'https://shopee.co.id/product/88421092/2947292182',
    rating: 4.8,
    soldCount: 380,
  },
  {
    itemId: '3819204911',
    name: 'Serum Wajah Niacinamide 10% Brightening Mencerahkan Kulit BPOM Original',
    category: 'Kecantikan',
    price: 89000,
    currentRank: 22,
    previousRank: 27,
    isBoosted: false,
    priority: 'high',
    boostedAt: null,
    cooldownUntil: null,
    seoScore: 95,
    impressions: 2150,
    clicks: 295,
    shopeeUrl: 'https://shopee.co.id/product/88421092/3819204911',
    rating: 4.9,
    soldCount: 920,
  },
  {
    itemId: '1948201948',
    name: 'TWS Bluetooth 5.3 Earphone Deep Bass Tahan Air IPX5 Gaming Low Latency',
    category: 'Elektronik',
    price: 155000,
    currentRank: 19,
    previousRank: 25,
    isBoosted: false,
    priority: 'medium',
    boostedAt: null,
    cooldownUntil: null,
    seoScore: 89,
    impressions: 980,
    clicks: 112,
    shopeeUrl: 'https://shopee.co.id/product/88421092/1948201948',
    rating: 4.7,
    soldCount: 240,
  },
];
