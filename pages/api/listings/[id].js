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
          author: { // Предполагается, что в модели есть связь с автором
            select: {
              id: true,
              name: true,
              isCompanyVerified: true, // Поле для проверки верификации
              country: true,
              city: true,
              phoneNumber: true,
              email: true,
              companyName: true,
              
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
        author: listing.author, // Включаем информацию об авторе
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
