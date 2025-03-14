// services/api.js
import { apiRequest } from './apiRequest'; // Предполагается, что это ваша вспомогательная функция для выполнения запросов

// Функции для работы с API для компаний
export const createCompany = async (companyData) => {
    return apiRequest('POST', '/api/companies', companyData);
};

export const getBalanceHistory = async (companyId) => {
    if (!companyId) throw new Error('Компания не указана');
    return apiRequest('GET', `/api/companies/${companyId}/balance-history`);
};

export const getCompanyDetails = async (companyId) => {
    if (!companyId) throw new Error('Компания не указана');
    return apiRequest('GET', `/api/companies/${companyId}`);
};

// export const getReviews = async (companyId) => {
//     if (!companyId) throw new Error('Компания не указана');
//     return apiRequest('GET', `/api/reviews?id=${companyId}`);
// };

// export const checkCanLeaveReview = async (companyId, userId) => {
//     if (!companyId || !userId) throw new Error('Компания или пользователь не указаны');
//     return apiRequest('GET', `/api/responses/check?companyId=${companyId}&userId=${userId}`);
// };


// export const submitReview = async ({ rating, comment, companyId, token }) => {
//     return apiRequest('POST', '/api/reviews', {
//         rating, comment, companyId, token
//     });
// };

export const getApplicationsStats = async (companyId) => {
    if (!companyId) throw new Error('Компания не указана');
    return apiRequest('GET', `/api/companies/${companyId}/applications-stats`);
};

export const getResponseStats = async (companyId) => {
    if (!companyId) throw new Error('Компания не указана');
    return apiRequest('GET', `/api/companies/${companyId}/response-stats`);
};

export const getEmployees = async (companyId) => {
    if (!companyId) throw new Error('Компания не указана');
    return apiRequest('GET', `/api/companies/${companyId}/employees`);
};

export const deleteEmployee = async (companyId, userId) => {
    return apiRequest('DELETE', `/api/companies/${companyId}/remove-employee`, { userId });
};


// Функция для пополнения баланса
export const topUpBalance = async ({ companyId, userId, points, addedBy }) => {
    // Используем корректную интерполяцию строки
    return apiRequest('POST', `/api/companies/${companyId}/top-up`, { userId, points, addedBy });
};


// Получение данных о сотруднике
export const getEmployeeById = async (employeeId) => {
    if (!employeeId) throw new Error('ID сотрудника не указан');
    return apiRequest('GET', `/api/employees/${employeeId}`);
};

// Получение истории расходов сотрудника
export const getPointsSpentByEmployee = async (employeeId) => {
    if (!employeeId) throw new Error('ID сотрудника не указан');
    return apiRequest('GET', `/api/pointsSpent?userId=${employeeId}`);
};

// Получение истории пополнений баланса сотрудника
export const getPointsAddedByEmployee = async (employeeId) => {
    if (!employeeId) throw new Error('ID сотрудника не указан');
    return apiRequest('GET', `/api/balance/balanceAddhistory?userId=${employeeId}`);
};


export const getEmployeeApplicationsStats = async (employeeId) => {
    if (!employeeId) throw new Error('Сотрудник не указан');
    return apiRequest('GET', `/api/employees/${employeeId}/applications-stats`);
};


// services/api.js

export const addEmployee = async (data) => {
    const response = await fetch('/api/companies/add-employee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при добавлении сотрудника');
    }

    return await response.json();
};


// Получение информации об объявлении
export const fetchListing = async (id) => {
    if (!id) throw new Error('ID объявления не указан');
    return apiRequest('GET', `/api/listings/${id}`);
};

// Получение откликов
export const fetchResponses = async (id) => {
    if (!id) throw new Error('ID объявления не указан');
    return apiRequest('GET', `/api/responses?id=${id}`);
};

// Публикация объявления
export const publishListing = async (id) => {
    if (!id) throw new Error('ID объявления не указан');
    return apiRequest('POST', `/api/listings/${id}/publish`);
};

// Снятие объявления с публикации
export const unpublishListing = async (id) => {
    if (!id) throw new Error('ID объявления не указан');
    return apiRequest('POST', `/api/listings/${id}/unpublish`);
};

// Отправка отклика
export const submitResponse = async (data) => {
    return apiRequest('POST', '/api/responses', data);
};

// Принятие отклика
export const acceptResponse = async (responseId, userId) => {
    if (!responseId || !userId) throw new Error('ID отклика или пользователя не указан');
    return apiRequest('POST', '/api/responses/acceptResponse', { responseId, userId });
};

// Отклонение отклика
export const declineResponse = async (responseId) => {
    if (!responseId) throw new Error('ID отклика не указан');
    return apiRequest('POST', '/api/responses/declineResponse', { responseId });
};

export const fetchListings = async () => {
    const response = await fetch('/api/listings');
    if (!response.ok) {
        throw new Error('Ошибка загрузки объявлений');
    }
    const data = await response.json();
    return data.filter((listing) => listing.published);
};

export const fetchCategories = async () => {
    const response = await fetch('/api/categories');
    if (!response.ok) {
        throw new Error('Ошибка загрузки категорий');
    }
    const data = await response.json();
    return data;
};


export const createListing = async (listingData) => {
    // Используем apiRequest для автоматической обработки авторизации через NextAuth
    try {
        return await apiRequest('POST', '/api/listings', listingData);
    } catch (error) {
        console.error("Error in createListing:", error);
        throw error;
    }
};





// Функция для получения объявлений компании
export async function fetchCompanyListings(companyId) {
    try {
        const response = await fetch(`/api/companies/${companyId}/publisher/listings`);
        if (!response.ok) {
            throw new Error('Ошибка при получении данных');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка в fetchCompanyListings:', error);
        throw error;
    }
}


// Получение роли сотрудника
export const getEmployeeRole = async (employeeId) => {
    if (!employeeId) throw new Error('ID сотрудника не указан');
    return apiRequest('GET', `/api/employees/${employeeId}/role`);
};