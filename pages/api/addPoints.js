import prisma from '../../prisma/client'; // Импортируем клиент Prisma

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Метод не разрешен.' });
    }

    const { userId, points, addedBy, reason, totalCost } = req.body;

    // Проверяем, что все необходимые данные переданы
    if (!userId || !points || !totalCost) {
        return res.status(400).json({ message: 'Необходимы userId, количество баллов и общая стоимость.' });
    }

    try {
        // Находим пользователя в базе данных
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден.' });
        }

        // Получаем текущую стоимость балла
        const currentPrice = await prisma.pointsPrice.findFirst({
            orderBy: { validFrom: 'desc' },
        });

        if (!currentPrice) {
            return res.status(404).json({ message: 'Стоимость балла не найдена.' });
        }

        // Обновляем баланс пользователя
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { points: (user.points || 0) + points },
        });

        // Добавляем запись в таблицу PointsAdded, включая цену на момент добавления
        await prisma.pointsAdded.create({
            data: {
                userId,
                points,
                addedBy: addedBy || 'system', // Если администратор не указан, записываем "system"
                reason: reason || 'Пополнение баланса', // Комментарий, если он предоставлен
                priceAtAdded: currentPrice.price, // Сохраняем стоимость балла на момент добавления
            },
        });

        return res.status(200).json({
            message: 'Баланс успешно пополнен.',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Ошибка при пополнении баланса:', error);
        return res.status(500).json({
            message: 'Ошибка сервера. Не удалось пополнить баланс.',
            error: error.message,
        });
    }
}
