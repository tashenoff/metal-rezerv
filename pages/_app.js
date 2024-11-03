// pages/_app.js
import '../styles/globals.css'; // Импортируйте стили
import { Provider } from 'react-redux';
import store from '../store/store';
import { AuthProvider } from '../contexts/AuthContext';
function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} data-theme="light" />
      </AuthProvider>
    </Provider>
  );
}

export default MyApp;
