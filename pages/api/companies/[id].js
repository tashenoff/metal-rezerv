// pages/api/companies/[id].js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // Получаем ID компании из параметров запроса

  if (req.method === 'GET') {
    try {
      // Поиск компании по ID
      const company = await prisma.company.findUnique({
        where: { id: parseInt(id, 10) }, // Преобразуем ID в число
      });

      if (!company) {
        return res.status(404).json({ error: 'Компания не найдена' });
      }

      return res.status(200).json({ company });
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка при получении компании' });
    }
  } else {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }
}
