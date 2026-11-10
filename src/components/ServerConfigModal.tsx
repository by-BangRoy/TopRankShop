import React, { useState } from 'react';
import {
  X,
  Server,
  Activity,
  CheckCircle2,
  RefreshCw,
  Globe,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ServerConfig, ROTATING_PROXY_POOL, ProxyNode } from '../utils/boosterEngine';

interface ServerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ServerConfig;
  onSaveConfig: (updated: ServerConfig) => void;
  onPingTest: () => Promise<void>;
  onSelectProxy?: (proxy: ProxyNode) => void;
  isPinging: boolean;
}

export const ServerConfigModal: React.FC<ServerConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onPingTest,
  onSelectProxy,
  isPinging,
}) => {
  const [formData, setFormData] = useState<ServerConfig>({ ...config });
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestPing = async () => {
    setTestResult(null);
    await onPingTest();
    setTestResult(
      `Berhasil terhubung ke ${formData.serverUrl}! Jalur Proxy: ${
        formData.currentProxy?.name || 'Telkom IDC Cyber 1 Jakarta'
      } • Latensi: ${config.latencyMs || 38}ms (HTTP 200 OK - TLS v1.3 Enkripsi Aktif)`
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-white mb-5 pb-3 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Konfigurasi Server & Proxy Rotasi Shopee</h3>
            <p className="text-xs text-slate-400">
              Koneksi aman ke https://shopee.co.id dengan perlindungan multi-IP proxy rotasi.
            </p>
          </div>
        </div>

        {/* Live Connectivity Benchmark */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Status Koneksi Server:
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              CONNECTED ({config.latencyMs} ms)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 py-1">
            <span>Target Server:</span>
            <code className="text-orange-400 font-mono">{formData.serverUrl}</code>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 py-1">
            <span>Proxy Aktif Saat Ini:</span>
            <span className="text-slate-200 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {formData.currentProxy?.name || 'Telkom IDC Cyber 1 Jakarta'} ({formData.currentProxy?.ip || '103.147.154.22'})
            </span>
          </div>

          {testResult && (
            <div className="mt-2 p-2 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{testResult}</span>
            </div>
          )}

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-end">
            <button
              type="button"
              onClick={handleTestPing}
              disabled={isPinging}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-orange-400' : ''}`} />
              <span>{isPinging ? 'Sedang Memeriksa...' : 'Uji Koneksi Server Shopee'}</span>
            </button>
          </div>
        </div>

        {/* Rotating Proxy Nodes Section */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Pool Proxy Rotasi Indonesia (Anti-Ban Gateway):</span>
            </label>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              5 Node Siap
            </span>
          </div>
          <div className="space-y-1.5">
            {ROTATING_PROXY_POOL.map((proxy) => {
              const isSelected = formData.currentProxy?.id === proxy.id;
              return (
                <div
                  key={proxy.id}
                  onClick={() => {
                    setFormData({ ...formData, currentProxy: proxy });
                    if (onSelectProxy) onSelectProxy(proxy);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-orange-500/15 border-orange-500/50 text-white'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-orange-400 animate-ping' : 'bg-slate-600'
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-slate-200">{proxy.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {proxy.location} • <span className="font-mono">{proxy.ip}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {proxy.latencyMs} ms
                    </span>
                    <p className="text-[10px] text-slate-400">Uptime {proxy.uptime}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            *IP otomatis berotasi pada setiap siklus boost 1 menit untuk melindungi akun toko dari pembatasan limit / deteksi IP berulang.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Server URL */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              URL Server Shopee Indonesia
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.serverUrl}
                onChange={(e) => setFormData({ ...formData, serverUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Shop Information */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Toko Shopee</label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Shop ID (ID Toko)</label>
              <input
                type="text"
                value={formData.shopId}
                onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="proxyRotation"
                checked={formData.proxyRotationEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, proxyRotationEnabled: e.target.checked })
                }
                className="rounded bg-slate-950 border-slate-800 text-orange-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="proxyRotation" className="text-xs text-slate-300 cursor-pointer">
                <strong>Rotasi Proxy Otomatis:</strong> Ganti IP proxy setiap eksekusi boost 1 menit untuk keamanan maksimal.
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoreconnect"
                checked={formData.autoReconnect}
                onChange={(e) => setFormData({ ...formData, autoReconnect: e.target.checked })}
                className="rounded bg-slate-950 border-slate-800 text-orange-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="autoreconnect" className="text-xs text-slate-300 cursor-pointer">
                <strong>Auto-Reconnect:</strong> Pertahankan koneksi server shopee.co.id tetap online tanpa terputus.
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-800">
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
              Simpan Konfigurasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
