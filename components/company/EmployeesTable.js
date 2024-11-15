import DateDisplay from "../DateDisplay";
import Button from "../Button";
import { useRouter } from 'next/router';
import Link from 'next/link';
const EmployeesTable = ({ employees, handleDeleteEmployee }) => {

    const router = useRouter(); // Хук useRouter должен быть вызван внутри компонента
    return (
        <div>
            <div className="flex items-center my-5 justify-between">
                <h3 className="text-xl font-semibold my-6">Сотрудники компании</h3>
                <Button
                    onClick={() => router.push('/company/create-employee')}
                    className="py-3 btn-outline btn"
                >
                    Добавить сотрудника
                </Button>
            </div>
            <div className="overflow-x-auto bg-base-100">
                <table className="table w-full table-compact">
                    <thead>
                        <tr>
                            <th className="text-center">ID</th>
                            <th className="text-center">Имя</th>
                            <th className="text-center">Должность</th>
                            <th className="text-center">Электронная почта</th>
                            <th className="text-center">Дата добавления</th>
                            <th className="text-center">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length > 0 ? (
                            employees.map((employee) => (
                                <tr key={employee.id} className="hover">
                                    <td className="text-center">{employee.user.id}</td>
                                    <td className="text-center">
                                        <Link className="text-blue-600 hover:underline" href={`/company/employee/${employee.user.id}`}>
                                            {employee.user.name}
                                        </Link></td>
                                    <td className="text-center">{employee.role}</td>
                                    <td className="text-center">{employee.user.email}</td>
                                    <td className="text-center">
                                        <DateDisplay date={employee.joinedAt} />
                                    </td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => handleDeleteEmployee(employee.id)}
                                            className="btn btn-sm btn-danger"
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">Нет сотрудников в компании.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeesTable;
