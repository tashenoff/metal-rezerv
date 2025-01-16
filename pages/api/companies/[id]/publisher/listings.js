
const prisma = new PrismaClient();
// pages/api/companies/[id]/publisher/listings.js
import { PrismaClient } from '@prisma/client';


export default async function handler(req, res) {
  const { id } = req.query;  // Получаем id компании из параметров запроса

  try {
    // Проверяем метод запроса
    if (req.method === 'GET') {
      const listings = await prisma.listing.findMany({
        where: {
          author: {
            companyId: Number(id),  // Ищем объявления для компании с данным id
          },
        },
        include: {
          author: true,  // Включаем данные о авторе объявления
          responses: {  // Включаем данные о откликах на объявление
            include: {
              responder: true,  // Включаем данные о респонденте
            },
          },
        },
      });

      // Отправляем успешный ответ с данными
      res.status(200).json(listings);
    } else {
      // Если метод не GET, отправляем ошибку
      res.status(405).json({ error: 'Метод не разрешён' });
    }
  } catch (error) {
    // Обрабатываем ошибку и отправляем ответ
    console.error('Ошибка при получении данных:', error);
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
}
