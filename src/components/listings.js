import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import ListingCard from './listing-card';
import Filter from './filter';
import styles from '../styles/listings.scss';
import { useNavigate } from 'react-router-dom';

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
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const updateFilterState = (newFilterState) => {
        setFilterState(newFilterState);
    };

    const handleRoutingToAddListingPage= () => {
        navigate(`/add-listing`);
    };

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
                    (filterState.minPrice === null || Number(listing.price) >= Number(filterState.minPrice)) &&
                    (filterState.maxPrice === null || Number(listing.price) <= Number(filterState.maxPrice)) &&
                    (filterState.minArea === null || Number(listing.area) >= Number(filterState.minArea)) &&
                    (filterState.maxArea === null || Number(listing.area) <= Number(filterState.maxArea)) &&
                    (filterState.rooms === null || Number(listing.bedrooms) === Number(filterState.rooms)) &&
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
            <Filter filterState={filterState} updateFilterState={updateFilterState} handleRoutingToAddListingPage={handleRoutingToAddListingPage}/>
            <div id='listings-holder'>
                {filteredData.length === 0 ? (
                    <p id='not-found-msg'>აღნიშნული მონაცემებით განცხადება არ იძებნება</p>
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
                            id={listing.id}
                        />
                    ))
                )}
            </div>
        </main>
    );
};

export default Listings;