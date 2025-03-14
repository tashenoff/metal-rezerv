// pages/api/upload/simple.js - более простой метод для загрузки файлов
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs-extra';
import prisma from '../../../prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { createRouter } from 'next-connect';

// Настройка multer для сохранения файлов
const uploadDir = path.join(process.cwd(), 'public/uploads');
fs.ensureDirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueFileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    cb(null, uniqueFileName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const apiRoute = createRouter();

// Middleware для аутентификации с использованием NextAuth
apiRoute.use(async (req, res, next) => {
  try {
    // Получаем сессию NextAuth
    const session = await getServerSession(req, res, authOptions);
    
    console.log('Session in upload API:', JSON.stringify(session, null, 2));
    
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Необходима авторизация' });
    }
    
    console.log('User ID from session:', session.user.id);
    
    // Получаем пользователя из базы данных
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    
    console.log('User found in database:', !!user);

    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    if (user.role !== 'PUBLISHER') {
      return res.status(403).json({ error: 'У вас нет прав для загрузки файлов' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    return res.status(401).json({ error: 'Ошибка авторизации' });
  }
});

// Обработчик POST запроса с загрузкой файла
apiRoute.post(upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const listingId = parseInt(req.body.listingId);
    if (isNaN(listingId)) {
      return res.status(400).json({ error: 'Некорректный ID объявления' });
    }

    // Проверяем, принадлежит ли объявление пользователю
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, authorId: true }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Объявление не найдено' });
    }

    if (listing.authorId !== req.user.id) {
      return res.status(403).json({ error: 'У вас нет прав для загрузки файлов к этому объявлению' });
    }

    // Создаем запись в базе данных
    const attachment = await prisma.attachment.create({
      data: {
        fileName: req.file.originalname,
        filePath: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        listingId: listingId,
        isVisible: true,
      },
    });

    return res.status(200).json({
      message: 'Файл успешно загружен',
      attachment
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    return res.status(500).json({
      error: 'Ошибка при обработке загрузки',
      details: error.message
    });
  }
});

export default apiRoute.handler();