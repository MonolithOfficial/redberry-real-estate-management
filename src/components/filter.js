import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../styles/filter.scss';


const Filter = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRegionActive, setIsRegionActive] = useState(false);
    const [isPriceActive, setIsPriceActive] = useState(false);
    const [isAreaActive, setIsAreaActive] = useState(false);
    const [isRoomsActive, setIsRoomsActive] = useState(false);
    const regionSelectRef = useRef(null);

    const handleClickOutsideRegionSelect = (event) => {
        if (regionSelectRef.current && !regionSelectRef.current.contains(event.target)){
            setIsRegionActive(false);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideRegionSelect);
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutsideRegionSelect);
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
                    headers: {
                        'Authorization': 'Bearer 9cfda59e-ab9c-4d44-a3b0-794325f8b2e6'
                    }
                });
                setData(response.data);
                console.log(response);
              } catch (error) {
                setError(error);
              } finally {
                setLoading(false);
              }
        };
    
        fetchData();
      }, 
    []);

    return (
        <div className='filter-holder'>
            <div id='filter'>
                <ul id='filter-options'>
                    <li>
                        <div className='region'>
                            <div className='region-label' onClick={handleRegionToggle}>
                                <h2>რეგიონი</h2>
                                <img id='region-down-arrow' src='/images/down-icon.svg' className={`box ${isRegionActive ? 'active' : ''}`}/>
                                <img id='region-up-arrow'src='/images/up-icon.svg' className={`box ${isRegionActive ? 'active' : ''}`}/>
                            </div>
                            <div id='region-select' ref={regionSelectRef} className={`box ${isRegionActive ? 'active' : ''}`}>
                                <h2>რეგიონის მიხედვით</h2>
                                {loading ? (
                                    <p>Loading...</p>
                                ) : error ? (
                                    <p>Error: {error.message}</p> 
                                ) : (
                                    <ul>
                                    {data.map(region => (
                                        <li key={region.id}>
                                        <input type="checkbox" id={region.name} name={region.name} value={region.name} />
                                        <label htmlFor={region.name}>{region.name}</label>
                                        </li>
                                    ))}
                                    </ul>
                                )}
                                <div className='select-region-btn-holder'>
                                    <button id='select-region-btn'>არჩევა</button>
                                </div>
                            </div>
                            {/* <select id="region-select" name='region-select' className={`box ${isRegionActive ? 'active' : ''}`}>
                                <option value="abkhazia">აფხაზეთი</option>
                                <option value="ajaria">აჭარა</option>
                                <option value="Guria">გურია</option>
                                <option value="imereti">იმერეთი</option>
                                <option value="kakheti">კახეთი</option>
                                <option value="kvemo kartli">ქვემო ქართლი</option>
                                <option value="mtskheta-mtianeti">მცხეთა-მთიანეთი</option>
                                <option value="racha-lechkhumi-kvemo svaneti">რაჭა-ლეჩხუმი-ქვემო სვანეთი</option>
                                <option value="samegrelo-zemo svaneti">სამეგრელო-ზემო სვანეთი</option>
                                <option value="samtskhe-javakheti">სამცხე-ჯავახეთი</option>
                                <option value="shida kartli">შიდა ქართლი</option>
                                <option value="tbilisi" selected="selected">თბილისი</option>
                            </select> */}
                        </div>
                    </li>
                    <li>
                        <div className='price'>
                            <div className='price-label' onClick={handlePriceToggle}>
                                <h2>საფასო კატეგორია</h2>
                                <img id='price-down-arrow' src='/images/down-icon.svg' className={`box ${isPriceActive ? 'active' : ''}`}/>
                                <img id='price-up-arrow'src='/images/up-icon.svg' className={`box ${isPriceActive ? 'active' : ''}`}/>
                            </div>
                            <input type='range' id='price-slider' name='price-slider' min='0' max='1000000' className={`box ${isPriceActive ? 'active' : ''}`}/>
                        </div>
                    </li>

                    <li>
                        <div className='area'>
                            <div className='area-label' onClick={handleAreaToggle}>
                                <h2>ფართობი</h2>
                                <img id='area-down-arrow' src='/images/down-icon.svg' className={`box ${isAreaActive ? 'active' : ''}`}/>
                                <img id='area-up-arrow'src='/images/up-icon.svg' className={`box ${isAreaActive ? 'active' : ''}`}/>
                            </div>
                            <input type='range' id='area-slider' name='area-slider' min='0' max='10000' className={`box ${isAreaActive ? 'active' : ''}`}/>
                        </div>
                    </li>
                    <li>
                        <div className='rooms'>
                            <div className='rooms-label' onClick={handleRoomsToggle}>
                                <h2>საძინებლების რაოდენობა</h2>
                                <img id='rooms-down-arrow' src='/images/down-icon.svg' className={`box ${isRoomsActive ? 'active' : ''}`}/>
                                <img id='rooms-up-arrow'src='/images/up-icon.svg' className={`box ${isRoomsActive ? 'active' : ''}`}/>
                            </div>
                            <select id="rooms-select" name='rooms-select' className={`box ${isRoomsActive ? 'active' : ''}`}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5+">5+</option>
                            </select>
                        </div>
                    </li>
                </ul>
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