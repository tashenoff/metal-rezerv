import '../styles/globals.css'; // Импортируйте стили
import { Provider } from 'react-redux';
import store from '../store/store';
import { AuthProvider } from '../contexts/AuthContext';
import '../utils/i18n'; // Инициализация i18next
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import { useEffect, useState } from 'react'; // Добавлены хуки

// Компонент для отображения уведомления об отсутствии интернета
const OfflineNotification = () => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#ff4444',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}
    >
      Интернет соединение отсутствует
    </div>
  );
};

function MyApp({ Component, pageProps }) {
  const [isOnline, setIsOnline] = useState(true); // Состояние сети

  // Эффект для отслеживания состояния сети
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Устанавливаем обработчики событий
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Проверяем состояние сети при загрузке
    setIsOnline(navigator.onLine);

    // Обработка сообщений от Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NETWORK_OFFLINE') {
          setIsOnline(false); // Устанавливаем состояние "оффлайн"
        }
      });
    }

    // Очистка обработчиков при размонтировании
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <Provider store={store}>
        <AuthProvider>
          <Component {...pageProps} data-theme="light" />
          {/* Отображаем уведомление, если интернета нет */}
          {!isOnline && <OfflineNotification />}
        </AuthProvider>
      </Provider>
    </>
  );
}

export default appWithTranslation(MyApp);