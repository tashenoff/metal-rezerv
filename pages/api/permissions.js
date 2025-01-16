// /pages/api/permissions.js
import prisma from '../../prisma/client'; 
import jwt from 'jsonwebtoken'; 

export default async function handler(req, res) {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ error: 'Необходима авторизация.' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Метод не разрешен.' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');  // Расшифровываем токен, получаем id пользователя
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: {
                company: {
                    include: {
                        employees: {
                            where: { userId: decoded.id },
                            include: {
                                roleDetails: {
                                    include: {
                                        permissions: {
                                            select: {
                                                permission: true,  // Включаем разрешения для роли
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (user && user.company) {
            const permissions = user.company.employees[0]?.roleDetails.permissions.map(p => p.permission.name) || [];
            return res.status(200).json({ permissions });
        } else {
            return res.status(404).json({ error: 'Пользователь или компания не найдены.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
