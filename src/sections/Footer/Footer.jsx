import { picassoConfig } from '../../configs/picasso.config'

const { GOLD, TEXT_SOFT, BG, BORDER } = picassoConfig.tokens

function Footer() {
  const vkItem = picassoConfig.social.find((item) => item.href.includes('vk.com'))
  const whatsappDigits = picassoConfig.contacts.whatsapp.replace(/\D/g, '')
  const socials = [
    ...(vkItem ? [vkItem] : []),
    {
      href: `https://wa.me/${whatsappDigits}`,
      label: `WhatsApp ${picassoConfig.meta.name}`,
      short: 'WA',
    },
  ]

  return (
    <footer className="py-10" style={{ background: BG, borderTop: `1px solid ${BORDER}` }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span
              className="font-picasso-display text-lg"
              style={{ color: GOLD, textShadow: '0 0 20px rgba(201,168,122,0.1)' }}
            >
              {picassoConfig.meta.name}
            </span>

            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Салон эстетики
            </span>
          </div>

          <div className="flex items-center gap-3">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[44px] h-10 px-4 flex items-center justify-center transition-all hover:opacity-80"
                style={{
                  border: `1px solid ${BORDER}`,
                  borderRadius: 9999,
                  color: TEXT_SOFT,
                  background: 'rgba(255,255,255,0.02)',
                }}
                aria-label={item.label}
                title={item.label}
              >
                <span className="text-xs uppercase tracking-[0.14em]">{item.short}</span>
              </a>
            ))}
          </div>
        </div>

        <div
          className="mt-6 pt-5 text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5"
          style={{ borderTop: `1px solid ${BORDER}` }}
        >
          <p className="font-picasso-body text-[11px] tracking-[0.05em]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            &copy; {picassoConfig.copyrightYear} {picassoConfig.meta.name}. Все права защищены.
          </p>

          <a
            href={`tel:${picassoConfig.contacts.phoneRaw}`}
            className="font-picasso-body text-[11px] tracking-[0.05em] transition-opacity hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            aria-label={`Позвонить в салон ${picassoConfig.meta.name}`}
          >
            {picassoConfig.contacts.phone}
          </a>
        </div>

        {picassoConfig.legal.showInFooter && (
          <p className="font-picasso-body text-[10px] tracking-[0.05em] mt-3 text-center" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {picassoConfig.legal.placeholder}
          </p>
        )}
      </div>
    </footer>
  )
}

export default Footer
