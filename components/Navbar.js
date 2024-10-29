import { useState } from 'react';
import Link from 'next/link';
import UsernameDisplay from './UsernameDisplay'; // Импорт компонента отображения имени
import PointsDisplay from './PointsDisplay'; // Импорт компонента отображения баллов


const Navbar = ({ isLoggedIn, role, username, points, handleLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="navbar bg-base-200">
      <div className="container mx-auto flex justify-between items-center">
        <div className="navbar-start">
          <h1 className="text-2xl font-bold">TradeSphere </h1>
        </div>
        <div className="navbar-center hidden lg:flex">
          <nav className="flex items-center  w-full  space-x-4">
            {isLoggedIn ? (
              <>
                
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
                  <div className="flex space-x-4 items-center">
                    <Link href="/create-listing" className="btn btn-primary btn-sm">
                      Создать Заявку
                    </Link>
                    <Link href="/publisher" className="link link-hover">
                      Мои заявки
                    </Link>
                  </div>
                )}

                {/* Выпадающее меню */}
                <div className="relative inline-block">
                  <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
                    <UsernameDisplay username={username} />
                    <PointsDisplay points={points} role={role} />
                    {/* Галочка для выпадающего меню */}
                    <svg
                      className={`w-4 h-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                    </svg>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-base-100 border border-base-200 rounded-md shadow-lg z-10">
                      <ul className="menu">
                        <li>
                          <Link href="/edit-profile" className="block px-4 py-2 hover:bg-base-300">
                            Редактировать профиль
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 hover:bg-base-300"
                          >
                            Выход
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
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
