export function formatNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

export function formatPercent(num: number, includeSign = true): string {
  if (num === undefined || num === null || isNaN(num)) return '0%';
  const sign = includeSign && num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

export function getPlatformBadgeColor(platform: string): { bg: string; text: string; border: string } {
  const p = platform.toLowerCase();
  if (p.includes('facebook') || p.includes('fb')) {
    return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
  }
  if (p.includes('instagram') || p.includes('ig')) {
    return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
  }
  if (p.includes('tiktok') || p.includes('tt')) {
    return { bg: 'bg-neutral-900', text: 'text-white', border: 'border-neutral-700' };
  }
  return { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200' };
}
