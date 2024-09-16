import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../styles/filter.scss';
import userEvent from '@testing-library/user-event';
import TagBar from './tag-bar';


const Filter = ({ filterState, updateFilterState }) => {
    // შვილობილი კომპონენტიდან სთეითის მოდიფიცირების ლოგიკა
    const removeStateProperty = (property) => {
        updateFilterState(prevState => {
            let updatedValue;
            switch (property) {
              case 'region':
                updatedValue = [];
                break;
              default:
                updatedValue = null;
                break;
            }
            return { ...prevState, [property]: updatedValue };
          });
    };

    // სპეციფიური რეგიონის ამოშლა ფილტრიდან
    const removeRegion = (regionToRemove) => {
        updateFilterState(prevState => ({
          ...prevState,
          region: prevState.region.filter(region => region !== regionToRemove)
        }));
    };

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRegionActive, setIsRegionActive] = useState(false);
    const [isPriceActive, setIsPriceActive] = useState(false);
    const [isAreaActive, setIsAreaActive] = useState(false);
    const [isRoomsActive, setIsRoomsActive] = useState(false);

    const regionSelectRef = useRef(null);
    const regionLabelRef = useRef(null);
    const regionListRef = useRef(null);
    const priceRangeRef = useRef(null);
    const priceLabelRef = useRef(null);
    const minPriceInputRef = useRef(null);
    const maxPriceInputRef = useRef(null);
    const priceErrorRef = useRef(null);
    const areaRangeRef = useRef(null);
    const areaLabelRef = useRef(null);
    const minAreaInputRef = useRef(null);
    const maxAreaInputRef = useRef(null);
    const areaErrorRef = useRef(null);
    const roomsSelectRef = useRef(null);
    const roomsLabelRef = useRef(null);
    const roomsInputRef = useRef(null);

    // რეგიონი
    const handleClickOutsideRegionSelect = (event) => {
        if (regionSelectRef.current && !regionSelectRef.current.contains(event.target) && !regionLabelRef.current.contains(event.target)){
            setIsRegionActive(false);
        }
    }

    const validateRegion = () => {
        const checkedRegionCheckboxes = regionListRef.current.querySelectorAll('input[type="checkbox"]:checked');
        const checkedRegionLabels = [];
    
        checkedRegionCheckboxes.forEach(checkbox => {
            const label = document.querySelector(`label[for="${checkbox.id}"]`);
            if (label) {
                checkedRegionLabels.push(label.textContent.trim());
            }
        });
        updateFilterState(({
            ...filterState,
            region: checkedRegionLabels,
        }));
        setIsRegionActive(false);
    }

    // ფასი
    const handleClickOutsidePriceRange = (event) => {
        if (priceRangeRef.current && !priceRangeRef.current.contains(event.target) && !priceLabelRef.current.contains(event.target)){
            setIsPriceActive(false);
        }
    }

    const handleMinPricePresetClick = (event) => {
        if (event.target.classList.contains('min-price-preset')){
            minPriceInputRef.current.value = event.target.innerText.replace("₾", "")
        }
    }

    const handleMaxPricePresetClick = (event) => {
        if (event.target.classList.contains('max-price-preset')){
            maxPriceInputRef.current.value = event.target.innerText.replace("₾", "")
        }
    }

    const validatePriceRange = () => {
        if (Number(maxPriceInputRef.current.value.replace(",", "")) < Number(minPriceInputRef.current.value.replace(",", ""))){
            console.log("შეცდომა");
            priceErrorRef.current.classList.add("active");
            minPriceInputRef.current.classList.add("error-input");
            maxPriceInputRef.current.classList.add("error-input");
        }
        else {
            const minPrice = minPriceInputRef.current.value.trim();
            const maxPrice = maxPriceInputRef.current.value.trim();

            updateFilterState(prevState => ({
                ...prevState,
                minPrice: minPrice === "" ? null : minPrice.replace(",", ""),
                maxPrice: maxPrice === "" ? null : maxPrice.replace(",", "")
            }));
            
            priceErrorRef.current.classList.remove("active");
            minPriceInputRef.current.classList.remove("error-input");
            maxPriceInputRef.current.classList.remove("error-input");
            setIsPriceActive(false);
        }
    }

    // ფართობი
    const handleClickOutsideAreaRange = (event) => {
        if (areaRangeRef.current && !areaRangeRef.current.contains(event.target) && !areaLabelRef.current.contains(event.target)){
            setIsAreaActive(false);
        }
    }

    const handleMinAreaPresetClick = (event) => {
        if (event.target.classList.contains('min-area-preset')){
            minAreaInputRef.current.value = event.target.innerText.replace("მ²", "");
        }
    }

    const handleMaxAreaPresetClick = (event) => {
        if (event.target.classList.contains('max-area-preset')){
            maxAreaInputRef.current.value = event.target.innerText.replace("მ²", "");
        }
    }

    const validateAreaRange = () => {
        if (Number(maxAreaInputRef.current.value.replace(",", "")) < Number(minAreaInputRef.current.value.replace(",", ""))){
            console.log("შეცდომა");
            areaErrorRef.current.classList.add("active");
            minAreaInputRef.current.classList.add("error-input");
            maxAreaInputRef.current.classList.add("error-input");
        }
        else {
            updateFilterState(prevState => ({
                ...prevState,
                minArea: minAreaInputRef.current.value,
                maxArea: maxAreaInputRef.current.value
            }));
            areaErrorRef.current.classList.remove("active");
            minAreaInputRef.current.classList.remove("error-input");
            maxAreaInputRef.current.classList.remove("error-input");
            setIsAreaActive(false);
        }
    }

    // ოთახები
    const handleClickOutsideRooms = (event) => {
        if (roomsSelectRef.current && !roomsSelectRef.current.contains(event.target) && !roomsLabelRef.current.contains(event.target)){
            setIsRoomsActive(false);
        }
    }

    const validateRooms = () => {
        updateFilterState(prevState => ({
            ...prevState,
            rooms: roomsInputRef.current.value
        }));
        setIsRoomsActive(false);
    };

    // მონაცემების შენახვის ლოგიკა
    useEffect(() => {
        localStorage.setItem('cachedState', JSON.stringify(filterState));
    }, [filterState]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideRegionSelect);
        document.addEventListener('mousedown', handleClickOutsidePriceRange);
        document.addEventListener('mousedown', handleMinPricePresetClick);
        document.addEventListener('mousedown', handleMaxPricePresetClick);
        document.addEventListener('mousedown', handleMinAreaPresetClick);
        document.addEventListener('mousedown', handleMaxAreaPresetClick);
        document.addEventListener('mousedown', handleClickOutsideAreaRange);
        document.addEventListener('mousedown', handleClickOutsideRooms);
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideRegionSelect);
            document.removeEventListener('mousedown', handleClickOutsidePriceRange);
            document.removeEventListener('mousedown', handleMinPricePresetClick);
            document.removeEventListener('mousedown', handleMaxPricePresetClick);
            document.removeEventListener('mousedown', handleMinAreaPresetClick);
            document.removeEventListener('mousedown', handleMaxAreaPresetClick);
            document.removeEventListener('mousedown', handleClickOutsideAreaRange);
            document.removeEventListener('mousedown', handleClickOutsideRooms);
        };
      }, []);

    const handleRegionToggle = () => {
        setIsRegionActive(!isRegionActive);
        setIsPriceActive(false);
        setIsAreaActive(false);
        setIsRoomsActive(false);
    };

    const handlePriceToggle = () => {
        setIsPriceActive(!isPriceActive);
        setIsRegionActive(false);
        setIsAreaActive(false);
        setIsRoomsActive(false);
    };

    const handleAreaToggle = () => {
        setIsAreaActive(!isAreaActive);
        setIsPriceActive(false);
        setIsRegionActive(false);
        setIsRoomsActive(false);
    };

    const handleRoomsToggle = () => {
        setIsRoomsActive(!isRoomsActive);
        setIsPriceActive(false);
        setIsAreaActive(false);
        setIsRegionActive(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.real-estate-manager.redberryinternship.ge/api/regions', {
                    // headers: {
                    //     'Authorization': 'Bearer 9cfda59e-ab9c-4d44-a3b0-794325f8b2e6'
                    // }
                });
                setData(response.data);
              } catch (error) {
                setError(error);
              } finally {
                setLoading(false);
              }
        };
    
        fetchData();
      }, 
    []);

    // console.log(state);

    return (
        <div className='filter-holder'>
            <div id='filter'>
                <ul id='filter-options'>
                    <li>
                        <div className='region'>
                            <div className='region-label' ref={regionLabelRef} onClick={handleRegionToggle}>
                                <h2>რეგიონი</h2>
                                <img id='region-down-arrow' src='/images/down-icon.svg' className={`box ${isRegionActive ? 'active' : ''}`}/>
                                <img id='region-up-arrow'src='/images/up-icon.svg' className={`box ${isRegionActive ? 'active' : ''}`}/>
                            </div>
                            <div id='region-select' ref={regionSelectRef} className={`box ${isRegionActive ? 'active' : ''}`}>
                                <h2>რეგიონის მიხედვით</h2>
                                {loading ? (
                                    <p>Loading...</p> // TODO: რამე სპინერი
                                ) : error ? (
                                    <p>Error: {error.message}</p> 
                                ) : (
                                    <ul ref={regionListRef}>
                                    {data.map(region => (
                                        <li key={region.id}>
                                            <input type="checkbox" id={region.name} name={region.name} value={region.name} />
                                            <label htmlFor={region.name}>{region.name}</label>
                                        </li>
                                    ))}
                                    </ul>
                                )}
                                <div className='select-region-btn-holder'>
                                    <button id='select-region-btn' className='select-btn' onClick={validateRegion}>არჩევა</button>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className='price'>
                            <div className='price-label' ref={priceLabelRef} onClick={handlePriceToggle}>
                                <h2>საფასო კატეგორია</h2>
                                <img id='price-down-arrow' src='/images/down-icon.svg' className={`box ${isPriceActive ? 'active' : ''}`}/>
                                <img id='price-up-arrow'src='/images/up-icon.svg' className={`box ${isPriceActive ? 'active' : ''}`}/>
                            </div>
                            <div id='price-range' ref={priceRangeRef} className={`box ${isPriceActive ? 'active' : ''}`}>
                                <h2>ფასის მიხედვით</h2>
                                <div id='price-presets'>
                                    <div id='min-preset'>
                                        <div className='price-input-wrapper'>
                                            <input id='min-price' name='min-price' placeholder='დან' ref={minPriceInputRef}/>
                                        </div>
                                        <h4 id='price-error' ref={priceErrorRef}>ჩაწერეთ ვალიდური მონაცემები</h4>
                                        <h3>მინ. ფასი</h3>
                                        <ul>
                                            <li className='min-price-preset'>50,000 ₾</li>
                                            <li className='min-price-preset'>100,000 ₾</li>
                                            <li className='min-price-preset'>150,000 ₾</li>
                                            <li className='min-price-preset'>200,000 ₾</li>
                                            <li className='min-price-preset'>300,000 ₾</li>
                                        </ul>
                                    </div>
                                    <div id='max-preset'>
                                        <div className='price-input-wrapper'>
                                            <input id='max-price' name='max-price' placeholder='მდე' ref={maxPriceInputRef}/>
                                        </div>
                                        <h3>მაქს. ფასი</h3>
                                        <ul>
                                            <li className='max-price-preset'>50,000 ₾</li>
                                            <li className='max-price-preset'>100,000 ₾</li>
                                            <li className='max-price-preset'>150,000 ₾</li>
                                            <li className='max-price-preset'>200,000 ₾</li>
                                            <li className='max-price-preset'>300,000 ₾</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className='price-range-btn-holder'>
                                    <button id='price-range-btn' className='select-btn' onClick={validatePriceRange}>არჩევა</button>
                                </div>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className='area'>
                            <div className='area-label' ref={areaLabelRef} onClick={handleAreaToggle}>
                                <h2>ფართობი</h2>
                                <img id='area-down-arrow' src='/images/down-icon.svg' className={`box ${isAreaActive ? 'active' : ''}`}/>
                                <img id='area-up-arrow'src='/images/up-icon.svg' className={`box ${isAreaActive ? 'active' : ''}`}/>
                            </div>
                            <div id='area-range' ref={areaRangeRef} className={`box ${isAreaActive ? 'active' : ''}`}>
                                <h2>ფართობის მიხედვით</h2>
                                <div id='area-presets'>
                                    <div id='min-preset'>
                                        <div className='area-input-wrapper'>
                                            <input id='min-area' name='min-area' placeholder='დან' ref={minAreaInputRef}/>
                                        </div>
                                        <h4 id='area-error' ref={areaErrorRef}>ჩაწერეთ ვალიდური მონაცემები</h4>
                                        <h3>მინ. მ²</h3>
                                        <ul>
                                            <li className='min-area-preset'>45 მ²</li>
                                            <li className='min-area-preset'>50 მ²</li>
                                            <li className='min-area-preset'>70 მ²</li>
                                            <li className='min-area-preset'>100 მ²</li>
                                            <li className='min-area-preset'>120 მ²</li>
                                        </ul>
                                    </div>
                                    <div id='max-preset'>
                                        <div className='area-input-wrapper'>
                                            <input id='max-area' name='max-area' placeholder='მდე' ref={maxAreaInputRef}/>
                                        </div>
                                        <h3>მაქს. მ²</h3>
                                        <ul>
                                            <li className='max-area-preset'>45 მ²</li>
                                            <li className='max-area-preset'>50 მ²</li>
                                            <li className='max-area-preset'>70 მ²</li>
                                            <li className='max-area-preset'>100 მ²</li>
                                            <li className='max-area-preset'>120 მ²</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className='price-range-btn-holder'>
                                    <button id='area-range-btn' className='select-btn' onClick={validateAreaRange}>არჩევა</button>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className='rooms'>
                            <div className='rooms-label' ref={roomsLabelRef} onClick={handleRoomsToggle}>
                                <h2>საძინებლების რაოდენობა</h2>
                                <img id='rooms-down-arrow' src='/images/down-icon.svg' className={`box ${isRoomsActive ? 'active' : ''}`}/>
                                <img id='rooms-up-arrow'src='/images/up-icon.svg' className={`box ${isRoomsActive ? 'active' : ''}`}/>
                            </div>
                            <div id="rooms-select" ref={roomsSelectRef} name='rooms-select' className={`box ${isRoomsActive ? 'active' : ''}`}>
                                <h2>საძინებლების რაოდენობა</h2>
                                <input type='number' ref={roomsInputRef} id='rooms-input' name='rooms-input' min="1" max="50" defaultValue="1"/>
                                <div className='rooms-select-btn-holder'>
                                    <button id='rooms-select-btn' className='select-btn' onClick={validateRooms}>არჩევა</button>
                                </div>
                            </div>
                            
                        </div>
                    </li>
                </ul>
                <TagBar removeStateProperty={removeStateProperty} removeRegion={removeRegion} state={filterState}/>
            </div>
            <div id='filter-buttons'>
                <div id='add-listing' className='button'>
                    <svg width="22" height="22" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5002 7.41439H7.91683V11.9977C7.91683 12.2408 7.82025 12.474 7.64834 12.6459C7.47644 12.8178 7.24328 12.9144 7.00016 12.9144C6.75705 12.9144 6.52389 12.8178 6.35198 12.6459C6.18007 12.474 6.0835 12.2408 6.0835 11.9977V7.41439H1.50016C1.25705 7.41439 1.02389 7.31781 0.851982 7.1459C0.680073 6.97399 0.583496 6.74084 0.583496 6.49772C0.583496 6.25461 0.680073 6.02145 0.851982 5.84954C1.02389 5.67763 1.25705 5.58105 1.50016 5.58105H6.0835V0.997721C6.0835 0.754606 6.18007 0.521448 6.35198 0.34954C6.52389 0.177632 6.75705 0.0810547 7.00016 0.0810547C7.24328 0.0810547 7.47644 0.177632 7.64834 0.34954C7.82025 0.521448 7.91683 0.754606 7.91683 0.997721V5.58105H12.5002C12.7433 5.58105 12.9764 5.67763 13.1483 5.84954C13.3203 6.02145 13.4168 6.25461 13.4168 6.49772C13.4168 6.74084 13.3203 6.97399 13.1483 7.1459C12.9764 7.31781 12.7433 7.41439 12.5002 7.41439Z" fill="currentColor"/>
                    </svg>
                    <h2>ლისტინგის დამატება</h2>
                </div>
                <div id='add-agent' className='button'>
                    <svg width="22" height="22" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5002 7.41439H7.91683V11.9977C7.91683 12.2408 7.82025 12.474 7.64834 12.6459C7.47644 12.8178 7.24328 12.9144 7.00016 12.9144C6.75705 12.9144 6.52389 12.8178 6.35198 12.6459C6.18007 12.474 6.0835 12.2408 6.0835 11.9977V7.41439H1.50016C1.25705 7.41439 1.02389 7.31781 0.851982 7.1459C0.680073 6.97399 0.583496 6.74084 0.583496 6.49772C0.583496 6.25461 0.680073 6.02145 0.851982 5.84954C1.02389 5.67763 1.25705 5.58105 1.50016 5.58105H6.0835V0.997721C6.0835 0.754606 6.18007 0.521448 6.35198 0.34954C6.52389 0.177632 6.75705 0.0810547 7.00016 0.0810547C7.24328 0.0810547 7.47644 0.177632 7.64834 0.34954C7.82025 0.521448 7.91683 0.754606 7.91683 0.997721V5.58105H12.5002C12.7433 5.58105 12.9764 5.67763 13.1483 5.84954C13.3203 6.02145 13.4168 6.25461 13.4168 6.49772C13.4168 6.74084 13.3203 6.97399 13.1483 7.1459C12.9764 7.31781 12.7433 7.41439 12.5002 7.41439Z" fill="currentColor"/>
                    </svg>

                    <h2>აგენტის დამატება</h2>
                </div>
            </div>
        </div>
    );
}

export default Filter;