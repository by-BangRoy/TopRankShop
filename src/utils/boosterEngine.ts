/**
 * Core Logic for Shopee Top Rank Auto-Booster Engine
 * Handles slot allocation, priority queuing, ranking score calculation, and countdown formatting.
 */

export type Priority = 'high' | 'medium' | 'low';

export interface ShopeeProduct {
  id: string;
  itemId: string;
  name: string;
  category: string;
  price: number;
  stock?: number;
  soldCount: number;
  rating: number;
  imageUrl?: string;
  priority: Priority;
  currentRank: number; // 1 = Top search position on shopee.co.id
  previousRank: number;
  isBoosted: boolean;
  boostedAt: number | null; // timestamp ms
  cooldownUntil: number | null; // timestamp ms
  impressions: number;
  clicks: number;
  seoScore: number;
  shopeeUrl: string;
}

export interface BoostSlot {
  slotIndex: number; // 1 to 5 (official Shopee allows 5 slots)
  productId: string | null;
  productName: string | null;
  status: 'idle' | 'active' | 'cooldown';
  boostedAt: number | null;
  expiresAt: number | null;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  targetUrl: string;
  responseTimeMs: number;
  statusCode: number;
  productId?: string;
  productName?: string;
}

export interface ServerConfig {
  serverUrl: string; // e.g. "https://shopee.co.id"
  mode: 'proxy' | 'cookie' | 'open_api' | 'simulation';
  shopId: string;
  shopName: string;
  cookieToken: string;
  partnerId: string;
  partnerKey: string;
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  latencyMs: number;
  lastPingTime: number | null;
  autoReconnect: boolean;
  intervalMinutes: number; // Default 1 minute
  currentProxy: ProxyNode;
  proxyRotationEnabled: boolean;
  proxyPool?: ProxyNode[];
  edgeServer?: string;
  rateLimitRemaining?: number;
  serverTimestamp?: string;
  realTimeConnected?: boolean;
  packetsReceived?: number;
}

export interface ProxyNode {
  id: string;
  name: string;
  ip: string;
  location: string;
  latencyMs: number;
  uptime: string;
  protocol: 'HTTPS' | 'SOCKS5';
  status: 'active' | 'standby';
}

export const ROTATING_PROXY_POOL: ProxyNode[] = [
  {
    id: 'px-jkt-1',
    name: 'Telkom IDC Cyber 1 Jakarta',
    ip: '103.147.154.22',
    location: 'Jakarta, Indonesia',
    latencyMs: 38,
    uptime: '99.98%',
    protocol: 'HTTPS',
    status: 'active',
  },
  {
    id: 'px-jkt-2',
    name: 'Biznet Metronet Duren Tiga',
    ip: '182.253.112.89',
    location: 'Jakarta, Indonesia',
    latencyMs: 44,
    uptime: '99.95%',
    protocol: 'HTTPS',
    status: 'standby',
  },
  {
    id: 'px-sby-1',
    name: 'Indosat Intiland Gateway',
    ip: '114.125.76.104',
    location: 'Surabaya, Indonesia',
    latencyMs: 52,
    uptime: '99.90%',
    protocol: 'HTTPS',
    status: 'standby',
  },
  {
    id: 'px-bdg-1',
    name: 'MNC Play Pasteur Gateway',
    ip: '36.88.204.18',
    location: 'Bandung, Indonesia',
    latencyMs: 48,
    uptime: '99.92%',
    protocol: 'HTTPS',
    status: 'standby',
  },
  {
    id: 'px-sg-1',
    name: 'Shopee Regional Fast Route',
    ip: '128.199.201.77',
    location: 'Singapore (Direct Route)',
    latencyMs: 29,
    uptime: '99.99%',
    protocol: 'HTTPS',
    status: 'standby',
  },
];

export function getNextProxy(currentProxyId?: string): ProxyNode {
  const currentIndex = ROTATING_PROXY_POOL.findIndex((p) => p.id === currentProxyId);
  const nextIndex = (currentIndex + 1) % ROTATING_PROXY_POOL.length;
  return ROTATING_PROXY_POOL[nextIndex];
}

/**
 * Standard Shopee Naikkan Produk duration: 4 hours (14,400,000 ms).
 * For simulation / demo speed testing, we can provide customizable duration.
 */
export const DEFAULT_SHOPEE_BOOST_DURATION_MS = 4 * 60 * 60 * 1000;

/**
 * Validates if a string is a valid Shopee Indonesia URL.
 */
export function validateShopeeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return (
      (parsed.hostname === 'shopee.co.id' ||
        parsed.hostname === 'seller.shopee.co.id' ||
        parsed.hostname.endsWith('.shopee.co.id')) &&
      parsed.protocol === 'https:'
    );
  } catch {
    return false;
  }
}

/**
 * Priority weighting for queue determination
 */
