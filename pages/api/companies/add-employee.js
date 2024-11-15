// pages/api/companies/add-employee.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, companyId, role } = req.body;

    console.log('Received data:', { userId, companyId, role });

    if (!userId || !companyId || !role) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    try {
      const userIdInt = parseInt(userId, 10);
      const companyIdInt = parseInt(companyId, 10);

      if (isNaN(userIdInt) || isNaN(companyIdInt)) {
        return res.status(400).json({ error: 'Неверный формат userId или companyId' });
      }

      console.log('Parsed values:', { userIdInt, companyIdInt });

      const user = await prisma.user.findUnique({ where: { id: userIdInt } });
      const company = await prisma.company.findUnique({ where: { id: companyIdInt } });

      if (!user || !company) {
        return res.status(404).json({ error: 'Пользователь или компания не найдены' });
      }

      // Проверка, состоит ли пользователь уже в какой-либо компании
      if (user.companyId) {
        return res.status(400).json({ error: 'Этот пользователь уже привязан к другой компании' });
      }

      // Проверяем, состоит ли уже этот пользователь в данной компании
      const existingEmployee = await prisma.companyEmployee.findFirst({
        where: {
          userId: userIdInt,
          companyId: companyIdInt,
        },
      });

      if (existingEmployee) {
        return res.status(409).json({ error: 'Этот пользователь уже является сотрудником компании' });
      }

      // Создаем сотрудника в компании
      const companyEmployee = await prisma.companyEmployee.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: role,
          joinedAt: new Date(),
        },
      });

      // Обновляем companyId для пользователя
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { companyId: company.id },
      });

      console.log('Created companyEmployee:', companyEmployee);
      console.log('Updated user with companyId:', updatedUser);

      return res.status(200).json({ message: 'Сотрудник успешно добавлен', companyEmployee });
    } catch (error) {
      console.error('Ошибка на сервере:', error);
      return res.status(500).json({ error: 'Ошибка при добавлении сотрудника', details: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }
}
