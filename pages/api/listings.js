import prisma from '../../prisma/client'; // Импортируем клиента Prisma
import jwt from 'jsonwebtoken'; // Импортируем jsonwebtoken для работы с токенами

export default async function handler(req, res) {
  console.log("Request method:", req.method); // Логируем метод запроса

  if (req.method === 'POST') {
    const { title, content, deliveryDate, purchaseDate, expirationDate, categoryId } = req.body; 
    const token = req.headers.authorization?.split(' ')[1]; // Получаем токен
    console.log("Received token:", token); // Логируем токен (убедитесь, что это безопасно в ваших условиях)

    if (!token) {
      console.warn("No token provided"); // Логируем отсутствие токена
      return res.status(401).json({ error: 'Необходима авторизация.' });
    }

    try {
      const decoded = jwt.verify(token, 'your_jwt_secret'); // Декодируем токен
      console.log("Decoded token:", decoded); // Логируем декодированный токен

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
      console.log("User found:", user); // Логируем пользователя

      if (!user) {
        console.warn("User not found"); // Логируем, если пользователь не найден
        return res.status(404).json({ error: 'Пользователь не найден.' });
      }

      if (user.role !== 'PUBLISHER') {
        console.warn("User is not a PUBLISHER"); // Логируем, если роль не PUBLISHER
        return res.status(403).json({ error: 'У вас нет прав для добавления объявлений.' });
      }

      if (!categoryId || categoryId.trim() === '') {
        console.warn("No category ID provided"); // Логируем отсутствие категории
        return res.status(400).json({ error: 'Не указана категория.' });
      }

      const parsedCategoryId = parseInt(categoryId, 10);
      console.log("Parsed categoryId:", parsedCategoryId); // Логируем categoryId

      const listing = await prisma.listing.create({
        data: {
          title,
          content,
          deliveryDate: deliveryDate ? new Date(deliveryDate) : new Date(),
          purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
          expirationDate: expirationDate ? new Date(expirationDate) : new Date(),
          author: { connect: { id: user.id } },
          category: { connect: { id: parsedCategoryId } },
        },
      });
      console.log("Listing created:", listing); // Логируем создание объявления
      res.status(201).json(listing);
    } catch (error) {
      console.error("Error in POST request:", error.message); // Логируем ошибку
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const listings = await prisma.listing.findMany({
        include: {
          author: true,
          category: true,
        },
      });
      console.log("Listings retrieved:", listings); // Логируем полученные объявления
      res.status(200).json(listings);
    } catch (error) {
      console.error("Error in GET request:", error.message); // Логируем ошибку
      res.status(500).json({ error: error.message });
    }
  } else {
    console.warn("Method not allowed:", req.method); // Логируем недопустимый метод
    res.status(405).json({ error: 'Метод не разрешен.' });
  }
}
