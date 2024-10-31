import prisma from '../../prisma/client'; // Импортируй клиента Prisma
import jwt from 'jsonwebtoken'; // Импортируем jsonwebtoken для работы с токенами

export default async function handler(req, res) {
  console.log('Request method:', req.method); // Логируем метод запроса
  console.log('Request body:', req.body); // Логируем тело запроса

  if (req.method === 'POST') {
    const { title, content, deliveryDate, purchaseDate, expirationDate, categoryId } = req.body; // Добавляем deliveryDate
    const token = req.headers.authorization?.split(' ')[1]; // Получаем токен

    if (!token) {
      return res.status(401).json({ error: 'Необходима авторизация.' });
    }

    try {
      // Декодируем токен и получаем пользователя
      const decoded = jwt.verify(token, 'your_jwt_secret'); // Замените на ваш секрет
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      // Проверяем, является ли пользователь PUBLISHER
      if (user.role !== 'PUBLISHER') {
        return res.status(403).json({ error: 'У вас нет прав для добавления объявлений.' });
      }

      // Проверяем, указана ли категория
      if (categoryId === undefined || categoryId === null || categoryId.trim() === '') {
        return res.status(400).json({ error: 'Не указана категория.' });
      }

      // Преобразуем categoryId в целое число
      const parsedCategoryId = parseInt(categoryId, 10);

      // Создаем объявление
      const listing = await prisma.listing.create({
        data: {
          title,
          content,
          deliveryDate: deliveryDate ? new Date(deliveryDate) : new Date(), // Устанавливаем дату, если передана, или текущую дату
          purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(), // Устанавливаем дату, если передана, или текущую дату
          expirationDate: expirationDate ? new Date(expirationDate) : new Date(),
          author: {
            connect: { id: user.id }, // Подключаем пользователя к объявлению
          },
          category: {
            connect: { id: parsedCategoryId }, // Подключаем категорию к объявлению
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
    // Логируем информацию о проблеме, когда метод не разрешен
    console.error('Метод не разрешен:', req.method);
    res.status(405).json({ error: 'Метод не разрешен.' });
  }
}
