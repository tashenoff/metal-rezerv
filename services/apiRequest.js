// services/apiRequest.js - Универсальный обработчик API-запросов

/**
 * Функция для обновления JWT токена
 * @returns {Promise<Object>} Результат обновления токена
 */
export const refreshToken = async () => {
  try {
    const oldToken = localStorage.getItem('token');
    if (!oldToken) {
      return { success: false };
    }

    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${oldToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      return { success: true, token: data.token };
    }

    return { success: false };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return { success: false };
  }
};

/**
 * Выполняет запрос к API с автоматической обработкой авторизации и ошибок
 * @param {string} method - HTTP метод (GET, POST, PUT, DELETE и т.д.)
 * @param {string} url - URL эндпоинта API
 * @param {Object} body - Данные для отправки (для POST, PUT и т.д.)
 * @returns {Promise<Object>} - Ответ от API
 */
export const apiRequest = async (method, url, body = null) => {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage

    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`; // Добавляем токен в заголовки
    } else {
        console.warn('Токен авторизации отсутствует'); // Логируем предупреждение, если токена нет
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        let response = await fetch(url, config);

        // Если ответ 401 (Unauthorized), это может быть из-за истекшего токена
        if (response.status === 401 && token) {
            // Пытаемся обновить токен
            const refreshResult = await refreshToken();
            
            // Если токен успешно обновлен, повторяем запрос
            if (refreshResult.success) {
                // Обновляем токен в заголовках
                headers['Authorization'] = `Bearer ${refreshResult.token}`;
                
                // Повторяем запрос с новым токеном
                response = await fetch(url, {
                    method,
                    headers,
                    ...(body ? { body: JSON.stringify(body) } : {})
                });
            }
        }

        if (!response.ok) {
            const errorData = await response.json(); // Получаем сообщение об ошибке из ответа
            throw new Error(errorData.message || errorData.error || `Ошибка запроса: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error in apiRequest (${method} ${url}):`, error);
        throw new Error(`Ошибка: ${error.message}`);
    }
};