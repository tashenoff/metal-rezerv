import Link from 'next/link';
import UsernameDisplay from './UsernameDisplay'; // Импорт компонента отображения имени
import PointsDisplay from './PointsDisplay'; // Импорт компонента отображения баллов
import ThemeToggle from './ThemeToggle';

const Navbar = ({ isLoggedIn, role, username, points, handleLogout }) => {
  return (
    <div className="navbar dark:bg-base-200 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="navbar-start">
          <h1 className="text-2xl font-bold">INEED</h1>
        </div>
        <div className="navbar-center hidden lg:flex">
          <nav className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
               <ThemeToggle />
                <Link href="/listings" className="link link-hover">
                  Заявки
                </Link>
                {role !== 'PUBLISHER' && (
                  <>
                    <Link href="/responses" className="link link-hover">
                      Мои отклики
                    </Link>
                    <Link href="/activity" className="link link-hover">
                      Активность
                    </Link>
                  </>
                )}
                {role === 'PUBLISHER' && (
                  <div className="flex space-x-4">
                    <Link href="/create-listing" className="link link-hover">
                      Создать Заявку
                    </Link>
                    <Link href="/publisher" className="link link-hover">
                      Мои заявки
                    </Link>
                  </div>
                )}

                {/* Используем компонент UsernameDisplay для отображения имени */}
                <UsernameDisplay username={username} />

                {/* Используем компонент PointsDisplay для отображения баллов */}
                <PointsDisplay points={points} role={role} />

                <button
                  onClick={handleLogout}
                  className="btn btn-active btn-sm"
                >
                  Выход
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline">
                  Вход
                </Link>

               


              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
