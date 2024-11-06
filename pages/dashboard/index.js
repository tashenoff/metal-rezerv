// pages/dashboard/index.js
import DashboardLayout from '../../components/DashboardLayout';

export default function DashboardHomePage() {
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold">Главная панель</h1>
            <p>Добро пожаловать в панель управления!</p>
            {/* Добавьте другие элементы и компоненты для отображения на главной странице дашборда */}
        </DashboardLayout>
    );
}
