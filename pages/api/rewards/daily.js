// pages/api/rewards/daily.js
import prisma from '../../../prisma/client';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

  // Проверяем, включены ли ежедневные награды
  const enableDailyRewards = process.env.ENABLE_DAILY_REWARDS;
  console.log('ENABLE_DAILY_REWARDS in API:', enableDailyRewards); // Отладочная информация
  console.log('Type in API:', typeof enableDailyRewards);
  
  // Проверка на строковое значение 'true', игнорируя регистр
  if (String(enableDailyRewards).toLowerCase() !== 'true') {
    return res.status(404).json({ message: 'Ежедневные награды отключены' });
  }

  // Получаем количество баллов для ежедневной награды
  const dailyRewardPoints = parseInt(process.env.DAILY_REWARD_POINTS || '20', 10);

  // Только POST запросы для запроса баллов
  if (req.method === 'POST') {
    // Проверяем авторизацию
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Необходима авторизация' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Недействительный токен' });
    }

    const userId = decoded.id;

    // Проверяем, что пользователь существует и является RESPONDER
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (user.role !== 'RESPONDER') {
      return res.status(403).json({ message: 'Только респондеры могут получать ежедневные награды' });
    }

    try {
      // Проверяем, является ли пользователь новым (зарегистрированным сегодня)
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { registrationDate: true },
      });
      
      // Текущая дата без времени
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Дата регистрации пользователя без времени
      const registrationDate = new Date(user.registrationDate);
      registrationDate.setHours(0, 0, 0, 0);
      
      // Проверяем, регистрация была сегодня
      const isNewUser = registrationDate.getTime() === today.getTime();
      
      // Если это не новый пользователь, проверяем, получена ли награда сегодня
      if (!isNewUser) {
        const existingReward = await prisma.dailyReward.findFirst({
          where: {
            userId: userId,
            claimedAt: {
              gte: today,
              lt: tomorrow,
            },
          },
        });

        if (existingReward) {
          return res.status(400).json({ 
            message: 'Вы уже получили ежедневную награду сегодня',
            nextRewardTime: tomorrow.toISOString(),
          });
        }
      }
      // Для новых пользователей пропускаем проверку, всегда предоставляем награду

      // Начинаем транзакцию для обновления баллов пользователя и записи о награде
      const result = await prisma.$transaction([
        // 1. Обновляем баллы пользователя
        prisma.user.update({
          where: { id: userId },
          data: {
            points: {
              increment: dailyRewardPoints,
            },
          },
        }),
        
        // 2. Создаем запись о полученной награде
        prisma.dailyReward.create({
          data: {
            userId: userId,
            points: dailyRewardPoints,
            claimedAt: new Date(),
          },
        }),
      ]);

      // Возвращаем обновленное количество баллов
      return res.status(200).json({
        message: 'Ежедневная награда успешно получена',
        pointsAwarded: dailyRewardPoints,
        currentPoints: result[0].points,
      });
    } catch (error) {
      console.error('Error processing daily reward:', error);
      return res.status(500).json({ message: 'Ошибка при обработке ежедневной награды' });
    }
  } 
  // GET запрос для проверки статуса награды
  else if (req.method === 'GET') {
    // Проверяем авторизацию
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Необходима авторизация' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Недействительный токен' });
    }

    const userId = decoded.id;

    try {
      // Проверяем, является ли пользователь новым (зарегистрированным сегодня)
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { registrationDate: true },
      });
      
      // Текущая дата без времени
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Дата регистрации пользователя без времени
      const registrationDate = new Date(user.registrationDate);
      registrationDate.setHours(0, 0, 0, 0);
      
      // Проверяем, регистрация была сегодня
      const isNewUser = registrationDate.getTime() === today.getTime();
      
      // Если это новый пользователь, всегда показываем, что награда доступна
      if (isNewUser) {
        return res.status(200).json({ 
          available: true, 
          message: 'Добро пожаловать! Получите вашу первую ежедневную награду!',
          rewardAmount: dailyRewardPoints,
          isWelcomeReward: true,
        });
      }
      
      // Для существующих пользователей проверяем, получили ли они уже награду сегодня
      const existingReward = await prisma.dailyReward.findFirst({
        where: {
          userId: userId,
          claimedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      if (existingReward) {
        return res.status(200).json({ 
          available: false,
          message: 'Вы уже получили ежедневную награду сегодня',
          nextRewardTime: tomorrow.toISOString(),
        });
      } else {
        return res.status(200).json({ 
          available: true, 
          message: 'Ежедневная награда доступна',
          rewardAmount: dailyRewardPoints,
        });
      }
    } catch (error) {
      console.error('Error checking daily reward status:', error);
      return res.status(500).json({ message: 'Ошибка при проверке статуса ежедневной награды' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Метод ${req.method} не разрешен` });
  }
}