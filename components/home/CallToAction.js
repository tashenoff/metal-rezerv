// components/home/CallToAction.js
import React from 'react';
import heroImage from './images/call.jpg'; // Импортируем изображение
const CallToAction = () => {
  return (
    <section
            className="hero text-white  h-[300px]"
            style={{
                backgroundImage: `url(${heroImage.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >

            
<div className="hero-overlay bg-black bg-opacity-60"></div>
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
        <p className="text-lg mb-6">Присоединяйтесь к нашему порталу и получите доступ к лучшим поставщикам!</p>
        <button className="bg-white text-blue-500 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-gray-100">
          Зарегистрироваться
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
