import PreviousSearches from "../components/PreviousSearches";
import FridgeCard from "../components/FridgeCard";

import React, { useEffect, useState } from 'react';

export default function Recepies(){
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedProductName, setSelectedProductName] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8081/products/productsShow', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                        'Content-Type': 'application/json'
                    },
                });
        
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
        
                const data = await response.json();
                console.log(data);
                setProducts(data.map(product => ({
                    id_product: product.id_product,
                    title: product.name_product,
                    image: product.base64CodIamgeProduct // Asigură-te că numele propriețății este corect
                })));
            } catch (error) {
                console.error('Fetch error:', error);
                setError(`Failed to fetch: ${error.message}`);
            }
        };

        fetchProducts();
    }, []);

    const onProductSelect = (productName) => {
        setSelectedProductName(productName);
    };
    const displayedProducts = selectedProductName
    ? products.filter(product => product.title === selectedProductName)
    : products;

    if (error) {
        return <div>Error: {error}</div>; // Afisăm eroarea în cazul în care există
    }

    return (
        <div>
            <PreviousSearches onProductSelect={onProductSelect} />
            <div className="myfridge-container">
                {displayedProducts.map((product, index) => (
                    <FridgeCard key={index} product={product}/>
                ))}
            </div>
        </div>
    );
}
