// pages/profile/edit-profile.js
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Notification from '../components/Notification';
import ThemeToggle from '../components/ThemeToggle';
import Form from '../components/Form';
import Input from '../components/Input';

const EditProfile = () => {
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyBIN, setCompanyBIN] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [profileName, setProfileName] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');

            const response = await fetch('/api/profile/get', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || 'Ошибка при получении профиля');
                return;
            }

            const data = await response.json();
            setEmail(data.email);
            setPhoneNumber(data.phoneNumber);
            setCity(data.city);
            setCountry(data.country);
            setCompanyName(data.companyName);
            setCompanyBIN(data.companyBIN);
            setProfileName(data.email);
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        const token = localStorage.getItem('token');

        const response = await fetch('/api/profile/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                email,
                currentPassword,
                newPassword,
                phoneNumber,
                city,
                country,
                companyName,
                companyBIN,
            }),
        });

        if (!response.ok) {
            const data = await response.json();
            setError(data.message || 'Ошибка при обновлении профиля');
            return;
        }

        const data = await response.json();
        setSuccessMessage(data.message);
        setCurrentPassword('');
        setNewPassword('');
    };

    return (
        <Layout>
          
                <div className='flex items-center justify-between my-4 bg-base-200 p-4 rounded-md'>
                    <span>Настройка темы</span>
                    <ThemeToggle />
                </div>

                <h1 className="text-2xl font-bold">Редактировать профиль: {profileName}</h1>

                <Form onSubmit={handleSubmit} className="mt-4 space-y-6">
                    {error && <Notification message={error} type="error" />}
                    {successMessage && <Notification message={successMessage} type="success" />}

                    {/* Основные данные профиля */}
                    <div className="bg-base-200 p-4 rounded-md">
                        <h2 className="text-xl font-semibold">Основные данные</h2>
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Введите новый email"
                            required
                        />
                        <Input
                            label="Номер телефона"
                            type="text"
                            name="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Введите номер телефона"
                            required
                        />
                        <Input
                            label="Город"
                            type="text"
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Введите город"
                            required
                        />
                        <Input
                            label="Страна"
                            type="text"
                            name="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Введите страну"
                            required
                        />
                    </div>

                    {/* Данные для входа */}
                    <div className="bg-base-200 p-4 rounded-md">
                        <h2 className="text-xl font-semibold">Данные для входа</h2>
                        <Input
                            label="Текущий пароль"
                            type="password"
                            name="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Введите текущий пароль"
                            required
                        />
                        <Input
                            label="Новый пароль"
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Введите новый пароль"
                        />
                    </div>

                    {/* Информация о компании */}
                    <div className="bg-base-200 p-4 rounded-md">
                        <h2 className="text-xl font-semibold">Информация о компании</h2>
                        <Input
                            label="Название компании"
                            type="text"
                            name="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Введите название компании"
                        />
                        <Input
                            label="BIN компании"
                            type="text"
                            name="companyBIN"
                            value={companyBIN}
                            onChange={(e) => setCompanyBIN(e.target.value)}
                            placeholder="Введите BIN компании"
                        />
                    </div>

                    <button type="submit" className="btn w-full">Обновить профиль</button>
                </Form>
          
        </Layout>
    );
};

export default EditProfile;
