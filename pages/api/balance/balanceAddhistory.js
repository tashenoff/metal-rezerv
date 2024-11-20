import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;  // Изменяем id на userId

    if (!userId) {
      return res.status(400).json({ message: 'Не указан userId сотрудника.' });
    }

    try {
      // Получаем историю пополнений баланса
      const additions = await prisma.pointTransfer.findMany({
        where: {
          userId: parseInt(userId), // Используем userId, который приходит из query
          points: { gt: 0 },   // Учитываем только положительные переводы (пополнения)
        },
        orderBy: {
          transferDate: 'desc', // Сортируем по дате, начиная с последнего пополнения
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          }, // Включаем информацию о компании
        },
      });

      // Если пополнений не найдено
      if (!additions || additions.length === 0) {
        return res.status(404).json({ message: 'Пополнения для данного пользователя не найдены.' });
      }

      res.status(200).json({ additions });
    } catch (error) {
      console.error('Ошибка при загрузке истории пополнений:', error);
      res.status(500).json({ message: 'Ошибка при загрузке информации о пополнениях.' });
    }
  } else {
    res.status(405).json({ message: 'Метод не поддерживается.' });
  }
}
