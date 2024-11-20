import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, points } = req.body;

    // Проверка на наличие обязательных параметров
    if (!userId || !points || points <= 0) {
      return res.status(400).json({ message: 'Необходимы userId и количество баллов.' });
    }

    try {
      // Начинаем транзакцию для обновления данных сотрудника и компании
      const result = await prisma.$transaction(async (prisma) => {
        // Получаем данные сотрудника
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        // Если сотрудник не найден, возвращаем ошибку
        if (!user) {
          throw new Error('Пользователь не найден.');
        }

        // Получаем данные компании сотрудника (если она есть)
        const company = await prisma.company.findUnique({
          where: { id: user.companyId },
        });

        // Если компания не найдена или у компании недостаточно баллов, возвращаем ошибку
        if (!company) {
          throw new Error('Компания сотрудника не найдена.');
        }

        if (company.balance < points) {
          throw new Error('У компании недостаточно баллов для пополнения.');
        }

        // Обновляем баланс сотрудника
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            points: (user.points || 0) + points,  // Увеличиваем баллы сотрудника
          },
        });

        // Обновляем баланс компании
        const updatedCompany = await prisma.company.update({
          where: { id: company.id },
          data: {
            balance: company.balance - points,  // Уменьшаем баланс компании
          },
        });

        // Записываем операцию перевода баллов в историю
        const pointTransfer = await prisma.pointTransfer.create({
          data: {
            companyId: company.id,      // Идентификатор компании, которая выполняет перевод
            userId: user.id,            // Идентификатор пользователя, который получает баллы
            points,                     // Количество переданных баллов
            description: 'Бонус за выполнение задачи',  // Описание операции
          },
        });

        // Возвращаем успешный результат
        return { updatedUser, updatedCompany, pointTransfer };
      });

      res.status(200).json({
        message: `Баланс сотрудника пополнен на ${points} баллов. Баланс компании уменьшен на ${points} баллов.`,
      });

    } catch (error) {
      // Обработка ошибок
      console.error(error); // Логирование ошибки для отладки
      res.status(500).json({ message: error.message || 'Ошибка при пополнении баланса.' });
    }
  } else {
    // Метод не поддерживается
    res.status(405).json({ message: 'Метод не поддерживается.' });
  }
}
