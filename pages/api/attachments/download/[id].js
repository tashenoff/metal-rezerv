// pages/api/attachments/download/[id].js
import prisma from '../../../../prisma/client';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

// Константы
const JWT_SECRET = 'your_jwt_secret';

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

      // Проверка безопасности на основе подписанных URL
      try {
        // Если файл публичный, разрешаем доступ без авторизации
        if (attachment.isVisible) {
          // Продолжаем выполнение и отдаем файл
        } else {
          // Для непубличных файлов проверяем подпись URL
          const { sig, exp } = req.query;
          
          // Проверяем наличие всех необходимых параметров
          if (!sig || !exp) {
            if (attachment.fileType.startsWith('image/')) {
              res.setHeader('Content-Type', 'image/svg+xml');
              return res.status(401).send('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f0f0f0"/><text x="50%" y="50%" font-family="Arial" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="#666">Нет доступа</text></svg>');
            } else {
              return res.status(401).json({ 
                error: 'Недействительная ссылка. Требуется повторная авторизация.', 
                authRequired: true 
              });
            }
          }
          
          // Проверяем время истечения
          const now = Math.floor(Date.now() / 1000);
          if (parseInt(exp) < now) {
            if (attachment.fileType.startsWith('image/')) {
              res.setHeader('Content-Type', 'image/svg+xml');
              return res.status(401).send('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f0f0f0"/><text x="50%" y="50%" font-family="Arial" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="#666">Ссылка просрочена</text></svg>');
            } else {
              return res.status(401).json({ 
                error: 'Ссылка просрочена. Требуется повторная авторизация.', 
                authRequired: true 
              });
            }
          }
          
          // Проверяем подпись (без знания пользователя, автор создал подпись на сервере)
          // Это требует перебора потенциальных пользователей, но в данном случае
          // мы полагаемся только на валидность подписи и срок действия
          
          // Проверяем, может ли доступ быть от автора объявления
          const authorPayload = `${attachmentId}:${attachment.listing.authorId}:${exp}`;
          const authorSignature = createHash('sha256')
            .update(`${authorPayload}:${JWT_SECRET}`)
            .digest('hex');
            
          if (sig === authorSignature) {
            // Подпись от автора, разрешаем доступ
          } else {
            // Проверяем админские подписи
            // В реальной системе здесь был бы запрос к базе для проверки, какие пользователи
            // имеют админские права, но для упрощения мы просто отклоняем запрос
            if (attachment.fileType.startsWith('image/')) {
              res.setHeader('Content-Type', 'image/svg+xml');
              return res.status(403).send('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#fee2e2"/><text x="50%" y="50%" font-family="Arial" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="#dc2626">Недействительная подпись</text></svg>');
            } else {
              return res.status(403).json({ 
                error: 'Недействительная ссылка. Повторите запрос.', 
                authRequired: true 
              });
            }
          }
        }
      } catch (error) {
        console.error('Error in security check:', error);
        if (attachment.fileType.startsWith('image/')) {
          res.setHeader('Content-Type', 'image/svg+xml');
          return res.status(500).send('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f0f0f0"/><text x="50%" y="50%" font-family="Arial" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="#666">Ошибка сервера</text></svg>');
        } else {
          return res.status(500).json({ 
            error: 'Ошибка при проверке безопасности', 
            authRequired: true 
          });
        }
      }

      // Путь к файлу в файловой системе
      const filePath = path.join(process.cwd(), 'public', attachment.filePath.startsWith('/') ? attachment.filePath.slice(1) : attachment.filePath);
      
      // Проверяем существование файла
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Файл не найден на сервере' });
      }

      // Получаем данные файла
      const fileStream = fs.createReadStream(filePath);
      const fileStats = fs.statSync(filePath);

      // Устанавливаем заголовки для скачивания файла
      res.setHeader('Content-Type', attachment.fileType);
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(attachment.fileName)}"`);
      res.setHeader('Content-Length', fileStats.size);
      
      // Отправляем файл
      fileStream.pipe(res);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      res.status(500).json({ error: 'Ошибка при скачивании файла' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Метод ${req.method} не разрешен` });
  }
}