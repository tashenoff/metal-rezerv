import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { userId, companyId } = req.body;

    if (!userId || !companyId) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    try {
      // Проверка, существует ли сотрудник в компании
      const employee = await prisma.companyEmployee.findFirst({
        where: {
          userId: parseInt(userId, 10),
          companyId: parseInt(companyId, 10),
        },
      });

      if (!employee) {
        return res.status(404).json({ error: 'Сотрудник не найден в данной компании' });
      }

      // Проверяем, не является ли сотрудник последним администратором компании
      const admins = await prisma.companyEmployee.findMany({
        where: { companyId: parseInt(companyId, 10), role: 'Администратор' },
      });

      if (admins.length === 1 && admins[0].userId === parseInt(userId, 10)) {
        return res.status(400).json({ error: 'Невозможно удалить последнего администратора компании' });
      }

      // Удаляем сотрудника из компании
      await prisma.companyEmployee.delete({
        where: {
          id: employee.id,
        },
      });

      // Обновляем пользователя, убирая его компанию
      await prisma.user.update({
        where: { id: parseInt(userId, 10) },
        data: { companyId: null },
      });

      return res.status(200).json({ message: 'Сотрудник успешно удален из компании' });
    } catch (error) {
      console.error('Ошибка на сервере:', error);
      return res.status(500).json({ error: 'Ошибка при удалении сотрудника' });
    }
  } else {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }
}
