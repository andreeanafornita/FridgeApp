import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

export default function PreviousSearches({onProductSelect}){
  
  const [searchOptions, setSearchOptions] = useState([]);
  const [previousSearches, setPreviousSearches] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
 
  useEffect(() => {
    const loadOptions = async () => {
      const response = await fetch('http://localhost:8081/products/productNames', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      const productNames = await response.json();
      const options = productNames.map(name => ({ label: name, value: name }));
      // Adaugă opțiunea "Another..."
      options.push({ label: 'Another...', value: 'another' });
      setSearchOptions(options);
    };

    loadOptions();
  }, []);

// Încărcarea căutărilor anterioare
useEffect(() => {
  const loadPreviousSearches = async () => {
    try {
      const response = await fetch('http://localhost:8081/previousSearches/getsearches', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      const data = await response.json();
      console.log('Previous searches data:', data);
  // If the data is present and the array is not empty, update the state
  if (data && data.length > 0) {
    setPreviousSearches(data);
  } else {
    // Handle the case where no previous searches are found
    setPreviousSearches(["You didn't select any product yet"]);
  }
} catch (error) {
  console.error('Failed to load previous searches:', error);
}
};

// Call the function to load previous searches
loadPreviousSearches();
}, []);



const handleSearchClick = async (searchValue) => {
  console.log('Sending search for:', searchValue || inputValue);
    const keyword = searchValue || inputValue; 
  try {
    const response = await fetch('http://localhost:8081/previousSearches/searches', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ keyword: keyword })
    });

    if (response.ok) {
      let updatedSearches = await response.json();
      console.log('Updated searches received:', updatedSearches);
      if (updatedSearches.length > 10) {
        updatedSearches = updatedSearches.slice(0, 10); // Păstrează doar primele 10 elemente
      }
      setPreviousSearches(updatedSearches);
    } else {
      throw new Error('Failed to add search');
    }
    
  } catch (error) {
    console.error('Failed to handle search:', error);
  }
};

const handleInputChange = newValue => {
  setInputValue(newValue.value);
};
const handleSelection = selectedOption => {
  console.log('Product selected:', selectedOption.value);
  if (selectedOption.value === 'another') {
    window.location.href = '/productSuggestion';
  } else {
    onProductSelect(selectedOption.value);
    handleSearchClick(selectedOption.value);
  }
};

return (
  <div className="previous-searches section">
  <h2>Previous Searches</h2>
  <div className="previous-searches-container">
  {previousSearches.length > 0 && previousSearches[0] !== "You didn't select any product yet" ?
    previousSearches.map((search, index) => (
      <div key={index} className="search-item">{search.keyword_search || search}</div>
    )) :
    <p>{previousSearches[0]}</p> // Check if the condition for displaying this message is correct
  }
</div>

    <div className="search-box">
      <Select
        options={searchOptions}
        onChange={handleSelection}
        onInputChange={handleInputChange}
        placeholder="Search for a product..."
        noOptionsMessage={() => 'No products found'}
        isLoading={!searchOptions.length}
      />
      <button className="btn" onClick={() => handleSearchClick(inputValue)}>
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  </div>
);
}