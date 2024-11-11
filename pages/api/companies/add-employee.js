import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, companyId, role } = req.body;

    console.log('Received data:', { userId, companyId, role });  // Логируем полученные данные

    if (!userId || !companyId || !role) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    try {
      const userIdInt = parseInt(userId, 10);
      const companyIdInt = parseInt(companyId, 10);

      if (isNaN(userIdInt) || isNaN(companyIdInt)) {
        return res.status(400).json({ error: 'Неверный формат userId или companyId' });
      }

      console.log('Parsed values:', { userIdInt, companyIdInt }); // Логируем распарсенные значения

      const user = await prisma.user.findUnique({ where: { id: userIdInt } });
      const company = await prisma.company.findUnique({ where: { id: companyIdInt } });

      if (!user || !company) {
        return res.status(404).json({ error: 'Пользователь или компания не найдены' });
      }

      // Создаем сотрудника в компании
      const companyEmployee = await prisma.companyEmployee.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: role,
          joinedAt: new Date(),
        },
      });

      // Обновляем companyId для пользователя
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { companyId: company.id },
      });

      console.log('Created companyEmployee:', companyEmployee); // Логируем результат создания сотрудника
      console.log('Updated user with companyId:', updatedUser); // Логируем результат обновления пользователя

      return res.status(200).json({ message: 'Сотрудник успешно добавлен', companyEmployee });
    } catch (error) {
      console.error('Ошибка на сервере:', error);
      return res.status(500).json({ error: 'Ошибка при добавлении сотрудника', details: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }
}
