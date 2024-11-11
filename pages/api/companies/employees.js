// pages/api/companies/employees.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { companyId } = req.query;

  // Получаем тело запроса для POST
  const { userId, role } = req.body;

  if (req.method === 'GET') {
    // Проверка на валидность companyId
    if (!companyId || isNaN(companyId)) {
      return res.status(400).json({ error: 'Invalid companyId parameter' });
    }

    try {
      // Получаем компанию с таким companyId и список сотрудников
      const company = await prisma.company.findUnique({
        where: {
          id: parseInt(companyId),
        },
        include: {
          employees: true, // Включаем сотрудников
        },
      });

      // Проверка, существует ли компания
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      // Возвращаем сотрудников компании
      res.status(200).json(company.employees);
    } catch (error) {
      console.error('Ошибка при получении сотрудников:', error);
      res.status(500).json({ error: 'Ошибка при получении сотрудников' });
    }
  } else if (req.method === 'POST') {
    // Проверка на валидность входных данных
    if (!companyId || isNaN(companyId) || !userId || !role) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    try {
      // Проверяем, существует ли компания
      const company = await prisma.company.findUnique({
        where: {
          id: parseInt(companyId),
        },
      });

      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      // Проверяем, существует ли пользователь
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(userId),
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Добавляем пользователя в список сотрудников
      const employee = await prisma.companyEmployee.create({
        data: {
          userId: parseInt(userId),
          companyId: parseInt(companyId),
          role: role, // Роль пользователя в компании
        },
      });

      // Отправляем успешный ответ с добавленным сотрудником
      res.status(201).json(employee);
    } catch (error) {
      console.error('Ошибка при добавлении сотрудника:', error);
      res.status(500).json({ error: 'Ошибка при добавлении сотрудника' });
    }
  } else {
    res.status(405).json({ error: 'Метод не разрешен' });
  }
}
