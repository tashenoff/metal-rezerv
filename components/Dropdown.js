import React, { useState, useEffect, useRef } from 'react';

const Dropdown = ({ label, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const dropdownRef = useRef(null); // Ссылка на элемент Dropdown

  // Обработчик выбора опции
  const handleSelect = (option) => {
    setSelectedOptions(prev => {
      const isSelected = prev.includes(option);
      const newSelectedOptions = isSelected 
        ? prev.filter(selected => selected !== option) // Удаляем опцию, если она уже выбрана
        : [...prev, option]; // Добавляем опцию в массив выбранных
      onSelect(newSelectedOptions); // Вызываем колбэк с текущими выбранными опциями
      return newSelectedOptions;
    });
  };

  // Обработчик для кнопки "Сбросить" или "Показать все"
  const handleButtonClick = () => {
    if (selectedOptions.length === options.length) {
      // Если все опции выбраны, сбрасываем выбор
      setSelectedOptions([]);
      onSelect([]); // Вызываем колбэк с пустым массивом
    } else {
      // Иначе выбираем все опции
      setSelectedOptions(options);
      onSelect(options); // Вызываем колбэк с массивом всех опций
    }
  };

  // Обработчик клика вне выпадающего списка
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false); // Закрываем список, если кликнули вне его
    }
  };

  // Используем useEffect для добавления обработчика события
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    
    // Убираем обработчик при размонтировании компонента
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="cursor-pointer py-2 select-bordered select  w-full"
        onClick={() => setIsOpen(!isOpen)} // Открываем/закрываем список
      >
        {label} ({selectedOptions.length} выбрано)
      </button>
      {isOpen && (
        <div className="absolute z-10 p-2 border border-base-100 bg-base-200 rounded-md shadow-md mt-2 w-full">
          <ul>
            {options.length > 0 ? (
              options.map((option, index) => (
                <li key={index} className="p-1 hover:underline flex items-center py-2">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleSelect(option)} // Обработчик выбора опции
                    className="checkbox checkbox-primary mx-2"
                  />
                  <label className='label-text'>{option}</label>
                </li>
              ))
            ) : (
              <li><span>Нет доступных опций</span></li>
            )}
          </ul>
          <div className="flex justify-between mt-2 py-2">
            <button 
              className="btn" 
              onClick={handleButtonClick}
            >
              {selectedOptions.length === options.length ? 'Сбросить' : 'Показать все'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
