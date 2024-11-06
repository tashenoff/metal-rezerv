import prisma from '../../prisma/client';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { userId } = req.query; // Получаем userId из query параметров

        if (!userId) {
            return res.status(400).json({ message: 'Не передан userId' });
        }

        try {
            // Получаем потраченные баллы респондера по userId
            const pointsSpent = await prisma.pointsSpent.findMany({
                where: {
                    userId: parseInt(userId),  // Фильтруем по userId
                },
                include: {
                    listing: {  // Получаем информацию о каждом лоте
                        select: { title: true, content: true },
                    },
                },
                orderBy: {
                    spentAt: 'desc',  // Сортируем по дате потраченных баллов
                },
            });

            // Добавляем поле `pointsUsed` в ответ для каждой записи
            const responseWithPointsUsed = pointsSpent.map(point => ({
                ...point,
                pointsUsed: point.pointsUsed,  // Добавляем поле pointsUsed
            }));

            return res.status(200).json(responseWithPointsUsed);
        } catch (error) {
            console.error('Ошибка при получении данных о потраченных баллах:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Метод ${req.method} не разрешен`);
    }
}
