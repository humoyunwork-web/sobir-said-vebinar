// Vercel serverless proxy — faqat serverda ishlaydi.
// Buyurtma lendingidagi forma bu route'ga POST qiladi ({name, phone, campaign_id, ad_id}).
// Biz leadni Telegram guruhga bot orqali yuboramiz. Bot token va guruh
// chat ID faqat ENV'da — brauzerga HECH QACHON chiqmaydi.
//
// Kerakli Vercel Environment Variables:
//   TELEGRAM_BOT_TOKEN      — BotFather bergan token
//   TELEGRAM_GROUP_CHAT_ID  — guruh chat ID (masalan -1001234567890)

const TG_API = 'https://api.telegram.org/bot';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;
  if (!token || !chatId) {
    return res.status(500).json({ ok: false, error: 'TELEGRAM_BOT_TOKEN yoki TELEGRAM_GROUP_CHAT_ID sozlanmagan' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const name = (body.name || '').toString().trim().slice(0, 100);
  const phone = (body.phone || '').toString().trim().slice(0, 30);
  if (!phone) {
    return res.status(400).json({ ok: false, error: 'phone majburiy' });
  }
  const campaign = (body.campaign_id || '').toString().trim().slice(0, 100);
  const ad = (body.ad_id || '').toString().trim().slice(0, 100);

  const lines = [
    '🛒 Yangi buyurtma',
    'Ism: ' + (name || '—'),
    'Telefon: ' + phone
  ];
  if (campaign) lines.push('campaign_id: ' + campaign);
  if (ad) lines.push('ad_id: ' + ad);

  try {
    const r = await fetch(TG_API + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), disable_web_page_preview: true })
    });
    const data = await r.json().catch(function () { return {}; });
    if (data && data.ok) {
      return res.status(200).json({ ok: true });
    }
    return res.status(502).json({ ok: false, error: (data && data.description) || 'Telegram xatosi' });
  } catch (err) {
    return res.status(502).json({ ok: false, error: 'Telegram so\'roviga ulanib bo\'lmadi' });
  }
};
