import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret'; // Замените на более безопасный секрет
const HCAPTCHA_SECRET = 'ES_0fec4c8770184733a146036310a036cc'; // Замените на ваш Secret Key

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, hCaptchaToken } = req.body;

    // Поиск пользователя в базе данных
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Если пользователь не найден, возвращаем ошибку
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Если передан токен hCaptcha, проверяем его
    if (hCaptchaToken) {
      const hcaptchaUrl = `https://hcaptcha.com/siteverify`;
      const hcaptchaRes = await fetch(hcaptchaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${HCAPTCHA_SECRET}&response=${hCaptchaToken}`,
      });

      const hcaptchaData = await hcaptchaRes.json();

      // Если hCaptcha не пройдена, возвращаем ошибку
      if (!hcaptchaData.success) {
        return res.status(400).json({ message: 'hCaptcha validation failed' });
      }
    }

    // Генерация токена с более длительным сроком действия
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d', // Увеличиваем до 7 дней
    });

    res.status(200).json({ token, role: user.role });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}