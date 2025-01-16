import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion'; // Импортируем framer-motion
import { EnvelopeIcon, LockClosedIcon, GlobeAltIcon } from '@heroicons/react/24/solid'; // Импортируем иконки

export default function Login() {
  const { t, i18n } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const router = useRouter();

  const changeLanguage = (lng) => {
    router.push(router.pathname, router.asPath, { locale: lng });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const { token, role } = await res.json();
      localStorage.setItem('token', token);
      if (role === 'RESPONDER') router.push('/activity');
      else router.push('/listings');
    } else {
      const { message } = await res.json();
      alert(message);
    }
  };

  return (
    <div className="h-screen grid bg-white grid-cols-1 md:grid-cols-2">
      {/* Левая колонка (картинка) */}
      <div
        className="hidden md:block bg-cover bg-center"
        style={{ backgroundImage: 'url(https://cdn.pixabay.com/photo/2015/05/31/13/45/working-791849_1280.jpg)' }}
      ></div>

      {/* Правая колонка (форма) */}
      <div className="flex flex-col items-center justify-center p-6">
        <motion.div
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm"
          initial={{ opacity: 0, y: 50 }} // Начальная позиция
          animate={{ opacity: 1, y: 0 }} // Конечная позиция
          transition={{ duration: 0.5 }} // Время анимации
        >
          <div className='flex items-center'>
            <h1 className="text-[42px] text-primary font-bold">INEED</h1>
            <sup className='text-[18px]'>®</sup>
          </div>
          <h1 className="text-1xl font-semibold uppercase text-gray-700 mb-6">
            new b2b experience
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="input input-bordered flex items-center gap-2">
                {/* Анимация иконки с изменением цвета */}
                <motion.div
                  initial={{ scale: 1, color: '#6B7280' }} // Начальный цвет и размер
                  animate={{
                    scale: emailFocus ? 1.2 : 1,
                    color: emailFocus ? '#4CAF50' : '#6B7280', // Зеленый цвет при фокусе
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <EnvelopeIcon className="h-5 w-5" />
                </motion.div>
                <input
                  type="email"
                  placeholder={t('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  onFocus={() => setEmailFocus(true)} // Фокус на поле
                  onBlur={() => setEmailFocus(false)}  // Потеря фокуса
                  className="grow input w-full bg-white"
                />
              </label>
            </div>
            <div className="mb-6">
              <label className="input input-bordered flex items-center gap-2">
                {/* Анимация иконки с изменением цвета */}
                <motion.div
                  initial={{ scale: 1, color: '#6B7280' }} // Начальный цвет и размер
                  animate={{
                    scale: passwordFocus ? 1.2 : 1,
                    color: passwordFocus ? '#4CAF50' : '#6B7280', // Зеленый цвет при фокусе
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <LockClosedIcon className="h-5 w-5" />
                </motion.div>
                <input
                  type="password"
                  placeholder={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  onFocus={() => setPasswordFocus(true)} // Фокус на поле
                  onBlur={() => setPasswordFocus(false)}  // Потеря фокуса
                  className="grow input w-full"
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">{t('login.language_label')}</label>

              <label className="input input-bordered flex items-center gap-2 w-full">
                <GlobeAltIcon className="h-5 w-5 text-gray-500" />
                <select
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="select select-bordered w-full pl-8" // Отступ для иконки
                >
                  <option value="ru">
                    {t('login.language_ru')}
                  </option>
                  <option value="en">{t('login.language_en')}</option>
                </select>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              {t('login.login_button')}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

// Добавляем функцию для получения переводов на сервере
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
