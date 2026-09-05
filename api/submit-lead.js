// Vercel serverless function — faqat serverda ishlaydi.
// Brauzer bu route'ga API kalitsiz POST qiladi. Bu funksiya
// x-api-key sarlavhasini o'zining ENV o'zgaruvchisidan qo'shib,
// so'rovni lidex.uz'ga uzatadi va javobni brauzerga qaytaradi.

const UPSTREAM_URL = 'https://www.lidex.uz/api/leads/website';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.LIDEX_LEADS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, telegram_link: null, error: 'LIDEX_LEADS_API_KEY sozlanmagan' });
  }

  // Body — Vercel odatda JSON'ni o'zi parslaydi; string kelsa ham qo'llab-quvvatlaymiz.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  // Forma olib tashlangan — odatda name/phone kelmaydi. Faqat kelgan
  // maydonlarni uzatamiz (undefined yubormaymiz).
  const payload = {
    campaign_id: body.campaign_id != null ? body.campaign_id : null,
    ad_id: body.ad_id != null ? body.ad_id : null
  };
  if (body.name) payload.name = body.name;
  if (body.phone) payload.phone = body.phone;
  if (body.fbclid) payload.fbclid = body.fbclid;

  // Haqiqiy foydalanuvchi ma'lumotlari — bo'lmasa Lidex bizning Vercel IP'imizni
  // yuboradi va Meta "bitta IP = ko'p foydalanuvchi" deb ogohlantiradi.
  const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const clientUa = req.headers['user-agent'] || '';
  const fbp = (/(?:^|;\s*)_fbp=([^;]+)/.exec(req.headers.cookie || '') || [])[1] || '';
  if (clientIp) payload.client_ip_address = clientIp;
  if (clientUa) payload.client_user_agent = clientUa;
  if (fbp) payload.fbp = fbp;

  try {
    const upstream = await fetch(UPSTREAM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-forwarded-for': clientIp,
        'user-agent': clientUa
      },
      body: JSON.stringify(payload)
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
