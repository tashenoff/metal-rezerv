import { useState } from 'react'; // Импортируем useState для управления состоянием
import { useRouter } from 'next/router'; // Импортируем useRouter для навигации

export default function Login() {
  const [email, setEmail] = useState(''); // Состояние для хранения email
  const [password, setPassword] = useState(''); // Состояние для хранения пароля
  const router = useRouter(); // Хук для навигации

  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    const res = await fetch('/api/auth', {
      method: 'POST', // Используем метод POST для аутентификации
      headers: {
        'Content-Type': 'application/json', // Указываем заголовок для JSON
      },
      body: JSON.stringify({ email, password }), // Отправляем email и пароль в теле запроса
    });

    if (res.ok) { // Если ответ успешный
      const { token, role } = await res.json(); // Извлекаем токен и роль из ответа
      localStorage.setItem('token', token); // Сохраняем токен в localStorage

      // Перенаправляем пользователя на нужную страницу в зависимости от роли
      if (role === 'RESPONDER') {
        router.push('/activity'); // Если роль - RESPONDER, перенаправляем на страницу активности
      } else {
        router.push('/listings'); // В противном случае перенаправляем на страницу объявлений
      }
    } else {
      const { message } = await res.json(); // Извлекаем сообщение об ошибке
      alert(message); // Показываем сообщение об ошибке
    }
  };

  return (
    <div data-theme="nord" className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Авторизация</h1>
        <form onSubmit={handleSubmit}> {/* Обработчик отправки формы */}
          <div className="mb-4">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                  d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path
                  d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="email" // Поле для ввода email
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Обновляем состояние при вводе
                required
                className="grow input w-full"
              />
            </label>
          </div>
          <div className="mb-6">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd" />
              </svg>
              <input
                type="password" // Поле для ввода пароля
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Обновляем состояние при вводе
                required
                className="grow input w-full"
              />
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-full"> {/* Кнопка для отправки формы */}
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
