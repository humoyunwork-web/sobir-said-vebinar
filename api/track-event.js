// Vercel serverless function — faqat serverda ishlaydi.
// Rahmat (thank you) sahifasidan keladigan funnel beacon'larini
// (thank_you_view / tg_click) x-api-key bilan lidex.uz'ga uzatadi.
// API kalit brauzerga HECH QACHON chiqmaydi.

const UPSTREAM_URL = 'https://www.lidex.uz/api/leads/track-event';
const ALLOWED = ['thank_you_view', 'tg_click'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.LIDEX_LEADS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: 'LIDEX_LEADS_API_KEY sozlanmagan' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const eventType = body.event_type;
  if (ALLOWED.indexOf(eventType) === -1) {
    return res.status(400).json({ ok: false, error: 'Invalid event_type' });
  }

  const payload = {
    event_type: eventType,
    campaign_id: body.campaign_id != null ? body.campaign_id : null,
    ad_id: body.ad_id != null ? body.ad_id : null
  };

  try {
    const upstream = await fetch(UPSTREAM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    const text = await upstream.text();
    let data = null;
    try { data = JSON.parse(text); } catch (_) {}

    if (data) return res.status(upstream.status).json(data);
    return res.status(upstream.status).json({ ok: upstream.ok });
  } catch (err) {
    return res.status(502).json({ ok: false, error: 'Upstream request failed' });
  }
};
