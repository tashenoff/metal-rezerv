// pages/api/attachments/[id].js
import prisma from '../../../prisma/client';
import jwt from 'jsonwebtoken';
import fs from 'fs-extra';
import path from 'path';

export default async function handler(req, res) {
  const { id } = req.query;
  const attachmentId = parseInt(id);

  if (!attachmentId) {
    return res.status(400).json({ error: 'Неверный ID вложения' });
  }

  if (req.method === 'GET') {
    try {
      // Получаем информацию о вложении
      const attachment = await prisma.attachment.findUnique({
        where: { id: attachmentId },
        include: {
          listing: {
            select: {
              id: true,
              authorId: true,
              published: true,
            },
          },
        },
      });

      if (!attachment) {
        return res.status(404).json({ error: 'Вложение не найдено' });
      }

      // Проверяем, видимо ли вложение для всех или нужна авторизация
      if (!attachment.isVisible) {
        // Проверяем авторизацию пользователя
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ error: 'Необходима авторизация для просмотра этого файла' });
        }

        try {
          const decoded = jwt.verify(token, 'your_jwt_secret');
          // Проверка, является ли пользователь автором объявления или администратором
          if (decoded.id !== attachment.listing.authorId && decoded.role !== 'ADMIN') {
            return res.status(403).json({ error: 'У вас нет доступа к этому файлу' });
          }
        } catch (error) {
          return res.status(401).json({ error: 'Недействительный токен авторизации' });
        }
      }

      // Возвращаем информацию о вложении
      return res.status(200).json(attachment);
    } catch (error) {
      console.error('Error fetching attachment:', error);
      return res.status(500).json({ error: 'Ошибка при получении вложения' });
    }
  } else if (req.method === 'DELETE') {
    // Получаем токен из заголовков
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Необходима авторизация' });
    }

    try {
      // Проверка авторизации
      const decoded = jwt.verify(token, 'your_jwt_secret');
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      // Получаем информацию о вложении
      const attachment = await prisma.attachment.findUnique({
        where: { id: attachmentId },
        include: {
          listing: true,
        },
      });

      if (!attachment) {
        return res.status(404).json({ error: 'Вложение не найдено' });
      }

      // Проверяем, является ли пользователь автором объявления или администратором
      if (attachment.listing.authorId !== user.id && user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'У вас нет прав для удаления этого вложения' });
      }

      // Удаляем файл из файловой системы
      const filePath = path.join(process.cwd(), 'public', attachment.filePath);
      await fs.remove(filePath);

      // Удаляем запись из базы данных
      await prisma.attachment.delete({
        where: { id: attachmentId },
      });

      return res.status(200).json({ message: 'Вложение успешно удалено' });
    } catch (error) {
      console.error('Error deleting attachment:', error);
      return res.status(500).json({ error: 'Ошибка при удалении вложения' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    return res.status(405).json({ error: `Метод ${req.method} не разрешен` });
  }
}