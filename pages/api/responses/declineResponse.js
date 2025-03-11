// pages/api/responses/declineResponse.js
import prisma from '../../../prisma/client';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { responseId } = req.body;

        // Отклонить отклик
        if (!responseId) {
            return res.status(400).json({ message: 'Необходим responseId.' });
        }

        try {
            // Обновляем отклик, устанавливая его статус на 'rejected'
            const response = await prisma.response.update({
                where: { id: responseId },
                data: { accepted: false, status: 'rejected' }, // Обновляем статус
            });

            // Отправляем уведомление респонденту об отклонении его отклика
            try {
                // Получаем данные отклика с информацией о респонденте и объявлении
                const responseWithDetails = await prisma.response.findUnique({
                    where: { id: responseId },
                    include: {
                        responder: true,
                        listing: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                });

                // Если у респондента есть email - отправляем уведомление
                if (responseWithDetails && responseWithDetails.responder && responseWithDetails.responder.email) {
                    // Импортируем сервис отправки email
                    const { sendResponseStatusNotification } = require('../../../services/emailService');
                    
                    // Формируем данные для отправки
                    const listingInfo = {
                        id: responseWithDetails.listing.id,
                        title: responseWithDetails.listing.title,
                    };
                    
                    // Отправляем уведомление об отклонении отклика
                    await sendResponseStatusNotification(
                        responseWithDetails.responder.email,
                        listingInfo,
                        false, // isAccepted = false (declined)
                        {} // Нет необходимости передавать информацию о публишере
                    );
                    
                    console.log('Rejection notification sent to responder:', responseWithDetails.responder.email);
                }
            } catch (emailError) {
                // Если есть ошибка с отправкой email, мы логируем ее, но не прерываем выполнение запроса
                console.error('Error sending rejection notification:', emailError);
            }

            return res.status(200).json({ response, message: 'Отклик отклонен.' })
        } catch (error) {
            console.error('Ошибка при отклонении отклика:', error);
            return res.status(500).json({ message: 'Ошибка при отклонении отклика.', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Метод ${req.method} не разрешен.`);
    }
}
