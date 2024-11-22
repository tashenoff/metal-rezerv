// pages/api/companies/[id]/response-stats.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // Извлекаем id компании из параметров запроса

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  if (!id) {
    return res.status(400).json({ error: 'id не передан' });
  }

  const companyIdInt = parseInt(id, 10);

  if (isNaN(companyIdInt) || companyIdInt <= 0) {
    return res.status(400).json({ error: 'Некорректный id' });
  }

  try {
    // Получаем компанию по id
    const company = await prisma.company.findUnique({
      where: { id: companyIdInt },
    });

    if (!company) {
      return res.status(404).json({ error: 'Компания не найдена' });
    }

    // Получаем сотрудников компании
    const employees = await prisma.companyEmployee.findMany({
      where: { companyId: companyIdInt },
      select: { userId: true },
    });

    if (!employees.length) {
      return res.status(200).json({ stats: [], message: 'Сотрудники не найдены' });
    }

    const employeeIds = employees.map((emp) => emp.userId);

    // Получаем отклики сотрудников за последние 7 дней
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const responses = await prisma.response.findMany({
      where: {
        responderId: { in: employeeIds },
        createdAt: { gte: sevenDaysAgo },
      },
      select: { status: true, createdAt: true },
    });

    const stats = {
      accepted: 0,
      rejected: 0,
      pending: 0,
    };

    // Подсчитываем количество откликов по статусам
    responses.forEach((response) => {
      if (response.status === 'approved') stats.accepted++;
      if (response.status === 'rejected') stats.rejected++;
      if (response.status === 'pending') stats.pending++;
    });

    return res.status(200).json({ stats });
  } catch (error) {
    console.error('Ошибка получения статистики откликов:', error);
    return res.status(500).json({ error: 'Ошибка получения данных' });
  }
}
