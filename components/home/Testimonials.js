// components/home/Testimonials.js
import React from 'react';

const Testimonials = () => {
  const testimonialsList = [
    { name: 'Иван', text: 'Отличный сервис! Быстро нашел нужного поставщика.' },
    { name: 'Анна', text: 'Все прошло гладко, очень доволен работой.' },
    { name: 'Олег', text: 'Качество предложений на высшем уровне!' },
  ];

  return (
    <section className="py-16 px-5 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Отзывы клиентов</h2>
        <div className="flex flex-col md:flex-row justify-around gap-8">
          {testimonialsList.map((testimonial, index) => (
            <div key={index} className="flex-1 bg-white p-6 rounded-lg shadow-md">
              <p className="italic mb-2">"{testimonial.text}"</p>
              <p className="font-semibold">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
