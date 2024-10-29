// components/home/Features.js
import React from 'react';
import { FaShieldAlt, FaCheckCircle, FaRocket } from 'react-icons/fa'; // Иконки

const Features = () => {
  const featuresList = [
    {
      title: 'Безопасный обмен контактами',
      description: 'Клиенты выбирают поставщиков, и только им показываются контакты.',
      icon: <FaShieldAlt className="text-blue-500 text-4xl mb-4" />,
    },
    {
      title: 'Тщательная проверка поставщиков',
      description: 'Все поставщики проходят строгую модерацию для обеспечения качества.',
      icon: <FaCheckCircle className="text-green-500 text-4xl mb-4" />,
    },
    {
      title: 'Удобный интерфейс',
      description: 'Простой и интуитивно понятный интерфейс для легкости использования.',
      icon: <FaRocket className="text-purple-500 text-4xl mb-4" />,
    },
  ];

  return (
    <section className="py-16 px-5 bg-base-300">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12 ">Преимущества нашего портала</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-lg transform hover:-translate-y-2 transition duration-300 ${
                index % 2 === 0 ? 'bg-base-200' : 'bg-base-200'
              }`}
            >
              <div className="flex flex-col items-center">
                {feature.icon}
                <h3 className="font-semibold text-2xl mb-2 ">{feature.title}</h3>
                <p className="">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
