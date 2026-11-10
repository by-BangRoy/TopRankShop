import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateShopeeUrl,
  findNextProductToBoost,
  assignProductToFreeSlot,
  calculateRankScore,
  formatCountdown,
  generateSeoTags,
  getNextProxy,
  ROTATING_PROXY_POOL,
  ShopeeProduct,
  BoostSlot,
} from './boosterEngine';

const mockProducts: ShopeeProduct[] = [
  {
    id: 'prod-1',
    itemId: '10001',
    name: 'Sepatu Sneakers Pria Casual Retro',
    category: 'Fashion',
    price: 189000,
    stock: 120,
    soldCount: 3420,
    rating: 4.9,
    imageUrl: '',
    priority: 'high',
    currentRank: 8,
    previousRank: 12,
    isBoosted: false,
    boostedAt: null,
    cooldownUntil: null,
    impressions: 12000,
    clicks: 1400,
    seoScore: 92,
    shopeeUrl: 'https://shopee.co.id/product/10001',
  },
  {
    id: 'prod-2',
    itemId: '10002',
    name: 'Serum Pencerah Kulit Niacinamide 10%',
    category: 'Kecantikan',
    price: 85000,
    stock: 450,
    soldCount: 8900,
    rating: 4.8,
    imageUrl: '',
    priority: 'medium',
    currentRank: 15,
    previousRank: 18,
    isBoosted: false,
    boostedAt: 1000,
    cooldownUntil: null,
    impressions: 25000,
    clicks: 3200,
    seoScore: 88,
    shopeeUrl: 'https://shopee.co.id/product/10002',
  },
  {
    id: 'prod-3',
    itemId: '10003',
    name: 'TWS Bluetooth 5.3 Earphone Bass',
    category: 'Elektronik',
    price: 139000,
    stock: 80,
    soldCount: 1540,
    rating: 4.7,
    imageUrl: '',
    priority: 'low',
    currentRank: 22,
    previousRank: 25,
    isBoosted: false,
    boostedAt: null,
    cooldownUntil: null,
    impressions: 8000,
    clicks: 650,
    seoScore: 80,
    shopeeUrl: 'https://shopee.co.id/product/10003',
  },
];

const mockSlots: BoostSlot[] = [
  {
    slotIndex: 1,
    productId: null,
    productName: null,
    status: 'idle',
    boostedAt: null,
    expiresAt: null,
  },
  {
    slotIndex: 2,
    productId: 'prod-99',
    productName: 'Other Item',
    status: 'active',
    boostedAt: 100,
    expiresAt: 500000,
  },
  {
    slotIndex: 3,
    productId: null,
    productName: null,
    status: 'idle',
    boostedAt: null,
    expiresAt: null,
  },
  {
    slotIndex: 4,
    productId: null,
    productName: null,
    status: 'idle',
    boostedAt: null,
    expiresAt: null,
  },
  {
    slotIndex: 5,
    productId: null,
    productName: null,
    status: 'idle',
    boostedAt: null,
    expiresAt: null,
  },
];

test('validateShopeeUrl validates official Shopee URLs', () => {
  assert.equal(validateShopeeUrl('https://shopee.co.id/product/12345'), true);
  assert.equal(validateShopeeUrl('https://seller.shopee.co.id/portal/product'), true);
  assert.equal(validateShopeeUrl('https://google.com'), false);
  assert.equal(validateShopeeUrl('not-a-url'), false);
  assert.equal(validateShopeeUrl(''), false);
});

test('findNextProductToBoost picks highest priority eligible product', () => {
  const chosen = findNextProductToBoost(mockProducts, mockSlots, 200);
  assert.ok(chosen);
  assert.equal(chosen?.id, 'prod-1'); // high priority
});

test('assignProductToFreeSlot fills first idle slot', () => {
  const { updatedSlots, assignedSlotIndex } = assignProductToFreeSlot(
    mockSlots,
    mockProducts[0],
    1000,
    14400000
  );

  assert.equal(assignedSlotIndex, 1);
  assert.equal(updatedSlots[0].productId, 'prod-1');
  assert.equal(updatedSlots[0].status, 'active');
  assert.equal(updatedSlots[0].expiresAt, 1000 + 14400000);
});

test('calculateRankScore brings boosted items to rank #1', () => {
  const result = calculateRankScore(mockProducts[0], true, 0);
  assert.equal(result.rank, 1);
  assert.ok(result.score >= 90);

  const unboosted = calculateRankScore(mockProducts[0], false, 60);
  assert.ok(unboosted.rank >= 5);
});

test('formatCountdown formats MM:SS and HH:MM:SS properly', () => {
  assert.equal(formatCountdown(60), '01:00');
  assert.equal(formatCountdown(125), '02:05');
  assert.equal(formatCountdown(3665), '01:01:05');
  assert.equal(formatCountdown(0), '00:00');
  assert.equal(formatCountdown(-10), '00:00');
});

test('generateSeoTags generates top Indonesian tags', () => {
  const tags = generateSeoTags('Kemeja Pria Polos Modern', 'Fashion');
  assert.ok(tags.length >= 3);
  assert.ok(tags.includes('ShopeeHaul'));
  assert.ok(tags.includes('FashionOOTD'));
});

test('getNextProxy rotates through Indonesian proxy nodes continuously', () => {
  const p1 = ROTATING_PROXY_POOL[0];
  const p2 = getNextProxy(p1.id);
  assert.equal(p2.id, ROTATING_PROXY_POOL[1].id);

  const last = ROTATING_PROXY_POOL[ROTATING_PROXY_POOL.length - 1];
  const wrapped = getNextProxy(last.id);
  assert.equal(wrapped.id, ROTATING_PROXY_POOL[0].id);
});
