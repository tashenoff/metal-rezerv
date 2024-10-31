import prisma from '../../prisma/client';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  console.log(`Request Method: ${req.method}`);
  console.log(`Request URL: ${req.url}`);

  if (req.method === 'POST') {
    const { title, content, deliveryDate, purchaseDate, expirationDate, categoryId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Необходима авторизация.' });
    }

    try {
      const decoded = jwt.verify(token, 'your_jwt_secret'); // Замените на ваш секрет
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (user.role !== 'PUBLISHER') {
        return res.status(403).json({ error: 'У вас нет прав для добавления объявлений.' });
      }

      if (categoryId === undefined || categoryId === null || categoryId.trim() === '') {
        return res.status(400).json({ error: 'Не указана категория.' });
      }

      const parsedCategoryId = parseInt(categoryId, 10);

      const listing = await prisma.listing.create({
        data: {
          title,
          content,
          deliveryDate: deliveryDate ? new Date(deliveryDate) : new Date(),
          purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
          expirationDate: expirationDate ? new Date(expirationDate) : new Date(),
          author: {
            connect: { id: user.id },
          },
          category: {
            connect: { id: parsedCategoryId },
          },
        },
      });
      res.status(201).json(listing);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    const listings = await prisma.listing.findMany({
      include: {
        author: true,
        category: true,
      },
    });
    res.status(200).json(listings);
  } else {
    res.status(405).json({ error: 'Метод не разрешен.' });
  }
}
