// components/DashboardLayout.js
import DashboardNavbar from './DashboardNavbar';

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            {/* Навбар слева */}
            <DashboardNavbar />

            {/* Контент дашборда */}
            <div className="flex-1 p-6 bg-base-200">
                {children}
            </div>
        </div>
    );
}
