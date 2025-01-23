import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret'; // Замените на более безопасный секрет
const HCAPTCHA_SECRET = 'ES_0fec4c8770184733a146036310a036cc'; // Замените на ваш Secret Key
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, hCaptchaToken  } = req.body;

       // Проверка hCaptcha
       const hcaptchaUrl = `https://hcaptcha.com/siteverify`;
       const hcaptchaRes = await fetch(hcaptchaUrl, {
         method: 'POST',
         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
         body: `secret=${HCAPTCHA_SECRET}&response=${hCaptchaToken}`,
       });

       const hcaptchaData = await hcaptchaRes.json();

       if (!hcaptchaData.success) {
         return res.status(400).json({ message: 'hCaptcha validation failed' });
       }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, role: user.role });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
