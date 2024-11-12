// pages/register.js
import { useState } from 'react';

// Данные стран и их городов
const countryCityMap = {
    Россия: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань'],
    Казахстан: ['Нур-Султан', 'Алматы', 'Шымкент'],
    Беларусь: ['Минск', 'Гомель', 'Могилёв'],
    Украина: ['Киев', 'Харьков', 'Одесса'],
    Узбекистан: ['Ташкент', 'Самарканд', 'Бухара']
};

export default function Register() {
    const [formData, setFormData] = useState({
        role: 'PUBLISHER', // по умолчанию "Пользователь"
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        city: '',
        country: '',
    });

    const [cities, setCities] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'country') {
            // Обновляем список городов при выборе страны
            setCities(countryCityMap[value] || []);
            setFormData({
                ...formData,
                [name]: value,
                city: '' // Сбрасываем выбранный город при смене страны
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
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
                        name="phoneNumber"
                        placeholder="Номер телефона"
                        onChange={handleChange}
                        className="input input-bordered"
                    />
                </div>

                {/* Выбор страны */}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text">Страна</span>
                    </label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="select select-bordered"
                    >
                        <option value="">Выберите страну</option>
                        {Object.keys(countryCityMap).map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Выбор города */}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text">Город</span>
                    </label>
                    <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="select select-bordered"
                        disabled={!formData.country}
                    >
                        <option value="">Выберите город</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary w-full">
                    Зарегистрироваться
                </button>
            </form>
        </div>
    );
}
