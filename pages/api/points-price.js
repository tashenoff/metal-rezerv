import prisma from '../../prisma/client';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { newPrice, changedBy } = req.body;

    // Проверяем, что новая цена валидная
    if (typeof newPrice !== 'number' || isNaN(newPrice)) {
      return res.status(400).json({ error: 'Invalid newPrice' });
    }

    try {
      // Получаем текущую цену
      const currentPrice = await prisma.pointsPrice.findFirst({
        orderBy: { validFrom: 'desc' }, // Получаем последнюю цену
      });

      // Если текущая цена существует, записываем историю изменений
      if (currentPrice) {
        // Создаем запись в истории изменений
        await prisma.pointPriceHistory.create({
          data: {
            pointsPriceId: currentPrice.id,
            oldPrice: currentPrice.price, // Старая цена
            newPrice: newPrice, // Новая цена
            changedBy: changedBy,
          },
        });
      }

      // Обновляем или создаем новую цену
      await prisma.pointsPrice.create({
        data: {
          price: newPrice, // Устанавливаем новую цену
        },
      });

      res.status(200).json({ message: 'Price updated successfully' });
    } catch (error) {
      console.error('Error updating price:', error);
      res.status(500).json({ error: 'Error updating price' });
    }
  } else if (req.method === 'GET') {
    try {
      // Получаем текущую цену
      const currentPrice = await prisma.pointsPrice.findFirst({
        orderBy: { validFrom: 'desc' }, // Получаем последнюю цену
      });

      if (!currentPrice) {
        return res.status(404).json({ error: 'Price not found' });
      }

      res.status(200).json({ price: currentPrice.price });
    } catch (error) {
      console.error('Error fetching price:', error);
      res.status(500).json({ error: 'Error fetching price' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
