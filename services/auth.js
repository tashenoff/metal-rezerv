/**
 * Сервис для работы с авторизацией через NextAuth
 */

import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

/**
 * Проверка авторизации на сервере с помощью NextAuth
 * @param {Object} req - HTTP запрос
 * @param {Object} res - HTTP ответ
 * @returns {Promise<Object|null>} Данные пользователя или null
 */
export const checkServerAuth = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user) {
    return null;
  }
  
  return {
    id: session.user.id,
    email: session.user.email, 
    role: session.user.role,
    companyId: session.user.companyId
  };
};

/**
 * Middleware для защиты API-маршрутов
 * @param {Function} handler - Обработчик API
 * @returns {Function} Middleware
 */
export const withAuth = (handler) => {
  return async (req, res) => {
    // Проверяем авторизацию
    const user = await checkServerAuth(req, res);
    
    if (!user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    // Добавляем пользователя в запрос
    req.user = user;
    
    // Вызываем исходный обработчик
    return handler(req, res);
  };
};

/**
 * Middleware для проверки ролей пользователя
 * @param {Function} handler - Обработчик API
 * @param {Array<string>} allowedRoles - Разрешенные роли
 * @returns {Function} Middleware
 */
export const withRoles = (handler, allowedRoles) => {
  return withAuth(async (req, res) => {
    const { role } = req.user;
    
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Недостаточно прав для выполнения операции' });
    }
    
    // Вызываем исходный обработчик
    return handler(req, res);
  });
};