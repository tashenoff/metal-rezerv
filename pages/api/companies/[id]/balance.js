// pages/api/companies/[id]/balance.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const { amount, description, adminId } = req.body; // Получаем данные из тела запроса

      if (amount <= 0) {
        return res.status(400).json({ error: 'Сумма пополнения должна быть положительной' });
      }

      // Проверка существования компании
      const company = await prisma.company.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!company) {
        return res.status(404).json({ error: 'Компания не найдена' });
      }

      // Создание записи о транзакции
      const transaction = await prisma.companyBalanceTransaction.create({
        data: {
          companyId: parseInt(id, 10),
          amount,
          transactionType: 'Пополнение',
          description,
          adminId,
        },
      });

      // Обновление баланса компании
      await prisma.company.update({
        where: { id: parseInt(id, 10) },
        data: { balance: { increment: amount } },
      });

      return res.status(201).json({ transaction });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка при пополнении баланса' });
    }
  } else {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }
}
