# Argon — vebinar lending page

Bo'g'im va suyak og'rig'i bo'yicha bepul onlayn vebinar uchun bir sahifali lending.

- Statik sayt, hech qanday build talab qilmaydi (`index.html` + `speaker.jpg`).
- Dizayn: minimalizm, mobil uchun optimallashtirilgan, oq–yashil rang sxemasi.
- Manba: `Argon_mijoz_portreti_va_sotuv_tahlili` hisoboti va mijoz portreti tahlili.

## Tahrirlash kerak bo'lgan joylar

| Joy | Nima |
|-----|------|
| Hero `chip` | Vebinar sanasi va vaqti (`[kun, oy — masalan 15-sentabr]`) |
| Spiker bloki | `<!-- Spiker ismini shu yerga qo'shing -->` — spikerning haqiqiy ismi |
| `Telegram orqali savol berish` tugmasi | `https://t.me/` — haqiqiy Telegram havolasi |
| `regForm` submit (JS) | Backend / Telegram bot / Google Form endpoint'ini ulash |

## Lokal ko'rish

```bash
cd site && python3 -m http.server 4599
```

## Deploy

Vercel'ga statik sayt sifatida deploy qilinadi (root katalog, framework yo'q).
