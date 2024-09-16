import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import ListingCard from './listing-card';
import Filter from './filter';
import styles from '../styles/listings.scss';

const Listings = () => {
    const [filterState, setFilterState] = useState(() => {
        const cachedState = localStorage.getItem('cachedState');
        return cachedState ? JSON.parse(cachedState) : {
            region: [],
            minPrice: null,
            maxPrice: null,
            minArea: null,
            maxArea: null,
            rooms: null
        };
    });

    const updateFilterState = (newFilterState) => {
        setFilterState(newFilterState);
        console.log(filterState);
    };

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.real-estate-manager.redberryinternship.ge/api/real-estates', {
                    headers: {
                        'Authorization': 'Bearer 9cfda59e-ab9c-4d44-a3b0-794325f8b2e6'
                    }
                });
                setData(response.data);
                console.log(data);
              } catch (error) {
                setError(error);
              } finally {
                setLoading(false);
              }
        };
    
        fetchData();
      }, 
    []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <main id='listings-page'>
            <Filter filterState={filterState} updateFilterState={updateFilterState}/>
            <div id='listings-holder'>
                {data.map((listing, index) => (
                <ListingCard key={index}
                address={listing.address}
                area={listing.area}
                bedrooms={listing.bedrooms}
                city={listing.city.name}
                zipCode={listing.zip_code}
                price={listing.price}
                image={listing.image}
                isRental={listing.isRental}
                />
                ))}
            </div>
        </main>
    );
};

export default Listings;