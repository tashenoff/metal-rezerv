import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { 
      name, 
      binOrIin, 
      region, 
      contacts, 
      director, 
      description, 
      website, 
      workingHours, 
      address, 
      ownerId 
    } = req.body;

    console.log('Полученные данные:', req.body); // Логируем данные для отладки

    // Валидация обязательных полей
    if (!name || !binOrIin || !region || !director || !ownerId) {
      return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
    }

    try {
      // Проверка на существующую компанию с таким же BIN/IIN или названием
      const existingCompany = await prisma.company.findFirst({
        where: {
          OR: [
            { name },
            { binOrIin }
          ],
        },
      });

      if (existingCompany) {
        return res.status(409).json({ error: 'Компания с таким названием или BIN/IIN уже существует' });
      }

      // Создание компании
      const newCompany = await prisma.company.create({
        data: {
          name,
          binOrIin,
          region,
          contacts,
          director,
          description,
          website,
          workingHours,
          address,
          ownerId,
          moderationStatus: 'PENDING', // Начальный статус модерации
        },
      });

      // Привязка компании к пользователю
      await prisma.user.update({
        where: { id: ownerId },
        data: { companyId: newCompany.id },
      });

      // Получаем ID роли "ADMIN"
      const adminRole = await prisma.employeeRole.findFirst({
        where: { name: 'ADMIN' },
      });

      if (!adminRole) {
        return res.status(404).json({ error: "Роль администратора не найдена" });
      }

      // Создание записи сотрудника для владельца компании
      await prisma.companyEmployee.create({
        data: {
          userId: ownerId,
          companyId: newCompany.id,
          roleId: adminRole.id, // Ссылка на роль администратора
          joinedAt: new Date(),
        },
      });

      return res.status(201).json({ company: newCompany });
    } catch (error) {
      console.error('Ошибка при создании компании:', error); // Логируем ошибку
      return res.status(500).json({ error: 'Ошибка при создании компании' });
    }
  } else {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }
}
