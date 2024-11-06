import { useState } from 'react';

const AddPriceForm = () => {
    const [price, setPrice] = useState('');
    const [changedBy, setChangedBy] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!price || !changedBy) {
            setError('Цена и изменивший должны быть указаны');
            return;
        }

        try {
            const res = await fetch('/api/points-price', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPrice: parseInt(price), changedBy }), // Используем newPrice
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Цена успешно обновлена!');
                setPrice('');
                setChangedBy('');
            } else {
                setError(data.error || 'Ошибка при обновлении цены');
            }
        } catch (error) {
            setError('Произошла ошибка при добавлении цены');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Добавить цену за балл</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Цена за балл
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        min="1"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="changedBy" className="block text-sm font-medium text-gray-700">
                        Кто изменил
                    </label>
                    <input
                        type="text"
                        id="changedBy"
                        value={changedBy}
                        onChange={(e) => setChangedBy(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="flex justify-between">
                    <button type="submit" className="btn btn-primary">Обновить цену</button>
                </div>
            </form>
            {error && <div className="text-red-500 mt-4">{error}</div>}
            {success && <div className="text-green-500 mt-4">{success}</div>}
        </div>
    );
};

export default AddPriceForm;
