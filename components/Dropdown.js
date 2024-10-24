import React, { useState } from 'react';

const Dropdown = ({ label, options, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Функция фильтрации опций на основе поискового запроса
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Обработчик выбора опции
  const handleSelect = (option) => {
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(selected => selected !== option); // Удаляем опцию, если она уже выбрана
      } else {
        return [...prev, option]; // Добавляем опцию в массив выбранных
      }
    });
    onSelect(selectedOptions); // Вызываем колбэк с текущими выбранными опциями
  };

  // Обработчик сброса фильтра
  const handleReset = () => {
    setSearchTerm('');
    setSelectedOptions([]); // Сбрасываем выбранные опции
    onSelect([]); // Вызываем колбэк с пустым массивом
  };

  return (
    <ul className="menu lg:menu-horizontal bg-base-200 rounded-box">
      <li className="relative">
        <details>
          <summary className="cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">
            {label} ({selectedOptions.length} выбрано)
          </summary>
          <div className="absolute z-10 p-2 bg-white border rounded-md shadow-md mt-2">
            {/* Поле ввода для поиска */}
            <label className="input input-bordered flex items-center gap-2 mb-2">
              <input
                type="text"
                className="grow"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Обновляем состояние поискового запроса
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            <button
              className="btn btn-outline mb-2"
              onClick={handleReset}
            >
              Сбросить фильтр
            </button>
            {/* Отображаем отфильтрованные варианты */}
            <ul>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li key={index} className="p-1 hover:bg-gray-100">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelect(option); // Обработчик выбора опции
                      }}
                      className={`flex items-center gap-2 ${
                        selectedOptions.includes(option) ? 'font-bold text-blue-600' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(option)}
                        readOnly
                        className="mr-2"
                      />
                      {option}
                    </a>
                  </li>
                ))
              ) : (
                <li><a>Нет доступных опций</a></li>
              )}
            </ul>
          </div>
        </details>
      </li>
    </ul>
  );
};

export default Dropdown;
