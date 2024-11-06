// components/DashboardNavbar.js
import Link from 'next/link';

export default function DashboardNavbar() {
    return (
        <nav className="bg-base-200 h-full w-64 p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            <ul className="space-y-2">
                <li>
                    <Link className='text-lg hover:bg-base-300 p-2 rounded block' href="/dashboard">
                        Главная
                    </Link>
                </li>
                <li>
                    <Link className='text-lg hover:bg-base-300 p-2 rounded block' href="/dashboard/add-points">
                        Добавить баллы
                    </Link>
                </li>
                <li>
                    <Link className='text-lg hover:bg-base-300 p-2 rounded block' href="/dashboard/change-rate">
                        Изменить курс
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
