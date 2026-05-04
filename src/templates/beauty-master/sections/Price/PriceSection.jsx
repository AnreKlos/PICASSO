import React from 'react';
import { useContext } from 'react'
import { defaultConfig } from '../../../../configs/_default.config'
import { ConfigContext } from '../../../../shared/contexts/ConfigContext'
import FadeIn from '../../components/FadeIn'
import TiltHeading from '../../components/TiltHeading'
import GoldSpan from '../../components/GoldSpan'

export default function PriceSection() {
  const configFromContext = useContext(ConfigContext)
  const config = configFromContext || defaultConfig
  const { GOLD, TEXT, TEXT_SOFT, BG } = config.tokens
  
  const priceData = config.sections?.price;
  
  if (!priceData?.enabled || !priceData.groups?.length) {
    return null;
  }

  const items = priceData.groups[0]?.items || [];

  if (!items.length) {
    return null;
  }

  return (
    <section id="prices" className="scroll-mt-20 py-28 sm:py-36" style={{ background: BG }}>
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <FadeIn>
          <p className="font-wow-body text-[12px] uppercase tracking-[0.4em] mb-5 select-none text-center" style={{ color: GOLD }}>Прайс</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <TiltHeading className="font-wow-display text-3xl sm:text-4xl lg:text-5xl font-medium text-center leading-[1.15]" style={{ color: TEXT }}>
            {priceData.title || <>Цены по <GoldSpan>направлениям</GoldSpan></>}
          </TiltHeading>
        </FadeIn>
        {priceData.note && (
          <FadeIn delay={0.15}>
            <p className="mt-6 text-center text-base font-light leading-relaxed max-w-lg mx-auto" style={{ color: TEXT_SOFT }}>
              {priceData.note}
            </p>
          </FadeIn>
        )}
        <div className="mt-16 flex flex-col gap-4">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className="flex justify-between items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex-1">
                <h3 className="font-wow-display text-lg sm:text-xl leading-tight" style={{ color: TEXT }}>
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: TEXT_SOFT }}>
                    {item.description}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-wow-display text-lg sm:text-xl italic" style={{ color: GOLD }}>
                  {item.priceFrom && <span className="text-sm">от </span>}
                  {item.price}
                </div>
                {item.duration_min && (
                  <span className="text-xs" style={{ color: TEXT_SOFT }}>
                    {item.duration_min} мин
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
