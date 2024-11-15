import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import ListingsDisplay from '../../components/ListingsDisplay';
import Dropdown from '../../components/Dropdown';
import SearchBar from '../../components/SearchBar';
import Banner from '../../components/Banner';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true); // Устанавливаем состояние загрузки в true
      const response = await fetch('/api/listings');
      const data = await response.json();
      const publishedListings = data.filter((listing) => listing.published);
      setListings(publishedListings);
      setFilteredResults(publishedListings);
      setLoading(false); // Завершаем состояние загрузки
    };

    const fetchCategories = async () => {
      const response = await fetch('/api/categories'); // Эндпоинт для получения категорий
      const data = await response.json();
      setCategories(data);
    };

    fetchListings();
    fetchCategories();
  }, []);

  const handleSearch = (term) => {
    const filtered = listings.filter((listing) =>
      listing.title.toLowerCase().includes(term) ||
      listing.content.toLowerCase().includes(term)
    );
    setFilteredResults(filtered);
  };

  const handleCategorySelect = (selectedCategories) => {
    setSelectedCategories(selectedCategories);

    const filteredByCategory = listings.filter((listing) =>
      selectedCategories.length === 0 || selectedCategories.includes(listing.category.name) // Предположим, что у вас есть поле category.name
    );
    setFilteredResults(filteredByCategory);
  };

  return (
    <Layout>
      <Banner title='Публикуйте заявки, получайте лучшие предложения' />
      <div className="py-5 w-full">
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading ? ( // Индикатор загрузки
        <div className="flex justify-center items-center py-10">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : filteredResults.length === 0 ? (
        <p>Нет опубликованных объявлений.</p>
      ) : (
        <ListingsDisplay listings={filteredResults} onListingClick={() => { }} />
      )}
    </Layout>
  );
};

export default Listings;
