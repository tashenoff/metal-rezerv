// pages/api/profile.js
import { getSession } from 'next-auth/client'; // Замените на вашу логику получения сессии
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }

  const userId = session.user.id; // Предположим, что у вас есть id пользователя в сессии
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  res.status(200).json(user);
}
