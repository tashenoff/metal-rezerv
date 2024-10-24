// pointsService.js
import prisma from '../../prisma/client';

// Функция для проверки достаточного количества баллов и списания их
export async function handlePoints(userId, responseCost) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new Error('Пользователь не найден.');
    }

    if (user.points === null || user.points < responseCost) {
        throw new Error('Недостаточно баллов для отклика.');
    }

    // Обновляем баллы пользователя
    await prisma.user.update({
        where: { id: userId },
        data: { points: user.points - responseCost },
    });

    return user;
}
