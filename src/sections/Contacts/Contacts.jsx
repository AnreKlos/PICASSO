import { MapPin, Phone, Clock3 } from 'lucide-react'
import { picassoConfig } from '../../config/picasso.config'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'

const { GOLD, TEXT, TEXT_SOFT, MUTED, CHOCOLATE, BORDER_H } = picassoConfig.tokens

function Contacts() {
  return (
    <section id="contacts" className="scroll-mt-20 py-20 sm:py-24" style={{ background: CHOCOLATE }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <TiltHeading as="h2" className="font-picasso-display text-2xl sm:text-3xl font-medium text-center leading-[1.15] mb-12" style={{ color: TEXT }}>
            Контакты
          </TiltHeading>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <FadeIn delay={0.1}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center" style={{ border: `1px solid ${BORDER_H}`, borderRadius: 9999 }}>
                <MapPin size={20} style={{ color: GOLD }} strokeWidth={1.5} />
              </div>
              <p className="text-[15px] font-light leading-relaxed" style={{ color: TEXT_SOFT }}>{picassoConfig.contacts.address}</p>
              <p className="text-[13px] font-light" style={{ color: MUTED }}>{picassoConfig.contacts.addressNote}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center" style={{ border: `1px solid ${BORDER_H}`, borderRadius: 9999 }}>
                <Phone size={20} style={{ color: GOLD }} strokeWidth={1.5} />
              </div>
              <a href={`tel:${picassoConfig.contacts.phoneRaw}`} className="text-[15px] font-light transition-colors hover:underline" style={{ color: TEXT_SOFT }}>{picassoConfig.contacts.phone}</a>
              <p className="text-[13px] font-light" style={{ color: MUTED }}>WhatsApp / Telegram</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center" style={{ border: `1px solid ${BORDER_H}`, borderRadius: 9999 }}>
                <Clock3 size={20} style={{ color: GOLD }} strokeWidth={1.5} />
              </div>
              <p className="text-[15px] font-light" style={{ color: TEXT_SOFT }}>{picassoConfig.contacts.hours}</p>
              <p className="text-[13px] font-light" style={{ color: MUTED }}>{picassoConfig.contacts.hoursNote}</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

export default Contacts
