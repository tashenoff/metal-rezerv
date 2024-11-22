// services/api.js
export const apiRequest = async (method, url, body = null) => {
    const headers = {
      'Content-Type': 'application/json',
      // можно добавить другие заголовки, например, для авторизации
    };
  
    const options = {
      method,
      headers,
    };
  
    if (body) {
      options.body = JSON.stringify(body);
    }
  
    const response = await fetch(url, options);
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка при выполнении запроса');
    }
  
    return data;
  };
  
  // Пример запроса для получения истории баланса
  export const getBalanceHistory = (companyId) => {
    if (!companyId) {
      throw new Error('Компания не указана');
    }
    return apiRequest('GET', `/api/companies/${companyId}/balance-history`);
  };
  