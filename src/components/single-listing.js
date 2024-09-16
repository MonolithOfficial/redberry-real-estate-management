import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';

const SingleListing = () => {
    const [estate, setEstate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    // const location = useLocation();
    // const { address, area, bedrooms, city, zipCode, price, image, isRental, description, agentId } = location.state || {};

    useEffect(() => {
        const fetchEstate = async () => {
            try {
                const response = await axios.get(`https://api.real-estate-manager.redberryinternship.ge/api/real-estates/${id}`, {
                    headers: {
                        'Authorization': 'Bearer 9cfda59e-ab9c-4d44-a3b0-794325f8b2e6'
                    }
                });
                setEstate(response.data);
              } catch (error) {
                setError(error);
              } finally {
                setLoading(false);
              }
        };
    
        fetchEstate();
      }, 
    []);

    return (
    <div id='listing-page'>
        <div id='listing-info-holder'>
            <div id='back-button-holder'>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.9428 26.2765C16.4221 26.7972 15.5779 26.7972 15.0572 26.2765L5.72385 16.9431C5.20315 16.4224 5.20315 15.5782 5.72385 15.0575L15.0572 5.72418C15.5779 5.20349 16.4221 5.20349 16.9428 5.72418C17.4635 6.24488 17.4635 7.0891 16.9428 7.6098L9.88561 14.667H25.3333C26.0697 14.667 26.6667 15.2639 26.6667 16.0003C26.6667 16.7367 26.0697 17.3337 25.3333 17.3337H9.88561L16.9428 24.3909C17.4635 24.9115 17.4635 25.7558 16.9428 26.2765Z" fill="#021526"/>
                </svg>
            </div>
            <div id='listing-info'>
                <div id='listing-section'>
                    <div className='picture'>
                        <img src={estate.image} />
                        <p className='isRental'>{estate.is_rental}</p>
                    </div>
                    <div className='info'>
                        <h2 className='price'>{estate.price} ₾</h2>
                        <h2 className='address'>{estate.address}</h2>
                        <h2 className='area'>ფართი {estate.area}</h2>
                        <h2 className='bedrooms'>საძინებელი {estate.bedrooms}</h2>
                        <h2 className='zip-code'>საფოსტო ინდექსი {estate.zip_code}</h2>
                        <p className='description'>{estate.description}</p>
                        <div id='agent-info'>
                            <div className='thumb-name-holder'>
                                <div className='thumb-holder'>
                                    <img src={estate.agent.avatar} />
                                </div>
                                <div className='name-holder'>
                                    <h3 className='name'>{estate.agent.name}</h3>
                                    <h4 className='agent'>აგენტი</h4>
                                </div>
                            </div>
                            <div className='contacts'>
                                <p className='email'>{estate.agent.email}</p>
                                <p className='phone'>{estate.agent.phone}</p>
                            </div>
                        </div>
                        <button id='delete-listing'>ლისტინგის წაშლა</button>
                    </div>
                </div>
                <p id='publication-date'>გამოქვეყნების თარიღი 08/08/24</p>
            </div>
        </div>
        <div id='recommendations-holder'>
            <h1>ბინები მსგავს ლოკაციაზე</h1>
            <h1>SLIDER</h1>
        </div>
    </div>
    );
  };
  
  export default SingleListing;