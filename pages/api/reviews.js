import jwt from 'jsonwebtoken';
import prisma from '../../prisma/client';

// Статический секретный ключ для примера
const JWT_SECRET = 'your_jwt_secret';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Обработка POST запроса для отправки отзыва
        const { companyId, rating, comment } = req.body;
        const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка Authorization
        
        if (!token) {
            return res.status(401).json({ message: 'Необходима авторизация.' });
        }

        // Проверка данных
        if (!companyId || !rating || !comment) {
            return res.status(400).json({ message: 'Необходимо предоставить companyId, rating и comment.' });
        }

        try {
            // Декодирование токена и извлечение данных пользователя
            const decodedToken = jwt.verify(token, JWT_SECRET);
            
            // Извлекаем userId из токена
            const userId = decodedToken.id;

            if (!userId) {
                return res.status(400).json({ message: 'Неверный токен.' });
            }

            // Сохранение отзыва в базу данных
            const newReview = await prisma.review.create({
                data: {
                    companyId,
                    rating,
                    comment,
                    reviewerId: userId, // Идентификатор пользователя, оставившего отзыв
                },
            });

            // Обновление рейтинга компании на основе всех отзывов
            const updatedCompany = await prisma.company.update({
                where: { id: companyId },
                data: {
                    rating: await prisma.review.aggregate({
                        _avg: {
                            rating: true,
                        },
                        where: {
                            companyId: companyId,
                            isModerated: true, // Фильтруем только модератированные отзывы
                        },
                    }).then((result) => result._avg.rating), // Получаем среднее значение рейтинга
                },
            });

            return res.status(201).json({ newReview, updatedCompany });
        } catch (err) {
            console.error('Ошибка при создании отзыва:', err);
            return res.status(500).json({ message: 'Ошибка при создании отзыва.' });
        }
    } else if (req.method === 'GET') {
        // Обработка GET запроса для получения отзывов
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: 'Необходим параметр id.' });
        }

        try {
            // Получаем отзывы по companyId
            const reviews = await prisma.review.findMany({
                where: {
                    companyId: Number(id),
                    isModerated: true, // Фильтруем только модератированные отзывы
                },
                include: {
                    reviewer: true, // Включаем информацию о рецензенте, если нужно
                },
            });

            return res.status(200).json(reviews);
        } catch (err) {
            console.error('Ошибка при получении данных:', err);
            return res.status(500).json({ message: 'Ошибка сервера при получении данных.' });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Метод ${req.method} не поддерживается`);
    }
}
