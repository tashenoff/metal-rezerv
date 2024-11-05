// pages/api/resetLevels.js
import prisma from '../../../prisma/client';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Сброс уровней всех респондентов
            const result = await prisma.user.updateMany({
                where: {
                    role: 'RESPONDER', // Только для респондентов
                },
                data: {
                    level: 'NOVICE', // Устанавливаем уровень на "Новичок"
                },
            });

            if (result.count === 0) {
                return res.status(404).json({ message: 'Респонденты не найдены.' });
            }

            return res.status(200).json({ message: 'Уровни пользователей успешно сброшены.' });
        } catch (error) {
            console.error('Ошибка при сбросе уровней пользователей:', error);
            return res.status(500).json({ message: 'Ошибка сервера', error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Метод ${req.method} не разрешен` });
    }
}
