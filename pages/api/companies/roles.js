// pages/api/roles/index.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const roles = await prisma.employeeRole.findMany({
        select: {
          id: true,       // ID роли
          name: true,     // Название роли
          description: true, // Описание роли (опционально)
        },
      });

      res.status(200).json(roles);
    } catch (error) {
      console.error('Ошибка при получении списка ролей:', error);
      res.status(500).json({ error: 'Не удалось получить список ролей' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Метод ${req.method} не разрешён` });
  }
}
