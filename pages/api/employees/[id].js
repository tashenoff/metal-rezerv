// pages/api/employees/[id].js
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: 'Требуется аутентификация' });
    }

    try {
      // Извлекаем токен из заголовка
      const token = authorization.split(' ')[1];

      // Декодируем токен
      const decoded = jwt.verify(token, 'your_jwt_secret');  // Замените на свой секретный ключ
      const userId = decoded.id;

      // Получаем информацию о пользователе
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { company: true },
      });

      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      // Проверяем, связан ли пользователь с компанией
      if (!user.company) {
        return res.status(403).json({ message: 'Пользователь не связан с компанией' });
      }

      // Получаем информацию о сотруднике и его роли в компании
      const companyEmployee = await prisma.companyEmployee.findFirst({
        where: {
          AND: [
            { userId: parseInt(id) }, // ID сотрудника
            { companyId: user.companyId }, // ID компании
          ],
        },
        include: {
          user: true, // Включаем информацию о пользователе (сотруднике)
          company: true, // Включаем информацию о компании
        },
      });

      if (!companyEmployee) {
        return res.status(404).json({ message: 'Сотрудник не найден в этой компании' });
      }

      // Проверяем, является ли пользователь администратором своей компании
      const isAdmin = userId === user.company.ownerId || companyEmployee.role === 'Администратор';

      if (!isAdmin) {
        return res.status(403).json({ message: 'Нет доступа к данным сотрудников компании' });
      }

      // Если сотрудник существует и у пользователя есть права администратора, возвращаем его данные
      return res.status(200).json({
        employee: {
          name: companyEmployee.user.name,
          email: companyEmployee.user.email,
          role: companyEmployee.role,
          joinedAt: companyEmployee.joinedAt,
        },
      });
    } catch (error) {
      console.error('Ошибка при проверке токена:', error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Метод ${req.method} не разрешён`);
  }
}
