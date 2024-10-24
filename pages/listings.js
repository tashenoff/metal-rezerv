import { useEffect, useState } from 'react';
import Link from 'next/link';

import Layout from '../components/Layout';
import Card from '../components/Card';
import DateDisplay from '../components/DateDisplay'; // Импортируем компонент даты
import Dropdown from '../components/Dropdown'; // Импортируем компонент для выбора города
import SearchBar from '../components/SearchBar'; // Импортируем компонент поиска

const Listings = () => {
    const [listings, setListings] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            const response = await fetch('/api/listings'); // Измените путь, если у вас другой API
            const data = await response.json();
            // Фильтруем объявления, оставляя только опубликованные
            const publishedListings = data.filter((listing) => listing.published);
            setListings(publishedListings);
            setFilteredResults(publishedListings); // Изначально показываем все опубликованные объявления
        };

        fetchListings();
    }, []);

    // Фильтрация объявлений на основе поискового запроса
    const handleSearch = (term) => {
        const filtered = listings.filter(listing =>
            listing.title.toLowerCase().includes(term) ||
            listing.content.toLowerCase().includes(term)
        );
        setFilteredResults(filtered);
    };

    return (
        <Layout>
            <div>
                <div className='container mx-auto'>
                    
                    
                    <div className='p-5 flex items-center justify-between'>
                        {/* Поле для поиска объявлений */}
                        <SearchBar onSearch={handleSearch} /> {/* Передаём функцию handleSearch в SearchBar */}

                        {/* Выпадающий список для выбора города */}
                        <Dropdown
                            label="Выберите город"
                            options={Array.from(new Set(listings.map(listing => listing.author.city)))} // Получаем уникальные города
                            onSelect={(selectedCity) => {
                                const filteredByCity = listings.filter(listing => listing.author.city === selectedCity);
                                setFilteredResults(filteredByCity);
                            }}
                        />
                    </div>

                    {filteredResults.length === 0 ? (
                        <p>Нет опубликованных объявлений.</p>
                    ) : (
                        <ul>
                            {filteredResults.map((listing) => (
                                <Card
                                    key={listing.id}
                                    title={listing.title}
                                    content={listing.content}
                                    link={`/listing/${listing.id}`}
                                >
                                    <div className='flex items-center w-full border-t border-gray-300 py-2'>
                                        <div className='mr-5 flex'>
                                            <DateDisplay label="Дата публикации" date={listing.publishedAt} />
                                        </div>
                                        <div className='flex'>
                                            <DateDisplay label="Дата доставки" date={listing.deliveryDate} />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Listings;
