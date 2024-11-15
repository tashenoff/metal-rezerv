// components/home/HeroSection.js
import React from 'react';
import heroImage from './images/home.jpg'; // Импортируем изображение

const HeroSection = () => {
    return (
        <>
            <section className="bg-primary text-white relative flex items-center justify-center w-full h-[400px]">
                <div className="w-ful">
                    <div className="container mx-auto text-center">
                        <h1 className="text-4xl font-bold mb-4">
                            Портал B2B для эффективных закупок
                        </h1>
                        <p className="text-lg mb-6">
                            Публикуйте заявки, получайте отклики от проверенных поставщиков, выбирайте лучших.
                        </p>
                    </div>
                </div>
            </section>

            <div className='relative  left-0 w-full flex items-center h-[400px] justify-center '>
                <div className='left-0 z-50 -top-5 relative bg-green-500 h-[500px] w-1/2 mx-20 '>
                    <div className='rounded-lg'>
                        <video
                            className='w-full h-full object-cover '
                            src="https://st.timeweb.com/cloud-static/main_1x_high_b.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>

                </div>
            </div>
        </>
    );
};

export default HeroSection;
