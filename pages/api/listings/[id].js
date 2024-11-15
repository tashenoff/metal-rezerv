// pages/api/listings/[id].js
import prisma from '../../../prisma/client';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const listing = await prisma.listing.findUnique({
        where: {
          id: parseInt(id), // Преобразуем id в число
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              isCompanyVerified: true,
              country: true,
              city: true,
              phoneNumber: true,
              email: true,
              company: { // Включаем данные о компании, связанной с пользователем
                select: {
                  id: true,
                  name: true,
                  binOrIin: true,
                  region: true,
                  contacts: true,
                  director: true,
                  rating: true,
                },
              },
            },
          },
        },
      });

      if (!listing) {
        return res.status(404).json({ message: 'Объявление не найдено.' });
      }

      // Проверка на истечение объявления
      const currentDate = new Date();
      const isExpired = listing.expirationDate && currentDate > listing.expirationDate;

      // Если объявление истекло, обновляем его статус на published: false
      if (isExpired && listing.published) {
        await prisma.listing.update({
          where: { id: listing.id },
          data: { published: false },
        });
      }

      return res.json({
        ...listing,
        isExpired, // Добавляем информацию о том, истекло ли объявление
        message: isExpired ? 'Срок действия объявления истек.' : 'Объявление активно.',
        responseCost: listing.responseCost, // Добавляем поле responseCost
        author: {
          ...listing.author,
          company: listing.author.company, // Включаем информацию о компании
        },
      });
    } catch (error) {
      console.error(error); // Для отладки
      return res.status(500).json({ message: 'Ошибка при получении объявления.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Метод ${req.method} не разрешен.`);
  }
}
