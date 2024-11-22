import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;  // Получаем параметр id из запроса

    if (!id) {
      return res.status(400).json({ message: 'ID компании не указан.' });
    }

    try {
      // Запрос на получение истории перевода баллов для конкретной компании
      const transfers = await prisma.pointTransfer.findMany({
        where: {
          companyId: parseInt(id),  // Фильтруем по id компании
        },
        orderBy: {
          transferDate: 'desc',  // Сортируем по дате перевода (от последнего к первому)
        },
        include: {
          company: true,  // Включаем информацию о компании
          user: true,     // Включаем информацию о пользователе, который получил баллы
        },
      });

      res.status(200).json({ transfers });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при загрузке истории перевода баллов.' });
    }
  } else {
    res.status(405).json({ message: 'Метод не поддерживается.' });
  }
}
