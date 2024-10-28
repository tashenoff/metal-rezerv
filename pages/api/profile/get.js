// pages/api/profile/get.js
import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret'; // Замените на безопасный секретный ключ

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  const token = req.headers.authorization?.split(' ')[1]; // Получаем токен из заголовков

  if (!token) {
    return res.status(401).json({ message: 'Необходима аутентификация' });
  }

  try {
    const decoded = verify(token, JWT_SECRET);
    const userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        phoneNumber: true,
        city: true,
        country: true,
        companyName: true,
        companyBIN: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
}
