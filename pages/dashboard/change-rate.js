// pages/dashboard/change-rate.js
import DashboardLayout from '../../components/DashboardLayout';
import AddPriceForm from '../../components/AddPriceForm';
import PriceHistory from '../../components/PriceHistory';

export default function ChangeRatePage() {
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">Изменить курс балла</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Форма для изменения курса балла */}
                <div className="bg-base-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Обновить курс балла</h2>
                    <AddPriceForm />
                </div>

                {/* История изменений курса */}
                <div className="bg-base-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">История изменения курса</h2>
                    <PriceHistory />
                </div>
            </div>
        </DashboardLayout>
    );
}
