/**
 * Маршрут обновления токена
 * 
 * Устаревший маршрут обновления токена, который больше не используется.
 * NextAuth автоматически обрабатывает обновление токенов.
 */

export default async function handler(req, res) {
  // Возвращаем сообщение о том, что этот маршрут больше не используется
  res.status(410).json({ 
    message: 'This endpoint is deprecated. Authorization is handled by NextAuth.', 
    code: 'TOKEN_REFRESH_DEPRECATED' 
  });
}