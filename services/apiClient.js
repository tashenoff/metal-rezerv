/**
 * Высокоуровневый API-клиент для работы с защищенными API-маршрутами
 * Поддерживает как NextAuth, так и стандартную JWT-авторизацию
 */

import { getSession } from 'next-auth/react';

/**
 * Проверка, включен ли режим NextAuth
 * @returns {boolean}
 */
const isNextAuthEnabled = () => {
  return process.env.NEXT_PUBLIC_NEXTAUTH_ENABLED === 'true';
};

/**
 * Проверка, включен ли режим использования только NextAuth
 * @returns {boolean}
 */
const isNextAuthOnly = () => {
  return process.env.NEXT_PUBLIC_NEXTAUTH_ONLY === 'true';
};

/**
 * Получение токена авторизации
 * @returns {Promise<string|null>} Токен авторизации или null
 */
export const getAuthToken = async () => {
  // Проверяем режим авторизации
  const useNextAuth = isNextAuthEnabled();
  const onlyNextAuth = isNextAuthOnly();
  
  if (useNextAuth || onlyNextAuth) {
    // Используем NextAuth
    const session = await getSession();
    if (session?.legacyToken) {
      return session.legacyToken;
    }
  }
  
  // Если не только NextAuth, проверяем localStorage
  if (!onlyNextAuth) {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
  }
  
  return null;
};

/**
 * Выполнение защищенного API-запроса
 * @param {string} url URL запроса
 * @param {Object} options Опции запроса (метод, тело и т.д.)
 * @returns {Promise<Response>} Ответ API
 */
export const fetchWithAuth = async (url, options = {}) => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Требуется авторизация для выполнения запроса');
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': options.headers?.['Content-Type'] || 'application/json',
  };
  
  return fetch(url, {
    ...options,
    headers,
  });
};

/**
 * GET-запрос с авторизацией
 * @param {string} url URL запроса
 * @param {Object} options Дополнительные опции запроса
 * @returns {Promise<any>} Данные ответа в формате JSON
 */
export const get = async (url, options = {}) => {
  const response = await fetchWithAuth(url, {
    ...options,
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * POST-запрос с авторизацией
 * @param {string} url URL запроса
 * @param {Object} data Данные для отправки
 * @param {Object} options Дополнительные опции запроса
 * @returns {Promise<any>} Данные ответа в формате JSON
 */
export const post = async (url, data, options = {}) => {
  const response = await fetchWithAuth(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * PUT-запрос с авторизацией
 * @param {string} url URL запроса
 * @param {Object} data Данные для отправки
 * @param {Object} options Дополнительные опции запроса
 * @returns {Promise<any>} Данные ответа в формате JSON
 */
export const put = async (url, data, options = {}) => {
  const response = await fetchWithAuth(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * DELETE-запрос с авторизацией
 * @param {string} url URL запроса
 * @param {Object} options Дополнительные опции запроса
 * @returns {Promise<any>} Данные ответа в формате JSON
 */
export const del = async (url, options = {}) => {
  const response = await fetchWithAuth(url, {
    ...options,
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};