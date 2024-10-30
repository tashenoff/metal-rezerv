// pages/api/register.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret'; // Замените на ваш секретный ключ

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password, companyName, companyBIN, phoneNumber, city, country, role } = req.body;

  // Проверка на существование пользователя
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
  }

  // Хеширование пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Определяем значение поинтов по умолчанию для RESPONDER
  let points = 0;
  if (role === 'RESPONDER') {
    points = 100; 
  }

  // Создание нового пользователя
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      companyName,
      companyBIN,
      phoneNumber,
      city,
      country,
      points, // Добавляем поле points
    },
  });

  // Создание JWT токена
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

  return res.status(201).json({ token, user });
}
