# Bo'g'im va suyak salomatligi vebinari — lending page

Sobir Said bilan bepul onlayn vebinar uchun bir sahifali lending.

- Statik sayt, build talab qilmaydi (`index.html` + `speaker.jpg`).
- Dizayn: minimalizm, mobil uchun, oq–yashil, matn minimal.
- Vebinar: 7–8 sentabr, 20:00.
- Forma: faqat **Ism** va **Telefon raqam**. To'ldirilgach Telegram kanalga yo'naltiradi:
  `https://t.me/+vJ73DS0sz101ZGIy` (JS ичидаги `TG_LINK`).

## Meta Ads

- Matnlar Meta reklama qoidalariga mos yozilgan: shaxsga qaratilgan sog'liq da'volari yo'q,
  "sizda ... bor" turidagi iboralar yo'q, mavzu umumiy/ta'limiy tarzda berilgan.
- Meta Pixel bazaviy kodini `<head>` ichidagi izohli joyga qo'ying.
  Forma to'ldirilganda `fbq('track','Lead')` avtomatik ishga tushadi.

## Tahrirlash

| Joy | Nima |
|-----|------|
| `<head>` izoh | Meta Pixel bazaviy kodi |
| `TG_LINK` (JS) | Telegram kanal havolasi |
| `speaker.jpg` | Sobir Saidning rasmi |

## Lokal ko'rish

```bash
cd site && python3 -m http.server 4599
```
