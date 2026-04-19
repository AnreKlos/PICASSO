import { ShieldCheck, Zap, Star, Users } from 'lucide-react';
import React from 'react';

// Данные для карточек преимуществ
const features = [
  {
    icon: <ShieldCheck className="w-10 h-10 text-blue-500" />,
    title: 'Абсолютная стерильность',
    description: 'Мы строго соблюдаем все санитарные нормы и используем только стерильные инструменты.',
  },
  {
    icon: <Star className="w-10 h-10 text-yellow-500" />,
    title: 'Гарантия качества',
    description: 'Наши услуги и материалы соответствуют высочайшим стандартам, обеспечивая долговечный результат.',
  },
  {
    icon: <Zap className="w-10 h-10 text-green-500" />,
    title: 'Премиальный сервис',
    description: 'Каждый клиент получает индивидуальный подход и обслуживание на высшем уровне.',
  },
  {
    icon: <Users className="w-10 h-10 text-purple-500" />,
    title: 'Профессиональные мастера',
    description: 'Наша команда состоит из опытных и квалифицированных специалистов, постоянно повышающих свою квалификацию.',
  },
  // Вы можете добавить больше карточек по аналогии
];

// Компонент одной карточки преимущества
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) => {
  return (
    <div className="
      flex 
      flex-col sm:flex-row       /* На мобильных: колонка, на sm+ экранах: строка */
      items-center sm:items-start /* Выравнивание по центру в колонке, по верху в строке */
      text-center sm:text-left   /* Текст по центру в колонке, по левому краю в строке */
      gap-4                      /* Пространство между элементами */
      p-6                        /* Внутренний отступ */
      bg-white rounded-xl shadow-sm
    ">
      {/* Иконка: не сжимается */}
      <div className="flex-shrink-0">
        {icon}
      </div>
      
      {/* Текстовый блок: гибкий и с переносами */ }
      <div className="flex-1 min-w-0"> {/* flex-1 позволяет блоку расти, min-w-0 исправляет переполнение текста */}
        <h4 className="text-lg font-semibold text-gray-900 leading-tight"> {/* leading-tight для нормального line-height */}
          {title}
        </h4>
        <p className="mt-1 text-gray-600 leading-normal"> {/* leading-normal для нормального line-height */}
          {description}
        </p>
      </div>
    </div>
  );
};

// Секция "О салоне" с карточками преимуществ
export const AboutFeatures = () => {
  return (
    <section className="py-12 bg-gray-50 sm:py-16">
      <div className="max-w-7xl px-4 mx-auto"> {/* Увеличил max-w для 4 колонок */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">О нашем салоне</h2>
        
        {/* Контейнер для карточек: адаптивная сетка */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> {/* Адаптивная сетка до 4 колонок */}
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};