import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, phone } = req.body

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' })
    }

    const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })

    // --- Email через Яндекс SMTP ---
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const targetEmail = process.env.NOTIFY_EMAIL || 'mauzer69@yandex.ru'

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: { user: smtpUser, pass: smtpPass },
      })

      await transporter.sendMail({
        from: `"PICASSO Salon" <${smtpUser}>`,
        to: targetEmail,
        subject: `Новая заявка с сайта — ${name}`,
        html: [
          '<h2>Новая заявка с сайта PICASSO</h2>',
          `<p><b>Имя:</b> ${name}</p>`,
          `<p><b>Телефон:</b> <a href="tel:${phone.replace(/\D/g, '')}">${phone}</a></p>`,
          `<p><b>Время:</b> ${timestamp}</p>`,
        ].join(''),
      })
    } else {
      console.warn('SMTP_USER or SMTP_PASS not set — email skipped')
    }

    // --- Telegram (если настроен) ---
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (botToken && chatId) {
      const text = [
        '📋 *Новая заявка с сайта PICASSO*',
        '',
        `👤 Имя: ${name}`,
        `📞 Телефон: ${phone}`,
        '',
        `🕐 ${timestamp}`,
      ].join('\n')

      await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
        }
      )
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Booking handler error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
