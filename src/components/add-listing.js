import React, { useEffect, useState } from 'react';
import styles from '../styles/add-listing.scss';
import axios from 'axios';

const AddListing = () => {
    const [state, setState] = useState({
        isRental: null,
        address: null,
        zipCode: null,
        region: null,
        regionId: null,
        city: null,
        price: null,
        area: null,
        bedrooms: null,
        description: null,
        image: null,
        agent: null,
    });

    const [regions, setRegions] = useState([]);
    const [regionsError, setRegionsError] = useState([]);
    const [regionsLoading, setRegionsLoading] = useState([]);

    const [cities, setCities] = useState([]);
    const [citiesError, setCitiesError] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState([]);

    const [agents, setAgents] = useState([]);
    const [agentsError, setAgentsError] = useState([]);
    const [agentsLoading, setAgentsLoading] = useState([]);

    const [filteredCities, setFilteredCitities] = useState([]);


    const handleRegionSelectChange = (event) => {
        setState(prevState => ({
            ...prevState,
            regionId: Number(event.target.value),
        }));
    }

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await axios.get('https://api.real-estate-manager.redberryinternship.ge/api/regions');
                setRegions(response.data);
              } catch (error) {
                setRegionsError(error);
              } finally {
                setRegionsLoading(false);
              }
        };
    
        fetchRegions();
        console.log(regions);
      }, 
    []);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('https://api.real-estate-manager.redberryinternship.ge/api/cities');
                setCities(response.data);
              } catch (error) {
                setCitiesError(error);
              } finally {
                setCitiesLoading(false);
              }
        };
    
        fetchCities();
        const filteredCitiesInner = cities.filter(city => {
            return (
                (city.region_id === state.regionId)
            );
        })

        setFilteredCitities(filteredCitiesInner);
      }, 
    [state.regionId]);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await axios.get('https://api.real-estate-manager.redberryinternship.ge/api/agents', {
                    headers: {
                        'Authorization': 'Bearer 9cfda59e-ab9c-4d44-a3b0-794325f8b2e6'
                    }
                });
                setAgents(response.data);
              } catch (error) {
                setAgentsError(error);
              } finally {
                setAgentsLoading(false);
              }
        };
    
        fetchAgents();
        console.log(agents);
      }, 
    []);

    return (
        <div className="form-container">
            <form action="#" method="POST">
                <div className="is-rental form-group">
                    <label>გარიგების ტიპი</label><br/>
                    <div className='is-rental-radios'>
                        <label for="isRentalFalse">იყიდება</label>
                        <input type="radio" name="isRentalFalse" value="0"/>
                    </div>
                    <div className='is-rental-radios'>
                        <label for="isRentalTrue">ქირავდება</label>
                        <input type="radio" name="isRentalTrue" value="1"/>
                    </div>
                </div>

                <div className="address form-group">
                    <h2>მდებარეობა</h2>
                    <label for="address">მისამართი*</label>
                    <input type="text" id="address" name="address" required/>

                    <label for="zip-code">საფოსტო ინდექსი*</label>
                    <input type="text" id="zip-code" name="zip-code" required/>

                    <label for="region">რეგიონი*</label>
                        {regionsLoading ? (
                            <p>Loading...</p> // TODO: რამე სპინერი
                        ) : (
                            <select id='region' name='region' onChange={handleRegionSelectChange}>
                            {regions.map(region => (
                                <option key={region.id} value={region.id}>{region.name}</option>
                            ))}
                            </select>
                        )}
                    <label for="city">ქალაქი*</label>
                        {regionsLoading ? (
                                <p>Loading...</p> // TODO: რამე სპინერი
                            ) : (
                                <select id='city' name='city'>
                                {filteredCities.map(city => (
                                    <option key={city.id} value={city.name}>{city.name}</option>
                                ))}
                                </select>
                        )}
                </div>

                <div className="listing-details form-group">
                    <h2>ბინის დეტალები</h2>
                    <label for="price">ფასი*</label>
                    <input type="text" id="price" name="price" required/>

                    <label for="area">ფართობი*</label>
                    <input type="text" id="area" name="area" required/>

                    <label for="bedrooms">საძინებლების რაოდენობა*</label>
                    <input type="text" id="bedrooms" name="bedrooms" required/>
                </div>

                <div className="listing-description form-group">
                    <label for="description">დეტალები*</label>
                    <textarea id="description" name="description" rows="4" required></textarea>
                </div>

                <div className="listing-thumbnail form-group">
                    <label for="fileUpload">ატვირთეთ ფოტო*</label>
                    <input type="file" id="fileUpload" name="fileUpload"/>
                </div>

                <div className="listing-agent form-group">
                    <label for="agent">ქმედება</label>
                    {agentsLoading ? (
                        <p>Loading...</p> // TODO: რამე სპინერი
                        ) : (
                            <select id='city' name='city'>
                            {agents.map((agent, index) => (
                                <option key={index} value={agent.id}>{agent.name}</option>
                            ))}
                            </select>
                        )
                    }
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
  };
  
  export default AddListing;