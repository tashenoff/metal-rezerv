import prisma from '../../../prisma/client';
import jwt from 'jsonwebtoken'; // Импортируем jsonwebtoken для работы с токенами

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, content, deliveryDate, purchaseDate, expirationDate, categoryId, purchaseMethod, paymentTerms, type } = req.body; // Добавляем новые поля
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

      // Проверяем, указан ли метод закупки
      if (!purchaseMethod) {
        return res.status(400).json({ error: 'Не указан метод закупки.' });
      }

      // Проверяем, указан ли тип объявления
      if (!type) {
        return res.status(400).json({ error: 'Не указан тип объявления.' });
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
          purchaseMethod, // Добавляем метод закупки
          paymentTerms, // Добавляем условия оплаты
          type, // Добавляем тип объявления
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
    res.status(405).json({ error: 'Метод не разрешен.' });
  }
}
