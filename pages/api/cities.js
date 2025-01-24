import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Группируем пользователей по городам и считаем их количество
      const usersByCity = await prisma.user.groupBy({
        by: ['city'], // Группировка по городу
        where: {
          city: {
            not: null, // Исключаем пользователей без указанного города
          },
          country: 'Казахстан', // Фильтр по стране
        },
        _count: {
          id: true, // Количество пользователей в каждом городе
        },
      });

      // Форматируем данные для ответа
      const formattedData = usersByCity.map((city) => ({
        city: city.city,
        count: city._count.id, // Количество пользователей
      }));

      res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ error: 'Failed to fetch cities' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}