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
      const decoded = jwt.verify(token, 'your_jwt_secret'); // Замените на свой секретный ключ
      const userId = decoded.id;

      // Получаем текущего пользователя с привязкой к компании
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          company: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      if (!user.company) {
        return res.status(403).json({ message: 'Пользователь не связан с компанией' });
      }

      // Проверяем, что пользователь администратор компании
      const isAdmin = user.company.ownerId === userId;

      if (!isAdmin) {
        return res
          .status(403)
          .json({ message: 'Нет прав доступа для просмотра данных сотрудников' });
      }

      // Находим данные сотрудника
      const companyEmployee = await prisma.companyEmployee.findFirst({
        where: {
          userId: parseInt(id), // ID сотрудника
          companyId: user.company.id, // ID компании
        },
        include: {
          user: true, // Включаем данные пользователя
          roleDetails: true, // Включаем роль (EmployeeRole)
        },
      });

      if (!companyEmployee) {
        return res.status(404).json({ message: 'Сотрудник не найден в компании' });
      }

      // Возвращаем данные сотрудника
      return res.status(200).json({
        employee: {
          name: companyEmployee.user.name,
          email: companyEmployee.user.email,
          role: companyEmployee.roleDetails.name, // Имя роли
          joinedAt: companyEmployee.joinedAt,
        },
      });
    } catch (error) {
      console.error('Ошибка при обработке запроса:', error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Метод ${req.method} не разрешён`);
  }
}
