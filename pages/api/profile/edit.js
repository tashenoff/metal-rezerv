// pages/api/profile/edit.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret'; // Замените на ваш секретный ключ

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ message: 'Требуется аутентификация' });
        }

        try {
            const token = authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            const userId = decoded.id;

            const {
                email,
                currentPassword,
                newPassword,
                phoneNumber,
                city,
                country,
                companyName,
                companyBIN,
                points,
            } = req.body;

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            // Проверка текущего пароля
            if (newPassword || currentPassword) {
                if (!currentPassword) {
                    return res.status(400).json({ message: 'Требуется текущий пароль' });
                }

                const isValidPassword = await bcrypt.compare(currentPassword, user.password);
                if (!isValidPassword) {
                    return res.status(401).json({ message: 'Неверный текущий пароль' });
                }
            }

            let updateData = {};

            // Обновление пароля
            if (newPassword) {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                updateData.password = hashedPassword; // Обновляем поле пароля
            }

            // Обновляем другие поля
            if (email) updateData.email = email;
            if (phoneNumber) updateData.phoneNumber = phoneNumber;
            if (city) updateData.city = city;
            if (country) updateData.country = country;

            if (user.role === 'publisher') {
                if (companyName) updateData.companyName = companyName;
                if (companyBIN) updateData.companyBIN = companyBIN;
            } else {
                if (points !== undefined) updateData.points = points;
            }

            // Проверяем, есть ли данные для обновления
            if (Object.keys(updateData).length > 0) {
                const updatedUser = await prisma.user.update({
                    where: { id: userId },
                    data: updateData,
                });

                return res.status(200).json({ message: 'Профиль обновлен', user: updatedUser });
            } else {
                return res.status(400).json({ message: 'Нет данных для обновления' });
            }

        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
            res.status(500).json({ message: 'Ошибка сервера', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Метод ${req.method} не поддерживается`);
    }
}
