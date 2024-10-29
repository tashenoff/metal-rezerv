// netlify/functions/register.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret'; // Замените на ваш секретный ключ

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  const { name, email, password, companyName, companyBIN, phoneNumber, city, country } = JSON.parse(event.body);

  try {
    // Проверка на существование пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Пользователь с таким email уже существует' }),
      };
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'PUBLISHER', // или RESPONDER в зависимости от логики
        companyName,
        companyBIN,
        phoneNumber,
        city,
        country,
      },
    });

    // Создание JWT токена
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    return {
      statusCode: 201,
      body: JSON.stringify({ token, user }),
    };
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Внутренняя ошибка сервера' }),
    };
  }
};
