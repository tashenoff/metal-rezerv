import prisma from '../../../prisma/client';

export default async function handler(req, res) {
    const { listingId, userId } = req.query;
  
    try {
        // Находим отклики пользователя на данное объявление
        const userResponses = await prisma.response.findMany({
            where: {
                listingId: parseInt(listingId), // Получаем все отклики для объявления
                responderId: parseInt(userId),  // Ищем отклики для конкретного пользователя
            },
        });

        // Логируем все отклики, которые были найдены
        console.log("All Responses:", userResponses);

        // Фильтруем отклики по статусу 'approved'
        const validResponses = userResponses.filter(response => response.status === 'approved');

        // Логируем фильтрованные отклики
        console.log("Valid Responses with 'approved' status:", validResponses);

        // Если есть хотя бы один отклик с нужным статусом
        if (validResponses.length > 0) {
            console.log("User has valid responses with status 'approved'.");
            return res.status(200).json({ canLeaveReview: true });
        }

        // Логируем причины, почему отклики не удовлетворяют условиям
        if (validResponses.length === 0) {
            console.log("No valid responses found with status 'approved'.");
            if (userResponses.length > 0) {
                // Если отклики есть, но они не подходят, можно вывести их статус
                userResponses.forEach(response => {
                    console.log(`Response ID: ${response.id}, Status: ${response.status}`);
                });
            }
        }

        return res.status(200).json({ canLeaveReview: false });
    } catch (error) {
        console.error("Error checking responses with status:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
