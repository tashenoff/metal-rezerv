// pages/api/upload/index.js
import { IncomingForm } from 'formidable';
import path from 'path';
import fs from 'fs-extra';
import prisma from '../../../prisma/client';
import jwt from 'jsonwebtoken';

export const config = {
  api: {
    bodyParser: false, // Отключаем встроенный парсинг тела запроса для обработки файлов
  },
};

// Настраиваем директорию для сохранения файлов
const uploadDir = path.join(process.cwd(), 'public/uploads');

// Проверка и создание директории, если она не существует
fs.ensureDirSync(uploadDir);

export default async function handler(req, res) {
  console.log('Upload handler called');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Получаем токен из заголовков
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }

  try {
    // Верифицируем токен
    console.log('Verifying token');
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    console.log('User found:', user ? `ID: ${user.id}, Role: ${user.role}` : 'No user');

    if (!user || user.role !== 'PUBLISHER') {
      return res.status(403).json({ error: 'У вас нет прав для загрузки файлов' });
    }

    // Парсим форму с помощью formidable
    const form = new IncomingForm({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10 МБ
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          return reject(res.status(500).json({ error: 'Ошибка при загрузке файла' }));
        }

        console.log('Form parsed successfully');
        console.log('Fields:', fields);
        console.log('Files:', Object.keys(files));

        try {
          // Проверяем наличие файла и ID объявления
          if (!files.file) {
            return reject(res.status(400).json({ error: 'Файл не загружен' }));
          }

          const listingId = parseInt(fields.listingId);
          if (isNaN(listingId)) {
            return reject(res.status(400).json({ error: 'Некорректный ID объявления' }));
          }

          // Проверяем, принадлежит ли объявление пользователю
          const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            select: { id: true, authorId: true }
          });

          if (!listing) {
            return reject(res.status(404).json({ error: 'Объявление не найдено' }));
          }

          if (listing.authorId !== user.id) {
            return reject(res.status(403).json({ error: 'У вас нет прав для загрузки файлов к этому объявлению' }));
          }

          // Обрабатываем загруженный файл
          const uploadedFile = files.file;
          const originalFilename = uploadedFile.originalFilename || 'file';
          const size = uploadedFile.size;
          const mimetype = uploadedFile.mimetype;
          const tempPath = uploadedFile.filepath; // Временный путь к файлу

          // Генерируем уникальное имя файла
          const uniqueFileName = `${Date.now()}-${originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const destPath = path.join(uploadDir, uniqueFileName);

          console.log('File details:', {
            originalName: originalFilename,
            size: size,
            type: mimetype,
            tempPath: tempPath,
            destPath: destPath
          });

          // Перемещаем файл из временной папки в постоянную
          try {
            await fs.copy(tempPath, destPath);
            console.log('File copied successfully');
            
            // После успешного копирования создаем запись в базе данных
            const attachment = await prisma.attachment.create({
              data: {
                fileName: originalFilename,
                filePath: `/uploads/${uniqueFileName}`,
                fileType: mimetype,
                fileSize: size,
                listingId: listingId,
                isVisible: true,
              },
            });

            console.log('Attachment created in database');
            return resolve(res.status(200).json({ 
              message: 'Файл успешно загружен',
              attachment 
            }));
          } catch (copyError) {
            console.error('Error copying file:', copyError);
            return reject(res.status(500).json({ 
              error: 'Ошибка при сохранении файла',
              details: copyError.message
            }));
          }
        } catch (error) {
          console.error('Error processing upload:', error);
          return reject(res.status(500).json({ 
            error: 'Ошибка при обработке загрузки',
            details: error.message
          }));
        }
      });
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Ошибка аутентификации' });
  }
}