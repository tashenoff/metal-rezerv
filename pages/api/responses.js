import prisma from '../../prisma/client';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    try {
        console.log('Received request method:', req.method);

        if (req.method === 'POST') {
            const { listingId, message } = req.body;

            if (!listingId || !message) {
                return res.status(400).json({ message: 'Необходимы listingId и message.' });
            }

            console.log('Received body:', { listingId, message });

            // Извлекаем токен из заголовка Authorization
            const authHeader = req.headers.authorization;
            console.log('Authorization header:', authHeader);

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Необходим токен для авторизации.' });
            }

            const token = authHeader.split(' ')[1];
            console.log('Extracted token:', token);

            // Декодируем JWT-токен для получения userId
            let decodedToken;
            try {
                decodedToken = jwt.verify(token, 'your_jwt_secret');
                console.log('Decoded token:', decodedToken);
            } catch (error) {
                return res.status(401).json({ message: 'Неверный токен.' });
            }

            const userId = decodedToken.id;
            console.log('User ID from token:', userId);

            if (!userId) {
                return res.status(400).json({ message: 'Неверный токен.' });
            }

            // Получаем данные пользователя, включая информацию о компании
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { company: true }
            });
            console.log('User data:', user);

            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден.' });
            }

            // Проверяем, привязана ли к пользователю компания
            let company = user.company;
            if (!company && user.companyId) {
                // Если у пользователя есть companyId, но связь с компанией не установлена, пытаемся загрузить компанию вручную
                company = await prisma.company.findUnique({
                    where: { id: user.companyId },
                });
                console.log('Loaded company data:', company);
            }

            if (!company) {
                return res.status(403).json({ message: 'Вы не можете откликаться, так как у вас нет привязанной компании.' });
            }

            // Логирование информации о компании
            console.log('User company:', company);

            const listing = await prisma.listing.findUnique({
                where: { id: parseInt(listingId) },
                include: { author: true },
            });
            console.log('Listing data:', listing);

            if (!listing) {
                return res.status(404).json({ message: 'Объявление не найдено.' });
            }

            if (listing.authorId === userId) {
                return res.status(403).json({ message: 'Владелец объявления не может отправлять отклики.' });
            }

            // Проверка, откликался ли уже кто-то из этой компании на данное объявление
            const existingCompanyResponse = await prisma.response.findFirst({
                where: {
                    listingId: parseInt(listingId),
                    responder: {
                        companyId: company.id, // Используем company.id, если она есть
                    },
                },
            });
            console.log('Existing company response:', existingCompanyResponse);

            if (existingCompanyResponse) {
                return res.status(400).json({ message: 'Сотрудник вашей компании уже откликался на это объявление.' });
            }

            // Проверка на наличие отклика самого пользователя
            const existingResponse = await prisma.response.findFirst({
                where: {
                    responderId: userId,
                    listingId: parseInt(listingId),
                },
            });
            console.log('Existing response:', existingResponse);

            if (existingResponse) {
                return res.status(400).json({ message: 'Вы уже отправили отклик на это объявление.' });
            }

            // Получаем стоимость отклика из объявления
            const responseCost = listing.responseCost;
            console.log('Response cost:', responseCost);

            // Проверка на наличие достаточного количества баллов
            if (user.points === null || user.points < responseCost) {
                return res.status(400).json({ message: 'Недостаточно баллов для отклика.' });
            }

            // Создаем отклик
            const response = await prisma.response.create({
                data: {
                    responderId: userId,
                    listingId: parseInt(listingId),
                    message,
                    accepted: null,
                },
            });
            console.log('New response created:', response);

            // Создаем запись о потраченных баллах
            await prisma.pointsSpent.create({
                data: {
                    userId,
                    responseId: response.id,
                    pointsUsed: listing.responseCost,
                    listingId: listing.id,
                    spentAt: new Date(),
                },
            });

            // Обновляем баллы пользователя
            await prisma.user.update({
                where: { id: userId },
                data: { points: user.points - responseCost },
            });

            return res.status(201).json(response);
        } else if (req.method === 'GET') {
            const { id: listingId } = req.query;
            console.log('Fetching responses for listing ID:', listingId);

            // Преобразуем listingId в число
            const parsedListingId = parseInt(listingId);

            if (isNaN(parsedListingId)) {
                return res.status(400).json({ message: 'Неверный ID объявления.' });
            }

            const responses = await prisma.response.findMany({
                where: { listingId: parsedListingId },
                include: {
                    responder: true,
                },
            });

            return res.status(200).json(responses);
        }

        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Метод ${req.method} не разрешен.`);
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера.', error: error.message });
    }
}
