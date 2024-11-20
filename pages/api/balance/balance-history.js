import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Запрос на получение истории перевода баллов
      const transfers = await prisma.pointTransfer.findMany({
        orderBy: {
          transferDate: 'desc', // Сортируем по дате, начиная с последнего перевода
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
