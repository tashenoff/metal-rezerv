// pages/register.js
import { useState } from 'react';

export default function Register() {
    const [formData, setFormData] = useState({
        role: 'user', // по умолчанию "Пользователь"
        name: '',
        email: '',
        password: '',
        companyName: '',
        companyBIN: '',
        phoneNumber: '',
        city: '',
        country: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
            alert('Регистрация успешна!');
            // Здесь можно сохранить токен в localStorage или выполнить редирект
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-200">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Регистрация</h2>

                {/* Выбор роли */}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text">Роль</span>
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="select select-bordered"
                    >
                        <option value="PUBLISHER">Публишер</option>
                        <option value="RESPONDER">RESPONDER</option>
                    </select>
                </div>

                <div className="form-control mb-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Имя"
                        onChange={handleChange}
                        required
                        className="input input-bordered"
                    />
                </div>
                <div className="form-control mb-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="input input-bordered"
                    />
                </div>
                <div className="form-control mb-4">
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        onChange={handleChange}
                        required
                        className="input input-bordered"
                    />
                </div>
                <div className="form-control mb-4">
                    <input
                        type="text"
                        name="companyName"
                        placeholder="Название компании"
                        onChange={handleChange}
                        className="input input-bordered"
                    />
                </div>
                <div className="form-control mb-4">
                    <input
                        type="text"
                        name="companyBIN"
                        placeholder="БИН компании"
                        onChange={handleChange}
                        className="input input-bordered"
                    />
                </div>
                <div className="form-control mb-4">
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Номер телефона"
                        onChange={handleChange}
                        className="input input-bordered"
                    />
                </div>
                <div className="form-control mb-4">
                    <input
                        type="text"
                        name="city"
                        placeholder="Город"
                        onChange={handleChange}
                        className="input input-bordered"
                    />
                </div>
                <div className="form-control mb-4">
                    <input
                        type="text"
                        name="country"
                        placeholder="Страна"
                        onChange={handleChange}
                        className="input input-bordered"
                    />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                    Зарегистрироваться
                </button>
            </form>
        </div>
    );
}
