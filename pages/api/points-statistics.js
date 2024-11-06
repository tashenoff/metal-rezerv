import prisma from '../../prisma/client';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Получаем статистику за все периоды
      const statistics = await prisma.pointsStatistics.findMany({
        orderBy: {
          statisticsDate: 'desc',
        },
      });

      res.status(200).json(statistics);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({ error: 'Error fetching statistics' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
