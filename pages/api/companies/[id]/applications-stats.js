import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // Извлекаем id компании из параметров запроса

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  // Проверка на наличие id
  if (!id) {
    return res.status(400).json({ error: 'id не передан' });
  }

  // Преобразуем id в число
  const companyIdInt = parseInt(id, 10);

  // Проверка на корректность значения id
  if (isNaN(companyIdInt) || companyIdInt <= 0) {
    return res.status(400).json({ error: 'Некорректный id' });
  }

  try {
    // Проверяем, существует ли компания
    const company = await prisma.company.findUnique({
      where: { id: companyIdInt },
    });

    if (!company) {
      return res.status(404).json({ error: 'Компания не найдена' });
    }

    // Получаем всех сотрудников компании
    const employees = await prisma.companyEmployee.findMany({
      where: { companyId: companyIdInt },
      select: { userId: true },
    });

    if (!employees.length) {
      return res.status(200).json({ stats: [], message: 'Сотрудники не найдены' });
    }

    const employeeIds = employees.map((emp) => emp.userId);

    // Дата 7 дней назад
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Получаем отклики всех сотрудников за последние 7 дней
    const responses = await prisma.response.findMany({
      where: {
        responderId: { in: employeeIds },  // Отклики всех сотрудников компании
        createdAt: { gte: sevenDaysAgo },  // Отклики за последние 7 дней
      },
      select: { createdAt: true },
    });

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
    return res.status(500).json({ error: 'Ошибка получения данных' });
  }
}
