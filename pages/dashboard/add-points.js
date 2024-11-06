// pages/dashboard/add-points.js
import DashboardLayout from '../../components/DashboardLayout';
import AddPointsForm from '../../components/AddPointsForm';
import PointsAddedTable from '../../components/PointsAddedTable';

export default function AddPointsPage() {
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">Добавить баллы пользователю</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Форма для добавления баллов */}
                <div className="bg-base-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Форма добавления баллов</h2>
                    <AddPointsForm />
                </div>

                {/* Таблица истории добавленных баллов */}
                <div className="bg-base-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">История добавления баллов</h2>
                    <PointsAddedTable />
                </div>
            </div>
        </DashboardLayout>
    );
}
