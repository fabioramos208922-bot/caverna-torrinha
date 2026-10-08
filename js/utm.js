(function (root, factory) { const api = factory(); if (typeof module !== 'undefined' && module.exports) module.exports = api; if (root) root.TorrinhaUTM = api; })(typeof window !== 'undefined' ? window : globalThis, function () {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid'];
  const normalize = (value) => String(value || '').trim().toLowerCase().slice(0, 60).replace(/[^a-z0-9_.%\-]/g, '_');
  const read = (search, referrer) => { const p = new URLSearchParams(search || ''); const out = {}; keys.forEach(k => { const v = p.get(k); if (v) out[k] = normalize(v); }); if (!out.utm_source) { if (p.has('fbclid')) out.utm_source = 'meta'; else { let h = ''; try { h = referrer ? new URL(referrer).hostname.toLowerCase().replace(/^www\./, '') : ''; } catch {} if (h === 'youtube.com' || h === 'youtu.be') out.utm_source = 'youtube'; else if (h === 'instagram.com' || h === 'l.instagram.com') out.utm_source = 'instagram'; else if (h === 'facebook.com' || h === 'l.facebook.com') out.utm_source = 'facebook'; else if (/google\.[a-z.]+$/.test(h)) out.utm_source = 'google_organico'; else out.utm_source = h || 'direto'; } } return out; };
  const origem = (v) => [v.utm_source, v.utm_medium, v.utm_campaign, v.utm_content].filter(Boolean).join(' / ');
  return { keys, normalize, read, origem };
});
