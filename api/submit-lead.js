// Vercel serverless proxy — faqat serverda ishlaydi.
// Brauzer bu route'ga API kalitsiz POST qiladi ({campaign_id, ad_id}).
// Biz x-api-key'ni ENV'dan qo'shib, Lidex'ning telegram-link endpoint'iga
// (GET) uzatamiz va {telegram_link}'ni brauzerga qaytaramiz.
// API kalit brauzerga HECH QACHON chiqmaydi.
//
// campaign_id/ad_id bo'lmasa yoki noto'g'ri bo'lsa Lidex 400/404 qaytaradi —
// bu normal (qo'lda ochilgan test), brauzer o'zi fallback linkka o'tadi.

const UPSTREAM_URL = 'https://www.lidex.uz/api/leads/telegram-link';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, telegram_link: null, error: 'Method not allowed' });
  }

  const apiKey = process.env.LIDEX_LEADS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, telegram_link: null, error: 'LIDEX_LEADS_API_KEY sozlanmagan' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const params = new URLSearchParams();
  if (body.campaign_id != null && body.campaign_id !== '') params.set('campaign_id', body.campaign_id);
  if (body.ad_id != null && body.ad_id !== '') params.set('ad_id', body.ad_id);

  const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const clientUa = req.headers['user-agent'] || '';

  try {
    const upstream = await fetch(UPSTREAM_URL + '?' + params.toString(), {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'x-forwarded-for': clientIp,
        'user-agent': clientUa
      }
    });

    const text = await upstream.text();
    let data = null;
    try { data = JSON.parse(text); } catch (_) {}

    if (data) {
      return res.status(upstream.status).json(data);
    }
    return res.status(upstream.status).json({ ok: upstream.ok, telegram_link: null });
  } catch (err) {
    return res.status(502).json({ ok: false, telegram_link: null, error: 'Upstream so\'rovi muvaffaqiyatsiz' });
  }
};
