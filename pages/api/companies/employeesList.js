import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { companyId } = req.query;

  if (req.method === 'GET') {
    try {
      const employees = await prisma.employee.findMany({
        where: { companyId: parseInt(companyId) },
      });

      res.status(200).json(employees);
    } catch (error) {
      console.error('Ошибка при получении сотрудников:', error);
      res.status(500).json({ message: 'Ошибка на сервере' });
    }
  } else {
    res.status(405).json({ message: 'Метод не поддерживается' });
  }
}
