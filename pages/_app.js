// pages/_app.js
import '../styles/globals.css'; // Импортируйте стили
import { Provider } from 'react-redux';
import store from '../store/store';
import { AuthProvider } from '../contexts/AuthContext';
import '../utils/i18n'; // Инициализация i18next
import { appWithTranslation } from 'next-i18next';
function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} data-theme="light" />
      </AuthProvider>
    </Provider>
  );
}

export default appWithTranslation(MyApp);

