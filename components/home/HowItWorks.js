// components/home/HowItWorks.js
import React from 'react';
import { FaClipboardCheck, FaComment, FaUserCheck } from 'react-icons/fa';

const HowItWorks = () => {
  return (
    <section className="py-16 px-5 bg-base-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Как это работает</h2>
        <div className="flex flex-col md:flex-row md:justify-around gap-8">
          <div className="flex items-start p-6 bg-base-200 rounded-lg shadow-md w-full md:w-1/3">
            <div className="mr-4 text-blue-600">
              <FaClipboardCheck size={40} />
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-2">Публикация заявки</h3>
              <p>Клиенты размещают заявку на портале, описывая свои требования.</p>
            </div>
          </div>
          <div className="flex items-start p-6 bg-base-200 rounded-lg shadow-md w-full md:w-1/3">
            <div className="mr-4 text-green-600">
              <FaComment size={40} />
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-2">Получение откликов</h3>
              <p>Проверенные поставщики оставляют свои отклики, предлагая услуги.</p>
            </div>
          </div>
          <div className="flex items-start p-6 bg-base-200 rounded-lg shadow-md w-full md:w-1/3">
            <div className="mr-4 text-orange-600">
              <FaUserCheck size={40} />
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-2">Выбор поставщиков</h3>
              <p>Клиент выбирает поставщиков, которым будут доступны его контакты.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
