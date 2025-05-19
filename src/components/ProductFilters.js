import React, { useState, useEffect } from 'react';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';
import axios from 'axios';

const ProductFilters = ({ onFilterChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [0, 2000000],
  });

  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState('popularity');

  
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Đen', 'Trắng', 'Đỏ', 'Xanh', 'Vàng', 'Hồng'];

  // Lấy danh mục từ backend khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/categories');
        // Lọc chỉ lấy các danh mục cấp 3 (level=3) hoặc thay đổi theo yêu cầu của bạn
        // Hoặc lọc theo loại sản phẩm như áo thun, quần jean, váy, đầm, áo khoác
        // Lọc chỉ lấy danh mục level 3 (danh mục lá/sản phẩm)
        const leafCategories = response.data.filter(cat => cat.level === 3);
        
        setCategories(leafCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories if API fails
        setCategories([
          { categoryId: 'men_tshirt', name: 'Áo thun' },
          { categoryId: 'men_shirt', name: 'Áo sơ mi' },
          { categoryId: 'men_jeans', name: 'Quần jean' },
          { categoryId: 'women_dress', name: 'Váy' },
          { categoryId: 'women_dress2', name: 'Đầm' },
          { categoryId: 'men_jacket', name: 'Áo khoác' }
        ]);
      }
    };
    
    fetchCategories();
  }, []);


  const handleFilterToggle = (filterType, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };

      //Xu ly dac biet cho danh muc
      if (filterType === 'categories') {
        const categoryId = typeof value === 'object' ? value.categoryId : value;

        if (newFilters.categories.includes(categoryId)) {
          newFilters.categories = newFilters.categories.filter(item => item !== categoryId);
        } else {
          newFilters.categories = [...newFilters.categories, categoryId];
        }
      }else {
        // Xu ly cho cac loai loc khac
        if (newFilters[filterType].includes(value)) {
          newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
        } else {
          newFilters[filterType] = [...newFilters[filterType], value];
        }
      } 

      return newFilters;
    });

    // Gọi sau khi state đã được cập nhật
    setTimeout(() => {
      onFilterChange && onFilterChange(selectedFilters, sortOption);
    }, 0);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    onFilterChange && onFilterChange(selectedFilters, e.target.value);
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, 2000000],
    });
    onFilterChange && onFilterChange({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, 2000000],
    }, sortOption);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center text-dark px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 md:hidden"
        >
          <FiFilter className="mr-2" />
          Lọc
          <FiChevronDown className={`ml-1 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-sm text-gray-600">Sắp xếp theo:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-primary"
          >
            <option value="popularity">Phổ biến</option>
            {/* <option value="newest">Mới nhất</option> */}
            <option value="price_low">Giá tăng dần</option>
            <option value="price_high">Giá giảm dần</option>
            {/* <option value="rating">Đánh giá</option> */}
          </select>
        </div>
      </div>

      <div className={`md:flex md:space-x-6 overflow-hidden transition-all duration-300 ${isFilterOpen ? 'max-h-[1000px]' : 'max-h-0 md:max-h-[1000px]'}`}>
        <div className="mb-4 md:mb-0">
          <h4 className="font-medium mb-2">Danh mục</h4>
        <div className="space-y-1">
          {categories.map((category, index) => (
            <label key={category.categoryId || index} className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2 accent-primary"
                checked={selectedFilters.categories.includes(category.categoryId)}
                onChange={() => handleFilterToggle('categories', category)}
              />
              {category.name}
            </label>
          ))}
        </div>
        </div>

        <div className="mb-4 md:mb-0">
          <h4 className="font-medium mb-2">Kích cỡ</h4>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, index) => (
              <button
                key={index}
                className={`w-8 h-8 flex items-center justify-center border ${selectedFilters.sizes.includes(size) ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:border-primary text-gray-800'}`}
                onClick={() => handleFilterToggle('sizes', size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 md:mb-0">
          <h4 className="font-medium mb-2">Màu sắc</h4>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <label
                key={index}
                className="flex items-center text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedFilters.colors.includes(color)}
                  onChange={() => handleFilterToggle('colors', color)}
                />
                <span
                  className={`mr-1 w-5 h-5 border inline-block ${selectedFilters.colors.includes(color)
                      ? 'bg-primary border-primary relative after:content-["✓"] after:absolute after:text-white after:text-xs after:top-0 after:left-1'
                      : 'border-gray-300'
                    }`}
                ></span>
                {color}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Giá</h4>
          <div className="px-2">
            <div className="h-2 bg-gray-200 rounded-full mb-4 relative">
              <div
                className="absolute h-full bg-primary rounded-full"
                style={{
                  left: `${(selectedFilters.priceRange[0] / 2000000) * 100}%`,
                  right: `${100 - (selectedFilters.priceRange[1] / 2000000) * 100}%`
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{selectedFilters.priceRange[0].toLocaleString()}đ</span>
              <span>{selectedFilters.priceRange[1].toLocaleString()}đ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected filters */}
      {(selectedFilters.categories.length > 0 ||
        selectedFilters.sizes.length > 0 ||
        selectedFilters.colors.length > 0) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Đã chọn:</span>
            
            {selectedFilters.categories.map((categoryId, index) => {
              // Tìm tên danh mục từ categoryId
              const category = categories.find(c => c.categoryId === categoryId);
              const displayName = category ? category.name : categoryId;
              
              return (
                <span key={`cat-${index}`} className="px-2 py-1 bg-gray-100 text-sm rounded-full flex items-center">
                  {displayName}
                  <button
                    onClick={() => handleFilterToggle('categories', categoryId)}
                    className="ml-1 text-gray-500 hover:text-primary"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              );
            })}

            {selectedFilters.sizes.map((item, index) => (
              <span key={`size-${index}`} className="px-2 py-1 bg-gray-100 text-sm rounded-full flex items-center">
                Size {item}
                <button
                  onClick={() => handleFilterToggle('sizes', item)}
                  className="ml-1 text-gray-500 hover:text-primary"
                >
                  <FiX size={14} />
                </button>
              </span>
            ))}

            {selectedFilters.colors.map((item, index) => (
              <span key={`color-${index}`} className="px-2 py-1 bg-gray-100 text-sm rounded-full flex items-center">
                Màu {item}
                <button
                  onClick={() => handleFilterToggle('colors', item)}
                  className="ml-1 text-gray-500 hover:text-primary"
                >
                  <FiX size={14} />
                </button>
              </span>
            ))}

            <button
              onClick={clearAllFilters}
              className="text-sm text-primary hover:underline"
            >
              Xóa tất cả
            </button>
          </div>
        )}
    </div>
  );
};

export default ProductFilters;