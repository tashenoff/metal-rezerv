import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import ListingsDisplay from '../../components/listing/ListingsDisplay';
import SearchBar from '../../components/SearchBar';
import Banner from '../../components/Banner';
import { fetchListings, fetchCategories } from '../../services/api'; // Импортируем API функции
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
const Listings = () => {
  const [listings, setListings] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  // const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true); // Устанавливаем состояние загрузки в true

        const listingsData = await fetchListings();
        const categoriesData = await fetchCategories();

        setListings(listingsData);
        setFilteredResults(listingsData);
        // setCategories(categoriesData);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false); // Завершаем состояние загрузки
      }
    };

    loadData();
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


export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])), // Загружаем переводы для страницы
    },
  };
}

