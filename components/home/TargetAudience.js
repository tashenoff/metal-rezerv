// components/home/TargetAudience.js
import React from 'react';

const TargetAudience = () => {
  const audienceList = [
    {
      title: 'Малый и средний бизнес',
      description: 'Идеально подходит для компаний, которые ищут проверенных поставщиков и хотят оптимизировать процессы закупок.',
    },
    {
      title: 'Корпоративные клиенты',
      description: 'Наш портал предоставляет возможности для крупных организаций, которым важно качество и безопасность при выборе поставщиков.',
    },
    {
      title: 'Поставщики услуг',
      description: 'Для профессиональных поставщиков, желающих расширить клиентскую базу и получить доступ к новым заявкам.',
    },
  ];

  return (
    <section className="py-16 px-5 bg-base-200">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Для кого этот портал?</h2>
        <p className="text-lg mb-8">
          Зачем тратить время на долгие поиски поставщиков в интернете, если можно найти проверенных и надежных партнеров в одном месте? Наш портал объединяет только качественные предложения, помогая вам экономить время и силы.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audienceList.map((audience, index) => (
            <div key={index} className="bg-base-100 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-xl mb-2">{audience.title}</h3>
              <p>{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
