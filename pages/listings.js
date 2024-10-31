import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ListingsDisplay from '../components/ListingsDisplay';
import Dropdown from '../components/Dropdown';
import SearchBar from '../components/SearchBar';
import { filterListingsBySearchTerm, filterListingsByCategories } from '../utils/filterHelpers';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch('/api/listings');
      const data = await response.json();
      const publishedListings = data.filter((listing) => listing.published);
      setListings(publishedListings);
      setFilteredResults(publishedListings);
      setLoading(false); // Устанавливаем состояние загрузки в false после загрузки
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
    const filtered = filterListingsBySearchTerm(listings, term);
    setFilteredResults(filtered);
  };

  const handleCategorySelect = (selected) => {
    setSelectedCategories(selected);
    const filteredByCategory = filterListingsByCategories(listings, selected);
    setFilteredResults(filteredByCategory);
  };

  return (
    <Layout>
      <div className="py-5 flex items-center justify-between">
        <SearchBar onSearch={handleSearch} />
        <Dropdown
          label="Выберите категории"
          options={categories.map(category => category.name)} // Получаем имена категорий
          onSelect={handleCategorySelect}
        />
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="flex w-full flex-col gap-4">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </div>
      ) : filteredResults.length === 0 ? (
        <p>Нет опубликованных объявлений.</p>
      ) : (
        <ListingsDisplay listings={filteredResults} onListingClick={() => {}} />
      )}
    </Layout>
  );
};

export default Listings;
