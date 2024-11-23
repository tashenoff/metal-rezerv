// services/statsService.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEmployeeApplicationsStats = async (employeeId) => {
  // Дата 7 дней назад
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Получаем заявки сотрудника за последние 7 дней
  const applications = await prisma.application.findMany({
    where: {
      employeeId,
      createdAt: { gte: sevenDaysAgo },
    },
    select: { createdAt: true },
  });

  // Сгруппируем заявки по дням
  const stats = Array(7)
    .fill(0)
    .map((_, idx) => {
      const date = new Date();
      date.setDate(date.getDate() - idx);
      const dateStr = date.toISOString().split('T')[0];

      const dayCount = applications.filter(
        (app) => app.createdAt.toISOString().split('T')[0] === dateStr
      ).length;

      return {
        date: dateStr,
        count: dayCount,
      };
    })
    .reverse();

  return stats;
};
