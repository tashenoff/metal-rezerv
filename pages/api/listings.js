import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Установка заголовков CORS
const setCORSHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешаем доступ из любого источника
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Разрешаем методы
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Разрешаем заголовки
};

export default async function handler(req, res) {
  // Устанавливаем заголовки CORS
  setCORSHeaders(res);

  console.log('Request method:', req.method);
  console.log('Request body:', req.body);

  if (req.method === 'OPTIONS') {
    // Обработка preflight-запроса
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const { title, content, deliveryDate, purchaseDate, expirationDate, categoryId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Необходима авторизация.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });

      if (!user || user.role !== 'PUBLISHER') {
        return res.status(403).json({ error: 'У вас нет прав для добавления объявлений.' });
      }

      // Валидация категорий
      if (!categoryId || isNaN(parseInt(categoryId, 10))) {
        return res.status(400).json({ error: 'Неверная категория.' });
      }

      const listing = await prisma.listing.create({
        data: {
          title,
          content,
          deliveryDate: new Date(deliveryDate || Date.now()),
          purchaseDate: new Date(purchaseDate || Date.now()),
          expirationDate: new Date(expirationDate || Date.now()),
          author: { connect: { id: user.id } },
          category: { connect: { id: parseInt(categoryId, 10) } },
        },
      });
      res.status(201).json(listing);
    } catch (error) {
      console.error('Server error:', error.message);
      res.status(500).json({ error: 'Ошибка сервера. Попробуйте позже.' });
    }
  } else if (req.method === 'GET') {
    try {
      const listings = await prisma.listing.findMany({
        include: {
          author: true,
          category: true,
        },
      });
      res.status(200).json(listings);
    } catch (error) {
      console.error('Error fetching listings:', error.message);
      res.status(500).json({ error: 'Ошибка при получении объявлений' });
    }
  } else {
    console.error('Метод не разрешен:', req.method);
    res.status(405).json({ error: 'Метод не разрешен.' });
  }
}
