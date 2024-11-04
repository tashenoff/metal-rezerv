/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      container: {
        center: true, // Центрировать контейнер
        padding: {
          DEFAULT: '1rem', // По умолчанию отступ
          sm: '2rem', // Отступ для малых экранов
          md: '3rem', // Отступ для средних экранов
          lg: '4rem', // Отступ для больших экранов
          xl: '5rem', // Отступ для очень больших экранов
        },
        screens: {
          sm: '640px', // Малый экран
          md: '768px', // Средний экран
          lg: '1024px', // Большой экран
          xl: '1280px', // Очень большой экран
          '2xl': '1536px', // Экстремально большой экран
        },
      },
    },
    daisyui: {
      themes: [
        {
          light: {
            "primary": "#a991f7",
          }
        }
      ]

    },
    darkMode: false, // Отключение dark mode
  },
  plugins: [
    require('daisyui'),
  ],
};
