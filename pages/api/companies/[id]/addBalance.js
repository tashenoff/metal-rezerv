import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { companyId, points, addedBy, reason, totalCost } = req.body;

        console.log("Полученные данные для пополнения баланса:", req.body);

        // Преобразуем companyId в целое число
        const parsedCompanyId = parseInt(companyId, 10);
        
        console.log("Используем companyId в запросе:", parsedCompanyId);

        try {
            // Проверяем наличие компании
            const company = await prisma.company.findUnique({
                where: { id: parsedCompanyId },
            });

            if (!company) {
                return res.status(404).json({ message: 'Компания не найдена.' });
            }

            // Добавляем баллы
            const updatedCompany = await prisma.company.update({
                where: { id: parsedCompanyId },
                data: {
                    balance: company.balance + points, // Добавляем баллы
                },
            });

            // Логируем успешное обновление
            console.log("Обновленный баланс компании:", updatedCompany.balance);

            return res.status(200).json({ message: 'Баланс компании успешно пополнен.' });
        } catch (error) {
            console.error("Ошибка при пополнении баланса компании:", error);
            return res.status(500).json({ message: 'Ошибка при пополнении баланса компании.' });
        }
    } else {
        return res.status(405).json({ message: 'Метод не разрешен.' });
    }
}
