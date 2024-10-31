import prisma from '../../prisma/client'; // Импортируй клиента Prisma
import jwt from 'jsonwebtoken'; // Импортируем jsonwebtoken для работы с токенами

export default async function handler(req, res) {
  console.log('Request received:', req.method, req.body); // Логируем метод и тело запроса

  // Проверка на метод POST
  if (req.method === 'POST') {
    const { title, content, deliveryDate, purchaseDate, expirationDate, categoryId } = req.body; // Добавляем deliveryDate
    const token = req.headers.authorization?.split(' ')[1]; // Получаем токен

    if (!token) {
      console.log('Authorization token is missing'); // Логируем отсутствие токена
      return res.status(401).json({ error: 'Необходима авторизация.' });
    }

    try {
      // Декодируем токен и получаем пользователя
      const decoded = jwt.verify(token, 'your_jwt_secret'); // Замените на ваш секрет
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        console.log('User not found'); // Логируем, если пользователь не найден
        return res.status(404).json({ error: 'Пользователь не найден.' });
      }

      // Проверяем, является ли пользователь PUBLISHER
      if (user.role !== 'PUBLISHER') {
        console.log(`User role is ${user.role}. Access denied.`); // Логируем, если у пользователя нет прав
        return res.status(403).json({ error: 'У вас нет прав для добавления объявлений.' });
      }

      // Проверяем, указана ли категория
      if (!categoryId || categoryId.trim() === '') {
        console.log('Category ID is missing or empty'); // Логируем, если категория отсутствует
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
      console.log('Listing created:', listing); // Логируем созданное объявление
      return res.status(201).json(listing);
    } catch (error) {
      console.error('Error during listing creation:', error); // Логируем ошибку
      return res.status(500).json({ error: 'Ошибка сервера.' });
    }
  } else if (req.method === 'GET') {
    console.log('Fetching listings'); // Логируем получение объявлений
    const listings = await prisma.listing.findMany({
      include: {
        author: true,
        category: true,
      },
    });
    return res.status(200).json(listings);
  } else {
    console.log(`Method ${req.method} not allowed`); // Логируем недопустимый метод
    return res.status(405).json({ error: 'Метод не разрешен.' });
  }
}
