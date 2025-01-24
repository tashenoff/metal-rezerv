import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import UsernameDisplay from './UsernameDisplay'; // Импортируем обновленный компонент
import PointsDisplay from './PointsDisplay';
import { useAuth } from '../contexts/AuthContext';
import { getEmployeeRole } from '../services/api';
import { useTranslation } from 'next-i18next';
import { generateGoogleStyleAvatar } from '../utils/avatar'; // Импортируем функцию для генерации аватара
import {
  ArrowLeftIcon, // Иконка "Назад"
  HomeIcon, // Иконка для "Заявки"
  DocumentTextIcon, // Иконка для "Мои отклики"
  ChartBarIcon, // Иконка для "Активность"
  UserIcon, // Иконка для "Управление аккаунтом"
  BuildingOfficeIcon, // Иконка для "Компания"
  ArrowRightOnRectangleIcon, // Иконка для "Выход"
} from '@heroicons/react/24/solid';

const Navbar = ({ handleLogout }) => {
  const { t } = useTranslation('common');
  const { user, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const dropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Генерация аватара на основе username
  const avatarUrl = user?.username ? generateGoogleStyleAvatar(user.username) : null;

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user?.isLoggedIn) {
      const checkAccess = async () => {
        try {
          const roleData = await getEmployeeRole(user.id);
          setRole(roleData.role);
        } catch (error) {
          console.error('Ошибка при проверке роли:', error);
        } finally {
          setIsLoading(false);
        }
      };

      checkAccess();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="drawer drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Навигационная панель */}
        <div className="navbar bg-base-100 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            {/* Логотип */}
            <h1 className="text-2xl font-bold text-primary">INEED</h1>

            {/* Основное меню для десктопа */}
            <div className="hidden lg:flex w-full items-center space-x-6">
              <nav className="flex items-start ml-5 space-x-4">
                <Link href="/listings" className="link link-hover text-primary font-bold hover:text-primary/80 transition-colors duration-200">
                  {t('navbar.requests')}
                </Link>

                {user?.isLoggedIn && user.role !== 'PUBLISHER' && (
                  <>
                    <Link href="/responses" className="link link-hover hover:text-primary/80 transition-colors duration-200">
                      {t('navbar.my_responses')}
                    </Link>
                    <Link href="/activity" className="link link-hover hover:text-primary/80 transition-colors duration-200">
                      {t('navbar.activity')}
                    </Link>
                  </>
                )}
                {user?.isLoggedIn && user.role === 'PUBLISHER' && (
                  <Link href="/publisher" className="link link-hover hover:text-primary/80 transition-colors duration-200">
                    {t('navbar.my_requests')}
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
                    <Link href="/listings/create-listing" className="btn btn-primary btn-sm hover:bg-primary/90 transition-colors duration-200">
                      {t('navbar.create_request')}
                    </Link>
                  )}

                  <div className="hidden lg:block">
                    <UsernameDisplay username={user?.username} avatarUrl={avatarUrl} />
                  </div>

                  {/* Выпадающее меню только для авторизованных пользователей */}
                  <div className="relative hidden lg:inline-block" ref={dropdownRef}>
                    <button
                      className="flex items-center cursor-pointer hover:bg-base-200 p-2 rounded-full transition-colors duration-200"
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
                            <Link href={`/profile/${user?.id}`} className="block px-4 py-2 hover:bg-base-300 transition-colors duration-200">
                              {t('navbar.edit_profile')}
                            </Link>
                          </li>
                          <li>
                            {user?.isLoggedIn && role?.permissions?.some(permission => permission.id === 1) ? (
                              <Link href="/company" className="link link-hover hover:bg-base-300 transition-colors duration-200">
                                {t('navbar.admin_panel')}
                              </Link>
                            ) : user?.isLoggedIn && role?.permissions?.some(permission => permission.id === 60001) ? (
                              <Link href={`/company/profile/${user?.companyEmployee?.companyId ?? ''}`} className="link link-hover hover:bg-base-300 transition-colors duration-200">
                                {t('navbar.company_profile')}
                              </Link>
                            ) : (
                              <Link href="company/create-company" className="link link-hover hover:bg-base-300 transition-colors duration-200">
                                {t('navbar.create_company')}
                              </Link>
                            )}
                          </li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-2 hover:bg-base-300 transition-colors duration-200"
                            >
                              {t('navbar.logout')}
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link href="/login" className="btn btn-outline hover:bg-primary/10 transition-colors duration-200">
                  Вход
                </Link>
              )}
            </div>

            {/* Бургер-кнопка для мобильного меню */}
            <div className="lg:hidden px-2">
              <label htmlFor="my-drawer-4" className="drawer-button btn btn-ghost hover:bg-base-200 p-2 rounded-full transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Мобильное меню (drawer) */}
      <div className="drawer-side" style={{ zIndex: 1000 }}>
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Кнопка "Назад" */}
          <li className='py-3 border-b border-white/20'>
            <label htmlFor="my-drawer-4" className="flex justify-between items-center p-2 cursor-pointer hover:bg-base-300 transition-colors duration-200">
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              <span>Назад</span>
            </label>
          </li>

          {user?.isLoggedIn && (
            <li className='py-3 border-b border-white/10'>
              <UsernameDisplay username={user?.username} avatarUrl={avatarUrl} />
            </li>
          )}
          <li className='py-3'>
            <Link href="/listings" className="link link-hover text-primary flex items-center hover:bg-base-300 transition-colors duration-200">
              <HomeIcon className="w-5 h-5 mr-2" />
              {t('navbar.requests')}
            </Link>
          </li>
          {user?.isLoggedIn && user.role !== 'PUBLISHER' && (
            <>
              <li className='py-3'>
                <Link href="/responses" className="link link-hover flex items-center hover:bg-base-300 transition-colors duration-200">
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  {t('navbar.my_responses')}
                </Link>
              </li>
              <li>
                <Link href="/activity" className="link link-hover flex items-center hover:bg-base-300 transition-colors duration-200">
                  <ChartBarIcon className="w-5 h-5 mr-2" />
                  {t('navbar.activity')}
                </Link>
              </li>
            </>
          )}
          {user?.isLoggedIn && user.role === 'PUBLISHER' && (
            <li className='py-3'>
              <Link href="/publisher" className="link link-hover flex items-center hover:bg-base-300 transition-colors duration-200">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                {t('navbar.my_requests')}
              </Link>
            </li>
          )}
          {user?.isLoggedIn && (
            <>
              <li className='py-3'>
                <Link href="/profile/edit-profile" className="link link-hover flex items-center hover:bg-base-300 transition-colors duration-200">
                  <UserIcon className="w-5 h-5 mr-2" />
                  {t('navbar.edit_profile')}
                </Link>
              </li>

            </>
          )}
          <li className='py-3'>
            {user?.isLoggedIn && role?.permissions?.some(permission => permission.id === 1) ? (
              <Link href="/company" className="link link-hover flex items-center hover:bg-base-300 transition-colors duration-200">
                <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                {t('navbar.admin_panel')}
              </Link>
            ) : user?.isLoggedIn && role?.permissions?.some(permission => permission.id === 60001) ? (
              <Link href={`/company/profile/${user?.companyEmployee?.companyId ?? ''}`} className="link link-hover flex items-center hover:bg-base-300 transition-colors duration-200">
                <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                {t('navbar.company_profile')}
              </Link>
            ) : (
              <Link href="company/create-company" className="link link-hover flex items-center hover:bg-base-300 transition-colors duration-200">
                <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                {t('navbar.create_company')}
              </Link>
            )}
          </li>

          <li className='py-3'>
            <button onClick={handleLogout} className="link link-hover flex items-center hover:bg-base-300 transition-colors duration-200">
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
              {t('navbar.logout')}
            </button>
          </li>


        </ul>
      </div>
    </div>
  );
};

export default Navbar;