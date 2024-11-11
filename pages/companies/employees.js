// pages/api/companies/employees.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { companyId } = req.query;

  if (req.method === 'POST') {
    const { userId, role } = req.body;

    // Проверка наличия всех данных
    if (!userId || !role) {
      return res.status(400).json({ error: 'Не все обязательные поля были заполнены.' });
    }

    try {
      // Находим компанию по companyId
      const company = await prisma.company.findUnique({
        where: {
          id: parseInt(companyId),
        },
      });

      if (!company) {
        return res.status(404).json({ error: 'Компания не найдена.' });
      }

      // Проверяем, существует ли пользователь
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(userId),
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден.' });
      }

      // Добавляем сотрудника в компанию
      await prisma.companyEmployee.create({
        data: {
          userId: parseInt(userId),
          companyId: parseInt(companyId),
          role: role,
        },
      });

      res.status(200).json({ message: 'Пользователь успешно приглашен в компанию.' });
    } catch (error) {
      console.error('Ошибка при приглашении сотрудника:', error);
      res.status(500).json({ error: 'Произошла ошибка при добавлении сотрудника.' });
    }
  } else {
    res.status(405).json({ error: 'Метод не разрешен' });
  }
}
