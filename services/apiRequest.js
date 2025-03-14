// services/apiRequest.js - Универсальный обработчик API-запросов с NextAuth

import { getSession } from 'next-auth/react';

/**
 * Получает токен авторизации из NextAuth сессии
 * @returns {Promise<string|null>} Токен авторизации или null
 */
export const getAuthToken = async () => {
  const session = await getSession();
  return session?.legacyToken || null;
};

/**
 * Выполняет запрос к API с авторизацией через NextAuth
 * @param {string} method - HTTP метод (GET, POST, PUT, DELETE и т.д.)
 * @param {string} url - URL эндпоинта API
 * @param {Object} body - Данные для отправки (для POST, PUT и т.д.)
 * @returns {Promise<Object>} - Ответ от API
 */
export const apiRequest = async (method, url, body = null) => {
  // Получаем токен из NextAuth сессии
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('Токен авторизации отсутствует в NextAuth сессии');
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
      let errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Если не удалось распарсить JSON, оставляем стандартное сообщение
      }
      
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error in apiRequest (${method} ${url}):`, error);
    throw new Error(error.message || 'Произошла ошибка при выполнении запроса');
  }
};