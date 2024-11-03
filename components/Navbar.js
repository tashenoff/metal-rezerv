import { useState } from 'react';
import Link from 'next/link';
import UsernameDisplay from './UsernameDisplay';
import PointsDisplay from './PointsDisplay';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ handleLogout }) => {
  const { user, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="navbar bg-base-100">
      <div className="container mx-auto flex justify-between items-center">
        {/* Логотип и пункты меню */}
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold">INEED</h1>
          <nav className="flex space-x-4">
            <Link href="/listings" className="link link-hover text-primary font-bold">
              Заявки
            </Link>
            {user && user.isLoggedIn && user.role !== 'PUBLISHER' && (
              <>
                <Link href="/responses" className="link link-hover">
                  Мои отклики
                </Link>
                <Link href="/activity" className="link link-hover">
                  Активность
                </Link>
              </>
            )}
            {user && user.isLoggedIn && user.role === 'PUBLISHER' && (
              <Link href="/publisher" className="link link-hover">
                Мои заявки
              </Link>
            )}
          </nav>
        </div>

        {/* Правая часть: Баллы, имя пользователя, кнопка "Создать Заявку" и выпадающее меню */}
        <div className="flex items-center space-x-4">
          {user && user.isLoggedIn ? (
            <>
              <PointsDisplay points={user.points} role={user.role} />
              {/* Кнопка "Создать Заявку" только для роли PUBLISHER */}
              {user.role === 'PUBLISHER' && (
                <Link href="/create-listing" className="btn btn-primary btn-sm">
                  Создать Заявку
                </Link>
              )}


              <UsernameDisplay username={user.username} />


              {/* Выпадающее меню */}
              <div className="relative inline-block">
                <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                      }`}
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
            <Link href="/login" className="btn btn-outline">
              Вход
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