const PRIORITY_WEIGHTS: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Finds the next best product to boost from the catalog.
 * Rules:
 * 1. Product must not currently be active in an unexpired slot.
 * 2. Higher priority ('high' > 'medium' > 'low') is chosen first.
 * 3. Break ties with oldest boostedAt (or never boosted = 0).
 */
export function findNextProductToBoost(
  products: ShopeeProduct[],
  slots: BoostSlot[],
  now: number = Date.now()
): ShopeeProduct | null {
  // Determine IDs currently active in slots
  const activeProductIds = new Set<string>();
  for (const slot of slots) {
    if (slot.productId && slot.expiresAt && slot.expiresAt > now) {
      activeProductIds.add(slot.productId);
    }
  }

  // Eligible products are those not currently active
  const eligible = products.filter((p) => !activeProductIds.has(p.id));
  if (eligible.length === 0) return null;

  // Sort by priority weight DESC, then boostedAt ASC (null/0 first)
  return eligible.slice().sort((a, b) => {
    const pDiff = PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
    if (pDiff !== 0) return pDiff;

    const aTime = a.boostedAt || 0;
    const bTime = b.boostedAt || 0;
    return aTime - bTime;
  })[0];
}

/**
 * Allocates a product to the first available/expired slot.
 */
export function assignProductToFreeSlot(
  slots: BoostSlot[],
  product: ShopeeProduct,
  now: number = Date.now(),
  durationMs: number = DEFAULT_SHOPEE_BOOST_DURATION_MS
): { updatedSlots: BoostSlot[]; assignedSlotIndex: number | null } {
  const updated = slots.map((s) => ({ ...s }));
  let assignedSlotIndex: number | null = null;

  for (let i = 0; i < updated.length; i++) {
    const slot = updated[i];
    const isFree =
      slot.status === 'idle' ||
      !slot.productId ||
      (slot.expiresAt !== null && slot.expiresAt <= now);

    if (isFree) {
      updated[i] = {
        slotIndex: slot.slotIndex,
        productId: product.id,
        productName: product.name,
        status: 'active',
        boostedAt: now,
        expiresAt: now + durationMs,
      };
      assignedSlotIndex = slot.slotIndex;
      break;
    }
  }

  return { updatedSlots: updated, assignedSlotIndex };
}

/**
 * Calculates updated rank and score for a product based on boost state and freshness.
 * When boosted, products jump to top positions (#1 - #3).
 */
export function calculateRankScore(
  product: ShopeeProduct,
  isBoosted: boolean,
  minutesSinceBoost: number = 0
): { rank: number; score: number } {
  let score = 50; // base score

  // SEO & Rating bonus
  score += Math.round((product.seoScore / 100) * 20);
  score += Math.round((product.rating / 5) * 15);

  if (isBoosted) {
    // Fresh boost gives massive algorithmic boost on shopee.co.id
    const boostFreshnessBonus = Math.max(0, 15 - Math.floor(minutesSinceBoost / 15));
    score += boostFreshnessBonus;

    // Rank is pushed toward #1
    let rank = 1;
    if (product.priority === 'medium') rank = Math.min(2, Math.max(1, Math.floor((100 - score) / 10)));
    if (product.priority === 'low') rank = Math.min(4, Math.max(2, Math.floor((100 - score) / 8)));
    return { rank, score: Math.min(100, Math.max(1, score)) };
  } else {
    // Unboosted products drop down in search results over time
    const rank = Math.max(5, Math.min(50, Math.floor((100 - score) / 2) + 5));
    return { rank, score: Math.min(100, Math.max(1, score)) };
  }
}

/**
 * Formats a duration in seconds into MM:SS or HH:MM:SS.
 */
export function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0 || isNaN(totalSeconds)) return '00:00';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generates top Shopee Indonesia SEO keywords and hashtags.
 */
export function generateSeoTags(productTitle: string, category: string): string[] {
  const commonIndonesiaTags = [
    'ShopeeHaul',
    'RacunShopee',
    'GratisOngkirRP0',
    'CodBayarDitempat',
    'ProdukTerlaris',
    'ShopeeSuperSeller',
  ];

  const words = productTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 4);

  const categoryTags: Record<string, string[]> = {
    Fashion: ['FashionOOTD', 'StyleKekinian', 'BajuViral'],
    Elektronik: ['GadgetMurah', 'ElektronikOriginal', 'GaransiResmi'],
    Kecantikan: ['SkincareRutin', 'GlowingMaksimal', 'BpomOriginal'],
    Makanan: ['KulinerNusantara', 'CemilanViral', 'HalalFood'],
    Rumah: ['DekorasiAestetik', 'PerabotRumah', 'RumahMinimalis'],
  };

  const specificTags = categoryTags[category] || ['ProdukOriginal', 'FlashSale'];

  const combined = new Set<string>();
  words.forEach((w) => combined.add(w.charAt(0).toUpperCase() + w.slice(1)));
  specificTags.forEach((t) => combined.add(t));
  commonIndonesiaTags.forEach((t) => combined.add(t));

  return Array.from(combined).slice(0, 8);
}
