// pages/api/employees/[id]/role.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Ищем сотрудника по userId и возвращаем его роль и разрешения
      const employee = await prisma.companyEmployee.findFirst({
        where: { userId: parseInt(id, 10) }, // Используем userId, а не id
        include: {
          roleDetails: {
            select: {
              id: true,
              name: true,
              description: true,
              // Включаем разрешения, связанные с ролью
              permissions: {
                select: {
                  permission: {
                    select: {
                      id: true,
                      name: true,
                      description: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!employee) {
        return res.status(404).json({ error: 'Сотрудник не найден' });
      }

      // Форматируем результат, включая permissions только внутри role
      res.status(200).json({
        employeeId: employee.id,
        role: {
          id: employee.roleDetails.id,
          name: employee.roleDetails.name,
          description: employee.roleDetails.description,
          permissions: employee.roleDetails.permissions.map(
            (rolePermission) => rolePermission.permission
          ),
        },
      });
    } catch (error) {
      console.error('Ошибка при получении роли сотрудника:', error);
      res.status(500).json({ error: 'Не удалось получить роль сотрудника' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Метод ${req.method} не разрешён` });
  }
}
