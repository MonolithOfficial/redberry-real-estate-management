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
    };

    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
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

    useEffect(() => {
        if (!loading) {
            const newFilteredData = data.filter(listing => {
                console.log(listing.price);
                console.log(filterState.minPrice);
                return (
                    (Number(listing.price) >= Number(filterState.minPrice)) &&
                    (Number(listing.price) <= Number(filterState.maxPrice)) &&
                    (Number(listing.area) >= Number(filterState.minArea)) &&
                    (Number(listing.area) <= Number(filterState.maxArea)) &&
                    (Number(listing.bedrooms) === Number(filterState.rooms)) &&
                    (filterState.region.length === 0 || filterState.region.includes(listing.city.region.name))
                );
            });

            setFilteredData(newFilteredData);
        }
    }, [filterState, data, loading]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    console.log(data)
    console.log(filteredData);

    return (
        <main id='listings-page'>
            <Filter filterState={filterState} updateFilterState={updateFilterState}/>
            <div id='listings-holder'>
                {filteredData.length === 0 ? (
                    <h3>Loading</h3>
                ) : (
                    filteredData.map((listing, index) => (
                        <ListingCard
                            key={index}
                            address={listing.address}
                            area={listing.area}
                            bedrooms={listing.bedrooms}
                            city={listing.city.name}
                            zipCode={listing.zip_code}
                            price={listing.price}
                            image={listing.image}
                            isRental={listing.isRental}
                        />
                    ))
                )}
            </div>
        </main>
    );
};

export default Listings;