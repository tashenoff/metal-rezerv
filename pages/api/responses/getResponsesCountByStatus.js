// pages/api/responses/getResponsesCountByStatus.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { listingId } = req.query;

    try {
        const parsedListingId = parseInt(listingId, 10);

        // Группировка по статусам
        const responseCounts = await prisma.response.groupBy({
            by: ['status'],
            where: {
                listingId: parsedListingId,
            },
            _count: {
                status: true,
            },
        });

        // Преобразуем данные в удобный формат
        const counts = {
            processed: 0, // Обработанные отклики
            rejected: 0,  // Отклоненные
            pending: 0,   // Ожидающие
        };

        let totalCount = 0; // Общий счетчик откликов

        // Подсчитываем отклики по статусам
        responseCounts.forEach((item) => {
            totalCount += item._count.status; // Увеличиваем общий счетчик
            if (item.status === 'approved') {
                counts.processed = item._count.status;
            } else if (item.status === 'rejected') {
                counts.rejected = item._count.status;
            } else if (item.status === 'pending') {
                counts.pending = item._count.status;
            }
        });

        // Возвращаем общий счетчик и распределение по статусам
        res.status(200).json({ totalCount, counts });
    } catch (error) {
        console.error('Ошибка при получении количества откликов:', error);
        res.status(500).json({ message: 'Ошибка при получении количества откликов.' });
    }
}
