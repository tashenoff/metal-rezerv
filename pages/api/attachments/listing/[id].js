// pages/api/attachments/listing/[id].js
import prisma from '../../../../prisma/client';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { id } = req.query;
  const listingId = parseInt(id);

  if (!listingId) {
    return res.status(400).json({ error: 'Неверный ID объявления' });
  }

  if (req.method === 'GET') {
    try {
      // Сначала получаем информацию об объявлении, чтобы проверить, нужна ли авторизация
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: {
          id: true,
          authorId: true,
          published: true,
        },
      });

      if (!listing) {
        return res.status(404).json({ error: 'Объявление не найдено' });
      }

      // Базовый запрос для получения вложений объявления
      const query = {
        where: {
          listingId: listingId,
        },
        orderBy: {
          uploadedAt: 'desc',
        },
      };

      // Проверка авторизации для доступа к непубличным вложениям
      const token = req.headers.authorization?.split(' ')[1];
      let isAuthorized = false;
      let userId = null;
      let userRole = null;

      if (token) {
        try {
          const decoded = jwt.verify(token, 'your_jwt_secret');
          isAuthorized = true;
          userId = decoded.id;
          userRole = decoded.role;
        } catch (error) {
          // Если токен недействителен, пользователь не авторизован
          isAuthorized = false;
        }
      }

      // Если пользователь не авторизован или не является автором или админом,
      // возвращаем только публичные вложения
      if (!isAuthorized || (userId !== listing.authorId && userRole !== 'ADMIN')) {
        query.where.isVisible = true; // Только видимые вложения
      }

      // Получаем вложения объявления
      const attachments = await prisma.attachment.findMany(query);

      return res.status(200).json(attachments);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      return res.status(500).json({ error: 'Ошибка при получении вложений' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Метод ${req.method} не разрешен` });
  }
}