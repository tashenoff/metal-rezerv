import jwt from 'jsonwebtoken';
import prisma from '../../../prisma/client';

const JWT_SECRET = 'your_jwt_secret'; // Используйте то же значение, что и в auth.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Получаем токен из заголовков
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }

  try {
    // Декодируем токен без проверки срока действия
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Недействительный токен' });
    }

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    // Генерируем новый токен
    const newToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token: newToken,
      role: user.role
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ error: 'Ошибка при обновлении токена' });
  }
}