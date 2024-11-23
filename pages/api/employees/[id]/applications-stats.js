  // pages/api/employees/[id]/applications-stats.js

  import { PrismaClient } from '@prisma/client';

  const prisma = new PrismaClient();

  export default async function handler(req, res) {
      const { id } = req.query; // Извлекаем id сотрудника из параметров запроса

      if (req.method !== 'GET') {
          return res.status(405).json({ error: 'Метод не разрешен' });
      }

      // Проверка на наличие id
      if (!id) {
          return res.status(400).json({ error: 'id не передан' });
      }

      // Преобразуем id в число
      const employeeIdInt = parseInt(id, 10);

      // Проверка на корректность значения id
      if (isNaN(employeeIdInt) || employeeIdInt <= 0) {
          return res.status(400).json({ error: 'Некорректный id' });
      }

      try {
          // Получаем отклики сотрудника за последние 7 дней
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          const responses = await prisma.response.findMany({
              where: {
                  responderId: employeeIdInt,
                  createdAt: { gte: sevenDaysAgo },
              },
              select: { createdAt: true },
          });

          if (!responses.length) {
              return res.status(200).json({ stats: [], message: 'Отклики не найдены' });
          }

          // Сгруппируем отклики по дням
          const stats = Array(7)
              .fill(0)
              .map((_, idx) => {
                  const date = new Date();
                  date.setDate(date.getDate() - idx);
                  const dateStr = date.toISOString().split('T')[0];

                  const dayCount = responses.filter(
                      (response) => response.createdAt.toISOString().split('T')[0] === dateStr
                  ).length;

                  return {
                      date: dateStr,
                      count: dayCount,
                  };
              })
              .reverse();

          return res.status(200).json({ stats });
      } catch (error) {
          console.error('Ошибка получения статистики откликов:', error);
          return res.status(500).json({ error: 'Ошибка загрузки статистики' });
      }
  }
