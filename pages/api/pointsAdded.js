import prisma from '../../prisma/client';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const pointsAdded = await prisma.pointsAdded.findMany({
                include: {
                    user: {
                        select: { name: true },
                    },
                },
                orderBy: {
                    addedAt: 'desc',
                },
            });

            // Отправляем данные, включая информацию о стоимости баллов на момент пополнения
            res.status(200).json(pointsAdded);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении данных о пополнениях баланса' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Метод ${req.method} не разрешен`);
    }
}
