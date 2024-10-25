// utils/responseCost.js

// Массив с сопоставлением ID объявления и стоимости отклика
const responseCosts = [
    { listingId: 122, cost: 3 },  // Для объявления с id 122 стоимость отклика 3 балла
    { listingId: 114, cost: 20 },  // Для объявления с id 114 стоимость отклика 20 баллов
    // Добавьте другие объявления и их цены по мере необходимости
];

// Массив с базовыми ценами для компаний
const baseCosts = [
    { isVerified: true, cost: 10 },  // Базовая стоимость для верифицированных компаний
    { isVerified: false, cost: 5 },   // Базовая стоимость для не верифицированных компаний
];

// Булево значение для применения специальной цены в зависимости от количества откликов
const applyAdditionalCost = false; // Измените на false, если не хотите применять специальную цену

/**
 * Функция для получения стоимости отклика
 * @param {number} listingId - ID объявления
 * @param {number} responseCount - Текущее количество откликов
 * @param {boolean} isVerifiedCompany - Верифицирована ли компания
 * @returns {number} - Стоимость отклика
 */
export function getResponseCost(listingId, responseCount, isVerifiedCompany) {
    // Получаем базовую стоимость на основе верификации компании
    const baseCost = baseCosts.find(item => item.isVerified === isVerifiedCompany);
    let responseCost = baseCost ? baseCost.cost : 5; // Устанавливаем базовую стоимость, если не найдено, ставим 5

    // Проверка, есть ли специальная цена для данного объявления
    const listingCost = responseCosts.find(item => item.listingId === listingId);
    if (listingCost) {
        responseCost = listingCost.cost; // Устанавливаем цену из массива
    }

    // Проверка дополнительных условий
    if (applyAdditionalCost && responseCount >= 10) {
        responseCost = 20; // Если applyAdditionalCost = true и количество откликов >= 10, устанавливаем стоимость 20
    }

    return responseCost;
}
