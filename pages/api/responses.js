import prisma from '../../prisma/client';
import jwt from 'jsonwebtoken';
import { getResponseCost } from './responseCost'; // Импортируем функцию

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

            const user = await prisma.user.findUnique({ where: { id: userId } });
            console.log('User data:', user);

            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден.' });
            }

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

            // Подсчет количества откликов на объявление
            const responseCount = await prisma.response.count({
                where: { listingId: parseInt(listingId) },
            });
            console.log('Current response count for listing:', responseCount);

            // Получаем стоимость отклика
            const responseCost = getResponseCost(listingId, responseCount, listing.author.isCompanyVerified);

            // Проверка на наличие достаточного количества баллов
            if (user.points === null || user.points < responseCost) {
                return res.status(400).json({ message: 'Недостаточно баллов для отклика.' });
            }

            const response = await prisma.response.create({
                data: {
                    responderId: userId,
                    listingId: parseInt(listingId),
                    message,
                    accepted: null,
                },
            });
            console.log('New response created:', response);

            // Обновляем баллы пользователя только если они не уйдут в минус
            await prisma.user.update({
                where: { id: userId },
                data: { points: user.points - responseCost },
            });

            return res.status(201).json(response);
        } else if (req.method === 'GET') {
            const { id: listingId } = req.query;
            console.log('Fetching responses for listing ID:', listingId);

            const responses = await prisma.response.findMany({
                where: { listingId: parseInt(listingId) },
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
