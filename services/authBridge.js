/**
 * Модуль для плавного перехода между старой JWT-авторизацией и NextAuth
 * Позволяет постепенно перенести код на NextAuth без поломок
 */

import { getSession } from "next-auth/react";
import jwt from "jsonwebtoken";

/**
 * Получает токен авторизации в зависимости от используемой системы
 * @param {Object} req - HTTP запрос
 * @returns {string|null} JWT токен или null
 */
export const getAuthToken = async (req) => {
  // Проверяем, включен ли NextAuth
  const nextAuthEnabled = process.env.NEXT_PUBLIC_NEXTAUTH_ENABLED === 'true';
  
  if (nextAuthEnabled) {
    // Используем NextAuth
    const session = await getSession({ req });
    return session?.legacyToken || null;
  } else {
    // Используем стандартную JWT авторизацию
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
};

/**
 * Проверяет и декодирует токен авторизации
 * @param {string} token - JWT токен
 * @returns {Object|null} Декодированные данные или null
 */
export const verifyToken = (token) => {
  if (!token) return null;
  
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

/**
 * Middleware для проверки авторизации в API
 * @param {Function} handler - Обработчик API
 * @returns {Function} Middleware функция
 */
export const withAuth = (handler) => async (req, res) => {
  const token = await getAuthToken(req);
  
  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Недействительный токен авторизации' });
  }
  
  // Добавляем пользователя в объект запроса
  req.user = decoded;
  
  // Вызываем исходный обработчик
  return handler(req, res);
};

/**
 * Middleware для проверки определенной роли
 * @param {Function} handler - Обработчик API
 * @param {Array<string>} allowedRoles - Массив разрешенных ролей
 * @returns {Function} Middleware функция
 */
export const withRole = (handler, allowedRoles) => {
  const authMiddleware = withAuth(async (req, res) => {
    const { role } = req.user;
    
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'Недостаточно прав для выполнения операции' });
    }
    
    return handler(req, res);
  });
  
  return authMiddleware;
};