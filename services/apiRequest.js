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
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json(); // Получаем сообщение об ошибке из ответа
            throw new Error(errorData.message || `Ошибка запроса: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Ошибка: ${error.message}`);
    }
};
