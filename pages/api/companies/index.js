// pages/api/companies.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, binOrIin, region, contacts, director, ownerId } = req.body;

    if (!name || !binOrIin || !region || !director || !ownerId) {
      return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
    }

    try {
      // Проверка, существует ли уже компания с таким же BIN/IIN или названием
      const existingCompany = await prisma.company.findFirst({
        where: {
          OR: [
            { name },
            { binOrIin }
          ],
        },
      });

      if (existingCompany) {
        return res.status(409).json({ error: 'Компания с таким названием или BIN/IIN уже существует' });
      }

      // Создание новой компании
      const newCompany = await prisma.company.create({
        data: {
          name,
          binOrIin,
          region,
          contacts,
          director,
          ownerId,
        },
      });

      // Обновление пользователя с присвоением companyId
      await prisma.user.update({
        where: { id: ownerId },
        data: { companyId: newCompany.id },
      });

      // Добавление записи о пользователе как администраторе компании
      const companyEmployee = await prisma.companyEmployee.create({
        data: {
          userId: ownerId,
          companyId: newCompany.id, // Используем новый companyId
          role: 'Администратор',
          joinedAt: new Date(),
        },
      });

      // return res.status(201).json({ newCompany, companyId: newCompany.id });
      return res.status(201).json({ company: newCompany });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка при создании компании' });
    }
  } else {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }
}
