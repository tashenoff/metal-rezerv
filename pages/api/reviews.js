import prisma from '../../prisma/client';

// Статический секретный ключ для примера
const JWT_SECRET = 'your_secret_key';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Логика обработки POST запроса (как уже реализовано)
    } else if (req.method === 'GET') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: 'Необходим параметр id.' });
        }

        try {
            // Получаем отзывы по `companyId`
            const reviews = await prisma.review.findMany({
                where: {
                    companyId: Number(id),
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
