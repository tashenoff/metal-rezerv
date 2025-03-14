// pages/api/attachments/listing/[id].js
import prisma from '../../../../prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

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

      // Получаем сессию NextAuth
      const session = await getServerSession(req, res, authOptions);
      
      let isAuthorized = false;
      let userId = null;
      let userRole = null;

      if (session && session.user) {
        isAuthorized = true;
        userId = session.user.id;
        userRole = session.user.role;
        console.log('NextAuth session found:', { userId, userRole });
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