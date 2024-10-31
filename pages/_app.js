// pages/_app.js
import '../styles/globals.css'; // Импортируйте стили

function MyApp({ Component, pageProps }) {
  return <Component  {...pageProps} data-theme="light" />;
}

export default MyApp;
