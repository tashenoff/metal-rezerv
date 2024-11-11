// pages/api/responses/getResponses.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { responderId } = req.query;

    try {
        const parsedResponderId = parseInt(responderId, 10);

        const responses = await prisma.response.findMany({
            where: {
                responderId: parsedResponderId,
            },
            include: {
                listing: { // Здесь мы включаем связанную модель Listing
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        published: true,
                        expirationDate: true,
                        responses: true,
                        author: { // Включаем информацию об авторе объявления
                            select: {
                                name: true,
                                phoneNumber: true,
                                email: true,
                                country: true,
                                company: { // Включаем информацию о компании
                                    select: {
                                        id: true,
                                        name: true,
                                        binOrIin: true,
                                        region: true,
                                        contacts: true,
                                        director: true,
                                        rating: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const user = await prisma.user.findUnique({
            where: { id: parsedResponderId },
            select: { level: true },
        });

        return res.status(200).json({ responses, level: user.level });
    } catch (error) {
        console.error('Ошибка при получении откликов:', error);
        res.status(500).json({ message: 'Ошибка при получении откликов.' });
    }
}
