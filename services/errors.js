// services/errors.js

class ApiError extends Error {
    constructor(message, code = 500) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
    }
}

const handleApiError = (error) => {
    if (error instanceof ApiError) {
        // Можно делать дополнительную обработку в зависимости от кода ошибки
        return error;
    }

    // Если ошибка не является ApiError, то возвращаем общую ошибку
    return new ApiError('Произошла ошибка при выполнении запроса');
};

export { ApiError, handleApiError };
