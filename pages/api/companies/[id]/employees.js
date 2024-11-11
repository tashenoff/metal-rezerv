// /pages/api/companies/[id]/employees.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query; // Используем id как параметр

    try {
        const employees = await prisma.companyEmployee.findMany({
            where: {
                companyId: parseInt(id), // Преобразуем id в число
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return res.status(200).json(employees);
    } catch (error) {
        console.error('Ошибка при получении сотрудников:', error);
        return res.status(500).json({ error: 'Ошибка при получении сотрудников' });
    }
}
