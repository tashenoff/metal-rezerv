// pages/api/responses/acceptResponse.js
import prisma from '../../../prisma/client';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { responseId } = req.body;

        // Проверяем наличие responseId
        if (!responseId) {
            return res.status(400).json({ message: 'Необходим responseId.' });
        }

        try {
            // Обновляем отклик, устанавливая его статус на 'accepted'
            const response = await prisma.response.update({
                where: { id: responseId },
                data: { accepted: true, status: 'approved' }, // Обновляем статус отклика
            });

            // Получаем идентификатор объявления из отклика
            const listingId = response.listingId; // Предполагаем, что у вас есть это поле в отклике

            // Обновляем статус публикации объявления на false
            // await prisma.listing.update({
                // where: { id: listingId },
                // data: { published: false }, // Устанавливаем статус публикации на false
            // });

            // Отправляем уведомление респонденту о принятии его отклика
            try {
                // Получаем данные отклика с информацией о респонденте и объявлении
                const responseWithDetails = await prisma.response.findUnique({
                    where: { id: responseId },
                    include: {
                        responder: {
                            include: {
                                company: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        listing: {
                            include: {
                                author: {
                                    include: {
                                        company: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
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
                    
                    const publisherInfo = {
                        name: responseWithDetails.listing.author.name,
                        email: responseWithDetails.listing.author.email,
                        phoneNumber: responseWithDetails.listing.author.phoneNumber,
                        company: responseWithDetails.listing.author.company,
                    };
                    
                    // Отправляем уведомление о принятии отклика
                    await sendResponseStatusNotification(
                        responseWithDetails.responder.email,
                        listingInfo,
                        true, // isAccepted = true
                        publisherInfo
                    );
                    
                    console.log('Acceptance notification sent to responder:', responseWithDetails.responder.email);
                }
            } catch (emailError) {
                // Если есть ошибка с отправкой email, мы логируем ее, но не прерываем выполнение запроса
                console.error('Error sending acceptance notification:', emailError);
            }

            return res.status(200).json({ response, message: 'Отклик принят и статус объявления обновлен.' });
        } catch (error) {
            console.error('Ошибка при принятии отклика:', error);
            return res.status(500).json({ message: 'Ошибка при принятии отклика.', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Метод ${req.method} не разрешен.`);
    }
}
