import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ListingsDisplay from '../components/ListingsDisplay';
import Dropdown from '../components/Dropdown';
import SearchBar from '../components/SearchBar';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch('/api/listings');
      const data = await response.json();
      const publishedListings = data.filter((listing) => listing.published);
      setListings(publishedListings);
      setFilteredResults(publishedListings);
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
      <div className="py-5 flex items-center justify-between">
        <SearchBar onSearch={handleSearch} />
        <Dropdown
          label="Выберите категории"
          options={categories.map(category => category.name)} // Получаем имена категорий
          onSelect={handleCategorySelect}
        />
      </div>

      {filteredResults.length === 0 ? (
        <p>Нет опубликованных объявлений.</p>
      ) : (
        <ListingsDisplay listings={filteredResults} onListingClick={() => {}} />
      )}
    </Layout>
  );
};

export default Listings;
