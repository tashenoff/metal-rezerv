// pages/api/publisher/republishListing.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { listingId, newExpirationDate } = req.body;

    try {
        // Проверяем, что переданы listingId и newExpirationDate
        if (!listingId || !newExpirationDate) {
            return res.status(400).json({ message: 'Необходимо передать listingId и newExpirationDate.' });
        }

        // Обновляем статус объявления на опубликованное и устанавливаем новую дату окончания
        const updatedListing = await prisma.listing.update({
            where: { id: listingId },
            data: {
                published: true,
                expirationDate: new Date(newExpirationDate), // Устанавливаем новую дату окончания
            },
        });

        res.status(200).json(updatedListing);
    } catch (error) {
        console.error('Ошибка при повторной публикации объявления:', error);
        res.status(500).json({ message: 'Ошибка при повторной публикации объявления.' });
    }
}
