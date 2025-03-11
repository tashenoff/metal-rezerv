// pages/api/attachments/secureUrl.js
import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';

// Константы
const JWT_SECRET = 'your_jwt_secret';
const URL_EXPIRATION = 5 * 60; // URL действителен 5 минут

export default async function handler(req, res) {
  // Только POST запросы
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Метод ${req.method} не разрешен` });
  }
  
  // Получаем токен авторизации
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Проверяем токен
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    
    // Получаем ID файла из запроса
    const { attachmentId } = req.body;
    if (!attachmentId) {
      return res.status(400).json({ error: 'Отсутствует ID вложения' });
    }
    
    // Создаем временный одноразовый ключ
    const now = Math.floor(Date.now() / 1000);
    const expires = now + URL_EXPIRATION;
    
    // Создаем подпись для URL
    const payload = `${attachmentId}:${userId}:${expires}`;
    const signature = createHash('sha256')
      .update(`${payload}:${JWT_SECRET}`)
      .digest('hex');
    
    // Формируем защищенный URL
    const secureUrl = `/api/attachments/download/${attachmentId}?sig=${signature}&exp=${expires}`;
    
    // Возвращаем URL клиенту
    return res.status(200).json({ url: secureUrl });
  } catch (error) {
    console.error('Error generating secure URL:', error);
    return res.status(401).json({ error: 'Недействительный токен авторизации' });
  }
}