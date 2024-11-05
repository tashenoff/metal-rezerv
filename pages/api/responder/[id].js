// pages/api/responder/[id].js
import prisma from '../../../prisma/client';

function calculateUserLevel(totalResponses, acceptedResponses) {
  if (totalResponses === 0) return 'NOVICE';

  const successRate = (acceptedResponses / totalResponses) * 100;

  if (successRate > 80) {
    return 'EXPERT';
  } else if (successRate >= 40 && successRate <= 80) {
    return 'EXPERIENCED';
  } else {
    return 'NOVICE';
  }
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Ищем респондента по ID
      const responder = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          companyName: true,
          role: true,
          city: true,
          level: true,
        },
      });

      if (!responder || responder.role !== 'RESPONDER') {
        return res.status(404).json({ message: 'Респондент не найден или не является респондентом' });
      }

      // Получаем отклики пользователя
      const responses = await prisma.response.findMany({
        where: { responderId: responder.id },
      });

      const totalResponses = responses.length;
      const acceptedResponses = responses.filter(r => r.accepted === true).length;

      // Вычисляем уровень
      const calculatedLevel = calculateUserLevel(totalResponses, acceptedResponses);

      // Обновляем уровень, если он отличается
      if (responder.level !== calculatedLevel) {
        await prisma.user.update({
          where: { id: responder.id },
          data: { level: calculatedLevel },
        });
        responder.level = calculatedLevel; // обновляем значение уровня в ответе
      }

      return res.status(200).json(responder);
    } catch (error) {
      console.error('Ошибка при запросе респондента:', error);
      return res.status(500).json({ message: 'Ошибка сервера', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Метод ${req.method} не разрешен` });
  }
}
