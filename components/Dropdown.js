import React, { useState, useEffect, useRef } from 'react';

const Dropdown = ({ label, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const dropdownRef = useRef(null);

  // Функция для обработки выбора опции
  const handleSelect = (option) => {
    setSelectedOptions(prev => {
      const isSelected = prev.includes(option);
      const newSelectedOptions = isSelected 
        ? prev.filter(selected => selected !== option) 
        : [...prev, option];
      return newSelectedOptions; // Обновляем состояние
    });
  };

  // Используем useEffect для вызова onSelect
  useEffect(() => {
    onSelect(selectedOptions); // Вызываем onSelect только когда selectedOptions меняется
  }, [selectedOptions]); // Зависимость от selectedOptions

  // Обработчик клика вне выпадающего списка
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };


   // Обработчик для кнопки "Сбросить" или "Показать все"
  const handleButtonClick = () => {
    if (selectedOptions.length === options.length) {
      // Если все опции выбраны, сбрасываем выбор
      setSelectedOptions([]);
    } else {
      // Иначе выбираем все опции
      setSelectedOptions(options);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="cursor-pointer py-2 select-bordered select w-full"
        onClick={() => setIsOpen(!isOpen)}
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
