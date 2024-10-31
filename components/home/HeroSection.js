// components/home/HeroSection.js
import React from 'react';
import heroImage from './images/home.jpg'; // Импортируем изображение

const HeroSection = () => {
    return (
        <section
            className="hero text-white  h-[600px]"
            style={{
                backgroundImage: `url(${heroImage.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'unset',
            }}
        >
              <div className="hero-overlay bg-primary bg-opacity-60"></div>

            <div className="hero-content text-center">
                <div className="container mx-auto text-center">

                    <h1 className="text-4xl font-bold mb-4">
                        Портал B2B для эффективных закупок
                    </h1>
                    <p className="text-lg mb-6">
                        Публикуйте заявки, получайте отклики от проверенных поставщиков, выбирайте лучших.
                    </p>
                    <button className="btn btn-accent">
                        Создать заявку
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
