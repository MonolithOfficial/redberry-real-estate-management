import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/add-listing.scss';
import axios from 'axios';
import { FileUploader } from "react-drag-drop-files";
import {
    validateIfStringNonNumeric,
    validateIfStringContainsMoreThanWords,
    checkIfFileLargerThanMegabyte,
    isAnyInputEmpty,
    validateFileExtension,
    saveFileToLocalStorage,
    base64ToFile
} from '../util/helper';
import { useNavigate } from 'react-router-dom';

const AddListing = () => {
    const [state, setState] = useState(() => {
        const cachedState = localStorage.getItem('cachedAddListingState');
        return cachedState ? JSON.parse(cachedState) : {
            isRental: 0,
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

    // const fileTypes = ["JPG", "PNG"];

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
    const imagePreviewRef = useRef(null);
    const deleteImageRef = useRef(null);
    const imagePreviewHolderRef = useRef(null);

    const navigate = useNavigate();
    const handleRoutingToMainPage = () => {
        navigate(`/`);
    };

    const handleIsRentalChange = (event) => {
        setState(prevState => ({
            ...prevState,
            isRental: Number(event.target.value),
        }));
    }

    const handleAddressChange = (event) => {
        const eventValue = event.target.value;
        if (eventValue.length >= 2) {
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
        if (validateIfStringNonNumeric(eventValue)) {
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
        }));
        citySelectRef.current.classList.remove("disabled");
        cityLabelRef.current.classList.remove("disabled");
        console.log(state.regionId)
    }

    const handleCityChange = (event) => {
        setState(prevState => ({
            ...prevState,
            city: Number(event.target.value),
        }));
    }

    const handlePriceChange = (event) => {
        const eventValue = event.target.value;
        if (validateIfStringNonNumeric(eventValue)) {
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
        if (validateIfStringNonNumeric(eventValue)) {
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
        if (validateIfStringNonNumeric(eventValue)) {
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
        if (validateIfStringContainsMoreThanWords(eventValue, 5)) {
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
        const isLargerThanOneMb = checkIfFileLargerThanMegabyte(file);
        const isValidFile = validateFileExtension(file);
        if (!isLargerThanOneMb && isValidFile) {
            saveFileToLocalStorage(file, "cachedBase64ListingImage", "cachedAddListingImageName", file.name);
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
            imagePreviewRef.current.style.display = "block";
            deleteImageRef.current.style.display = "block";
            imagePreviewHolderRef.current.style.zIndex = "3";
        }
        else {
            setState(prevState => ({
                ...prevState,
                image: null,
            }));
            setImagePreview(null);
            if (isLargerThanOneMb && isValidFile) {
                setErrorState(prevState => ({
                    ...prevState,
                    imageStyle: "error-holder validation-error",
                    imageInputStyle: 'form-input error-input',
                    imageText: "ზომა აღემატება 1mb-ს"
                }));
                imagePreviewRef.current.style.display = "none";
            }
            if (!isLargerThanOneMb && !isValidFile) {
                setErrorState(prevState => ({
                    ...prevState,
                    imageStyle: "error-holder validation-error",
                    imageInputStyle: 'form-input error-input',
                    imageText: "დაშვებულია მხოლოდ PNG, JPG და JPEG ფორმატები"
                }));
                imagePreviewRef.current.style.display = "none";
            }
            deleteImageRef.current.style.display = "none";
            imagePreviewHolderRef.current.style.zIndex = "0";
        }

    }

    const handleAgentChange = (event) => {
        setState(prevState => ({
            ...prevState,
            agent: Number(event.target.value),
        }));
    }

    const handleDeleteThumbnail = () => {
        setState(prevState => ({
            ...prevState,
            image: null,
        }));
        setImagePreview(null);
        localStorage.removeItem('cachedBase64ListingImage');
        localStorage.removeItem('cachedAddListingImageName');
        imagePreviewRef.current.style.display = "none";
        deleteImageRef.current.style.display = "none";
        imagePreviewHolderRef.current.style.zIndex = "0";
    }

    const handleCancel = () => {
        localStorage.removeItem('cachedAddListingState');
        localStorage.removeItem('cachedImagePreview');
        localStorage.removeItem('cachedErrorState');
        localStorage.removeItem('cachedBase64ListingImage');
        localStorage.removeItem('cachedAddListingImageName');
        handleRoutingToMainPage();
    }

    const handleSubmit = () => {
        console.log(state)
        const form = document.querySelector('#add-listing-form');
        if (state.regionId === null) {
            alert("აირჩიეთ რეგიონი.");
            return;
        }
        if (state.agent === null) {
            alert("აირჩიეთ აგენტი.");
            return;
        }
        if (state.city === null) {
            alert("აირჩიეთ ქალაქი.");
            return;
        }
        if (isAnyInputEmpty(form)) {
            alert("ჩაწერეთ ვალიდური მონაცემები.");
            return;
        }
        if (state.image === null) {
            alert("ატვირთეთ სურათი.");
            return;
        }
        if (Object.values(errorState).some(value => value.includes('validation-error'))) {
            alert("ჩაწერეთ ვალიდური მონაცემები.");
            return;
        }

        else {
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
                    if (response.status === 201) {
                        localStorage.removeItem('cachedAddListingState');
                        localStorage.removeItem('cachedImagePreview');
                        localStorage.removeItem('cachedErrorState');
                        handleRoutingToMainPage();
                    }
                } catch (error) {
                    console.error('Error posting data:', error);
                }
            };

            postData();
        }
        console.log(state);
    }

    useEffect(() => {
        const cachedBase64ListingImage = localStorage.getItem('cachedBase64ListingImage');
        const cachedAddListingImageName = localStorage.getItem('cachedAddListingImageName');
        if (cachedBase64ListingImage && cachedAddListingImageName) {
            const recoveredFile = base64ToFile(cachedBase64ListingImage, cachedAddListingImageName);
            setState(prevState => ({
                ...prevState,
                image: recoveredFile,
            }));
            setImagePreview(URL.createObjectURL(recoveredFile));
        }
    }, []);

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
    },
        []);

    // მონაცემების შენახვის ლოგიკა
    useEffect(() => {
        localStorage.setItem('cachedAddListingState', JSON.stringify(state));
        localStorage.setItem('cachedImagePreview', imagePreview);
        localStorage.setItem('cachedErrorState', JSON.stringify(errorState));
    }, [state, imagePreview]);

    useEffect(() => {
        const previewImage = document.querySelector('.image-preview');

        previewImage.querySelector("img").onerror = function () {
            this.style.display = 'none';
            imagePreviewHolderRef.current.style.zIndex = "0";
            deleteImageRef.current.style.display = "none";
        };
        if (state.image === null) {
            deleteImageRef.current.style.display = "none";
        }

    }, []);

    return (
        <div className="form-container">
            <h1>ლისტინგის დამატება</h1>
            <form id='add-listing-form' action="#" method="POST">
                <h3>გარიგების ტიპი</h3>
                <div className="is-rental-holder form-group">
                    <div className='radios-holder'>
                        <div className='is-rental-radios'>
                            <input type="radio" name="isRentalFalse" value="0" onChange={handleIsRentalChange} checked={(
                                () => {
                                    if (state.isRental === 0 || state.isRental === null) {
                                        return true;
                                    }
                                    return false;
                                }
                            )()
                            } />
                            <label for="isRentalFalse">იყიდება</label>
                        </div>
                        <div className='is-rental-radios'>
                            <input type="radio" name="isRentalTrue" value="1" onChange={handleIsRentalChange} checked={(
                                () => {
                                    if (state.isRental === 1) {
                                        return true;
                                    }
                                    return false;
                                }
                            )()
                            } />
                            <label for="isRentalTrue">ქირავდება</label>
                        </div>
                    </div>
                </div>

                <h3>მდებარეობა</h3>
                <div className="address-form-group">
                    <div className='address-input-holder'>
                        <label for="address">მისამართი*</label>
                        <input type="text" id="address" name="address" className={errorState.addressInputStyle} onChange={handleAddressChange} defaultValue={state.address} required />
                        <div className={errorState.addressStyle} ref={addressErrorRef}>
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p className='potential-error-message'>{errorState.addressText}</p>
                        </div>
                    </div>
                    <div className='zip-code-input-holder'>
                        <label for="zip-code">საფოსტო ინდექსი*</label>
                        <input type="text" id="zip-code" name="zip-code" className={errorState.zipCodeInputStyle} onChange={handleZipCodeChange} defaultValue={state.zipCode} required />
                        <div className={errorState.zipCodeStyle} ref={zipCodeErrorRef}>
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p className='potential-error-message'>{errorState.zipCodeText}</p>
                        </div>
                    </div>
                    <div className='region-input-holder'>
                        <label for="region">რეგიონი*</label>
                        {regionsLoading ? (
                            <p>Loading...</p> // TODO: რამე სპინერი
                        ) : (
                            <select id='region' name='region' onChange={handleRegionChange}>
                                <option value="" disabled selected>რეგიონი</option>
                                {regions.map((region, index) => (
                                    <option key={index} value={region.id}
                                        selected={(
                                            () => {
                                                if (state.regionId === region.id) {
                                                    return true;
                                                }
                                                return false;
                                            }
                                        )()
                                        }
                                    >{region.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className='city-input-holder'>
                        <label for="city" ref={cityLabelRef} className={(
                            () => {
                                if (state.regionId === null) {
                                    return 'disabled';
                                }
                                return '';
                            }
                        )()}>ქალაქი*</label>
                        {regionsLoading ? (
                            <p>Loading...</p> // TODO: რამე სპინერი
                        ) : (
                            <select id='city' name='city' ref={citySelectRef} onChange={handleCityChange}
                                className={(
                                    () => {
                                        if (state.regionId === null) {
                                            return 'disabled';
                                        }
                                        return '';
                                    }
                                )()}>
                                <option value="" disabled selected>ქალაქი</option>
                                {filteredCities.map((city, index) => (
                                    <option key={index} value={city.id}>{city.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <h3>ბინის დეტალები</h3>
                <div className="listing-details form-group">
                    <div className='price-input-holder'>
                        <label for="price">ფასი*</label>
                        <input type="text" id="price" name="price" className={errorState.priceInputStyle} onChange={handlePriceChange} defaultValue={state.price} required />
                        <div className={errorState.priceStyle} ref={priceErrorRef}>
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p className='potential-error-message'>{errorState.priceText}</p>
                        </div>
                    </div>
                    <div className='area-input-holder'>
                        <label for="area">ფართობი*</label>
                        <input type="text" id="area" name="area" className={errorState.areaInputStyle} onChange={handleAreaChange} defaultValue={state.area} required />
                        <div className={errorState.areaStyle} ref={areaErrorRef}>
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p className='potential-error-message'>{errorState.areaText}</p>
                        </div>
                    </div>
                    <div className='rooms-input-holder'>
                        <label for="bedrooms">საძინებლების რაოდენობა*</label>
                        <input type="text" id="bedrooms" name="bedrooms" className={errorState.roomsInputStyle} onChange={handleRoomsChange} defaultValue={state.bedrooms} required />
                        <div className={errorState.roomsStyle} ref={roomsErrorRef}>
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p className='potential-error-message'>{errorState.roomsText}</p>
                        </div>
                    </div>
                </div>

                <div className="listing-description">
                    <div className='description-input-holder'>
                        <label for="description">დეტალები*</label>
                        <textarea id="description" name="description" rows="4" className={errorState.descriptionInputStyle} onChange={handleDesciptionChange} defaultValue={state.description} required></textarea>
                        <div className={errorState.descriptionStyle} ref={descriptionErrorRef}>
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p className='potential-error-message'>{errorState.descriptionText}</p>
                        </div>
                    </div>
                </div>

                <div className="listing-thumbnail">
                    <div className='image-input-holder'>
                        <label for="image">ატვირთეთ ფოტო*</label>
                        <div className='file-upload-holder'>
                            <FileUploader handleChange={handleImageChange} name="image" required />
                            <div className='image-preview' ref={imagePreviewHolderRef}>
                                <img src={imagePreview} ref={imagePreviewRef} />
                                <svg ref={deleteImageRef} onClick={() => handleDeleteThumbnail()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="11.5" fill="white" stroke="currentColor" />
                                    <path d="M6.75 8.5H7.91667H17.25" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M16.0834 8.50033V16.667C16.0834 16.9764 15.9605 17.2732 15.7417 17.492C15.5229 17.7107 15.2262 17.8337 14.9167 17.8337H9.08341C8.774 17.8337 8.47725 17.7107 8.25846 17.492C8.03966 17.2732 7.91675 16.9764 7.91675 16.667V8.50033M9.66675 8.50033V7.33366C9.66675 7.02424 9.78966 6.72749 10.0085 6.5087C10.2272 6.28991 10.524 6.16699 10.8334 6.16699H13.1667C13.4762 6.16699 13.7729 6.28991 13.9917 6.5087C14.2105 6.72749 14.3334 7.02424 14.3334 7.33366V8.50033" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M10.8333 11.417V14.917" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M13.1667 11.417V14.917" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <img className="add-image" src="/images/plus.png" />
                        </div>
                        <div className={errorState.imageStyle} ref={imageErrorRef}>
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 1.40918L3.125 9.591L0 5.87199" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p className='potential-error-message'>{errorState.imageText}</p>
                        </div>
                    </div>
                </div>

                <h3>აგენტი</h3>
                <div className="listing-agent form-group">
                    <div className='agent-input-holder'>
                        <label for="agent">აირჩიე</label>
                        {agentsLoading ? (
                            <p>Loading...</p> // TODO: რამე სპინერი
                        ) : (
                            <select id='agent' name='agent' onChange={handleAgentChange}>
                                <option value="" disabled selected>აგენტი</option>
                                {agents.map((agent, index) => (
                                    <option key={index} value={agent.id}>{agent.name}</option>
                                ))}
                            </select>
                        )
                        }
                    </div>
                </div>
            </form>

            <div className='add-listing-buttons'>
                <button id="cancel-btn" onClick={() => { handleCancel() }}>გაუქმება</button>
                <button id="submit-btn" onClick={() => { handleSubmit() }}>დაამატე ლისტინგი</button>
            </div>
        </div>
    );
};

export default AddListing;