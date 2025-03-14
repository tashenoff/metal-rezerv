import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET' || req.method === 'PUT') {
    let userId;
    
    try {
      // Получаем сессию NextAuth
      const session = await getServerSession(req, res, authOptions);
      
      console.log('Session in profile API:', JSON.stringify(session, null, 2));
      
      // Если нет сессии, возвращаем ошибку авторизации
      if (!session || !session.user) {
        return res.status(401).json({ message: 'Требуется авторизация' });
      }
      
      // Получаем ID пользователя из сессии
      userId = session.user.id;
      console.log('Используем ID из NextAuth сессии:', userId);
      
      // Проверяем, что userId получен
      if (!userId) {
        return res.status(401).json({ message: 'Не удалось получить ID пользователя' });
      }

      // Если запрос на получение данных пользователя, проверяем, совпадает ли id с id в токене
      if (req.method === 'GET') {
        if (parseInt(id) !== userId) {
          return res.status(403).json({ message: 'Нет доступа к данным другого пользователя' });
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            company: true, // Добавляем компанию пользователя
          },
        });

        if (!user) {
          return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Получаем информацию о потраченных баллах
        const pointsSpent = await prisma.pointsSpent.aggregate({
          _sum: {
            pointsUsed: true,
          },
          where: {
            userId: userId,
          },
        });

        const totalPointsSpent = pointsSpent._sum.pointsUsed || 0; // Если нет записей, возвращаем 0

        let employees = [];
        let companyMessage = null;

        // Если у пользователя есть компания, получаем сотрудников
        if (user.companyId) {
          employees = await prisma.companyEmployee.findMany({
            where: {
              companyId: user.companyId, // Находим сотрудников компании пользователя
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          });
        } else {
          companyMessage = 'У пользователя нет привязанной компании';
        }

        return res.status(200).json({
          user,
          totalPointsSpent, // Отправляем общую сумму потраченных баллов
          company: user.company || null, // Отправляем информацию о компании или null
          employees, // Отправляем список сотрудников
          companyMessage, // Добавляем сообщение о компании
        });
      }

      // Если запрос на обновление данных, проверяем, совпадает ли id с id в токене
      if (req.method === 'PUT') {
        if (parseInt(id) !== userId) {
          return res.status(403).json({ message: 'Нет доступа к обновлению данных другого пользователя' });
        }

        const { name, email } = req.body;
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { name, email },
        });

        return res.status(200).json(updatedUser);
      }

    } catch (error) {
      console.error('Ошибка авторизации:', error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Метод ${req.method} не разрешён`);
  }
}
