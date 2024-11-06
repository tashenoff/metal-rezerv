import AddPointsForm from '../components/AddPointsForm';
import PointsAddedTable from '../components/PointsAddedTable';
import PriceHistory from '../components/PriceHistory';
import PointsStatistics from '../components/PointsStatistics';
import AddPriceForm from '../components/AddPriceForm';
import Layout from '../components/Layout';

export default function AddPointsPage() {
    return (
        <Layout>
            <div className="p-6 space-y-8">
                <div className="text-2xl font-bold mb-6">
                    <h2>Панель управления баллами</h2>
                </div>

                {/* Статистика по баллам */}
                <div className="mb-8">
                    <PointsStatistics />
                </div>

                {/* Секция с формами */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Добавить баллы */}
                    <div className="bg-base-100 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Добавить баллы пользователю</h3>
                        <AddPointsForm />
                    </div>

                    {/* Таблица добавленных баллов */}
                    <div className="bg-base-100 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">История добавленных баллов</h3>
                        <PointsAddedTable />
                    </div>
                </div>

                {/* Секция с ценой балла и историей изменений */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Добавить цену */}
                    <div className="bg-base-100 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Обновить цену балла</h3>
                        <AddPriceForm />
                    </div>

                    {/* История цен */}
                    <div className="bg-base-100 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">История изменения цен</h3>
                        <PriceHistory />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
