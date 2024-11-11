//необходимо создать обработчик для проверки компании 


import prisma from '../../prisma/client';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    try {
        console.log('Received request method:', req.method);

        if (req.method === 'GET') {
            const { listingId } = req.query;

            if (!listingId) {
                return res.status(400).json({ message: 'Необходим listingId.' });
            }

            // Преобразуем listingId в число
            const parsedListingId = parseInt(listingId);

            if (isNaN(parsedListingId)) {
                return res.status(400).json({ message: 'Неверный ID объявления.' });
            }

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

            // Проверка, откликался ли кто-то из этой компании на данное объявление
            const existingCompanyResponse = await prisma.response.findFirst({
                where: {
                    listingId: parsedListingId,
                    responder: {
                        companyId: company.id, // Используем company.id, если она есть
                    },
                },
            });
            console.log('Existing company response:', existingCompanyResponse);

            if (existingCompanyResponse) {
                return res.status(200).json({ exists: true });
            } else {
                return res.status(200).json({ exists: false });
            }
        }

        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Метод ${req.method} не разрешен.`);
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера.', error: error.message });
    }
}
