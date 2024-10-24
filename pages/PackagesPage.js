import React from 'react';
import Layout from '../components/Layout';

const PackagesPage = () => {
  const packages = [
    {
      title: 'Стартовый пакет',
      price: '500 баллов',
      gift: '20 откликов в подарок',
      duration: 'Бессрочно',
      support: 'Приоритетная поддержка',
      buttonText: 'Купить за 100₸',
      gradient: 'from-green-400 to-green-600', // Градиент для стартового пакета
    },
    {
      title: 'Стандартный пакет',
      price: '1500 баллов',
      gift: '60 откликов в подарок',
      duration: 'Бессрочно',
      support: 'Приоритетная поддержка',
      buttonText: 'Купить за 250₸',
      gradient: 'from-blue-400 to-blue-600', // Градиент для стандартного пакета
    },
    {
      title: 'Премиум пакет',
      price: '3000 баллов',
      gift: '60 откликов в подарок',
      duration: 'Бессрочно',
      support: 'Приоритетная поддержка',
      buttonText: 'Купить за 500₸',
      gradient: 'from-purple-400 to-purple-600', // Градиент для премиум пакета
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-10">Выберите свой пакет баллов</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative card w-full shadow-xl text-white bg-gradient-to-b ${pkg.gradient} rounded-lg`}
            >
              {/* Бейдж с откликами в подарок */}
              <div className="absolute top-0 right-0 bg-yellow-400 text-black text-sm font-bold py-1 px-3 rounded-bl-lg">
                {pkg.gift}
              </div>
              <div className="card-body bg-opacity-70 rounded-lg p-6">
                <h2 className="card-title text-2xl">{pkg.title}</h2>
                {/* Оформляем цену в стиле Daisy */}
                <p className="text-4xl font-extrabold mt-4 mb-2">{pkg.price}</p>
                <p className="text-sm mb-1">{pkg.duration}</p>
                <p className="text-sm mb-4">{pkg.support}</p>

                <div className="card-actions justify-end">
                  {/* Яркая белая кнопка с границей */}
                  <button className="btn btn-outline btn-white font-bold py-2 px-4 rounded-full text-gray-800 bg-white hover:bg-gray-100 border-2 border-gray-800 shadow-lg transform hover:scale-105 transition-transform hover:text-gray-800">
                    {pkg.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PackagesPage;
