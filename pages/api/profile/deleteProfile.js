import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret'; // Замените на ваш секретный ключ

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'Требуется аутентификация' });
    }

    try {
      const token = authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      // Удаляем пользователя. Если добавлено каскадное удаление, это удалит все связанные записи автоматически.
      const user = await prisma.user.delete({
        where: { id: userId },
      });

      return res.status(200).json({ message: 'Аккаунт успешно удалён.' });
    } catch (error) {
      console.error('Ошибка при удалении аккаунта:', error);
      return res.status(500).json({ message: 'Произошла ошибка при удалении аккаунта.' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Метод ${req.method} не разрешён`);
  }
}
