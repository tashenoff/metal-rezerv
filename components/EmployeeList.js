// components/EmployeeList.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Используем контекст

const EmployeeList = () => {
    const { user, loading } = useAuth(); // Получаем данные из контекста
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [loadingEmployees, setLoadingEmployees] = useState(true);

    useEffect(() => {
        if (loading) {
            return; // Если данные из контекста еще загружаются, ничего не делаем
        }

        const fetchEmployees = async () => {
            setLoadingEmployees(true); // Начинаем загрузку данных сотрудников
            try {
                const response = await fetch(`/api/companies/employees?companyId=${user.companyId}`);
                if (!response.ok) {
                    throw new Error('Не удалось загрузить сотрудников');
                }
                const data = await response.json();
                setEmployees(data); // Загружаем сотрудников в состояние
            } catch (error) {
                setError('Ошибка при загрузке сотрудников');
            } finally {
                setLoadingEmployees(false); // Завершаем загрузку
            }
        };

        fetchEmployees();
    }, [user, loading]); // Запрашиваем сотрудников при изменении user или loading

    if (loadingEmployees) {
        return 'Загрузка...';
    }

    if (error) {
        return {error};
    }

    return (
        <>
            <h2>Список сотрудников</h2>
            <ul>
                {employees.map((employee) => (
                    <li key={employee.id}>
                        {employee.name} - {employee.role}
                    </li>
                ))}
            </ul>
        </>

    );
};

export default EmployeeList;
