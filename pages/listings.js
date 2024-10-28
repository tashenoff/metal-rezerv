import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ListingsDisplay from '../components/ListingsDisplay';
import Dropdown from '../components/Dropdown';
import SearchBar from '../components/SearchBar';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch('/api/listings');
      const data = await response.json();
      const publishedListings = data.filter((listing) => listing.published);
      setListings(publishedListings);
      setFilteredResults(publishedListings);
    };

    fetchListings();
  }, []);

  const handleSearch = (term) => {
    const filtered = listings.filter((listing) =>
      listing.title.toLowerCase().includes(term) ||
      listing.content.toLowerCase().includes(term)
    );
    setFilteredResults(filtered);
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="p-5 flex items-center justify-between">
          <SearchBar onSearch={handleSearch} />
          <Dropdown
            label="Выберите город"
            options={Array.from(new Set(listings.map((listing) => listing.author.city)))}
            onSelect={(selectedCity) => {
              const filteredByCity = listings.filter((listing) => listing.author.city === selectedCity);
              setFilteredResults(filteredByCity);
            }}
          />
        </div>

        {filteredResults.length === 0 ? (
          <p>Нет опубликованных объявлений.</p>
        ) : (
          <ListingsDisplay listings={filteredResults} onListingClick={() => {}} />
        )}
      </div>
    </Layout>
  );
};

export default Listings;
