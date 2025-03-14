/**
 * Маршрут авторизации
 * 
 * Устаревший маршрут авторизации, который больше не используется.
 * Все запросы перенаправляются на NextAuth.
 */

export default async function handler(req, res) {
  // Перенаправляем на NextAuth
  res.status(307).redirect('/api/auth/signin');
}