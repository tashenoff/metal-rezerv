import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import UsernameDisplay from './UsernameDisplay';
import PointsDisplay from './PointsDisplay';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ handleLogout }) => {
  const { user, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        // Закрывать мобильное меню только если оно открыто
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]); // добавьте isMobileMenuOpen в зависимости

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="navbar bg-base-100">
      <div className="container mx-auto flex justify-between items-center">
        {/* Логотип */}
        <h1 className="text-2xl font-bold">INEED</h1>

        {/* Основное меню для десктопа */}
        <div className="hidden lg:flex w-full items-center space-x-6">
          <nav className="flex items-start ml-5 space-x-4">
            <Link href="/listings" className="link link-hover text-primary font-bold">
              Заявки
            </Link>
            {user?.isLoggedIn && user.role !== 'PUBLISHER' && (
              <>
                <Link href="/responses" className="link link-hover">
                  Мои отклики
                </Link>
                <Link href="/activity" className="link link-hover">
                  Активность
                </Link>
              </>
            )}
            {user?.isLoggedIn && user.role === 'PUBLISHER' && (
              <Link href="/publisher" className="link link-hover">
                Мои заявки
              </Link>
            )}
          </nav>
        </div>

        {/* Правая часть: Баллы и кнопка "Создать Заявку" */}
        <div className="flex w-full items-center justify-end space-x-4">
          {user?.isLoggedIn ? (
            <>
              <PointsDisplay points={user.points} role={user.role} />
              {user.role === 'PUBLISHER' && (
                <>
                  <Link href="/create-listing" className="btn btn-primary btn-sm">
                    Создать Заявку
                  </Link>
                  <div className='hidden lg:block'>
                  <UsernameDisplay username={user?.username} />
                  </div>
                </>
              )}

              {/* Выпадающее меню */}
              <div className="relative inline-block" ref={dropdownRef}>
                <button
                  className="flex items-center cursor-pointer"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                >
                  <svg
                    className={`w-4 h-4 hidden lg:block ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                  </svg>
                </button>

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

        {/* Бургер-кнопка для мобильного меню */}
        <div className="lg:hidden">
          <button onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div ref={dropdownRef} className="lg:hidden absolute top-16 right-4 w-48 bg-base-100 border border-base-200 rounded-md shadow-lg z-10">
          <ul className="menu p-2">
            <li>
              <UsernameDisplay username={user?.username} />
            </li>
            <li>
              <Link href="/listings" className="link link-hover text-primary">
                Заявки
              </Link>
            </li>
            {user?.isLoggedIn && user.role !== 'PUBLISHER' && (
              <>
                <li>
                  <Link href="/responses" className="link link-hover">
                    Мои отклики
                  </Link>
                </li>
                <li>
                  <Link href="/activity" className="link link-hover">
                    Активность
                  </Link>
                </li>
              </>
            )}
            {user?.isLoggedIn && user.role === 'PUBLISHER' && (
              <li>
                <Link href="/publisher" className="link link-hover">
                  Мои заявки
                </Link>
              </li>
            )}
            <li>
              <Link href="/edit-profile" className="link link-hover">
                Редактировать профиль
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="link link-hover text-red-500">
                Выход
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
