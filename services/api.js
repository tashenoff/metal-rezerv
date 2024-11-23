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