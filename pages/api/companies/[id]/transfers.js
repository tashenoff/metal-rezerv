// pages/api/companies/[id]/transfers.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // Получаем ID компании из параметров запроса

  if (req.method === 'GET') {
    try {
      // Получение всех переводов баллов компании по ID компании
      const transfers = await prisma.pointTransfer.findMany({
        where: { companyId: parseInt(id, 10) },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(200).json({ transfers });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка при получении переводов' });
    }
  } else if (req.method === 'POST') {
    try {
      const { userId, points, description } = req.body; // Получаем данные из тела запроса

      // Проверка существования компании
      const company = await prisma.company.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!company) {
        return res.status(404).json({ error: 'Компания не найдена' });
      }

      // Проверка наличия достаточного баланса у компании
      if (company.balance < points) {
        return res.status(400).json({ error: 'Недостаточно баллов на балансе компании' });
      }

      // Создание записи о переводе
      const pointTransfer = await prisma.pointTransfer.create({
        data: {
          companyId: parseInt(id, 10),
          userId: parseInt(userId, 10),
          points,
          description,
        },
      });

      // Обновление баланса компании
      await prisma.company.update({
        where: { id: parseInt(id, 10) },
        data: { balance: company.balance - points },
      });

      // Обновление баланса пользователя
      await prisma.user.update({
        where: { id: parseInt(userId, 10) },
        data: { points: { increment: points } },
      });

      return res.status(201).json({ pointTransfer });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка при создании перевода' });
    }
  } else {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }
}
