import prisma from '../../prisma/client';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Получаем все категории
      const categories = await prisma.category.findMany(); // Замените 'category' на название вашей модели категорий в Prisma
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Метод не разрешен.' });
  }
}
