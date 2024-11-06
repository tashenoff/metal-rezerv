import prisma from '../../prisma/client';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const history = await prisma.pointPriceHistory.findMany({
        include: {
          pointsPrice: true, // Включаем связанную модель, чтобы получить цену
        },
        orderBy: {
          changedAt: 'desc', // Сортировка по дате изменения
        },
      });

      // Преобразуем данные, чтобы включить старую цену
      const historyWithOldPrice = history.map(item => ({
        ...item,
        oldPrice: item.oldPrice, // Старая цена
        newPrice: item.newPrice, // Новая цена
        changedBy: item.changedBy, // Кто изменил
        changedAt: item.changedAt, // Когда изменили
      }));

      res.status(200).json(historyWithOldPrice);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching price history' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
