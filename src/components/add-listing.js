import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/add-listing.scss';
import axios from 'axios';
import { FileUploader } from "react-drag-drop-files";
import { validateIfStringNonNumeric, validateIfStringContainsMoreThanWords, checkIfFileLargerThanMegabyte } from '../util/helper';

const AddListing = () => {
    const [state, setState] = useState(() => {
        const cachedState = localStorage.getItem('cachedAddListingState');
        return cachedState ? JSON.parse(cachedState) : {
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
        };
    });

    const [errorState, setErrorState] = useState(() => {
        const cachedErrorState = localStorage.getItem('cachedErrorState');
        return cachedErrorState ? JSON.parse(cachedErrorState) : {
            addressStyle: 'error-holder',
            addressInputStyle: 'form-input',
            addressText: 'მინიმუმ ორი სიმბოლო',
            zipCodeStyle: 'error-holder',
            zipCodeInputStyle: 'form-input',
            zipCodeText: 'მხოლოდ რიცხვები',
            priceStyle: 'error-holder',
            priceInputStyle: 'form-input',
            priceText: 'მხოლოდ რიცხვები',
            areaStyle: 'error-holder',
            areaInputStyle: 'form-input',
            areaText: 'მხოლოდ რიცხვები',
            roomsStyle: 'error-holder',
            roomsInputStyle: 'form-input',
            roomsText: 'მხოლოდ რიცხვები',
            descriptionStyle: 'error-holder',
            descriptionInputStyle: 'form-input',
            descriptionText: 'მინიმუმ 5 სიტყვა',
            imageStyle: 'error-holder',
            imageInputStyle: 'form-input',
            imageText: 'მაქსიმუმ 1mb',
        };
    });

    const [imagePreview, setImagePreview] = useState(() => {
        const cachedImagePreview = localStorage.getItem('cachedImagePreview');
        return cachedImagePreview ? cachedImagePreview : null;
    });

    const fileTypes = ["JPG", "PNG"];

    const [regions, setRegions] = useState([]);
    const [regionsError, setRegionsError] = useState(null);
    const [regionsLoading, setRegionsLoading] = useState(true);

    const [cities, setCities] = useState([]);
    const [citiesError, setCitiesError] = useState(null);
    const [citiesLoading, setCitiesLoading] = useState(true);

    const [agents, setAgents] = useState([]);
    const [agentsError, setAgentsError] = useState(null);
    const [agentsLoading, setAgentsLoading] = useState(true);

    const [filteredCities, setFilteredCitities] = useState(true);

    const citySelectRef = useRef(null);
    const cityLabelRef = useRef(null);

    const addressErrorRef = useRef(null);
    const zipCodeErrorRef = useRef(null);
    const priceErrorRef = useRef(null);
    const areaErrorRef = useRef(null);
    const roomsErrorRef = useRef(null);
    const descriptionErrorRef = useRef(null);
    const imageErrorRef = useRef(null);

    const handleIsRentalChange = (event) => {
        setState(prevState => ({
            ...prevState,
            isRental: Number(event.target.value),
        }));
    }

    const handleAddressChange = (event) => {
        const eventValue = event.target.value;
        if (eventValue.length >= 2){
            setErrorState(prevState => ({
                ...prevState,
                addressStyle: "error-holder correct",
                addressInputStyle: 'form-input',
                addressText: "მინიმუმ 2 სიმბოლო"
            }));
        }
        else {
            setErrorState(prevState => ({
                ...prevState,
                addressStyle: "error-holder validation-error",
                addressInputStyle: 'form-input error-input',
                addressText: "ჩაწერეთ ვალიდური მონაცემები"
            }));
        }
        setState(prevState => ({
            ...prevState,
            address: eventValue,
        }));
    }

    const handleZipCodeChange = (event) => {
        const eventValue = event.target.value;
        if (validateIfStringNonNumeric(eventValue)){
            setErrorState(prevState => ({
                ...prevState,
                zipCodeStyle: "error-holder correct",
                zipCodeInputStyle: 'form-input',
                zipCodeText: "მხოლოდ რიცხვები"
            }));
        }
        else {
            setErrorState(prevState => ({
                ...prevState,
                zipCodeStyle: "error-holder validation-error",
                zipCodeInputStyle: 'form-input error-input',
                zipCodeText: "ჩაწერეთ ვალიდური მონაცემები"
            }));
        }
        setState(prevState => ({
            ...prevState,
            zipCode: eventValue,
        }));
    }

    const handleRegionChange = (event) => {
        setState(prevState => ({
            ...prevState,
            regionId: Number(event.target.value),
            // region: event.target.innerText
        }));
        citySelectRef.current.classList.remove("disabled");
        cityLabelRef.current.classList.remove("disabled");
    }

    const handleCityChange = (event) => {
        setState(prevState => ({
            ...prevState,
            city: Number(event.target.value),
        }));
    }

    const handlePriceChange = (event) => {
        const eventValue = event.target.value;
        if (validateIfStringNonNumeric(eventValue)){
            setState(prevState => ({
                ...prevState,
                price: Number(eventValue),
            }));
            setErrorState(prevState => ({
                ...prevState,
                priceStyle: "error-holder correct",
                priceInputStyle: 'form-input',
                priceText: "მხოლოდ რიცხვები"
            }));
        }
        else {
            setErrorState(prevState => ({
                ...prevState,
                priceStyle: "error-holder validation-error",
                priceInputStyle: 'form-input error-input',
                priceText: "ჩაწერეთ ვალიდური მონაცემები"
            }));
        }
    }

    const handleAreaChange = (event) => {
        const eventValue = event.target.value;
        if (validateIfStringNonNumeric(eventValue)){
            setErrorState(prevState => ({
                ...prevState,
                areaStyle: "error-holder correct",
                areaInputStyle: 'form-input',
                areaText: "მხოლოდ რიცხვები"
            }));
        }
        else {
            setErrorState(prevState => ({
                ...prevState,
                areaStyle: "error-holder validation-error",
                areaInputStyle: 'form-input error-input',
                areaText: "ჩაწერეთ ვალიდური მონაცემები"
            }));
        }
        setState(prevState => ({
            ...prevState,
            area: Number(eventValue),
        }));
    }

    const handleRoomsChange = (event) => {
        const eventValue = event.target.value;
        if (validateIfStringNonNumeric(eventValue)){
            setErrorState(prevState => ({
                ...prevState,
                roomsStyle: "error-holder correct",
                roomsInputStyle: 'form-input',
                roomsText: "მხოლოდ რიცხვები"
            }));
        }
        else {
            setErrorState(prevState => ({
                ...prevState,
                roomsStyle: "error-holder validation-error",
                roomsInputStyle: 'form-input error-input',
                roomsText: "ჩაწერეთ ვალიდური მონაცემები"
            }));
        }
        setState(prevState => ({
            ...prevState,
            bedrooms: Number(eventValue),
        }));
    }

    const handleDesciptionChange = (event) => {
        const eventValue = event.target.value;
        if (validateIfStringContainsMoreThanWords(eventValue, 5)){
            setErrorState(prevState => ({
                ...prevState,
                descriptionStyle: "error-holder correct",
                descriptionInputStyle: 'form-input',
                descriptionText: "მინიმუმ 5 სიტყვა"
            }));
        }
        else {
            setErrorState(prevState => ({
                ...prevState,
                descriptionStyle: "error-holder validation-error",
                descriptionInputStyle: 'form-input error-input',
                descriptionText: "ჩაწერეთ ვალიდური მონაცემები"
            }));
        }
        setState(prevState => ({
            ...prevState,
            description: event.target.value,
        }));
    }

    const handleImageChange = (file) => {
        if (!checkIfFileLargerThanMegabyte(file)){
            setState(prevState => ({
                ...prevState,
                image: file,
            }));
            setImagePreview(URL.createObjectURL(file));
            setErrorState(prevState => ({
                ...prevState,
                imageStyle: "error-holder correct",
                imageInputStyle: 'form-input',
                imageText: "მაქსიმუმ 1mb"
            }));
        }
        else {
            setState(prevState => ({
                ...prevState,
                image: null,
            }));
            setErrorState(prevState => ({
                ...prevState,
                imageStyle: "error-holder validation-error",
                imageInputStyle: 'form-input error-input',
                imageText: "ზომა აღემატება 1mb-ს"
            }));
        }
        
    }

    const handleAgentChange = (event) => {
        setState(prevState => ({
            ...prevState,
            agent: Number(event.target.value),
        }));
    }

    const handleSubmit = () => {
        if (Object.values(errorState).some(value => value.includes('validation-error'))){
            alert("ჩაწერეთ ვალიდური მონაცემები");
        }
        else {
            console.log(state)
            const postData = async () => {
                try {
                  const response = await axios.post('https://api.real-estate-manager.redberryinternship.ge/api/real-estates', {
                    is_rental: state.isRental,
                    address: state.address,
                    zip_code: state.zipCode,
                    region_id: state.regionId,
                    city_id: state.city,
                    price: state.price,
                    area: state.area,
                    bedrooms: state.bedrooms,
                    description: state.description,
                    image: state.image,
                    agent_id: state.agent,
                  },
                  {
                    headers: {
                      'Authorization': 'Bearer 9cfda59e-ab9c-4d44-a3b0-794325f8b2e6',
                      'Content-Type': 'multipart/form-data'
                    },
                  }
                );
                  console.log('Response:', response.data);
                } catch (error) {
                  console.error('Error posting data:', error);
                }
              };
              
              postData();
        }
        console.log(errorState);
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
    [state.regionId, regionsLoading]);

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

    useEffect(() => {
        if (!regionsLoading){
            console.log(addressErrorRef.current.value)
        }
    }, [])

    // მონაცემების შენახვის ლოგიკა
    useEffect(() => {
        localStorage.setItem('cachedAddListingState', JSON.stringify(state));
        localStorage.setItem('cachedImagePreview', imagePreview);
        localStorage.setItem('cachedErrorState', JSON.stringify(errorState));
    }, [state, imagePreview]);

    return (
        <div className="form-container">
            <form action="#" method="POST">
                <div className="is-rental form-group">
                    <label>გარიგების ტიპი</label><br/>
                    <div className='is-rental-radios'>
                        <label for="isRentalFalse">იყიდება</label>
                        <input type="radio" name="isRentalFalse" value="0" onChange={handleIsRentalChange} checked={(
                            () => {
                                if (state.isRental === 0){
                                    return true;
                                }
                                return false;
                            }
                        )()
                        }/>
                    </div>
                    <div className='is-rental-radios'>
                        <label for="isRentalTrue">ქირავდება</label>
                        <input type="radio" name="isRentalTrue" value="1" onChange={handleIsRentalChange} checked={(
                            () => {
                                if (state.isRental === 0){
                                    return false;
                                }
                                return true;
                            }
                        )()
                        }/>
                    </div>
                </div>

                <div className="address form-group">
                    <h2>მდებარეობა</h2>
                    <label for="address">მისამართი*</label>
                    <input type="text" id="address" name="address" className={errorState.addressInputStyle} onChange={handleAddressChange} defaultValue={state.address} required/>
                    <div className={errorState.addressStyle} ref={addressErrorRef}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p className='potential-error-message'>{errorState.addressText}</p>
                    </div>

                    <label for="zip-code">საფოსტო ინდექსი*</label>
                    <input type="text" id="zip-code" name="zip-code" className={errorState.zipCodeInputStyle} onChange={handleZipCodeChange} defaultValue={state.zipCode} required/>
                    <div className={errorState.zipCodeStyle} ref={zipCodeErrorRef}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p className='potential-error-message'>{errorState.zipCodeText}</p>
                    </div>

                    <label for="region">რეგიონი*</label>
                        {regionsLoading ? (
                            <p>Loading...</p> // TODO: რამე სპინერი
                        ) : (
                            <select id='region' name='region' onChange={handleRegionChange}>
                                {/* <option value="" disabled selected>რეგიონი</option> */}
                            {regions.map(region => (
                                <option key={region.id} value={region.id} selected={(
                                    () => {
                                        if (state.regionId === region.id){
                                            return true;
                                        }
                                        return false;
                                    }
                                )()
                                }>{region.name}</option>
                            ))}
                            </select>
                        )}
                    <label for="city" ref={cityLabelRef} className={(
                                    () => {
                                        if (state.regionId === null){
                                            return 'disabled';
                                        }
                                        return '';
                                    }
                                )()}>ქალაქი*</label>
                        {regionsLoading ? (
                                <p>Loading...</p> // TODO: რამე სპინერი
                            ) : (
                                <select id='city' name='city' ref={citySelectRef} onChange={handleCityChange} className={(
                                    () => {
                                        if (state.regionId === null){
                                            return 'disabled';
                                        }
                                        return '';
                                    }
                                )()}>
                                {filteredCities.map(city => (
                                    <option key={city.id} value={city.id} selected={(
                                        () => {
                                            if (state.city === city.id){
                                                return true;
                                            }
                                            return false;
                                        }
                                    )()
                                    }>{city.name}</option>
                                ))}
                                </select>
                        )}
                </div>

                <div className="listing-details form-group">
                    <h2>ბინის დეტალები</h2>
                    <label for="price">ფასი*</label>
                    <input type="text" id="price" name="price" className={errorState.priceInputStyle} onChange={handlePriceChange} defaultValue={state.price} required/>
                    <div className={errorState.priceStyle} ref={priceErrorRef}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p className='potential-error-message'>{errorState.priceText}</p>
                    </div>

                    <label for="area">ფართობი*</label>
                    <input type="text" id="area" name="area" className={errorState.areaInputStyle} onChange={handleAreaChange} defaultValue={state.area} required/>
                    <div className={errorState.areaStyle} ref={areaErrorRef}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p className='potential-error-message'>{errorState.areaText}</p>
                    </div>

                    <label for="bedrooms">საძინებლების რაოდენობა*</label>
                    <input type="text" id="bedrooms" name="bedrooms" className={errorState.roomsInputStyle}  onChange={handleRoomsChange} defaultValue={state.bedrooms} required/>
                    <div className={errorState.roomsStyle} ref={roomsErrorRef}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p className='potential-error-message'>{errorState.roomsText}</p>
                    </div>
                </div>

                <div className="listing-description form-group">
                    <label for="description">დეტალები*</label>
                    <textarea id="description" name="description" rows="4"  className={errorState.descriptionInputStyle} onChange={handleDesciptionChange} defaultValue={state.description} required></textarea>
                    <div className={errorState.descriptionStyle} ref={descriptionErrorRef}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p className='potential-error-message'>{errorState.descriptionText}</p>
                    </div>
                </div>

                <div className="listing-thumbnail form-group">
                    <label for="image">ატვირთეთ ფოტო*</label>
                    <div className='file-upload-holder'>
                        <FileUploader handleChange={handleImageChange} name="image" types={fileTypes} label=''/>
                        <img className="image-preview" width="100px" src={imagePreview}/>
                    </div>
                    <div className={errorState.imageStyle} ref={imageErrorRef}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p className='potential-error-message'>{errorState.imageText}</p>
                    </div>
                    {/* <input type="file" id="fileUpload" name="fileUpload"  onChange={handleImageChange} required/> */}
                </div>

                <div className="listing-agent form-group">
                    <h2>აგენტი</h2>
                    <label for="agent">აირჩიე</label>
                    {agentsLoading ? (
                        <p>Loading...</p> // TODO: რამე სპინერი
                        ) : (
                            <select id='agent' name='agent'  onChange={handleAgentChange}>
                            {agents.map((agent, index) => (
                                <option key={index} value={agent.id} selected={(
                                    () => {
                                        if (state.agent === agent.id){
                                            return true;
                                        }
                                        return false;
                                    }
                                )()
                                }>{agent.name}</option>
                            ))}
                            </select>
                        )
                    }
                </div>

            </form>
            <button type="submit">გაუქმება</button>
            <button type="submit" onClick={() => {handleSubmit()}}>დაამატე ლისტინგი</button>
        </div>
    );
  };
  
  export default AddListing;