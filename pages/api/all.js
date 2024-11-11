import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const users = await prisma.user.findMany({
      include: {
        company: true, // Связанные данные о компании
        listings: true, // Связанные данные о листингах
        responses: true, // Связанные данные о откликах
        pointsSpent: true, // Связанные данные о потраченных баллах
        pointsAdded: true, // Связанные данные о добавленных баллах
        employees: true, // Связанные данные о сотрудниках компании
      },
    });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Произошла ошибка при загрузке данных пользователей' });
  }
}
