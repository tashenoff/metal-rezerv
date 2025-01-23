import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import TetrisGame from '../components/TetrisGame';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function Login() {
  const { t, i18n } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hCaptchaToken, setHCaptchaToken] = useState(null); // Состояние для токена hCaptcha
  const [failedAttempts, setFailedAttempts] = useState(0); // Счетчик неудачных попыток
  const [showCaptcha, setShowCaptcha] = useState(false); // Показывать ли капчу
  const router = useRouter();

  // При загрузке страницы проверяем localStorage на наличие неудачных попыток
  useEffect(() => {
    const attempts = localStorage.getItem('failedAttempts');
    if (attempts) {
      setFailedAttempts(Number(attempts));
      if (Number(attempts) >= 2) {
        setShowCaptcha(true);
      }
    }
  }, []);

  const changeLanguage = (lng) => {
    router.push(router.pathname, router.asPath, { locale: lng });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Если капча не показана, но есть неудачные попытки, показываем капчу
    if (!showCaptcha && failedAttempts >= 2) {
      setShowCaptcha(true);
      setIsLoading(false);
      return;
    }

    // Если капча показана, но токен не заполнен
    if (showCaptcha && !hCaptchaToken) {
      alert('Please complete the hCaptcha challenge');
      setIsLoading(false);
      return;
    }

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, hCaptchaToken }),
    });

    if (res.ok) {
      const { token, role } = await res.json();
      localStorage.setItem('token', token);
      localStorage.removeItem('failedAttempts'); // Сбрасываем счетчик неудачных попыток
      setFailedAttempts(0); // Сбрасываем счетчик
      setShowCaptcha(false); // Скрываем капчу
      if (role === 'RESPONDER') router.push('/activity');
      else router.push('/listings');
    } else {
      const { message } = await res.json();
      alert(message);
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem('failedAttempts', newAttempts); // Сохраняем счетчик в localStorage
      if (newAttempts >= 2) {
        setShowCaptcha(true); // Показываем капчу после 2 неудачных попыток
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="h-screen grid bg-white grid-cols-1 md:grid-cols-2">
      {/* Левая колонка (тетрис) */}
      <div className="hidden md:flex items-center justify-center bg-gray-900">
        <TetrisGame />
      </div>

      {/* Правая колонка (форма) */}
      <div className="flex flex-col items-center justify-center p-6">
        <motion.div
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
                <motion.div
                  initial={{ scale: 1, color: '#6B7280' }}
                  animate={{
                    scale: emailFocus ? 1.2 : 1,
                    color: emailFocus ? '#4CAF50' : '#6B7280',
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
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  className="grow input w-full bg-white"
                />
              </label>
            </div>
            <div className="mb-6">
              <label className="input input-bordered flex items-center gap-2">
                <motion.div
                  initial={{ scale: 1, color: '#6B7280' }}
                  animate={{
                    scale: passwordFocus ? 1.2 : 1,
                    color: passwordFocus ? '#4CAF50' : '#6B7280',
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
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
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
                  className="select select-bordered w-full pl-8"
                >
                  <option value="ru">
                    {t('login.language_ru')}
                  </option>
                  <option value="en">{t('login.language_en')}</option>
                </select>
              </label>
            </div>

            {/* Показываем капчу только после 2 неудачных попыток */}
            {showCaptcha && (
              <div className="mb-4">
                <HCaptcha
                  sitekey="b4c2e1be-c808-41e0-8fac-e2a4654cc068" // Замените на ваш Site Key
                  onVerify={(token) => setHCaptchaToken(token)} // Сохраняем токен
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="loading loading-bars loading-lg"></span>
              ) : (
                t('login.login_button')
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}